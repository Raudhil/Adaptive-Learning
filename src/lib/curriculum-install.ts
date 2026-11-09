import { CURRICULUM_VERSION, PRETEST_INSTRUMENT_VERSION, legacyMapping } from "./curriculum";
import { seedKCs, seedExercises, curriculumMaterials, defaultConfig } from "./seed-data";
import { validateDAG } from "./adaptive/bayes-net";
import { json, type DB } from "./db";

/** Add another version atomically. Do not copy mastery or overwrite learner history. */
export async function installCurriculum(tx:DB) {
 validateDAG(seedKCs);
 for(const k of seedKCs){
  const old=(await tx.query('SELECT curriculum_version FROM knowledge_components WHERE id=$1',[k.id])).rows[0];
  if(old&&old.curriculum_version!==CURRICULUM_VERSION)throw new Error('ID '+k.id+' sudah dipakai versi lain; migrasi dibatalkan.');
 }
 await tx.query("INSERT INTO curriculum_versions(version,title,instrument_version) VALUES($1,'Pemrograman Web 2026: SIMPUS-Mini front-end',$2) ON CONFLICT DO NOTHING",[CURRICULUM_VERSION,PRETEST_INSTRUMENT_VERSION]);
 for(const k of seedKCs)await tx.query("INSERT INTO knowledge_components(id,code,name,module,position,curriculum_version,description,importance_weight,difficulty_level,sources,external_prerequisites,assessment_ready,assessment_note,weight_reason) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) ON CONFLICT(id) DO NOTHING",[k.id,k.code,k.name,k.module,k.position,CURRICULUM_VERSION,k.description,k.importance_weight,k.difficulty_level,json(k.sources),json(k.external_prerequisites),k.assessment_ready,k.assessment_note,k.weight_reason]);
 for(const k of seedKCs)for(const p of k.prerequisites)await tx.query('INSERT INTO kc_prerequisites(kc_id,prereq_kc_id,weight) VALUES($1,$2,$3) ON CONFLICT DO NOTHING',[k.id,p.id,p.weight]);
 for(const m of curriculumMaterials)await tx.query('INSERT INTO materials(id,kc_id,type,title,content,url) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING',[m.id,m.kc_id,m.type,m.title,m.content,m.url]);
 for(const e of seedExercises){
  await tx.query("INSERT INTO exercises(id,title,instructions,starter_code,difficulty,hints,curriculum_version,evaluator,assessment_ready,assessment_note,sources) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) ON CONFLICT DO NOTHING",[e.id,e.title,e.instructions,json(e.starter_code),e.difficulty,json(e.hints),CURRICULUM_VERSION,e.evaluator,e.assessment_ready,e.assessment_note,json(e.sources)]);
  for(const k of e.kcs)await tx.query('INSERT INTO exercise_kc(exercise_id,kc_id,weight) VALUES($1,$2,$3) ON CONFLICT DO NOTHING',[e.id,k.id,k.weight]);
  for(const t of e.tests)await tx.query('INSERT INTO test_cases(id,exercise_id,description,script,timeout_ms) VALUES($1,$2,$3,$4,$5) ON CONFLICT DO NOTHING',[t.id,e.id,t.description,t.script,t.timeout_ms]);
 }
 for(const [oldId,newIds] of Object.entries(legacyMapping))for(const newId of newIds)await tx.query("INSERT INTO kc_version_mapping(old_kc_id,new_kc_id,curriculum_version) SELECT id,$2,$3 FROM knowledge_components WHERE id=$1 ON CONFLICT DO NOTHING",[oldId,newId,CURRICULUM_VERSION]);
 const config=(await tx.query('SELECT version,values FROM model_params WHERE active=true')).rows[0];
 if(config?.values.instrumentVersion!==PRETEST_INSTRUMENT_VERSION){
  const values={...(config?.values??defaultConfig),instrumentVersion:PRETEST_INSTRUMENT_VERSION,training:[],bktByKc:{},masteryThreshold:0.95,dataset:{source:'manual',kind:'unverified',rubricVersions:[]}};
  await tx.query('UPDATE model_params SET active=false WHERE active');
  await tx.query('INSERT INTO model_params(version,values,active) VALUES($1,$2,true)',['simpus-v1-'+Date.now(),json(values)]);
 }
 await tx.query('UPDATE curriculum_versions SET active=false WHERE active');
 await tx.query('UPDATE curriculum_versions SET active=true WHERE version=$1',[CURRICULUM_VERSION]);
 return {version:CURRICULUM_VERSION,kcs:seedKCs.length,materials:curriculumMaterials.length,exercises:seedExercises.length,automaticallyAssessed:seedKCs.filter(k=>k.assessment_ready).length,pending:seedKCs.filter(k=>!k.assessment_ready).map(k=>k.id)};
}
