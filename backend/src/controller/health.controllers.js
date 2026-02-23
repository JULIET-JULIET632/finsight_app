import { fetchMLDiagnosis } from "../services/ml.service.js";
import Groq from 'groq-sdk';

const groq = new Groq(); 

export const getDiagnosis = async (req, res, next) => {
  try {
    // 1. Get the math and metrics from your Python ML service
    const diagnosisData = await fetchMLDiagnosis(req.body);

    // --- SAFETY NET ---
    if (!diagnosisData) {
        return res.status(502).json({
            success: false,
            error: "Failed to get data from the ML engine. Is the Python server running?"
        });
    }

    // 2. Build the "Smart Advisor" Prompt
    const diagnosisPrompt = `
    A business owner in the ${req.body.sector} sector scored ${diagnosisData.health_score}/100.
    
    PERFORMANCE DATA (Scores for different areas):
    ${JSON.stringify(diagnosisData.breakdown)}
    
    IMPACT ANALYSIS (What is driving the score):
    ${JSON.stringify(diagnosisData.simulation_impacts)}

    TASK:
    Write a friendly, encouraging, and educational paragraph (about 4 to 5 sentences) in simple English. You MUST explain their result, highlight their strengths, and explain the weak spot before offering any advice.

    Follow this exact structure:
    1. The Score & Analogy: Start with a simple analogy (like a car engine, a garden, or a health check-up) to describe their overall score of ${diagnosisData.health_score}/100. 
    2. The Praise (What they are doing right): Look at their highest-scoring category in the PERFORMANCE DATA or any metric marked "optimal" in the IMPACT ANALYSIS. Explicitly praise them for this strength and explain how it is actively keeping their business stable.
    3. The "Why" & The Impact (The weak spot): Look at their lowest-scoring category. Explain clearly *why* their score isn't higher by pointing out this leak. Explain exactly *how* this specific issue is pulling down their overall health score.
    4. The Recommendation: Look at the IMPACT ANALYSIS. Pick ONE metric with the status "needs_improvement" that relates to their weak spot, and suggest ONE practical action to fix it.

    CRITICAL RULES:
    - NO financial jargon (No "liquidity", "ratios", or "assets"). 
    - Use "cash on hand" instead of "cash surplus" or "cash position".
    - Use "stock" instead of "inventory".
    - NEVER suggest improving a metric if its status is "optimal". Only suggest actions for metrics marked "needs_improvement".
    - DO NOT use bullet points or labeled lists. Write it as a natural, flowing paragraph.
    - Stay encouraging and beginner-friendly.
    - Be extremely concise, conversational, and direct.
    - Limit it to 70 words maximum.
    - IF ALL metrics are marked "optimal": DO NOT invent a problem. Instead, use these two sentences to congratulate them on running a highly efficient business and advise them to simply maintain their current excellent financial habits.
    - CRITICAL: Do NOT just tell them to "increase cash" or "improve surplus." Look for an OPERATIONAL fix like reducing "stock" or "wages" that will naturally create more cash.
    `;

    // 3. Call Groq with a System instruction for better control
    const chatCompletion = await groq.chat.completions.create({
        messages: [
            { role: 'system', content: 'You are a warm, plain-English business coach for non-experts.' },
            { role: 'user', content: diagnosisPrompt }
        ],
        model: 'llama-3.3-70b-versatile', 
        temperature: 0.4, 
    });

    // 4. Clean up the response and attach it
    diagnosisData.explanation = chatCompletion.choices[0].message.content.trim();

    // 5. Send the final object to the frontend
    return res.status(200).json(diagnosisData);

  } catch (error) {
    console.error("AI Generation Error:", error.message);
    next(error); 
  }
};