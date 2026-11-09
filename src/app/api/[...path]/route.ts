import { NextResponse } from "next/server";
import { z } from "zod";
import { hash, compare } from "bcryptjs";
import { randomBytes } from "node:crypto";
import { db, id, json, transaction } from "@/lib/db";
import { requireUser,checkMutation,createSession,destroySession,checkRateLimit,HttpError } from "@/lib/auth";
import { getKCs,getExercises,getConfig } from "@/lib/content";
import { submitPretest,recordAttempt,buildRecommendation,hasPretest,studentContext } from "@/lib/learning";
import { validateDAG } from "@/lib/adaptive/bayes-net";
import { selectK } from "@/lib/adaptive/knn";
import { configSchema,kcSchema,exerciseSchema,materialSchema,codeSchema,trainingSchema } from "@/lib/validation";
import { pretestQuestions } from "@/lib/seed-data";
import { CURRICULUM_VERSION,PRETEST_INSTRUMENT_VERSION } from "@/lib/curriculum";
import { pseudonym,toCSV } from "@/lib/export";
import { roleHomePath } from "@/lib/roles";
import { classAnalytics,studentDetail } from "@/lib/analytics";
import { labelPilot,pilotDataset,validateTraining } from "@/lib/pilot";
export const runtime="nodejs";
export const dynamic="force-dynamic";
type Context={params:Promise<{path:string[]}>};
async function body(request:Request) {
 const text=await request.text();
 if (Buffer.byteLength(text)>1024*1024) throw new HttpError(413,"Data terlalu besar (maksimal 1 MB).");
 try {return JSON.parse(text);} catch {throw new HttpError(400,"JSON tidak valid.");}
}
function ok(value:unknown,status=200) {return NextResponse.json(value,{status,headers:{"Cache-Control":"no-store"}});}
async function handle(request:Request,context:Context) {
 const {path}=await context.params, route=path.join("/"),method=request.method,url=new URL(request.url);
 try {
  if (!["GET","HEAD"].includes(method)) checkMutation(request);
  if (route==="auth/register"&&method==="POST") {
   const input=z.object({email:z.email().max(254),name:z.string().trim().min(2).max(120),password:z.string().min(12).max(72),role:z.enum(["student","lecturer"]).default("student"),consent:z.boolean()}).parse(await body(request));
   const email=input.email.toLowerCase(),domains=(process.env.CAMPUS_EMAIL_DOMAINS||"").split(",").map(s=>s.trim().toLowerCase()).filter(Boolean);
   if (process.env.NODE_ENV==="production"&&!domains.length&&process.env.ALLOW_LOCAL_DB!=="true") throw new HttpError(503,"Admin harus mengatur domain email kampus.");
   if (domains.length&&!domains.includes(email.split("@")[1])) throw new HttpError(400,"Gunakan email kampus yang diizinkan.");
   await checkRateLimit(`register:${email}`);
   const userId=id();
   await db.query("INSERT INTO users(id,email,name,role,password_hash,consent_at) VALUES($1,$2,$3,$4,$5,$6)",[userId,email,input.name,input.role,await hash(input.password,12),input.role==="student"&&input.consent?new Date().toISOString():null]);
   await createSession(userId);return ok({next:roleHomePath(input.role)},201);
  }
  if (route==="auth/login"&&method==="POST") {
   const input=z.object({email:z.email(),password:z.string().min(1).max(72)}).parse(await body(request)),email=input.email.toLowerCase();
   await checkRateLimit(`login:${email}`);
   const {rows}=await db.query("SELECT id,password_hash,role FROM users WHERE email=$1",[email]);
   // Constant-cost hash comparison for unknown email as well.
   const valid=await compare(input.password,rows[0]?.password_hash??"$2b$12$y0G71n8SRM1DsVroLCG6kuKwG4MnMZ8n.uq.VzUjSrM9dPIVjdaFu");
   if (!rows[0]||!valid) throw new HttpError(401,"Email atau kata sandi salah.");
   await createSession(rows[0].id);return ok({next:roleHomePath(rows[0].role)});
  }
  if (route==="auth/logout"&&method==="POST") {await destroySession();return ok({next:"/login"});}
  const user=await requireUser();
  if (route==="me"&&method==="GET") {
   const profile=user.role==="student"?(await db.query("SELECT knn_label,method,model_version,created_at,features->'scores' AS scores,instrument_version,audit->'dataset' AS dataset FROM current_pretests WHERE user_id=$1",[user.id])).rows[0]??null:null;
   return ok({user,pretest:user.role==="student"?!!profile:null,profile});
  }
  if(route==="curriculum/history"&&method==="GET"){
   await requireUser(["student"]);
   const [pretests,states,attempts]=await Promise.all([
    db.query("SELECT instrument_version,knn_label,created_at FROM pretest_results WHERE user_id=$1 AND instrument_version<>$2 ORDER BY created_at DESC",[user.id,PRETEST_INSTRUMENT_VERSION]),
    db.query("SELECT m.*,k.code,k.name FROM mastery_states m JOIN knowledge_components k ON k.id=m.kc_id WHERE m.user_id=$1 AND k.curriculum_version<>$2 ORDER BY k.position",[user.id,CURRICULUM_VERSION]),
    db.query("SELECT a.id,a.code,a.passed,a.created_at,e.title FROM attempts a JOIN exercises e ON e.id=a.exercise_id WHERE a.user_id=$1 AND e.curriculum_version<>$2 ORDER BY a.created_at DESC",[user.id,CURRICULUM_VERSION])
   ]);return ok({pretests:pretests.rows,states:states.rows,attempts:attempts.rows});
  }
  if (route==="consent"&&method==="PUT") {
   const {consent}=z.object({consent:z.boolean()}).parse(await body(request));
   await db.query("UPDATE users SET consent_at=$1 WHERE id=$2",[consent?new Date().toISOString():null,user.id]);return ok({consent});
  }
  if (route==="pretest"&&method==="GET") {
   await requireUser(["student"]);return ok({questions:pretestQuestions.map(({answer,...q})=>q)});
  }
  if (route==="pretest"&&method==="POST") {
   await requireUser(["student"]);
   const input=z.object({answers:z.record(z.string(),z.number().int().min(0).max(3)),times:z.array(z.number().min(0).max(1800)).length(3),experience:z.number().int().min(1).max(5),prerequisite:z.number().min(0).max(100).nullable()}).parse(await body(request));
   return ok(await submitPretest(user.id,input.answers,input.times,input.experience,input.prerequisite));
  }
  if (route==="recommendation"&&method==="GET") {await requireUser(["student"]);return ok(await transaction(tx=>buildRecommendation(user.id,tx)));}
  if (route==="attempts"&&method==="POST") {
   await requireUser(["student"]);
   const input=z.object({exercise_id:z.string(),code:codeSchema,tests_result:z.array(z.object({id:z.string(),passed:z.boolean(),error:z.string().max(1000).optional()})).min(1).max(15),selection:z.enum(["recommended","manual"]),recommendation_id:z.string().optional()}).parse(await body(request));
   return ok(await recordAttempt(user.id,input));
  }
  if (route==="mastery"&&method==="GET") {
   await requireUser(["student"]);
   const [{rows:states},{rows:history}]=await Promise.all([db.query("SELECT m.*,k.assessment_ready FROM mastery_states m JOIN knowledge_components k ON k.id=m.kc_id WHERE m.user_id=$1 AND k.curriculum_version=$2",[user.id,CURRICULUM_VERSION]),db.query("SELECT l.kc_id,l.p_before,l.p_after,l.created_at FROM mastery_log l JOIN knowledge_components k ON k.id=l.kc_id WHERE l.user_id=$1 AND k.curriculum_version=$2 ORDER BY l.created_at DESC LIMIT 100",[user.id,CURRICULUM_VERSION])]);
   const {values}=await getConfig();
   return ok({states,history,masteryThreshold:values.masteryThreshold,readinessThreshold:values.readinessThreshold});
  }
  if (route==="drafts"&&["GET","PUT"].includes(method)) {
   await requireUser(["student"]);
   const exerciseId=method==="GET"?url.searchParams.get("exercise_id"):null;
   const input=method==="PUT"?z.object({exercise_id:z.string(),code:codeSchema}).parse(await body(request)):null;
   const ex=(await getExercises()).find(e=>e.id===(input?.exercise_id??exerciseId));
   if (!ex) throw new HttpError(404,"Latihan tidak ditemukan.");
   await studentContext(user.id);
   if (!await hasPretest(user.id)) throw new HttpError(409,"Selesaikan pretest dahulu.");
   if (input) await db.query("INSERT INTO drafts(user_id,exercise_id,code) VALUES($1,$2,$3) ON CONFLICT(user_id,exercise_id) DO UPDATE SET code=$3,updated_at=now()",[user.id,ex.id,json(input.code)]);
   else await db.query("INSERT INTO drafts(user_id,exercise_id,code) VALUES($1,$2,$3) ON CONFLICT DO NOTHING",[user.id,ex.id,json(ex.starter_code)]);
   const {rows}=await db.query("SELECT * FROM drafts WHERE user_id=$1 AND exercise_id=$2",[user.id,ex.id]);
   return ok(rows[0]);
  }
  if (route==="hints"&&method==="POST") {
   await requireUser(["student"]);const {exercise_id}=z.object({exercise_id:z.string()}).parse(await body(request));
   const exercise=(await getExercises()).find(e=>e.id===exercise_id);
   if (!exercise) throw new HttpError(404,"Latihan tidak ditemukan.");
   const {rows}=await db.query("UPDATE drafts SET hints_used=LEAST(hints_used+1,$3) WHERE user_id=$1 AND exercise_id=$2 RETURNING hints_used",[user.id,exercise_id,exercise.hints.length]);
   if (!rows[0]) throw new HttpError(409,"Buka latihan dahulu.");
   return ok({hints:exercise.hints.slice(0,rows[0].hints_used),hints_used:rows[0].hints_used});
  }
  if (route==="classes"&&method==="GET") {
   const {rows}=await db.query(user.role==="student"?"SELECT c.* FROM classes c JOIN enrollments e ON e.class_id=c.id WHERE e.user_id=$1":user.role==="lecturer"?"SELECT * FROM classes WHERE lecturer_id=$1 ORDER BY created_at DESC":"SELECT * FROM classes WHERE $1::text IS NOT NULL ORDER BY created_at DESC",[user.id]);return ok(rows);
  }
  if (route==="classes"&&method==="POST") {
   await requireUser(["lecturer","admin"]);const input=z.object({name:z.string().trim().min(3).max(150),mode:z.enum(["adaptive","control"]),purpose:z.enum(["practice","pilot","experiment"]).default("practice"),data_kind:z.enum(["real","simulation"]).default("simulation")}).parse(await body(request));
   const {rows}=await db.query("INSERT INTO classes(id,name,lecturer_id,join_code,mode,purpose,data_kind) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *",[id(),input.name,user.id,randomBytes(5).toString("hex").toUpperCase(),input.mode,input.purpose,input.data_kind]);return ok(rows[0],201);
  }
  if (route==="classes/join"&&method==="POST") {
   await requireUser(["student"]);const {code}=z.object({code:z.string().trim().min(4).max(30)}).parse(await body(request));
   return ok(await transaction(async tx=> {
    if ((await tx.query("SELECT user_id FROM enrollments WHERE user_id=$1",[user.id])).rows.length) throw new HttpError(409,"Mahasiswa hanya dapat mengikuti satu kelas eksperimen agar kelompok tidak tercampur.");
    const {rows}=await tx.query("SELECT id,name,mode FROM classes WHERE join_code=$1",[code.toUpperCase()]);
    if (!rows[0]) throw new HttpError(404,"Kode kelas tidak ditemukan.");
    await tx.query("INSERT INTO enrollments(user_id,class_id) VALUES($1,$2)",[user.id,rows[0].id]);return rows[0];
   }));
  }
  if (path.length===5&&path[0]==="classes"&&path[2]==="students"&&path[4]==="label"&&method==="POST") {
   await requireUser(["lecturer","admin"]);
   const input=z.object({rubric_version:z.string().min(3).max(80),label:z.enum(["pemula","menengah","mahir"]),rationale:z.string().trim().min(20).max(5000)}).parse(await body(request));
   return ok(await transaction(tx=>labelPilot(user,{...input,class_id:path[1],user_id:path[3]},tx)),201);
  }
  if (path.length===4&&path[0]==="classes"&&path[2]==="students"&&method==="GET") {
   await requireUser(["lecturer","admin"]);const page=z.coerce.number().int().min(1).max(100000).parse(url.searchParams.get("page")??1);
   return ok(await studentDetail(user,path[1],path[3],page));
  }
  if (path.length===3&&path[0]==="classes"&&path[2]==="analytics"&&method==="GET") {
   await requireUser(["lecturer","admin"]);
   return ok(await classAnalytics(user,path[1]));
  }
  if (route==="pilot/rubrics") {
   await requireUser(["lecturer","admin"]);
   if(method==="GET")return ok((await db.query("SELECT version,title,criteria,status,created_by,approved_by,approved_at,created_at FROM pilot_rubrics WHERE status='approved' OR created_by=$1 OR $2='admin' ORDER BY created_at DESC",[user.id,user.role])).rows);
   if(method==="POST"||method==="PUT"){
    const input=z.object({version:z.string().regex(/^[a-zA-Z0-9._-]{3,80}$/),title:z.string().trim().min(5).max(180),criteria:z.object({pemula:z.string().trim().min(10).max(3000),menengah:z.string().trim().min(10).max(3000),mahir:z.string().trim().min(10).max(3000)})}).parse(await body(request));
    return ok(await transaction(async tx=>{
     if(method==="POST")return (await tx.query("INSERT INTO pilot_rubrics(version,title,criteria,created_by) VALUES($1,$2,$3,$4) RETURNING *",[input.version,input.title,json(input.criteria),user.id])).rows[0];
     const existing=(await tx.query("SELECT * FROM pilot_rubrics WHERE version=$1",[input.version])).rows[0];
     if(!existing||(existing.created_by!==user.id&&user.role!=="admin"))throw new HttpError(403,"Rubrik tidak dapat diubah.");
     if(existing.status!=="draft")throw new HttpError(409,"Rubrik disetujui tidak dapat diubah. Buat versi baru untuk revisi.");
     return (await tx.query("UPDATE pilot_rubrics SET title=$2,criteria=$3 WHERE version=$1 RETURNING *",[input.version,input.title,json(input.criteria)])).rows[0];
    }),method==="POST"?201:200);
   }
  }
  if(path.length===4&&path[0]==="pilot"&&path[1]==="rubrics"&&path[3]==="approve"&&method==="POST"){
   await requireUser(["lecturer","admin"]);
   return ok(await transaction(async tx=>{
    const rubric=(await tx.query("SELECT * FROM pilot_rubrics WHERE version=$1",[path[2]])).rows[0];
    if(!rubric||(rubric.created_by!==user.id&&user.role!=="admin"))throw new HttpError(403,"Rubrik tidak dapat disetujui.");
    if(rubric.status!=="draft")throw new HttpError(409,"Rubrik sudah disetujui.");
    return (await tx.query("UPDATE pilot_rubrics SET status='approved',approved_by=$2,approved_at=now() WHERE version=$1 RETURNING *",[rubric.version,user.id])).rows[0];
   }));
  }
  if(route==="pilot/dataset"&&method==="GET"){
   await requireUser(["admin"]);const kind=z.enum(["real","simulation"]).parse(url.searchParams.get("kind")??"real");
   return ok(await pilotDataset(kind,url.searchParams.get("class_id")||undefined));
  }
  if (["kc","exercises","materials"].includes(route)) {
   if (method==="GET") return ok(route==="kc"?await getKCs():route==="exercises"?(await getExercises()).map(e=>user.role==="student"?{...e,hints:e.hints.map(()=>"Petunjuk tersedia melalui tombol hint.")}:e):(await db.query("SELECT m.* FROM materials m JOIN knowledge_components k ON k.id=m.kc_id WHERE k.curriculum_version=$1 ORDER BY m.kc_id,m.title",[CURRICULUM_VERSION])).rows);
   await requireUser(["lecturer","admin"]);
   if (method==="DELETE") {
    const {id:target}=z.object({id:z.string().min(1)}).parse(await body(request));
    const table={kc:"knowledge_components",exercises:"exercises",materials:"materials"}[route]!;
    const archived=route==="materials"?(await db.query("SELECT k.curriculum_version FROM materials m JOIN knowledge_components k ON k.id=m.kc_id WHERE m.id=$1",[target])).rows[0]:(await db.query(`SELECT curriculum_version FROM ${table} WHERE id=$1`,[target])).rows[0];
    if(archived&&archived.curriculum_version!==CURRICULUM_VERSION)throw new HttpError(409,"Konten arsip tidak dihapus; riwayat kurikulum lama dipertahankan.");
    await db.query(`DELETE FROM ${table} WHERE id=$1`,[target]);return ok({deleted:true});
   }
   if (["POST","PUT"].includes(method)) {
    const input=await body(request);
    return ok(await transaction(async tx=> {
     if (route==="kc") {
      const k=kcSchema.parse(input),all=await getKCs(tx);
      const old=(await tx.query("SELECT curriculum_version FROM knowledge_components WHERE id=$1",[k.id])).rows[0];
      if(old&&old.curriculum_version!==CURRICULUM_VERSION)throw new HttpError(409,"KC historis tidak dapat ditimpa. Gunakan ID versi baru.");
      try { validateDAG([...all.filter(x=>x.id!==k.id),k]); } catch(error) { throw new HttpError(400,(error as Error).message); }
      await tx.query("INSERT INTO knowledge_components(id,code,name,module,position,curriculum_version) VALUES($1,$2,$3,$4,$5,'simpus-web-2026-v1') ON CONFLICT(id) DO UPDATE SET code=$2,name=$3,module=$4,position=$5",[k.id,k.code,k.name,k.module,k.position]);
      await tx.query("UPDATE knowledge_components SET description=COALESCE($2,description),importance_weight=COALESCE($3,importance_weight),difficulty_level=COALESCE($4,difficulty_level) WHERE id=$1",[k.id,k.description??null,k.importance_weight??null,k.difficulty_level??null]);
      await tx.query("DELETE FROM kc_prerequisites WHERE kc_id=$1",[k.id]);
      for (const p of k.prerequisites) await tx.query("INSERT INTO kc_prerequisites(kc_id,prereq_kc_id,weight) VALUES($1,$2,$3)",[k.id,p.id,p.weight]);
      return k;
     }
     if (route==="exercises") {
      const e=exerciseSchema.parse(input);
      const nodes=await getKCs(tx);
      if(e.assessment_ready&&e.kcs.some(k=>nodes.some(n=>n.id===k.id&&n.assessment_ready===false)))throw new HttpError(409,"KC belum siap dinilai otomatis.");
      if(e.kcs.some(k=>!nodes.some(n=>n.id===k.id)))throw new HttpError(400,"Latihan hanya boleh merujuk KC kurikulum aktif.");
      if((await tx.query("SELECT id FROM attempts WHERE exercise_id=$1 LIMIT 1",[e.id])).rows.length)throw new HttpError(409,"Soal sudah memiliki riwayat. Buat ID/versi soal baru.");
      const old=(await tx.query("SELECT curriculum_version FROM exercises WHERE id=$1",[e.id])).rows[0];
      if(old&&old.curriculum_version!==CURRICULUM_VERSION)throw new HttpError(409,"Latihan historis tidak dapat ditimpa.");
      await tx.query("INSERT INTO exercises(id,title,instructions,starter_code,difficulty,hints,curriculum_version) VALUES($1,$2,$3,$4,$5,$6,'simpus-web-2026-v1') ON CONFLICT(id) DO UPDATE SET title=$2,instructions=$3,starter_code=$4,difficulty=$5,hints=$6",[e.id,e.title,e.instructions,json(e.starter_code),e.difficulty,json(e.hints)]);
      await tx.query("UPDATE exercises SET evaluator=$2,assessment_ready=$3,assessment_note=$4 WHERE id=$1",[e.id,e.evaluator,e.assessment_ready,e.assessment_note]);
      await tx.query("DELETE FROM exercise_kc WHERE exercise_id=$1",[e.id]);await tx.query("DELETE FROM test_cases WHERE exercise_id=$1",[e.id]);
      for (const k of e.kcs) await tx.query("INSERT INTO exercise_kc(exercise_id,kc_id,weight) VALUES($1,$2,$3)",[e.id,k.id,k.weight]);
      for (const t of e.tests) await tx.query("INSERT INTO test_cases(id,exercise_id,description,script,timeout_ms) VALUES($1,$2,$3,$4,$5)",[t.id,e.id,t.description,t.script,t.timeout_ms]);return e;
     }
     const m=materialSchema.parse(input);
     if(!(await getKCs(tx)).some(k=>k.id===m.kc_id))throw new HttpError(409,"Materi harus merujuk KC kurikulum aktif.");
     const oldMaterial=(await tx.query("SELECT k.curriculum_version FROM materials m JOIN knowledge_components k ON k.id=m.kc_id WHERE m.id=$1",[m.id])).rows[0];
     if(oldMaterial&&oldMaterial.curriculum_version!==CURRICULUM_VERSION)throw new HttpError(409,"Materi arsip tidak dapat ditimpa.");
     await tx.query("INSERT INTO materials(id,kc_id,title,type,content,url) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT(id) DO UPDATE SET kc_id=$2,title=$3,type=$4,content=$5,url=$6,updated_at=now()",[m.id,m.kc_id,m.title,m.type,m.content,m.url]);return m;
    }));
   }
  }
  if (route==="model-params") {
   await requireUser(["admin"]);
   if (method==="GET") return ok({active:await getConfig(),versions:(await db.query("SELECT version,active,created_at FROM model_params ORDER BY created_at DESC")).rows});
   if (method==="PUT") {
    const input=z.object({version:z.string().regex(/^[a-zA-Z0-9._-]{3,80}$/),values:configSchema}).parse(await body(request));
    await transaction(async tx=>{const dataset=await validateTraining(input.values.training,tx);await tx.query("UPDATE model_params SET active=false WHERE active=true");await tx.query("INSERT INTO model_params(version,values,active) VALUES($1,$2,true)",[input.version,json({...input.values,dataset})]);});return ok({version:input.version});
   }
  }
  if (route==="model-params/train"&&method==="POST") {
   await requireUser(["admin"]);const training=trainingSchema.parse((await body(request)).training);return ok(selectK(training));
  }
  if (route==="users") {
   await requireUser(["admin"]);
   if (method==="GET") return ok((await db.query("SELECT id,name,email,role,created_at FROM users ORDER BY name")).rows);
   if (method==="PUT") {
    const input=z.object({id:z.string(),role:z.enum(["student","lecturer","admin","researcher"])}).parse(await body(request));
    if (input.id===user.id&&input.role!=="admin") throw new HttpError(400,"Peran admin sendiri tidak dapat diturunkan.");
    if ((await db.query("SELECT user_id FROM enrollments WHERE user_id=$1",[input.id])).rows.length&&input.role!=="student") throw new HttpError(409,"Akun peserta eksperimen tidak dapat diganti perannya.");
    await db.query("UPDATE users SET role=$1 WHERE id=$2",[input.role,input.id]);return ok({updated:true});
   }
  }
  if (route==="export"&&method==="GET") {
   await requireUser(["researcher","admin"]);
   const {class_id,from,to,kind}=z.object({class_id:z.string().min(1),from:z.iso.date(),to:z.iso.date(),kind:z.enum(["attempts","pretest","recommendations"]).default("attempts")}).parse(Object.fromEntries(url.searchParams));
   if (from>to) throw new HttpError(400,"Rentang tanggal tidak valid.");
   const secret=process.env.RESEARCH_SECRET||"";
   pseudonym("validation",secret);
   if (kind!=="attempts") {
    const table=kind==="pretest"?"pretest_results":"recommendations";
    const {rows}=await db.query(`SELECT a.*,c.mode FROM ${table} a JOIN users u ON u.id=a.user_id JOIN enrollments e ON e.user_id=u.id JOIN classes c ON c.id=e.class_id WHERE u.consent_at IS NOT NULL AND a.created_at>=u.consent_at AND c.id=$1 AND a.created_at>=$2::date AND a.created_at<($3::date+interval '1 day') ORDER BY a.created_at`,[class_id,from,to]);
    const headers=kind==="pretest"?["participant","class_id","mode","instrument_version","features","knn_label","neighbors","model_version","method","created_at"]:["participant","class_id","mode","kc_id","exercise_id","reason","inputs","accepted","created_at"];
    const csv=toCSV(headers,rows.map(r=>[pseudonym(r.user_id,secret),class_id,r.mode,...(kind==="pretest"?[r.instrument_version,r.features,r.knn_label,r.neighbors.map((n:any)=>({...n,id:pseudonym("training:"+n.id,secret)})),r.model_version,r.method,r.created_at]:[r.kc_id,r.exercise_id,r.reason,r.inputs,r.accepted,r.created_at])]));
    return new Response(csv,{headers:{"Content-Type":"text/csv; charset=utf-8","Content-Disposition":`attachment; filename="${kind}-penelitian.csv"`,"Cache-Control":"no-store"}});
   }
   const {rows}=await db.query("SELECT a.*,c.mode,m.kc_id,m.p_before,m.p_after,m.predicted_correct,m.observed_correct,COALESCE(m.param_version,a.context->>'param_version') AS param_version FROM attempts a JOIN users u ON u.id=a.user_id JOIN enrollments e ON e.user_id=u.id JOIN classes c ON c.id=e.class_id LEFT JOIN mastery_log m ON m.attempt_id=a.id WHERE u.consent_at IS NOT NULL AND a.created_at>=u.consent_at AND c.id=$1 AND a.created_at>=$2::date AND a.created_at<($3::date+interval '1 day') ORDER BY a.created_at,a.id,m.kc_id",[class_id,from,to]);
   const headers=["participant","class_id","mode","exercise_id","curriculum_version","kc_id","passed","is_first","hints_used","duration_ms","p_before","p_after","predicted_correct","observed_correct","param_version","created_at"];
   const csv=toCSV(headers,rows.map(a=>[pseudonym(a.user_id,secret),class_id,a.mode,a.exercise_id,a.context?.curriculum_version??"legacy-srs-v1",a.kc_id,a.passed,a.is_first,a.hints_used,a.duration_ms,a.p_before,a.p_after,a.predicted_correct,a.observed_correct,a.param_version,a.created_at]));
   return new Response(csv,{headers:{"Content-Type":"text/csv; charset=utf-8","Content-Disposition":'attachment; filename="interaksi-penelitian.csv"',"Cache-Control":"no-store"}});
  }
  throw new HttpError(404,"Endpoint tidak ditemukan.");
 } catch (error) {
  if (error instanceof HttpError) return ok({error:error.message},error.status);
  if (error instanceof z.ZodError) return ok({error:error.issues.map(i=>`${i.path.join(".")}: ${i.message}`).join("; ")},400);
  const pg=error as {code?:string};
  if (pg.code==="23505") return ok({error:"Data sudah ada. Gunakan email, kode, atau versi yang berbeda."},409);
  if (pg.code==="23503") return ok({error:"Data masih digunakan atau referensi KC tidak ditemukan."},409);
  console.error("API error",error);
  return ok({error:process.env.NODE_ENV==="production"?"Permintaan gagal diproses.":error instanceof Error?error.message:"Terjadi kesalahan."},500);
 }
}
export {handle as GET,handle as POST,handle as PUT,handle as DELETE};
