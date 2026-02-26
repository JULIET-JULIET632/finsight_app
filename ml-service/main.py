from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import shap
import os
import sklearn.impute
import groq

# --- 1. INITIAL SETUP & FIXES ---
if not hasattr(sklearn.impute.SimpleImputer, '_fill_dtype'):
    sklearn.impute.SimpleImputer._fill_dtype = property(lambda self: getattr(self, '_fit_dtype', None))

app = FastAPI()

# --- 2. CORS CONFIGURATION ---
# Industry-standard origins for development and production
origins = [
    "http://localhost:3000",        # Local React
    "http://localhost:5173",        # Vite (common alternative)
    "https://finsight.com",          # Production domain
    "https://finsight-app.vercel.app" # Common deployment URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)          # Allows Content-Type, Authorization, etc.

# Initialize Groq (Ensure GROQ_API_KEY is in your Render Environment Variables)
client = groq.Groq(api_key=os.environ.get("GROQ_API_KEY"))

# --- 2. LOAD MODEL ---
MODEL_PATH = os.path.join("model", "finsight.joblib")
pipeline = joblib.load(MODEL_PATH)
xgb_model = pipeline.named_steps["classifier"]
preprocessor = pipeline.named_steps["preprocessor"]
explainer = shap.TreeExplainer(xgb_model)

# --- 3. DATA MODELS ---
class BusinessInput(BaseModel):
    inventory_days: float
    monthly_cash_surplus: float
    monthly_wages: float
    monthly_loan_payment: float
    total_assets: float
    total_debt: float
    sector: str
    currency: str


class SimulationInput(BaseModel):
    original_data: BusinessInput
    adjustments: dict[str, float]

# --- 4. CORE LOGIC FUNCTIONS ---

def calculate_score_breakdown(data: BusinessInput):
    # Asset vs Debt (Max 25)
    debt_ratio = data.total_debt / max(data.total_assets, 1)
    asset_score = 25 if debt_ratio < 0.4 else 15 if debt_ratio < 0.8 else 5 if debt_ratio <= 1.0 else 0

    # Debt Coverage (Max 20)
    dscr = data.monthly_cash_surplus / max(data.monthly_loan_payment, 1)
    debt_score = 20 if dscr >= 1.5 else 15 if dscr >= 1.2 else 10 if dscr >= 1.0 else 0

    # Cash Position (Max 25)
    payroll_coverage = data.monthly_cash_surplus / max(data.monthly_wages, 1)
    cash_score = 25 if payroll_coverage >= 1.0 else 15 if payroll_coverage >= 0.5 else 5

    # Profit / Efficiency (Max 30)
    profit_score = 30 if data.inventory_days <= 30 else 20 if data.inventory_days <= 60 else 10 if data.inventory_days <= 90 else 0

    breakdown = {
        "cash_position": {"current": cash_score, "max": 25, "label": "Cash Position"},
        "profit_margin": {"current": profit_score, "max": 30, "label": "Profit & Efficiency"},
        "asset_vs_debt": {"current": asset_score, "max": 25, "label": "Asset to Debt"},
        "debt_coverage": {"current": debt_score, "max": 20, "label": "Debt Coverage"}
    }
    return breakdown, sum([cash_score, profit_score, asset_score, debt_score])


def get_llm_explanation(health_score, breakdown, is_simulation=False):
    # Creating a simple summary for the LLM to read
    summary = ", ".join([f"{v['label']}: {v['current']}/{v['max']}" for v in breakdown.values()])
    
    if is_simulation:
        # PROMPT FOR THE SIMULATION SCREEN (Potential Benefits)
        prompt = f"""
        You are a business advisor in Nigeria. The user just simulated a new financial strategy.
        New Score: {health_score}/100. Details: {summary}.
        
        Highlight the potential benefits of this new simulated position. Briefly explain how these new numbers make the business stronger, safer, or more profitable.
        
        Strict Constraints: No jargon. No greetings. Under 60 words.
        """
    else:
        # PROMPT FOR THE DIAGNOSIS SCREEN (Explanation of current state)
        prompt = f"""
        You are a supportive business advisor for a company in Nigeria. 
        Analyze this current report: Score {health_score}/100. Details: {summary}.
        
        1. Praise the user for areas where they scored high.
        2. Explain the areas pulling the score down using simple terms (e.g., 'money tied up in stock' instead of 'inventory turnover').
        
        Strict Constraints: No jargon. No advice. Under 60 words. No greetings.
        """
        
    try:
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
        )
        return response.choices[0].message.content.strip()
    except:
        return "Analysis currently unavailable, but your metrics are being tracked."
    
# --- 5. ENDPOINTS ---

