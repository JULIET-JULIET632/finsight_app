import { generateActionPlan } from "../services/llm.service.js";

export const getCoachAdvice = async (req, res, next) => {
  console.log("COACH CONTROLLER: Generating Strategic UI Content...");

  try {
    // 1. ADDED 'impacts' TO THE DESTRUCTURING HERE
    const { sector, final_score, adjusted_data, currency, impacts } = req.body;

    // Safety check
    if (!final_score || !adjusted_data) {
      return res.status(400).json({
        success: false,
        error: "Simulation data missing. Please provide final_score and adjusted_data."
      });
    }

    /**
     * 2. Call the LLM Service
     * We pass the sector, simulated data, AND the impacts so the AI respects the 'optimal' statuses!
     */
    // 2. ADDED 'impacts' AS THE 5TH ARGUMENT HERE
    const coachResponse = await generateActionPlan(
      sector, 
      final_score, 
      adjusted_data, 
      currency, 
      impacts
    );

    /**
     * 3. Response for the UI
     * We structure this so the frontend can easily access "action_steps" and "growth_tips"
     */
    return res.status(200).json({ 
      success: true, 
      projected_score: final_score,
      status: final_score >= 70 ? "Stable" : "Action Required",
      // These map directly to your two columns in the UI
      action_steps: coachResponse.action_steps || [], 
      growth_tips: coachResponse.growth_tips || []
    });

  } catch (error) {
    console.error("COACH CONTROLLER ERROR:", error.message);
    next(error);
  }
};