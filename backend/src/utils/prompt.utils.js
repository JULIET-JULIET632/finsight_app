export const buildPrompt = (data, score, riskLevel) => {
  return` 
You are a financial AI coach for SMEs.

Business data:
- Operating Profit: ${data.operating_profit}
- Total Assets: ${data.total_assets}
- Total Debt: ${data.total_debt}
- Days to Sell Stock: ${data.days_to_sell_stock}

The ML model gave:
Score: ${score}
Risk Level: ${riskLevel}

Explain:
1. Why the score is this value
2. What is hurting the business most
3. Clear action steps
4. Growth tips

Keep explanation simple and practical.
`;
};