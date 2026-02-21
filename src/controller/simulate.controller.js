const simulate = async (req, res, next) => {
  try {

    const { original_data, adjustments } = req.body;

    const adjusted = {
      ...original_data,
      operating_profit:
        original_data.operating_profit *
        (1 + (adjustments.operating_profit || 0) / 100)
    };

    const ratios = calculateRatios(adjusted);

    const { risk_score } =
      await runPrediction(ratios);

    res.json({ simulated_score: risk_score });

  } catch (err) {
    next(err);
  }
};