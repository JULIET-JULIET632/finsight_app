import Groq from "groq-sdk";

// This helps us see if the key is actually there when the server starts
if (!process.env.GROQ_API_KEY) {
    console.error("❌ ERROR: GROQ_API_KEY is missing from your .env file!");
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateActionPlan = async (sector, top_risk_drivers) => {
  // Debug log to see what data is arriving from the frontend/Postman
  console.log(`🤖 AI Coach generating plan for ${sector} sector...`);

  const prompt = `You are FinSight, a friendly, supportive, and easy-to-understand financial coach for everyday small business owners in Nigeria. 
  A user in the ${sector || "everyday"} sector just received their business health score. Our system found that these are the biggest issues hurting their business:
  
  ${JSON.stringify(top_risk_drivers)}

  Your job is to give them a practical turnaround plan to fix these specific issues. 
  
  CRITICAL RULES:
  1. USE EXTREMELY SIMPLE LANGUAGE. No jargon like "liquidity" or "assets".
  2. USE EVERYDAY EXAMPLES. (e.g., "Think of your cash like water in a leaky bucket").
  3. EXPLAIN THE "WHY" in basic terms.
  4. BE ENCOURAGING.

  Format in Markdown with these headers:
  ### Short-term Actions (Next 30 Days)
  ### Medium-term Actions (1-3 Months)
  ### Long-term Actions (3-6 Months)`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile", 
      temperature: 0.6,
    });

    return chatCompletion.choices[0]?.message?.content || "I couldn't generate a plan right now. Please try again!";
  } catch (error) {
    console.error("Groq API Error:", error.message);
    throw error; // This will send the error details back to Postman
  }
};