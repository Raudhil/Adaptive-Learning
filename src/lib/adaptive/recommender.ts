import type { Exercise, KC, ModelConfig } from "../types";
import { predictCorrect } from "./bkt";
import { diagnose } from "./bayes-net";
export type RecommendationInput = {
  nodes: KC[]; exercises: Exercise[]; mastery: Record<string,number>; readiness: Record<string,number>;
  posterior: Record<string,number>; config: ModelConfig; mode: "adaptive"|"control";
  recent: string[]; attempted: string[]; failures: Record<string,number>;
};
export function recommend(input: RecommendationInput) {
  const {nodes,exercises,mastery,readiness,posterior,config,mode,recent,attempted,failures}=input;
  const ordered=[...nodes].sort((a,b)=>a.position-b.position||(mastery[a.id]??0)-(mastery[b.id]??0)||a.id.localeCompare(b.id));
  let target: KC|undefined, remedial=false;
  if (mode==="control") target=ordered.find(k=>exercises.some(e=>e.kcs.some(x=>x.id===k.id)&&!attempted.includes(e.id)));
  else {
    const failed=ordered.find(k=>(failures[k.id]??0)>=config.failureThreshold && (mastery[k.id]??0)<config.masteryThreshold);
    const weak=failed&&diagnose(failed,posterior);
    if (weak && (mastery[weak]??0)<config.masteryThreshold && exercises.some(e=>e.kcs.some(k=>k.id===weak))) {
      target=nodes.find(k=>k.id===weak); remedial=true;
    }
    target ??= ordered.find(k=>(mastery[k.id]??0)<config.masteryThreshold && (readiness[k.id]??0)>=config.readinessThreshold && exercises.some(e=>e.kcs.some(x=>x.id===k.id)));
    if (!target) {
      const blocked=ordered.find(k=>(mastery[k.id]??0)<config.masteryThreshold);
      const weak=blocked&&diagnose(blocked,posterior);
      target=ordered.find(k=>k.id===weak&&exercises.some(e=>e.kcs.some(x=>x.id===k.id))) ?? ordered.find(k=>!k.prerequisites.length&&(mastery[k.id]??0)<config.masteryThreshold&&exercises.some(e=>e.kcs.some(x=>x.id===k.id)));
      remedial=!!target;
    }
  }
  if (!target) return {kc_id:null, exercise_id:null, reason:mode==="control"?"Seluruh latihan pada urutan kelas telah dikerjakan.":"Tidak ada latihan baru yang sesuai. Periksa penguasaan dan materi bersama dosen.", predicted:null, repeat:false};
  const available=exercises.filter(e=>e.kcs.some(k=>k.id===target!.id));
  const fresh=available.filter(e=>!recent.includes(e.id)&&!attempted.includes(e.id));
  const notRecent=available.filter(e=>!recent.includes(e.id));
  const choices=mode==="control"?available.filter(e=>!attempted.includes(e.id)):(fresh.length?fresh:notRecent.length?notRecent:available);
  function prediction(e:Exercise) {
    const p=e.kcs.reduce((s,k)=>s+predictCorrect(mastery[k.id]??config.bkt.initial,config.bktByKc[k.id]??config.bkt)*k.weight,0)/e.kcs.reduce((s,k)=>s+k.weight,0);
    // Difficulty shifts the odds; 0.5 preserves the BKT prediction.
    const bounded=Math.max(0.001,Math.min(0.999,p));
    return 1/(1+Math.exp(-(Math.log(bounded/(1-bounded))-2*(e.difficulty-0.5))));
  }
  choices.sort((a,b)=>mode==="control"?a.id.localeCompare(b.id):Math.abs(prediction(a)-config.targetCorrect)-Math.abs(prediction(b)-config.targetCorrect)||a.id.localeCompare(b.id));
  const exercise=choices[0];
  return {kc_id:target.id,exercise_id:exercise?.id??null,predicted:exercise?prediction(exercise):null,repeat:!!exercise&&attempted.includes(exercise.id),reason:mode==="control"?`Kelas kontrol mengikuti urutan tetap: ${target.name}.`:remedial?`Perkuat ${target.name} sebagai prasyarat sebelum melanjutkan.`:`${target.name} belum dikuasai dan prasyaratnya sudah siap. Latihan dipilih sesuai peluang keberhasilanmu.`};
}
