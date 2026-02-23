import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Generates structured Action Steps and Growth Tips for the UI
 */
// 1. ADD 'impacts' TO THE FUNCTION PARAMETERS
export const generateActionPlan = async (sector, score, adjusted_data, currency, impacts) => {
  console.log(`AI Coach generating strategic plan for ${sector}...`);

  const prompt = `
    You are a wise financial coach for small businesses in the ${sector} sector.
    Their simulated state: ${JSON.stringify(adjusted_data)} (${currency}).
    The target score is ${score}/100.

    IMPACT ANALYSIS (Read carefully):
    ${JSON.stringify(impacts)}

    Based on these numbers and the impact analysis, provide a clear roadmap in JSON format.
    
    CRITICAL RULES:
    1. Language: Use simple, warm, everyday English. No financial jargon.
    2. Currency Formatting: Whenever you mention a specific money amount, you MUST include the currency (${currency}). (e.g., "Aim to keep ${currency} 50,000 on hand").
    3. No Emojis: Do not use any emojis or special symbols.
    4. Action Steps (3 items): Provide clear "how-to" sentences. Explain the human benefit (Max 20 words per step).
    5. Growth Tips (3 items): Provide supportive, long-term advice on keeping the business stable and healthy (Max 20 words per tip).
    6. Formatting: Return ONLY a raw JSON object.
    7. When mentioning time-based metrics like 'Inventory Days', refer to them as 'stock turnaround time' or 'days your stock sits on the shelf'.
    8. When looking at the IMPACT ANALYSIS, ONLY suggest improvements for items where status is 'needs_improvement'. If the status is 'optimal', congratulate the business on doing a great job in that area and tell them to maintain it. Never ask them to reduce or improve an optimal metric.

    JSON Structure:
    {
      "action_steps": ["Step 1", "Step 2", "Step 3"],
      "growth_tips": ["Tip 1", "Tip 2", "Tip 3"]
    }
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a professional business mentor who simplifies complex finance." },
        { role: "user", content: prompt }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.4, 
      response_format: { type: "json_object" } 
    });

    const aiContent = chatCompletion.choices[0]?.message?.content;
    return JSON.parse(aiContent); 
    
  } catch (error) {
    console.error("Groq API Error:", error.message);
    throw new Error("Failed to generate AI strategy.");
  }
};