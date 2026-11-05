import type { BKTParams } from "../types";
export function predictCorrect(p: number, params: BKTParams) {
  return p * (1 - params.slip) + (1 - p) * params.guess;
}
/** Fractional likelihood for Q-matrix weights; weight=1 is standard BKT. */
export function updateBKT(p: number, correct: boolean, params: BKTParams, weight = 1) {
  const known = Math.pow(correct ? 1 - params.slip : params.slip, weight);
  const unknown = Math.pow(correct ? params.guess : 1 - params.guess, weight);
  const posterior = p * known / (p * known + (1 - p) * unknown);
  return posterior + (1 - posterior) * (1 - Math.pow(1 - params.learn, weight));
}
