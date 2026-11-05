/** Black-box HTTP checks against an isolated disposable database and built app. */
import { spawn,spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import path from "node:path";
import assert from "node:assert/strict";
import { hash } from "bcryptjs";
import { db,closeDB } from "../src/lib/db";
import { pretestQuestions,defaultConfig } from "../src/lib/seed-data";
const origin="http://localhost:3107";
const password=randomBytes(20).toString("hex");
process.env.LOCAL_DB_PATH=path.join(process.cwd(),".tmp","smoke-"+Date.now(),"postgres");
process.env.DATABASE_URL="";
process.env.CAMPUS_EMAIL_DOMAINS="smoke.test";
process.env.ALLOW_LOCAL_DB="true";
process.env.APP_URL=origin;
process.env.RESEARCH_SECRET=randomBytes(32).toString("hex");
const cookies:Record<string,string>={};
let server:ReturnType<typeof spawn>|undefined;
async function call(role:string,endpoint:string,method="GET",input?:unknown,expected=200){
 const response=await fetch(origin+"/api/"+endpoint,{method,headers:{"Content-Type":"application/json",Origin:origin,"X-CSRF-Protection":"1",Cookie:cookies[role]??""},body:input===undefined?undefined:JSON.stringify(input)});
 const cookie=response.headers.get("set-cookie");if(cookie)cookies[role]=cookie.split(";")[0];
 const payload=await response.text();assert.equal(response.status,expected,`${method} ${endpoint}: ${payload.slice(0,300)}`);
 return response.headers.get("content-type")?.includes("application/json")?JSON.parse(payload):payload;
}
async function main(){
 const seed=spawnSync(process.execPath,["--import","tsx","scripts/seed.ts"],{env:process.env,encoding:"utf8"});if(seed.status!==0)throw new Error(seed.stderr||seed.stdout);
 const passwordHash=await hash(password,4);
 for(const role of ["lecturer","admin","researcher"])await db.query("INSERT INTO users(id,email,name,role,password_hash) VALUES($1,$2,$3,$4,$5)",[role,`${role}@smoke.test`,role,role,passwordHash]);
 await closeDB();
 server=spawn(process.execPath,["node_modules/next/dist/bin/next","start","-p","3107"],{env:process.env,stdio:["ignore","pipe","pipe"]});
 let output="";server.stdout?.on("data",d=>output+=d.toString());server.stderr?.on("data",d=>output+=d.toString());
 let available=false;
 for(let i=0;i<80;i++){if(server.exitCode!==null)break;try{if(output.includes("Ready")&&(await fetch(origin+"/login")).ok){available=true;break;}}catch{}await new Promise(r=>setTimeout(r,250));}
 if(!available)throw new Error("Server uji tidak tersedia: "+output);
 await call("anonymous","mastery","GET",undefined,401);
 const rejected=await fetch(origin+"/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:"admin@smoke.test",password})});assert.equal(rejected.status,403);
 const registrationPage=await (await fetch(origin+"/register")).text();
 assert.match(registrationPage,/<select[^>]*name="role"/);
 assert.match(registrationPage,/<option value="student"[^>]*>Mahasiswa<\/option>/);
 assert.match(registrationPage,/<option value="lecturer"[^>]*>Dosen<\/option>/);
 const homePaths={student:"/dashboard",lecturer:"/classes",admin:"/settings",researcher:"/research"};
 for(const role of ["lecturer","admin","researcher"] as const){
  const login=await call(role,"auth/login","POST",{email:`${role}@smoke.test`,password,role:"student"});
  assert.equal(login.next,homePaths[role]);
 }
 for(const role of ["admin","researcher","invalid"]){
  await call("anonymous","auth/register","POST",{email:`invalid-${role}@smoke.test`,name:"Role Ditolak",password,consent:false,role},400);
 }
 const lecturer=await call("newLecturer","auth/register","POST",{email:"new-lecturer@smoke.test",name:"Dosen Baru",password,role:"lecturer",consent:true},201);
 assert.equal(lecturer.next,"/classes");
 const lecturerAccount=(await call("newLecturer","me")).user;
 assert.equal(lecturerAccount.role,"lecturer");assert.equal(lecturerAccount.consent_at,null);
 await call("newLecturer","classes","POST",{name:"Kelas Dosen Baru",mode:"adaptive"},201);
 await call("newLecturer","mastery","GET",undefined,403);
 await call("newLecturer","auth/logout","POST");
 assert.equal((await call("newLecturer","auth/login","POST",{email:"new-lecturer@smoke.test",password,role:"admin"})).next,"/classes");
 await call("anonymous","auth/register","POST",{email:"new-lecturer@smoke.test",name:"Duplikat",password,role:"student",consent:false},409);
 const student=await call("student","auth/register","POST",{email:"student@smoke.test",name:"Mahasiswa Uji",password,role:"student",consent:true},201);
 assert.equal(student.next,"/dashboard");
 const studentAccount=(await call("student","me")).user;
 assert.equal(studentAccount.role,"student");assert.ok(studentAccount.consent_at);
 await call("student","auth/logout","POST");
 assert.equal((await call("student","auth/login","POST",{email:"student@smoke.test",password,role:"lecturer"})).next,"/dashboard");
 await call("legacyStudent","auth/register","POST",{email:"legacy-student@smoke.test",name:"Mahasiswa Lama",password,consent:false},201);
 assert.equal((await call("legacyStudent","me")).user.role,"student");
 for(const [role,home] of Object.entries(homePaths)){
  for(const page of ["/","/login","/register"]){
   const response=await fetch(origin+page,{headers:{Cookie:cookies[role]},redirect:"manual"});
   assert.equal(response.status,307,`${role} ${page} redirect`);assert.equal(response.headers.get("location"),home);
  }
 }
 for(const [role,page,home] of [["student","/classes","/dashboard"],["lecturer","/settings","/classes"],["researcher","/classes","/research"]]){
  const response=await fetch(origin+page,{headers:{Cookie:cookies[role]},redirect:"manual"});
  assert.equal(response.status,307);assert.equal(response.headers.get("location"),home);
 }
 await call("student","users","GET",undefined,403);
 await call("student","model-params","GET",undefined,403);
 const course=await call("lecturer","classes","POST",{name:"Kelas Uji Adaptif",mode:"adaptive"},201);
 await call("student","classes/join","POST",{code:course.join_code});
 await call("student","pretest","POST",{answers:Object.fromEntries(pretestQuestions.map(q=>[q.id,q.answer])),times:[10,10,10,10],experience:3,prerequisite:null});
 await call("student","pretest","POST",{answers:Object.fromEntries(pretestQuestions.map(q=>[q.id,q.answer])),times:[10,10,10,10],experience:3,prerequisite:null},409);
 const mastery=await call("student","mastery");assert.equal(mastery.states.length,20);
 const ex=(await call("student","exercises"))[0];
 const draft=await call("student",`drafts?exercise_id=${ex.id}`);assert.ok(draft.code);
 await call("student","drafts","PUT",{exercise_id:ex.id,code:ex.starter_code});
 await call("student","hints","POST",{exercise_id:ex.id});
 const attempt=await call("student","attempts","POST",{exercise_id:ex.id,code:ex.starter_code,tests_result:ex.tests.map((t:any)=>({id:t.id,passed:true})),selection:"manual"});assert.equal(attempt.is_first,true);
 const again=await call("student","attempts","POST",{exercise_id:ex.id,code:ex.starter_code,tests_result:ex.tests.map((t:any)=>({id:t.id,passed:false})),selection:"manual"});assert.equal(again.is_first,false);assert.deepEqual(again.mastery,[]);
 const analytics=await call("lecturer",`classes/${course.id}/analytics`);assert.equal(analytics.students.length,1);assert.equal(analytics.students[0].attempts,2);
 await call("student",`classes/${course.id}/analytics`,"GET",undefined,403);
 await call("researcher","model-params","GET",undefined,403);
 await call("lecturer","kc","PUT",{id:"SMOKE",code:"SMOKE",name:"Konsep uji",module:"HTML",position:99,prerequisites:[{id:"H1",weight:.9}]});
  await call("lecturer","kc","PUT",{id:"H1",code:"H1",name:"Struktur dokumen HTML",module:"HTML",position:0,prerequisites:[{id:"SMOKE",weight:.9}]},400);
 // Verify a rejected cycle is rolled back, preserving the original graph.
 const nodes=await call("lecturer","kc");assert.deepEqual(nodes.find((k:any)=>k.id==="H1").prerequisites,[]);
 await call("lecturer","materials","PUT",{id:"smoke-material",kc_id:"SMOKE",type:"text",title:"Materi uji",content:"Contoh materi pengujian.",url:null});
 assert.ok((await call("student","materials")).some((m:any)=>m.id==="smoke-material"));
 await call("lecturer","materials","DELETE",{id:"smoke-material"});
 await call("lecturer","exercises","PUT",{id:"smoke-exercise",title:"Latihan uji",instructions:"Buat satu paragraf HTML.",starter_code:{html:"",css:"",js:""},difficulty:.5,hints:[],kcs:[{id:"SMOKE",weight:1}],tests:[{id:"smoke-test",description:"Paragraf tersedia",script:"!!document.querySelector('p')",timeout_ms:1000}]});
 assert.ok((await call("student","exercises")).some((e:any)=>e.id==="smoke-exercise"));
 await call("lecturer","exercises","DELETE",{id:"smoke-exercise"});
 await call("lecturer","kc","DELETE",{id:"SMOKE"});
 await call("admin","model-params","PUT",{version:"smoke-v2",values:{...defaultConfig,masteryThreshold:.9}});
 assert.equal((await call("admin","model-params")).active.version,"smoke-v2");
 const today=new Date().toISOString().slice(0,10),query=`export?class_id=${course.id}&from=${today}&to=${today}`;
 const csv=await call("researcher",query);assert.ok(csv.includes("participant"));assert.ok(!csv.includes("student@smoke.test"));assert.ok(!csv.includes("Mahasiswa Uji"));assert.ok(csv.split("\r\n").length>1);
 for(const kind of ["pretest","recommendations"]){const exportCsv=await call("researcher",query+"&kind="+kind);assert.ok(exportCsv.split("\r\n").length>1);assert.ok(!exportCsv.includes("student@smoke.test"));}
 await call("student","consent","PUT",{consent:false});assert.equal((await call("researcher",query)).split("\r\n").length,1);
 for(const [role,pages] of Object.entries({student:["/dashboard","/learn","/learn/H1","/exercise/ex-h1-1","/pretest"],lecturer:["/classes","/content"],admin:["/settings"],researcher:["/research"]}))for(const p of pages){const r=await fetch(origin+p,{headers:{Cookie:cookies[role]},redirect:"manual"});assert.equal(r.status,200,`${role} ${p}`);const html=await r.text();assert.ok(!html.includes('"digest":"'),`SSR error ${p}`);}
 const worker=await fetch(origin+"/sandbox-worker.js");assert.ok(worker.headers.get("content-security-policy")?.includes("connect-src 'none'"));
 await call("student","auth/logout","POST");await call("student","mastery","GET",undefined,401);
 console.log("HTTP smoke passed: student/lecturer registration, persisted-role login redirects, role validation, authentication/CSRF/RBAC, class, pretest, drafts, hints, attempts, BKT, analytics, DAG rollback, model version, consent-filtered export, SSR pages, worker CSP.");
}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{server?.kill();await closeDB();});
