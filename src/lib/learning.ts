import { db, id, json, transaction, type DB } from "./db";
import { getConfig, getExercises, getKCs } from "./content";
import { inferReadiness } from "./adaptive/bayes-net";
import { updateBKT, predictCorrect } from "./adaptive/bkt";
import { classify } from "./adaptive/knn";
import { recommend } from "./adaptive/recommender";
import { pretestQuestions, PRETEST_INSTRUMENT_VERSION } from "./seed-data";
import { effectiveTraining } from "./pilot";
import { HttpError } from "./auth";
import type { Code, TestResult } from "./types";
export async function studentContext(userId:string,tx:DB=db) {
 const {rows}=await tx.query("SELECT c.* FROM classes c JOIN enrollments e ON e.class_id=c.id WHERE e.user_id=$1",[userId]);
 if (!rows[0]) throw new HttpError(409,"Gabung kelas sebelum mengerjakan pretest atau latihan.");
 return rows[0];
}
export async function hasPretest(userId:string,tx:DB=db) {
 return !!(await tx.query("SELECT user_id FROM pretest_results WHERE user_id=$1",[userId])).rows.length;
}
export async function submitPretest(userId:string,answers:Record<string,number>,times:number[],experience:number,prerequisite:number|null) {
 return transaction(async tx=> {
  await studentContext(userId,tx);
  if (await hasPretest(userId,tx)) throw new HttpError(409,"Pretest hanya dapat dikirim sekali.");
  if (Object.keys(answers).length!==pretestQuestions.length || pretestQuestions.some(q=>answers[q.id]===undefined || answers[q.id]<0 || answers[q.id]>=q.options.length)) throw new HttpError(400,"Lengkapi seluruh jawaban pretest.");
  const modules=["HTML","CSS","JavaScript","React"];
  const scores=modules.map(m=> {const qs=pretestQuestions.filter(q=>q.module===m);return qs.filter(q=>answers[q.id]===q.answer).length/qs.length;});
  // Missing prerequisite mark uses neutral midpoint; never silently interpreted as zero.
  const features=[...scores,...times,experience,prerequisite??50];
  const params=await getConfig(tx), nodes=await getKCs(tx);
  const training=await effectiveTraining(params.values.training,tx);
  const thresholds=params.values.fallbackThresholds??{intermediate:0.4,advanced:0.75};
  const result=classify(features,training,params.values.k,params.values.minTraining,thresholds);
  const audit={scope:"global",k:params.values.k,minTraining:params.values.minTraining,fallbackThresholds:thresholds,effectiveTrainingIds:training.map(row=>row.id),dataset:params.values.dataset??{source:"manual",kind:"unverified",rubricVersions:[]},initialProbability:params.values.initialByLevel[result.label],questions:pretestQuestions};
  await tx.query("INSERT INTO pretest_results(user_id,features,answers,knn_label,neighbors,model_version,method,instrument_version,audit) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)",[userId,json({raw:features,scores,prerequisiteMissing:prerequisite===null}),json(answers),result.label,json(result.neighbors),params.version,result.method,PRETEST_INSTRUMENT_VERSION,json(audit)]);
  const mastery=Object.fromEntries(nodes.map(k=>[k.id,params.values.initialByLevel[result.label]]));
  const {readiness}=inferReadiness(nodes,mastery,params.values);
  for (const node of nodes) await tx.query("INSERT INTO mastery_states(user_id,kc_id,p_learned,readiness) VALUES($1,$2,$3,$4)",[userId,node.id,mastery[node.id],readiness[node.id]]);
  return {...result,scores,next:await buildRecommendation(userId,tx)};
 });
}
export async function buildRecommendation(userId:string,tx:DB=db) {
 const course=await studentContext(userId,tx);
 if (!await hasPretest(userId,tx)) throw new HttpError(409,"Selesaikan pretest terlebih dahulu.");
 const params=await getConfig(tx), nodes=await getKCs(tx), exercises=await getExercises(tx);
 const {rows:states}=await tx.query("SELECT * FROM mastery_states WHERE user_id=$1",[userId]);
 const mastery=Object.fromEntries(nodes.map(k=>[k.id,states.find(s=>s.kc_id===k.id)?.p_learned??params.values.bkt.initial]));
 const inference=inferReadiness(nodes,mastery,params.values);
 for (const k of nodes) await tx.query("INSERT INTO mastery_states(user_id,kc_id,p_learned,readiness) VALUES($1,$2,$3,$4) ON CONFLICT(user_id,kc_id) DO UPDATE SET readiness=$4",[userId,k.id,mastery[k.id],inference.readiness[k.id]]);
 const {rows:attempts}=await tx.query("SELECT a.exercise_id,a.passed FROM attempts a WHERE user_id=$1 ORDER BY created_at DESC,id DESC",[userId]);
 const failures:Record<string,number>={};
 for (const k of nodes) {
  const related=attempts.filter(a=>exercises.find(e=>e.id===a.exercise_id)?.kcs.some(x=>x.id===k.id));
  let n=0; for (const a of related) {if (a.passed) break;n++;} failures[k.id]=n;
 }
 const input={nodes,exercises,mastery,...inference,config:params.values,mode:course.mode,recent:[...new Set(attempts.map(a=>a.exercise_id))].slice(0,params.values.recentSessions),attempted:[...new Set(attempts.map(a=>a.exercise_id))],failures};
 const next=recommend(input),recId=id();
 // Store complete effective model inputs, including version, for audit and replay.
 await tx.query("INSERT INTO recommendations(id,user_id,kc_id,exercise_id,reason,inputs) VALUES($1,$2,$3,$4,$5,$6)",[recId,userId,next.kc_id,next.exercise_id,next.reason,json({mastery,readiness:inference.readiness,posterior:inference.posterior,failures,mode:course.mode,recent:input.recent,attempted:input.attempted,param_version:params.version,exerciseSnapshot:exercises.map(e=>({id:e.id,kcs:e.kcs,difficulty:e.difficulty})),kcSnapshot:nodes,algorithm:"hybrid-v1"})]);
 return {...next,id:recId,param_version:params.version};
}
export async function recordAttempt(userId:string,input:{exercise_id:string;code:Code;tests_result:TestResult[];selection:string;recommendation_id?:string}) {
 return transaction(async tx=> {
  await studentContext(userId,tx);
  if (!await hasPretest(userId,tx)) throw new HttpError(409,"Selesaikan pretest dahulu.");
  const exercises=await getExercises(tx),exercise=exercises.find(e=>e.id===input.exercise_id);
  if (!exercise) throw new HttpError(404,"Latihan tidak ditemukan.");
  const ids=input.tests_result.map(t=>t.id);
  if (new Set(ids).size!==exercise.tests.length || ids.length!==exercise.tests.length || exercise.tests.some(t=>!ids.includes(t.id))) throw new HttpError(400,"Hasil tes tidak sesuai latihan.");
  const {rows:drafts}=await tx.query("SELECT * FROM drafts WHERE user_id=$1 AND exercise_id=$2",[userId,exercise.id]);
  if (!drafts[0]) throw new HttpError(409,"Buka latihan terlebih dahulu.");
  const hints=drafts[0].hints_used,passed=input.tests_result.every(t=>t.passed);
  const fullHint=exercise.hints.length>0&&hints>=exercise.hints.length;
  const {rows:earlier}=await tx.query("SELECT id FROM attempts WHERE user_id=$1 AND exercise_id=$2 LIMIT 1",[userId,exercise.id]);
  const first=!earlier.length, attemptId=id(),params=await getConfig(tx);
  const duration=Math.max(0,Math.min(2147483647,Date.now()-new Date(drafts[0].started_at).getTime()));
  const recommendation=input.recommendation_id?(await tx.query("SELECT id,exercise_id FROM recommendations WHERE id=$1 AND user_id=$2",[input.recommendation_id,userId])).rows[0]:null;
  const selection=recommendation?.exercise_id===exercise.id&&input.selection==="recommended"?"recommended":"manual";
  await tx.query("INSERT INTO attempts(id,user_id,exercise_id,code,passed,tests_result,hints_used,duration_ms,is_first,selection,context) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)",[attemptId,userId,exercise.id,json(input.code),passed,json(input.tests_result),hints,duration,first,selection,json({param_version:params.version,exerciseSnapshot:exercise,fullHint,source:"client-reported",recommendation_id:recommendation?.id??null})]);
  const updates=[];
  if (first) for (const kc of exercise.kcs) {
   const {rows}=await tx.query("SELECT p_learned FROM mastery_states WHERE user_id=$1 AND kc_id=$2",[userId,kc.id]);
   const before=rows[0]?.p_learned??params.values.bkt.initial,bkt=params.values.bktByKc[kc.id]??params.values.bkt;
   const observed=passed&&!fullHint,after=updateBKT(before,observed,bkt,kc.weight);
   await tx.query("INSERT INTO mastery_states(user_id,kc_id,p_learned,readiness) VALUES($1,$2,$3,0) ON CONFLICT(user_id,kc_id) DO UPDATE SET p_learned=$3,updated_at=now()",[userId,kc.id,after]);
   await tx.query("INSERT INTO mastery_log(id,user_id,kc_id,attempt_id,p_before,p_after,predicted_correct,observed_correct,param_version) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)",[id(),userId,kc.id,attemptId,before,after,predictCorrect(before,bkt),observed,params.version]);
   updates.push({kc:kc.id,p_before:before,p_after:after});
  }
  if (recommendation) await tx.query("UPDATE recommendations SET accepted=$1 WHERE id=$2 AND user_id=$3",[selection==="recommended",recommendation.id,userId]);
  const next=await buildRecommendation(userId,tx);
  return {id:attemptId,passed,is_first:first,full_hint:fullHint,mastery:updates,next,param_version:params.version};
 });
}
