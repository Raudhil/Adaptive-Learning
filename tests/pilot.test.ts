import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { randomUUID } from "node:crypto";
process.env.LOCAL_DB_PATH=path.join(process.cwd(),".tmp","pilot-test-"+randomUUID(),"postgres");
process.env.DATABASE_URL="";
import { db,transaction,closeDB,json } from "../src/lib/db";
import { labelPilot,pilotDataset,validateTraining,effectiveTraining,managedClass } from "../src/lib/pilot";
import { classify } from "../src/lib/adaptive/knn";
import { configSchema } from "../src/lib/validation";
import { defaultConfig,PRETEST_INSTRUMENT_VERSION } from "../src/lib/seed-data";
import type { User } from "../src/lib/types";

test("fallback thresholds are configurable, backward compatible, and ordered",()=>{
 const features=[.5,.5,.5,10,10,10,3,50];
 assert.equal(classify(features,[],3,15).label,"menengah");
 assert.equal(classify(features,[],3,15,{intermediate:.6,advanced:.9}).label,"pemula");
 assert.equal(configSchema.safeParse({...defaultConfig,fallbackThresholds:{intermediate:.8,advanced:.4}}).success,false);
 const {fallbackThresholds:omitted,...legacy}=defaultConfig;
 assert.deepEqual(configSchema.parse(legacy).fallbackThresholds,{intermediate:.4,advanced:.75});
});

test("pilot provenance: approved rubrics, owner access, cohort isolation, immutable labels, consent withdrawal",async()=>{
 const teacher={id:"teacher",role:"lecturer"} as User;
 try{
  for(const [userId,role] of [["teacher","lecturer"],["other","lecturer"],["real","student"],["sim","student"],["experiment","student"]]){
   await db.query("INSERT INTO users(id,email,name,role,password_hash,consent_at) VALUES($1,$2,$1,$3,'test',now()-interval '1 day')",[userId,`${userId}@test.local`,role]);
  }
  for(const [courseId,purpose,kind,userId] of [["real-class","pilot","real","real"],["sim-class","pilot","simulation","sim"],["exp-class","experiment","real","experiment"]]){
   await db.query("INSERT INTO classes(id,name,lecturer_id,join_code,mode,purpose,data_kind) VALUES($1,$1,'teacher',$1,'adaptive',$2,$3)",[courseId,purpose,kind]);
   await db.query("INSERT INTO enrollments(user_id,class_id) VALUES($1,$2)",[userId,courseId]);
   await db.query("INSERT INTO pretest_results(user_id,features,answers,knn_label,neighbors,model_version,method,instrument_version) VALUES($1,$2,'{}','mahir','[]','test','score-fallback',$3)",[userId,json({raw:[.5,.5,.5,10,10,10,3,50]}),PRETEST_INSTRUMENT_VERSION]);
  }
  const criteria={pemula:"Kriteria pemula dari ahli",menengah:"Kriteria menengah dari ahli",mahir:"Kriteria mahir dari ahli"};
  await db.query("INSERT INTO pilot_rubrics(version,title,criteria,created_by) VALUES('draft-v1','Rubrik draft',$1,'teacher')",[json(criteria)]);
  await db.query("INSERT INTO pilot_rubrics(version,title,criteria,status,created_by,approved_by,approved_at) VALUES('approved-v1','Rubrik disepakati',$1,'approved','teacher','teacher',now())",[json(criteria)]);
  const input={class_id:"real-class",user_id:"real",rubric_version:"draft-v1",label:"pemula" as const,rationale:"Bukti penilaian dari tugas dasar yang diamati dosen."};
  await assert.rejects(()=>transaction(tx=>labelPilot(teacher,input,tx)),/rubrik yang sudah/);
  await assert.rejects(()=>transaction(tx=>labelPilot({...teacher,id:"other"},input,tx)),/Kelas tidak dapat diakses/);
  await assert.rejects(()=>managedClass({id:"real",role:"student"} as User,"real-class"),/Kelas tidak dapat diakses/);
  await assert.rejects(()=>transaction(tx=>labelPilot(teacher,{...input,class_id:"exp-class",user_id:"experiment",rubric_version:"approved-v1"},tx)),/hanya untuk kelas/);
  const first=await transaction(tx=>labelPilot(teacher,{...input,rubric_version:"approved-v1"},tx));
  const second=await transaction(tx=>labelPilot(teacher,{...input,rubric_version:"approved-v1",label:"menengah"},tx));
  const simulated=await transaction(tx=>labelPilot(teacher,{...input,class_id:"sim-class",user_id:"sim",rubric_version:"approved-v1"},tx));
  const real=await pilotDataset("real"),sim=await pilotDataset("simulation");
  assert.equal(real.training.length,1);assert.equal(real.training[0].id,second.id);assert.equal(real.training[0].label,"menengah");
  assert.equal(sim.training.length,1);assert.equal(sim.training[0].id,simulated.id);
  assert.equal((await pilotDataset("real","exp-class")).training.length,0);
  assert.equal((await db.query("SELECT count(*)::int AS n FROM pilot_labels WHERE user_id='real'")).rows[0].n,2);
  assert.deepEqual(await transaction(tx=>validateTraining(real.training,tx)),{source:"pilot",kind:"real",rubricVersions:["approved-v1"]});
  await assert.rejects(()=>transaction(tx=>validateTraining([...real.training,...sim.training],tx)),/simulasi dan data nyata/);
  await assert.rejects(()=>transaction(tx=>validateTraining([{...real.training[0],features:new Array(8).fill(0)}],tx)),/fitur\/label tidak sesuai/);
  await assert.rejects(()=>transaction(tx=>validateTraining([...real.training,{...real.training[0],id:first.id,pilot_label_id:first.id,label:"pemula"}],tx)),/Satu peserta/);
  await db.query("UPDATE users SET consent_at=null WHERE id='real'");
  assert.equal((await pilotDataset("real")).training.length,0);
  assert.equal((await transaction(tx=>effectiveTraining(real.training,tx))).length,0);
  await assert.rejects(()=>transaction(tx=>validateTraining(real.training,tx)),/persetujuan tidak aktif/);
  await db.query("UPDATE users SET consent_at=now() WHERE id='real'");
  assert.equal((await pilotDataset("real")).training.length,0,"renewed consent does not retrospectively include an earlier pretest");
 }finally{await closeDB();}
});
