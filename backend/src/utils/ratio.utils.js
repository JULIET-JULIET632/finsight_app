export const calculateRatios = (data) => {

  const returnOnAssets =
    data.operating_profit / data.total_assets;

  const debtRatio =
    data.total_debt / data.total_assets;

  const inventoryDays =
    data.days_to_sell_stock;

  const receivableDays =
    data.credit_payment_terms;

  return {
    Return_on_Assets: returnOnAssets,
    Debt_Ratio: debtRatio,
    Inventory_Turnover_Days: inventoryDays,
    Days_Total_Receivables_Outstanding: receivableDays
  };
};