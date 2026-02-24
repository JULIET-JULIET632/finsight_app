import axios from "axios";

// Pull the URL from .env, but fallback to local if missing
const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://127.0.0.1:8000";

/**
 * Communicates with the Python FastAPI ML engine.
 * This handles the ratio calculations, XGBoost prediction, and SHAP values.
 */
export const fetchMLDiagnosis = async (businessData) => {
  try {
    const response = await axios.post(`${PYTHON_API_URL}/predict`, businessData, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 60000, // 5 second timeout to keep the app snappy
    });

    // We return the raw data (health_score, breakdown, simulation_impacts, etc.)
    return response.data;
  } catch (error) {
    console.error("Error connecting to Python ML Service:", error.message);
    
    // If the Python server is down, we throw a clear error for the controller to catch
    throw new Error("ML_SERVICE_UNREACHABLE");
  }
};