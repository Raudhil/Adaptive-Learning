import type { Code, TestCase } from "../types";
import { instrument } from "./instrument";
import { analyzeSource } from "./source";
const scriptSafe=(s:string)=>s.replace(/<\/script/gi,"<\\/script");
export function sanitizeHTML(html:string) {
 const doc=new DOMParser().parseFromString(html,"text/html");
 doc.querySelectorAll("script,iframe,frame,object,embed,base,meta,link").forEach(e=>e.remove());
 doc.querySelectorAll("*").forEach(el=>Array.from(el.attributes).forEach(a=> {
  if (a.name.toLowerCase().startsWith("on")||a.name==="srcdoc"||/^(javascript|data:text\/html):/i.test(a.value.trim())) el.removeAttribute(a.name);
 }));
 return doc.body.innerHTML;
}
export function buildSandbox(code:Code,channel:string,tests:TestCase[]=[]) {
 const guard="__budget_"+channel.replaceAll("-","");
 const js=instrument(code.js,guard);
 const scripts=tests.map(t=>({id:t.id,timeout:t.timeout_ms,script:instrument(t.script,guard,true)}));
 const sourceFacts=tests.length?scriptSafe(JSON.stringify(analyzeSource(code))):"{}";
 const boot=`
 (()=>{
 const channel=${JSON.stringify(channel)};
 const send=(type,data)=>parent.postMessage({channel,type,...data},'*');
 let deadline=performance.now()+1200, steps=0, last=performance.now();
 Object.defineProperty(window,${JSON.stringify(guard)},{value:()=>{const now=performance.now();if(now-last>100){deadline=now+1200;steps=0;}last=now;if(++steps>150000 || now>deadline) throw new Error('Batas waktu eksekusi terlampaui');},writable:false,configurable:false});
 window.__resetBudget=(ms)=>{deadline=performance.now()+ms;steps=0;};
 for(const level of ['log','info','warn','error']) console[level]=(...args)=>send('console',{level,text:args.map(a=>{try{return typeof a==='string'?a:JSON.stringify(a)}catch{return String(a)}}).join(' ').slice(0,2000)});
 window.addEventListener('error',e=>{send('console',{level:'error',text:e.message});window.__runtimeError=true;});
 window.addEventListener('unhandledrejection',e=>{send('console',{level:'error',text:String(e.reason)});window.__runtimeError=true;});
 window.addEventListener('click',e=>{const a=e.target.closest?.('a');if(a)e.preventDefault();},true);
 window.addEventListener('submit',e=>e.preventDefault(),true);
 window.__sendSandbox=send;
 })();`;
 // Tests execute sequentially, capturing each Promise before the next test is introduced.
 const testRunner=tests.length?`<script>window.__testQueue=[];<\/script>${scripts.map(t=>`<script>
window.__testQueue.push(async()=>{
 const sourceFacts=${sourceFacts};
 window.__resetBudget(${t.timeout});window.__testResult=undefined;
 try{
${scriptSafe(t.script)}
  const value=await Promise.race([window.__testResult,new Promise((_,r)=>setTimeout(()=>r(new Error('Tes melewati batas waktu')),${t.timeout}))]);
  const passed=value===true&&!window.__runtimeError;
  window.__sendSandbox('test',{id:${JSON.stringify(t.id)},passed,error:passed?undefined:window.__runtimeError?'Ada error JavaScript. Periksa konsol.':'Kondisi tes belum terpenuhi'});
 }catch(e){window.__sendSandbox('test',{id:${JSON.stringify(t.id)},passed:false,error:String(e.message||e)});}
});
<\/script>`).join("")}<script>window.addEventListener('load',()=>{requestAnimationFrame(()=>requestAnimationFrame(async()=>{for(const run of window.__testQueue)await run();window.__sendSandbox('complete',{});}));},{once:true});<\/script>`:"";
 // Keep injected source on its own lines: a trailing // comment must not consume harness code.
 return `<!doctype html><html lang="id"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; connect-src 'none'; font-src 'none'; media-src 'none'; frame-src 'none'; worker-src 'none'; form-action 'none'; base-uri 'none'"><style>body{font:16px system-ui;padding:20px;color:#172a3a} ${code.css.replace(/<\/style/gi,"<\\/style")}</style><script>${scriptSafe(boot)}<\/script></head><body>${sanitizeHTML(code.html)}<script>
try{
${scriptSafe(js)}
}catch(e){window.__runtimeError=true;console.error(e.message||e)}
<\/script>${testRunner}<script>window.__sendSandbox('ready',{});<\/script></body></html>`;
}
/** Runs a pure JS test suite in a genuinely terminable Worker. DOM suites use the iframe harness. */
export function runWorker(code:Code,tests:TestCase[],timeout=2500,evaluator:"js"|"source"="js"):Promise<{id:string;passed:boolean;error?:string}[]> {
 return new Promise(resolve=> {
  const worker=new Worker("/sandbox-worker.js");
  const timer=setTimeout(()=>{worker.terminate();resolve(tests.map(t=>({id:t.id,passed:false,error:"Worker dihentikan: batas waktu eksekusi."})));},timeout);
  worker.onmessage=e=>{clearTimeout(timer);worker.terminate();resolve(e.data.results);};
  worker.onerror=()=>{clearTimeout(timer);worker.terminate();resolve(tests.map(t=>({id:t.id,passed:false,error:"Worker gagal menjalankan tes."})));};
  worker.postMessage({code:code.js,tests,sourceFacts:analyzeSource(code),evaluator});
 });
}
