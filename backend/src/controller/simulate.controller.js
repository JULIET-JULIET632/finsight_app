import { fetchMLDiagnosis } from "../services/ml.service.js";
import Groq from 'groq-sdk';

const groq = new Groq();

export const simulate = async (req, res, next) => {
  try {
    const { original_data, adjustments, current_score, isFinalAction } = req.body;

    // 1. Convert percentage adjustments to raw numbers for the ML engine
    const adjusted = { ...original_data };
    const simulationLevers = [
      "inventory_days", 
      "monthly_cash_surplus", 
      "monthly_wages", 
      "monthly_loan_payment", 
      "total_assets", 
      "total_debt"
    ];

    simulationLevers.forEach((lever) => {
      if (adjustments && adjustments[lever] !== undefined) {
        adjusted[lever] = original_data[lever] * (1 + adjustments[lever] / 100);
      }
    });

    // 2. Get the new projected score
    const result = await fetchMLDiagnosis(adjusted);
    const newScore = result.health_score;

    let aiBenefits = [];

    // 3. Generate the "Potential Benefits" list for the results screen
    if (isFinalAction) {
      const benefitPrompt = `
        A business owner in the ${original_data.sector} sector improved their score from ${current_score} to ${newScore}.
        
        CHANGES MADE: ${JSON.stringify(adjustments)}
        CURRENCY: ${original_data.currency}

        TASK:
    Provide 3 clear, descriptive benefits of these specific improvements.
    - Focus on the "So What?" (e.g., instead of "Less debt," say "Owing less money means you keep more of your monthly profit to spend on growing your business").
    - Use very simple, warm, everyday English.
    - NO financial jargon, NO emojis, and NO symbols.
    - Each benefit must be a full, helpful sentence (Max 20 words).
    - NO introductory or concluding text.
      `;

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are a professional business mentor.' },
          { role: 'user', content: benefitPrompt }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.4,
      });

      // CLEANUP: Removes asterisks, dashes, and numbers to keep the UI list clean
      aiBenefits = chatCompletion.choices[0].message.content
        .split('\n')
        .map(line => line.replace(/^[*-\d.\s]+/, '').trim())
        .filter(line => line.length > 5)
        .slice(0, 3);
    }

    // 4. Final Response matching your UI
    return res.status(200).json({
      status: "success",
      new_score: newScore,
      points_gained: newScore - current_score,
      before_simulation: current_score,
      after_simulation: newScore,
      benefits: aiBenefits 
    });

  } catch (err) {
    console.error("Simulation Error:", err.message);
    next(err);
  }
};