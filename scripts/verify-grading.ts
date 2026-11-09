/** Real Chromium DOM/Worker grading, isolated from application DB and user browser profiles. */
import { build } from "esbuild";
import { chromium } from "@playwright/test";
import { createServer } from "node:http";
import { mkdir,writeFile } from "node:fs/promises";
import { GET } from "../src/app/sandbox-worker.js/route";
import { curriculumExercises, curriculumSolutions } from "../src/lib/curriculum-exercises";
async function main(){
 const bundle=await build({entryPoints:["scripts/grading-browser-entry.ts"],bundle:true,write:false,format:"iife",globalName:"Grading",platform:"browser",banner:{js:"var process={env:{},emitWarning:()=>{}};"},define:{"process.env.NODE_ENV":'"production"'}});
 const worker=await GET().text();
 const server=createServer((req,res)=>{
  res.setHeader("Cache-Control","no-store");
  if(req.url==="/bundle.js"){res.setHeader("Content-Type","text/javascript");res.end(bundle.outputFiles[0].text);}
  else if(req.url==="/sandbox-worker.js"){res.setHeader("Content-Type","text/javascript");res.setHeader("Content-Security-Policy","default-src 'none'; script-src 'unsafe-eval'; connect-src 'none'");res.end(worker);}
  else {res.setHeader("Content-Type","text/html");res.end('<!doctype html><html><head><title>Isolated grading verification</title></head><body><script src="/bundle.js"></script></body></html>');}
 });
 await new Promise<void>(resolve=>server.listen(0,"127.0.0.1",resolve));
 const address=server.address() as {port:number};
 const browser=await chromium.launch({channel:"chrome",headless:true});
 try{
  const page=await browser.newPage();await page.addInitScript("window.__name=(value)=>value;");page.on("pageerror",e=>console.error("Browser setup:",e.message));await page.goto("http://127.0.0.1:"+address.port);
  const grade=async(id:string,code:unknown)=>page.evaluate(async({id,code})=>{
   const g=(window as any).Grading,ex=g.curriculumExercises.find((x:any)=>x.id===id);
   if(ex.evaluator!=="dom")return await g.runWorker(code,ex.tests,3000,ex.evaluator);
   return await new Promise<any[]>(resolve=>{
    const frame=document.createElement("iframe");frame.setAttribute("sandbox","allow-scripts");frame.style.width="800px";frame.style.height="600px";
    const channel=crypto.randomUUID(),results:any[]=[];
    const done=()=>{clearTimeout(timer);window.removeEventListener("message",onMessage);frame.remove();resolve(results);};
    const onMessage=(event:MessageEvent)=>{if(event.source!==frame.contentWindow||event.origin!=="null"||event.data?.channel!==channel)return;const d=event.data;if(d.type==="test")results.push(d);if(d.type==="complete")done();};
    const timer=setTimeout(done,5000);window.addEventListener("message",onMessage);
    frame.srcdoc=g.buildSandbox(code,channel,ex.tests);document.body.append(frame);
   });
  },{id,code});
  const failures:any[]=[],report:any[]=[];
  for(const ex of curriculumExercises.filter(e=>e.assessment_ready)){
   const good=await grade(ex.id,curriculumSolutions[ex.id]);
   const bad=await grade(ex.id,{...ex.starter_code,js:"",css:""});
   const correct=good.length===ex.tests.length&&good.every((r:any)=>r.passed);
   const rejected=bad.length===ex.tests.length&&bad.some((r:any)=>!r.passed);
   report.push({id:ex.id,tests:ex.tests.length,referencePassed:correct,emptyRejected:rejected});
   if(!correct||!rejected)failures.push({id:ex.id,correct,rejected,good,bad});
  }
  const mutants=[
   ["simpus-h01-1-v1",{html:"<h1>SIMPUS-Mini</h1>",css:"",js:""}],
   ["simpus-j01-1-v1",{html:"",css:"",js:"window.nilaiStok=()=>20000;"}],
   ["simpus-j02-1-v1",{html:"",css:"",js:"window.jumlahTersedia=()=>2;"}],
   ["simpus-j03-2-v1",{html:"",css:"",js:"let n=0;window.buatPenghitung=()=>()=>++n;"}],
   ["simpus-j10-1-v1",{html:"",css:"",js:"window.ambilBuku=async(f,u)=>(await f(u)).json();"}],
   ["simpus-j09-1-v1",{html:"<table><tbody></tbody></table>",css:"",js:"window.initDelegasi=(r,c)=>r.querySelectorAll('button').forEach(b=>b.onclick=()=>b.closest('tr').remove());"}],
  ] as const;
  const mutationResults=[];
  for(const [id,code] of mutants){const r=await grade(id,code);const rejected=r.some((x:any)=>!x.passed);mutationResults.push({id,rejected});if(!rejected)failures.push({id,mutation:"accepted"});}
  await mkdir("output/validation",{recursive:true});
  await writeFile("output/validation/kc25-grading.json",JSON.stringify({browser:await browser.version(),report,mutationResults,failures},null,2));
  console.log(JSON.stringify({graded:report.length,referencePassed:report.filter(r=>r.referencePassed).length,emptyRejected:report.filter(r=>r.emptyRejected).length,mutations:mutationResults,failures},null,2));
  if(failures.length)process.exitCode=1;
 }finally{await browser.close();await new Promise<void>(resolve=>server.close(()=>resolve()));}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
