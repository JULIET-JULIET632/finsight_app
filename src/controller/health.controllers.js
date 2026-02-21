import { calculateRatios } from "../utils/ratio.utils.js";
import { runPrediction } from "../services/ml.service.js";
import { rankImpacts } from "../utils/impact.utils.js";
import { generateActionPlan } from "../services/llm.service.js";

const healthCheck = async (req, res, next) => {
  try {
    const ratios = calculateRatios(req.body);

    const { risk_score, feature_impact } =
      await runPrediction(ratios);

    const bucket =
      risk_score <= 30 ? "Low"
      : risk_score <= 65 ? "Moderate"
      : "High";

    const impacts = rankImpacts(feature_impact);

    // ✅ FIXED — use generateActionPlan
    const explanation = await generateActionPlan(
      req.body.sector,
      impacts
    );

    res.json({
      score: risk_score,
      label: bucket,
      explanation,
      impacts
    });

  } catch (err) {
    next(err);
  }
};

export default healthCheck;