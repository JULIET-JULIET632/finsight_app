import axios from "axios";

const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://127.0.0.1:8000";

export const runPrediction = async (businessData) => {
  const response = await axios.post(`${PYTHON_API_URL}/predict, businessData`);
  return response.data;
};