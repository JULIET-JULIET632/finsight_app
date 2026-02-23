from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
import shap
import os
import sklearn.impute

# --- QUICK FIX FOR SKLEARN VERSION MISMATCH ---
if not hasattr(sklearn.impute.SimpleImputer, '_fill_dtype'):
    sklearn.impute.SimpleImputer._fill_dtype = property(lambda self: getattr(self, '_fit_dtype', None))
# ---------------------------------------------

app = FastAPI()

# --- 1. LOAD MODEL AND PREPROCESSOR ---
MODEL_PATH = os.path.join("model", "finsight.joblib")
pipeline = joblib.load(MODEL_PATH)
xgb_model = pipeline.named_steps["classifier"]
preprocessor = pipeline.named_steps["preprocessor"]

explainer = shap.TreeExplainer(xgb_model)

# --- 2. INPUT MODEL ---
class BusinessInput(BaseModel):
    inventory_days: float
    monthly_cash_surplus: float
    monthly_wages: float
    monthly_loan_payment: float
    total_assets: float
    total_debt: float
    sector: str
    currency: str

# --- 3. BREAKDOWN CALCULATION ---
def calculate_score_breakdown(data: BusinessInput):
    # Asset vs Debt (Max 25)
    debt_ratio = data.total_debt / max(data.total_assets, 1)
    if debt_ratio < 0.4: asset_score = 25
    elif debt_ratio < 0.8: asset_score = 15
    elif debt_ratio <= 1.0: asset_score = 5
    else: asset_score = 0

    # Debt Coverage (Max 20)
    dscr = data.monthly_cash_surplus / max(data.monthly_loan_payment, 1)
    if dscr >= 1.5: debt_score = 20
    elif dscr >= 1.2: debt_score = 15
    elif dscr >= 1.0: debt_score = 10
    else: debt_score = 0

    # Cash Position (Max 25)
    payroll_coverage = data.monthly_cash_surplus / max(data.monthly_wages, 1)
    if payroll_coverage >= 1.0: cash_score = 25
    elif payroll_coverage >= 0.5: cash_score = 15
    else: cash_score = 5

    # Profit / Efficiency (Max 30)
    if data.inventory_days <= 30: profit_score = 30
    elif data.inventory_days <= 60: profit_score = 20
    elif data.inventory_days <= 90: profit_score = 10
    else: profit_score = 0

    breakdown = {
        "cash_position": {"current": cash_score, "max": 25},
        "profit_margin": {"current": profit_score, "max": 30},
        "asset_vs_debt": {"current": asset_score, "max": 25},
        "debt_coverage": {"current": debt_score, "max": 20}
    }

    hand_score = sum([cash_score, profit_score, asset_score, debt_score])
    return breakdown, hand_score

