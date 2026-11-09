import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { performance } from "node:perf_hooks";
process.env.LOCAL_DB_PATH=path.join(process.cwd(),".tmp","curriculum-"+randomUUID(),"postgres");
process.env.DATABASE_URL="";
import { db,transaction,json,closeDB } from "../src/lib/db";
import { installCurriculum } from "../src/lib/curriculum-install";
import { seedKCs as legacyKCs, seedExercises as legacyExercises, defaultConfig as legacyConfig } from "../src/lib/legacy-seed-data";
import { seedKCs,seedExercises,pretestQuestions,defaultConfig } from "../src/lib/seed-data";
import { getKCs,getExercises } from "../src/lib/content";
import { submitPretest,recordAttempt,hasPretest } from "../src/lib/learning";
import { effectiveTraining } from "../src/lib/pilot";
import { trainingSchema } from "../src/lib/validation";
import { analyzeSource } from "../src/lib/sandbox/source";
import { inferReadiness,validateDAG } from "../src/lib/adaptive/bayes-net";
import { CURRICULUM_VERSION,PRETEST_INSTRUMENT_VERSION } from "../src/lib/curriculum";

test("KC25 migration preserves legacy evidence, isolates instruments and refuses pending assessments",async()=>{
 try{
  await transaction(async tx=>{
   for(const k of legacyKCs)await tx.query("INSERT INTO knowledge_components(id,code,name,module,position) VALUES($1,$2,$3,$4,$5)",[k.id,k.code,k.name,k.module,k.position]);
   const ex=legacyExercises[0];
   await tx.query("INSERT INTO exercises(id,title,instructions,starter_code,difficulty,hints) VALUES($1,$2,$3,$4,$5,$6)",[ex.id,ex.title,ex.instructions,json(ex.starter_code),ex.difficulty,json(ex.hints)]);
   await tx.query("INSERT INTO exercise_kc(exercise_id,kc_id,weight) VALUES($1,'H1',1)",[ex.id]);
   await tx.query("INSERT INTO users(id,email,name,role,password_hash) VALUES('teacher','teacher@fixture.local','Teacher','lecturer','test'),('student','student@fixture.local','Student','student','test')");
   await tx.query("INSERT INTO classes(id,name,lecturer_id,join_code,mode) VALUES('c','Fixture','teacher','FIXTURE','adaptive')");
   await tx.query("INSERT INTO enrollments(user_id,class_id) VALUES('student','c')");
   await tx.query("INSERT INTO pretest_results(user_id,features,answers,knn_label,neighbors,model_version,method,instrument_version) VALUES('student',$1,'{}','mahir','[]','legacy','score-fallback','mcq-pilot-v1')",[json({raw:[1,1,1,1,10,10,10,10,3,80]})]);
   await tx.query("INSERT INTO mastery_states(user_id,kc_id,p_learned,readiness) VALUES('student','H1',.97,1)");
   await tx.query("INSERT INTO attempts(id,user_id,exercise_id,code,passed,tests_result,hints_used,duration_ms,is_first,selection) VALUES('old-attempt','student',$1,$2,true,$3,0,100,true,'manual')",[ex.id,json(ex.starter_code),json(ex.tests.map(t=>({id:t.id,passed:true})))]);
   await tx.query("INSERT INTO mastery_log(id,user_id,kc_id,attempt_id,p_before,p_after,predicted_correct,observed_correct,param_version) VALUES('old-log','student','H1','old-attempt',.8,.97,.82,true,'legacy')");
   await tx.query("INSERT INTO model_params(version,values,active) VALUES('legacy',$1,true)",[json(legacyConfig)]);
  });
  const before={
   attempts:(await db.query("SELECT * FROM attempts")).rows,
   states:(await db.query("SELECT * FROM mastery_states")).rows,
   logs:(await db.query("SELECT * FROM mastery_log")).rows,
   pretests:(await db.query("SELECT * FROM pretest_results")).rows,
  };
  const first=await transaction(installCurriculum);assert.equal(first.kcs,25);assert.equal(first.exercises,75);assert.deepEqual(first.pending,["C07","C08","C09"]);
  assert.deepEqual((await db.query("SELECT * FROM attempts")).rows,before.attempts);
  assert.deepEqual((await db.query("SELECT * FROM mastery_states")).rows,before.states);
  assert.deepEqual((await db.query("SELECT * FROM mastery_log")).rows,before.logs);
  assert.deepEqual((await db.query("SELECT * FROM pretest_results")).rows,before.pretests);
  assert.equal((await getKCs()).length,25);assert.equal((await getExercises()).length,75);
  assert.equal((await db.query("SELECT count(*)::int AS n FROM materials m JOIN knowledge_components k ON k.id=m.kc_id WHERE k.curriculum_version=$1",[CURRICULUM_VERSION])).rows[0].n,50);
  await transaction(installCurriculum);
  assert.equal((await db.query("SELECT count(*)::int AS n FROM exercises")).rows[0].n,76);
  assert.equal((await db.query("SELECT count(*)::int AS n FROM model_params")).rows[0].n,2);
  assert.equal(await hasPretest("student"),false,"old pretest is not a current assessment");
  const answers=Object.fromEntries(pretestQuestions.map(q=>[q.id,(q.answer+1)%4]));
  const result=await submitPretest("student",answers,[10,10,10],1,null);assert.equal(result.method,"score-fallback");
  assert.equal((await db.query("SELECT count(*)::int AS n FROM pretest_results WHERE user_id='student'")).rows[0].n,2);
  assert.equal((await db.query("SELECT p_learned FROM mastery_states WHERE kc_id='H1'")).rows[0].p_learned,.97);
  assert.equal((await db.query("SELECT p_learned FROM mastery_states WHERE kc_id='H01'")).rows[0].p_learned,.2);
  const pending=seedExercises.find(e=>e.kcs[0].id==="C07")!;
  await assert.rejects(()=>recordAttempt("student",{exercise_id:pending.id,code:pending.starter_code,tests_result:[],selection:"manual"}),/ditunda|belum siap/);
  assert.equal((await db.query("SELECT count(*)::int AS n FROM mastery_log")).rows[0].n,1);
  const oldTraining={id:"old",features:new Array(10).fill(0),label:"pemula" as const};
  assert.equal(trainingSchema.safeParse([oldTraining]).success,false);
  assert.deepEqual(await effectiveTraining([oldTraining],db),[]);
  assert.equal(trainingSchema.safeParse([{...oldTraining,features:[0,0,0,10,10,10,1,50],instrument_version:PRETEST_INSTRUMENT_VERSION}]).success,true);
  assert.equal((await db.query("SELECT count(*)::int AS n FROM kc_version_mapping")).rows[0].n,22);
 }finally{await closeDB();}
});

