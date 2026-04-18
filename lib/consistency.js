export function checkConsistency(history) {
  let contradictions = 0;

  history.forEach((ans, i) => {
    if (
      ans.tags?.includes("team") &&
      history[i + 1]?.tags?.includes("self")
    ) {
      contradictions++;
    }
  });

  return contradictions;
}