# --- 4. PREDICT ENDPOINT ---
@app.post("/predict")
def predict(data: BusinessInput):
    # --- ML FEATURES ---
    annual_net_income = data.monthly_cash_surplus * 12
    annual_wages = data.monthly_wages * 12
    annual_loan = data.monthly_loan_payment * 12
    safe_assets = max(data.total_assets, 1)
    total_equity = max(safe_assets - data.total_debt, 1)
    current_liabilities = max(data.total_debt * 0.3, 1)
    cash_and_equiv = max(data.monthly_cash_surplus * 3, 0)
    current_assets = cash_and_equiv + safe_assets * 0.5

    ml_features = {
        "Return_on_Sales": annual_net_income / max(annual_net_income + annual_wages + annual_loan, 1),
        "Activity_Total_Asset_Turnover": (annual_net_income + annual_wages) / safe_assets,
        "Asset_Turnover_Days": 365 / max(((annual_net_income + annual_wages)/safe_assets), 0.001),
        "Days_Total_Receivables_Outstanding": 15.0,
        "Inventory_Turnover_Days": data.inventory_days,
        "Liquidity_Cash_Ratio": cash_and_equiv / current_liabilities,
        "Quick_Ratio": (cash_and_equiv + (current_assets * 0.1)) / current_liabilities,
        "Current_Ratio": current_assets / current_liabilities,
        "Return_on_Assets": annual_net_income / safe_assets,
        "Return_on_Equity": annual_net_income / total_equity
    }

    input_df = pd.DataFrame([ml_features])
    processed_data = preprocessor.transform(input_df)

    # --- ML PREDICTION ---
    distress_prob = xgb_model.predict_proba(processed_data)[0][1]

    # --- HAND-CODED BREAKDOWN ---
    breakdown, hand_score = calculate_score_breakdown(data)

    # --- COMBINED HEALTH SCORE ---
    ml_weight = 0.4
    combined_score = int(hand_score * 0.6 + (1 - distress_prob) * 100 * ml_weight)
    health_score = max(0, min(100, combined_score))

    # --- SHAP FOR SLIDER IMPACTS ---
    explainer_values = explainer.shap_values(processed_data)[0]
    slider_impacts = {k:0.0 for k in ["inventory_days","monthly_cash_surplus","monthly_wages","monthly_loan_payment","total_assets","total_debt"]}
    feature_to_slider = {
        "Return_on_Sales":["monthly_cash_surplus","monthly_wages"],
        "Activity_Total_Asset_Turnover":["total_assets","monthly_wages"],
        "Asset_Turnover_Days":["total_assets"],
        "Inventory_Turnover_Days":["inventory_days"],
        "Liquidity_Cash_Ratio":["monthly_cash_surplus","total_assets"],
        "Quick_Ratio":["monthly_cash_surplus","monthly_loan_payment"],
        "Current_Ratio":["total_assets","total_debt"],
        "Return_on_Assets":["monthly_cash_surplus","total_assets"],
        "Return_on_Equity":["monthly_cash_surplus","total_debt"]
    }
    for f, val in zip(ml_features.keys(), explainer_values):
        for slider in feature_to_slider.get(f, []):
            slider_impacts[slider] += abs(val)
    total = sum(slider_impacts.values()) or 1
    for k in slider_impacts: slider_impacts[k] /= total

    # --- GROUP SLIDERS BY IMPACT & HEALTH STATUS ---
    grouped_impacts = {"high_impact":[],"medium_impact":[],"low_impact":[]}
    ui_labels = {
        "inventory_days":"Stock Spending / Inventory",
        "monthly_cash_surplus":"Cash Buffer / Surplus",
        "monthly_wages":"Payroll / Wages",
        "monthly_loan_payment":"Loan Repayments",
        "total_assets":"Total Assets",
        "total_debt":"Total Debt"
    }
    
    for slider, impact in slider_impacts.items():
        # Determine if this specific metric is already optimal
        is_optimal = False
        if slider == "inventory_days" and data.inventory_days <= 30: 
            is_optimal = True
        elif slider == "total_debt" and breakdown["asset_vs_debt"]["current"] == 25: 
            is_optimal = True
        elif slider in ["monthly_cash_surplus", "monthly_wages"] and breakdown["cash_position"]["current"] == 25: 
            is_optimal = True
        elif slider == "monthly_loan_payment" and breakdown["debt_coverage"]["current"] == 20: 
            is_optimal = True
        elif slider == "total_assets" and breakdown["asset_vs_debt"]["current"] == 25: 
            is_optimal = True

        # Add the status flag to the card
        card = {
            "key": slider, 
            "label": ui_labels[slider], 
            "current_value": getattr(data, slider),
            "status": "optimal" if is_optimal else "needs_improvement"
        }
        
        if impact > 0.3: grouped_impacts["high_impact"].append(card)
        elif impact > 0.1: grouped_impacts["medium_impact"].append(card)
        else: grouped_impacts["low_impact"].append(card)

    # --- GENERATE EXPLANATION & RETURN ---
    breakdown_labels = {
        "cash_position": "Cash Position",
        "profit_margin": "Profit Margin & Efficiency",
        "asset_vs_debt": "Asset to Debt Ratio",
        "debt_coverage": "Debt Coverage"
    }
    weak_points = [k for k,v in breakdown.items() if v["current"] < v["max"]]
    explanation = "Focus on improving: " + ", ".join([breakdown_labels.get(k,k) for k in weak_points]) if weak_points else "All metrics are at maximum!"

    return {
        "status": "success",
        "health_score": health_score,
        "breakdown": breakdown,
        "simulation_impacts": grouped_impacts,
        "currency": data.currency,
        "explanation": explanation
    }