import { fetchMLDiagnosis } from "../services/ml.service.js";
import Groq from 'groq-sdk';

const groq = new Groq();

/**
 * Simulate Controller
 * Calculates "What-If" scenarios by applying adjustments to original business data.
 */
export const simulate = async (req, res, next) => {
  try {
    const { original_data, adjustments, current_score, isFinalAction } = req.body;

    // 1. CLONE & ADJUST: Start with original data so adjustments are OPTIONAL
    // If the user doesn't provide an adjustment for a field, it stays as the original.
    const adjustedData = { ...original_data };
    
    const simulationLevers = [
      "inventory_days", 
      "monthly_cash_surplus", 
      "monthly_wages", 
      "monthly_loan_payment", 
      "total_assets", 
      "total_debt"
    ];

    let changeDetected = false;

    simulationLevers.forEach((lever) => {
      if (adjustments && adjustments[lever] !== undefined) {
        // Apply percentage-based change (e.g., -15 for 15% reduction)
        adjustedData[lever] = original_data[lever] * (1 + adjustments[lever] / 100);
        
        // Mark that a change actually happened
        if (adjustments[lever] !== 0) changeDetected = true;
      }
    });

    // 2. CALL THE BRIDGE: Use the 'simulate' route we added to the Python engine
    const mlResult = await fetchMLDiagnosis(adjustedData, 'simulate');
    const newScore = mlResult.health_score;

    let aiBenefits = [];

    // 3. AI BENEFITS LOGIC: Only trigger if it's the final action AND there's a change
    if (isFinalAction && changeDetected) {
      const benefitPrompt = `
        Business Sector: ${original_data.sector}
        Score Change: From ${current_score} to ${newScore}
        Changes Applied: ${JSON.stringify(adjustments)}
        Currency: ${original_data.currency}

        TASK: Provide 3 clear, descriptive benefits of these specific improvements.
        - Use simple, warm, everyday English (No jargon like "liquidity").
        - Each benefit must be one helpful sentence (Max 20 words).
        - Focus on how this helps the owner sleep better or grow the business.
        - NO introductory text, NO numbers, NO bullet points.
      `;

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are a supportive business mentor who speaks in plain English.' },
          { role: 'user', content: benefitPrompt }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.4,
      });

      // Cleanup formatting for the UI
      aiBenefits = chatCompletion.choices[0].message.content
        .split('\n')
        .map(line => line.replace(/^[*-\d.\s]+/, '').trim())
        .filter(line => line.length > 5)
        .slice(0, 3);
    } else if (isFinalAction && !changeDetected) {
      aiBenefits = ["Keep up your current habits to maintain your business stability."];
    }

    // 4. FINAL RESPONSE: Structured for your frontend components
    return res.status(200).json({
      status: "success",
      new_score: newScore,
      points_change: newScore - current_score,
      before_simulation: current_score,
      after_simulation: newScore,
      benefits: aiBenefits,
      details: mlResult.breakdown // Useful if you want to show mini-charts on simulation
    });

  } catch (err) {
    console.error("Simulation Controller Error:", err.message);
    next(err);
  }
};