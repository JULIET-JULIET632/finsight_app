export const rankImpacts = (featureImpact) => {

  const sorted = Object.entries(featureImpact)
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));

  return sorted.slice(0, 4).map(([key, value]) => ({
    feature: key,
    impact: Math.abs(value) > 0.1 ? "High"
            : Math.abs(value) > 0.05 ? "Medium"
            : "Low"
  }));
};