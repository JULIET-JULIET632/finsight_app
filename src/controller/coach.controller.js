import { generateActionPlan } from "../services/llm.service.js";

export const getCoachAdvice = async (req, res, next) => {
  console.log("🚀 COACH CONTROLLER: Request received!");
  
  // DEBUG: Let's see what is actually inside req.body
  console.log("Full Request Body:", req.body);

  try {
    // Safety check: If req.body is missing, send a clear error back to Postman
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        error: "The server received an empty body. Please check your Postman settings (Body > raw > JSON)."
      });
    }

    const { sector, top_risk_drivers } = req.body;
    console.log("📦 Data extracted:", { sector, top_risk_drivers });

    const actionPlan = await generateActionPlan(sector, top_risk_drivers);
    console.log("✅ Groq responded successfully!");

    return res.status(200).json({ 
      success: true, 
      actionPlan: actionPlan 
    });
  } catch (error) {
    console.error("❌ COACH CONTROLLER ERROR:", error.message);
    next(error);
  }
};