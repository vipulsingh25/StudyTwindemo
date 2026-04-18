export function updateScores(scores, selectedOption) {
  const weights = selectedOption.weight;

  Object.keys(weights).forEach(key => {
    scores[key] = (scores[key] || 0) + weights[key];
  });

  return scores;
}