test("Source parsing and graph contracts measure the submitted source rather than preview repair",()=>{
 const malformed=analyzeSource({html:"<h1>SIMPUS-Mini</h1>",css:"",js:""});
 assert.equal(malformed.html.tags.html[0].explicit,false);
 assert.ok(malformed.html.errors.length>0);
 const original=analyzeSource({html:'<!doctype html><html lang="id"><head><title>Katalog</title></head><body><h1>Katalog</h1></body></html>',css:"",js:"for(let i=0;i<3;i++){}"});
 assert.equal(original.html.tags.title[0].parent,"head");
 assert.equal(original.js.counts.ForStatement,1);
 validateDAG(seedKCs);
 assert.equal(seedKCs.filter(k=>k.module==="HTML").length,5);
 assert.equal(seedKCs.filter(k=>k.module==="CSS").length,9);
 assert.equal(seedKCs.filter(k=>k.module==="JavaScript").length,11);
 assert.equal(seedKCs.reduce((n,k)=>n+k.importance_weight!,0),77);
 for(const kc of seedKCs){assert.equal(seedExercises.filter(e=>e.kcs[0].id===kc.id).length,3);if(kc.assessment_ready)assert.ok(seedExercises.filter(e=>e.kcs[0].id===kc.id).every(e=>e.tests.length>=3));}
 const samples=[];
 for(const p of [.2,.5,.8]){const start=performance.now();const r=inferReadiness(seedKCs,Object.fromEntries(seedKCs.map(k=>[k.id,p])),defaultConfig);samples.push(performance.now()-start);assert.ok(Object.values(r.readiness).every(n=>n>=0&&n<=1));}
 console.log("BN25 exact inference local ms:",samples.map(n=>Math.round(n)));
});
