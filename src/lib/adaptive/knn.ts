import type { Level, TrainingRow, FallbackThresholds } from "../types";
const labels: Level[] = ["pemula", "menengah", "mahir"];
import { FEATURE_BOUNDS, PRETEST_MODULES } from "../curriculum";
export { FEATURE_BOUNDS };
export function normalize(features: number[]) {
  if (features.length !== FEATURE_BOUNDS.length || features.some(n => !Number.isFinite(n))) throw new Error("Vektor fitur harus berisi 8 angka valid.");
  return features.map((x,i) => Math.max(0, Math.min(1, (x - FEATURE_BOUNDS[i][0]) / (FEATURE_BOUNDS[i][1] - FEATURE_BOUNDS[i][0]))));
}
export function classify(features: number[], training: TrainingRow[], k: number, minTraining: number, thresholds:FallbackThresholds={intermediate:0.4,advanced:0.75}) {
  const input = normalize(features);
  if (training.length < Math.max(minTraining,k)) {
    const score = features.slice(0,PRETEST_MODULES.length).reduce((a,b)=>a+b,0)/PRETEST_MODULES.length;
    return { label: (score < thresholds.intermediate ? "pemula" : score < thresholds.advanced ? "menengah" : "mahir") as Level, neighbors: [], method: "score-fallback" };
  }
  const neighbors = training.map(row => ({ id: row.id, label: row.label, distance: Math.sqrt(normalize(row.features).reduce((s,x,i)=>s+(x-input[i])**2,0)) }))
    .sort((a,b)=>a.distance-b.distance || a.id.localeCompare(b.id)).slice(0,k);
  const exact = neighbors.filter(n=>n.distance===0);
  const votes = (exact.length ? exact : neighbors).reduce((v,n)=> { v[n.label] += exact.length ? 1 : 1/n.distance; return v; }, { pemula:0, menengah:0, mahir:0 });
  const label = [...labels].sort((a,b)=>votes[b]-votes[a] || labels.indexOf(a)-labels.indexOf(b))[0];
  return {label, neighbors, method:"distance-weighted-knn"};
}
/** Stratified deterministic CV. Bounds are fixed, never fitted on held-out students. */
export function selectK(rows: TrainingRow[], candidates = [3,5,7], folds = 5) {
  if (rows.length < 10 || labels.some(l => rows.filter(r=>r.label===l).length < 2)) throw new Error("CV memerlukan â‰¥10 siswa dan â‰¥2 contoh setiap label.");
  const buckets: TrainingRow[][] = Array.from({length:folds},()=>[]);
  for (const label of labels) rows.filter(r=>r.label===label).sort((a,b)=>a.id.localeCompare(b.id)).forEach((r,i)=>buckets[i%folds].push(r));
  const reports = candidates.filter(k=>k%2===1 && k>0 && buckets.every(b=>rows.length-b.length>=k)).map(k=> {
    const confusion = labels.map(()=>labels.map(()=>0));
    for (const test of buckets) {
      const ids = new Set(test.map(r=>r.id));
      const train = rows.filter(r=>!ids.has(r.id));
      for (const r of test) confusion[labels.indexOf(r.label)][labels.indexOf(classify(r.features,train,k,k).label)]++;
    }
    const perClass = labels.map((label,i)=> {
      const tp=confusion[i][i], precision=tp/(confusion.reduce((s,r)=>s+r[i],0)||1), recall=tp/(confusion[i].reduce((a,b)=>a+b,0)||1);
      return {label,precision,recall,f1:2*precision*recall/(precision+recall||1)};
    });
    return {k, confusion, labels, accuracy:confusion.reduce((s,r,i)=>s+r[i],0)/rows.length, perClass};
  });
  if (!reports.length) throw new Error("Data tidak cukup untuk kandidat k.");
  reports.sort((a,b)=>b.accuracy-a.accuracy || a.k-b.k);
  return {selectedK:reports[0].k,reports,folds,bounds:FEATURE_BOUNDS};
}
