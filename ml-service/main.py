# main.py
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict

# 1. FastAPI instance
app = FastAPI()

# 2. Request schema
class BusinessData(BaseModel):
    features: List[str]
    shap_values: List[List[float]]
    feature_to_slider: Dict[str, List[str]]
    slider_impacts: Dict[str, float]
    health_score: float

# 3. SHAP simulation logic
def simulate_impacts(features, shap_values, feature_to_slider, slider_impacts, health_score):
    # Add up the SHAP magnitudes for each slider
    for feature_name, shap_val in zip(features, shap_values[0]):
        magnitude = abs(shap_val)
        if feature_name in feature_to_slider:
            for slider in feature_to_slider[feature_name]:
                slider_impacts[slider] += magnitude

    # Format the simulation array for the React frontend
    simulation_tags = []
    for slider_name, total_impact in slider_impacts.items():
        if total_impact > 1.5:
            impact_level = "High Impact"
        elif total_impact > 0.6:
            impact_level = "Medium Impact"
        else:
            impact_level = "Low Impact"

        simulation_tags.append({
            "slider_name": slider_name,
            "impact": impact_level
        })

    # Sort so High Impact sliders show up first in the UI
    sort_order = {"High Impact": 0, "Medium Impact": 1, "Low Impact": 2}
    simulation_tags.sort(key=lambda x: sort_order[x["impact"]])

    return {
        "health_score": health_score,
        "simulation_impacts": simulation_tags
    }

# 4. FastAPI endpoint
@app.post("/predict")
def predict(data: BusinessData):
    result = simulate_impacts(
        features=data.features,
        shap_values=data.shap_values,
        feature_to_slider=data.feature_to_slider,
        slider_impacts=data.slider_impacts,
        health_score=data.health_score
    )
    return result