def run_prediction(data: BusinessInput, is_simulation: bool = False):
    # --- 1. ML FEATURE ENGINEERING ---
    ml_features = {
        "Return_on_Sales": (data.monthly_cash_surplus * 12) / max((data.monthly_cash_surplus + data.monthly_wages + data.monthly_loan_payment) * 12, 1),
        "Activity_Total_Asset_Turnover": ((data.monthly_cash_surplus + data.monthly_wages) * 12) / max(data.total_assets, 1),
        "Asset_Turnover_Days": 365 / max((((data.monthly_cash_surplus + data.monthly_wages)*12)/max(data.total_assets,1)), 0.001),
        "Days_Total_Receivables_Outstanding": 15.0,
        "Inventory_Turnover_Days": data.inventory_days,
        "Liquidity_Cash_Ratio": (data.monthly_cash_surplus * 3) / max(data.total_debt * 0.3, 1),
        "Quick_Ratio": (data.monthly_cash_surplus * 3 + data.total_assets * 0.05) / max(data.total_debt * 0.3, 1),
        "Current_Ratio": (data.monthly_cash_surplus * 3 + data.total_assets * 0.5) / max(data.total_debt * 0.3, 1),
        "Return_on_Assets": (data.monthly_cash_surplus * 12) / max(data.total_assets, 1),
        "Return_on_Equity": (data.monthly_cash_surplus * 12) / max(data.total_assets - data.total_debt, 1)
    }

    processed_data = preprocessor.transform(pd.DataFrame([ml_features]))
    distress_prob = xgb_model.predict_proba(processed_data)[0][1]
    
    breakdown, hand_score = calculate_score_breakdown(data)
    combined_score = int(hand_score * 0.6 + (1 - distress_prob) * 100 * 0.4)
    health_score = max(0, min(100, combined_score))

    explanation = get_llm_explanation(health_score, breakdown, is_simulation)

    # --- 2. CONDITIONAL RETURN LOGIC ---
    if is_simulation:
        # Streamlined response for Simulation & ready for /coach
        return {
            "status": "success",
            "final_score": health_score,
            "potential_benefits": explanation,
            "currency": data.currency,
            "sector": data.sector,
            "adjusted_data": {
                "inventory_days": data.inventory_days,
                "total_debt": data.total_debt,
                "monthly_cash_surplus": data.monthly_cash_surplus
            }
        }
    else:
        # Full response for the first Diagnosis
        explainer_values = explainer.shap_values(processed_data)[0]
        feature_names = ["Return_on_Sales", "Activity_Total_Asset_Turnover", "Asset_Turnover_Days", 
                         "Days_Total_Receivables_Outstanding", "Inventory_Turnover_Days", 
                         "Liquidity_Cash_Ratio", "Quick_Ratio", "Current_Ratio", 
                         "Return_on_Assets", "Return_on_Equity"]
        
        shap_dict = {name: abs(val) for name, val in zip(feature_names, explainer_values)}
        
        # Map the ML features to the EXACT 6 inputs the user provided
        slider_impacts = {
            "inventory_days": shap_dict.get("Inventory_Turnover_Days", 0),
            "monthly_cash_surplus": shap_dict.get("Return_on_Sales", 0) + shap_dict.get("Liquidity_Cash_Ratio", 0),
            "monthly_wages": shap_dict.get("Return_on_Sales", 0), # Wages affect profitability
            "monthly_loan_payment": shap_dict.get("Liquidity_Cash_Ratio", 0), # Payments affect debt coverage
            "total_assets": shap_dict.get("Activity_Total_Asset_Turnover", 0) + shap_dict.get("Return_on_Assets", 0),
            "total_debt": shap_dict.get("Return_on_Equity", 0) + shap_dict.get("Quick_Ratio", 0)
        }
        
        sorted_sliders = sorted(slider_impacts.items(), key=lambda x: x[1], reverse=True)
        
        impacts = {
            "high_impact": [sorted_sliders[0][0]] if len(sorted_sliders) > 0 else [],
            "medium_impact": [sorted_sliders[1][0]] if len(sorted_sliders) > 1 else [],
            "low_impact": [x[0] for x in sorted_sliders[2:]]
        }

        return {
            "status": "success",
            "health_score": health_score,
            "breakdown": breakdown,
            "impacts": impacts,
            "currency": data.currency,
            "explanation": explanation
        }
    
@app.get("/")
def health_check():
    return {"status": "online"}

@app.post("/diagnose")
def diagnose(data: BusinessInput):
    return run_prediction(data, is_simulation=False)

@app.post("/simulate")
def simulate(payload: SimulationInput):
    data_dict = payload.original_data.model_dump() 
    adjustments = payload.adjustments
    
    for key, percent in adjustments.items():
        if key in data_dict:
            data_dict[key] = max(0, data_dict[key] * (1 + (percent / 100)))
            
    return run_prediction(BusinessInput(**data_dict), is_simulation=True)