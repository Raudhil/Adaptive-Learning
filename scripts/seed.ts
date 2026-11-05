import { db, transaction, json, closeDB } from "../src/lib/db";
import { seedKCs, seedExercises, defaultConfig, materialNotes } from "../src/lib/seed-data";
async function main() {
 await transaction(async tx=> {
  for (const k of seedKCs) await tx.query("INSERT INTO knowledge_components(id,code,name,module,position) VALUES($1,$2,$3,$4,$5) ON CONFLICT(id) DO NOTHING",[k.id,k.code,k.name,k.module,k.position]);
  for (const k of seedKCs) {
   for (const p of k.prerequisites) await tx.query("INSERT INTO kc_prerequisites(kc_id,prereq_kc_id,weight) VALUES($1,$2,$3) ON CONFLICT DO NOTHING",[k.id,p.id,p.weight]);
   await tx.query("INSERT INTO materials(id,kc_id,type,title,content) VALUES($1,$2,'text',$3,$4) ON CONFLICT DO NOTHING",[`mat-${k.id}`,k.id,k.name,materialNotes[k.id]]);
  }
  for (const e of seedExercises) {
   await tx.query("INSERT INTO exercises(id,title,instructions,starter_code,difficulty,hints) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING",[e.id,e.title,e.instructions,json(e.starter_code),e.difficulty,json(e.hints)]);
   for (const k of e.kcs) await tx.query("INSERT INTO exercise_kc(exercise_id,kc_id,weight) VALUES($1,$2,$3) ON CONFLICT DO NOTHING",[e.id,k.id,k.weight]);
   for (const t of e.tests) await tx.query("INSERT INTO test_cases(id,exercise_id,description,script,timeout_ms) VALUES($1,$2,$3,$4,$5) ON CONFLICT DO NOTHING",[t.id,e.id,t.description,t.script,t.timeout_ms]);
  }
  const {rows}=await tx.query("SELECT version FROM model_params LIMIT 1");
  if (!rows.length) await tx.query("INSERT INTO model_params(version,values,active) VALUES('pilot-v1',$1,true)",[json(defaultConfig)]);
 });
 const {rows}=await db.query("SELECT (SELECT count(*) FROM knowledge_components) AS kcs,(SELECT count(*) FROM exercises) AS exercises");
 console.log("Seed selesai (idempoten):",rows[0]);
}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(closeDB);
