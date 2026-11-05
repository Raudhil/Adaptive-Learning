import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { randomUUID } from "node:crypto";
process.env.LOCAL_DB_PATH=path.join(process.cwd(),".tmp","test-"+randomUUID(),"postgres");
process.env.DATABASE_URL="";
import { db,transaction,json,closeDB } from "../src/lib/db";
import { seedKCs,seedExercises,defaultConfig,pretestQuestions } from "../src/lib/seed-data";
import { submitPretest,recordAttempt } from "../src/lib/learning";
test("Integration: pretest → attempt → first-only BKT → audit; full hint; transaction rollback",async()=>{
 try{
  await transaction(async tx=>{
   for(const k of seedKCs)await tx.query("INSERT INTO knowledge_components(id,code,name,module,position) VALUES($1,$2,$3,$4,$5)",[k.id,k.code,k.name,k.module,k.position]);
   for(const k of seedKCs)for(const p of k.prerequisites)await tx.query("INSERT INTO kc_prerequisites(kc_id,prereq_kc_id,weight) VALUES($1,$2,$3)",[k.id,p.id,p.weight]);
   for(const e of seedExercises.slice(0,3)){
    await tx.query("INSERT INTO exercises(id,title,instructions,starter_code,difficulty,hints) VALUES($1,$2,$3,$4,$5,$6)",[e.id,e.title,e.instructions,json(e.starter_code),e.difficulty,json(e.hints)]);
    await tx.query("INSERT INTO exercise_kc(exercise_id,kc_id,weight) VALUES($1,'H1',1)",[e.id]);
    for(const t of e.tests)await tx.query("INSERT INTO test_cases(id,exercise_id,description,script,timeout_ms) VALUES($1,$2,$3,$4,$5)",[t.id,e.id,t.description,t.script,t.timeout_ms]);
   }
   await tx.query("INSERT INTO model_params(version,values,active) VALUES('test-v1',$1,true)",[json(defaultConfig)]);
   await tx.query("INSERT INTO users(id,email,name,role,password_hash,consent_at) VALUES('teacher','teacher@test.local','Teacher','lecturer','test',null),('student','student@test.local','Student','student','test',now())");
   await tx.query("INSERT INTO classes(id,name,lecturer_id,join_code,mode) VALUES('course','Course','teacher','CODE','adaptive')");
   await tx.query("INSERT INTO enrollments(user_id,class_id) VALUES('student','course')");
  });
  const answers=Object.fromEntries(pretestQuestions.map(q=>[q.id,(q.answer+1)%4]));
  const pretest=await submitPretest("student",answers,[10,10,10,10],1,null);assert.equal(pretest.method,"score-fallback");assert.equal(pretest.label,"pemula");
  await assert.rejects(()=>submitPretest("student",answers,[1,1,1,1],1,null),/sekali/);
  const ex=seedExercises[0];await db.query("INSERT INTO drafts(user_id,exercise_id,code) VALUES('student',$1,$2)",[ex.id,json(ex.starter_code)]);
  const input={exercise_id:ex.id,code:ex.starter_code,tests_result:ex.tests.map(t=>({id:t.id,passed:true})),selection:"manual"};
  const first=await recordAttempt("student",input);assert.equal(first.is_first,true);assert.ok(Math.abs(first.mastery[0].p_after-.6)<1e-12);
  const second=await recordAttempt("student",input);assert.equal(second.is_first,false);assert.equal(second.mastery.length,0);
  assert.equal((await db.query("SELECT * FROM mastery_log")).rows.length,1);
  const recs=(await db.query("SELECT * FROM recommendations ORDER BY created_at DESC")).rows;assert.ok(recs.length>=3);assert.equal(recs[0].inputs.param_version,"test-v1");
  const nextEx=seedExercises[1];await db.query("INSERT INTO drafts(user_id,exercise_id,code,hints_used) VALUES('student',$1,$2,3)",[nextEx.id,json(nextEx.starter_code)]);
  const full=await recordAttempt("student",{...input,exercise_id:nextEx.id,tests_result:nextEx.tests.map(t=>({id:t.id,passed:true}))});assert.equal(full.full_hint,true);assert.ok(full.mastery[0].p_after<full.mastery[0].p_before);
  await assert.rejects(()=>recordAttempt("student",{...input,tests_result:[{id:"fake",passed:true}]}),/sesuai/);
  await assert.rejects(()=>transaction(async tx=>{await tx.query("UPDATE users SET name='CHANGED' WHERE id='student'");throw new Error("rollback");}),/rollback/);
  assert.equal((await db.query("SELECT name FROM users WHERE id='student'")).rows[0].name,"Student");
 }finally{await closeDB();}
});
