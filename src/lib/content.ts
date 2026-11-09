import { db, type DB } from "./db";
import type { Exercise, KC, ModelConfig } from "./types";
export async function getKCs(tx:DB=db):Promise<KC[]> {
 const [{rows:nodes},{rows:edges}]=await Promise.all([tx.query("SELECT * FROM knowledge_components WHERE curriculum_version=COALESCE((SELECT version FROM curriculum_versions WHERE active),'legacy-srs-v1') ORDER BY position,code"),tx.query("SELECT * FROM kc_prerequisites ORDER BY prereq_kc_id")]);
 return nodes.map(k=>({...k,prerequisites:edges.filter(e=>e.kc_id===k.id).map(e=>({id:e.prereq_kc_id,weight:e.weight}))})) as KC[];
}
export async function getExercises(tx:DB=db):Promise<Exercise[]> {
 const [{rows:items},{rows:kcs},{rows:tests}]=await Promise.all([tx.query("SELECT * FROM exercises WHERE curriculum_version=COALESCE((SELECT version FROM curriculum_versions WHERE active),'legacy-srs-v1') ORDER BY id"),tx.query("SELECT * FROM exercise_kc ORDER BY kc_id"),tx.query("SELECT * FROM test_cases ORDER BY id")]);
 return items.map(e=>({...e,kcs:kcs.filter(k=>k.exercise_id===e.id).map(k=>({id:k.kc_id,weight:k.weight})),tests:tests.filter(t=>t.exercise_id===e.id)})) as Exercise[];
}
export async function getConfig(tx:DB=db):Promise<{version:string;values:ModelConfig}> {
 const {rows}=await tx.query("SELECT version,values FROM model_params WHERE active=true");
 if (!rows[0]) throw new Error("Basis data belum diisi. Jalankan npm run db:seed.");
 return rows[0] as {version:string;values:ModelConfig};
}
