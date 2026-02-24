import axios from "axios";

// Pull the URL from .env, but fallback to local if missing
const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://127.0.0.1:8000";

/**
 * Communicates with the Python FastAPI ML engine.
 * This handles the ratio calculations, XGBoost prediction, and SHAP values.
 */
export const fetchMLDiagnosis = async (businessData, route = 'diagnose') => {
  try {
    const response = await axios.post(`${process.env.PYTHON_API_URL}/${route}`, businessData, {
      headers: { "Content-Type": "application/json" },
      timeout: 20000, // 20s for Render cold start
    });
    return response.data;
  } catch (error) {
    console.error("Error connecting to Python ML Service:", error.message);
    throw new Error("ML_SERVICE_UNREACHABLE");
  }
};