import axios from "axios";

// 1. Pull the URL from .env, but fallback to local if missing
const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://127.0.0.1:8000";

/**
 * Communicates with the Python FastAPI ML engine.
 * This handles the ratio calculations, XGBoost prediction, and SHAP values.
 */
export const fetchMLDiagnosis = async (businessData, route = 'diagnose') => {
  try {
    // 2. SAFETY: Remove trailing slash from the base URL to prevent "//route" errors
    const cleanBaseUrl = PYTHON_API_URL.replace(/\/$/, "");

    // 3. Use cleanBaseUrl instead of process.env directly
    const response = await axios.post(`${cleanBaseUrl}/${route}`, businessData, {
      headers: { "Content-Type": "application/json" },
      timeout: 30000, // 4. Increased to 30s to handle Render "Cold Starts" + SHAP processing
    });

    return response.data;
  } catch (error) {
    // Log the specific error for DevOps debugging
    console.error(`Error connecting to Python ML Service at ${PYTHON_API_URL}:`, error.message);
    
    // Check if it was a timeout specifically
    if (error.code === 'ECONNABORTED') {
       throw new Error("ML_SERVICE_TIMEOUT");
    }
    
    throw new Error("ML_SERVICE_UNREACHABLE");
  }
};