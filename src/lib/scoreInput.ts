/**
 * Scores a user's reflection input using simple heuristics
 * @param input The user's text input to score
 * @return A score from 0 to 5 indicating the quality of the reflection
*/
export const scoreInput = (input: string): number => {
  const trimmed = input.trim();
  if (trimmed.length === 0) return 0;

  let score = 1; // Base score for any non-empty input

  // Length-based scoring
  if (trimmed.length > 20) score += 1;
  if (trimmed.length > 50) score += 1;
  if (trimmed.length > 80) score += 1;

  console.log(`Input length is ${trimmed.length}`);

  // Reflective language bonus (very basic heuristics)
  const reflectivePatterns = [
    /\b(because|since|therefore|realized|learned|understand|think|feel|notice|consider)\b/i,
    /\b(maybe|perhaps|could|would|should|might|wonder)\b/i,
    /\b(perspective|approach|differently|important|improve|challenge|reflect)\b/i,
  ];
  for (const pattern of reflectivePatterns) {
    if (pattern.test(trimmed)) {
      score += 1;
      break; // Max +1 from reflective language
    }
  }

  console.log(`Score for input: ${score}`);

  return Math.min(score, 5); // Cap at 5 per answer
}