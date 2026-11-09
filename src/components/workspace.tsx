"use client";
import { useCallback,useEffect,useRef,useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Code,Exercise,TestResult } from "@/lib/types";
import { Editor } from "./editor";
import { api } from "./api";
import { buildSandbox,runWorker } from "@/lib/sandbox/runner";
export function Workspace({userId,exercise}:{userId:string;exercise:Exercise}) {
 const search=useSearchParams(),[code,setCode]=useState<Code>(exercise.starter_code),[tab,setTab]=useState<keyof Code>("html"),[ready,setReady]=useState(false),[src,setSrc]=useState(""),[messages,setMessages]=useState<{level:string;text:string}[]>([]),[results,setResults]=useState<TestResult[]>([]),[error,setError]=useState(""),[status,setStatus]=useState("Memuat draft…"),[running,setRunning]=useState(false),[hints,setHints]=useState<string[]>([]),[hintCount,setHintCount]=useState(0),[outcome,setOutcome]=useState<any>(null);
 const frame=useRef<HTMLIFrameElement>(null),channel=useRef(""),codeRef=useRef(code),runRef=useRef<((r:TestResult[])=>void)|null>(null),resultRef=useRef<TestResult[]>([]),changed=useRef(false);
 codeRef.current=code;
 const storageKey=`draft:${userId}:${exercise.id}`;
 useEffect(()=> {
  let alive=true;
  api(`drafts?exercise_id=${encodeURIComponent(exercise.id)}`).then(d=>{if(!alive)return;let restored=d.code;try{const local=JSON.parse(localStorage.getItem(storageKey)||"null");if(local&&new Date(local.updated_at)>new Date(d.updated_at))restored=local.code;}catch{}setCode(restored);setHintCount(d.hints_used);setReady(true);setStatus("Draft dipulihkan");}).catch(e=>setError(e.message));
  return()=>{alive=false;};
 },[exercise.id,storageKey]);
 useEffect(()=>{if(!ready)return;const timer=setTimeout(()=>{try{localStorage.setItem(storageKey,JSON.stringify({code,updated_at:new Date().toISOString()}));}catch{}setStatus("Menyimpan…");api("drafts","PUT",{exercise_id:exercise.id,code}).then(()=>setStatus("Tersimpan otomatis")).catch(()=>setStatus("Tersimpan di perangkat · server belum tersinkron"));},700);return()=>clearTimeout(timer);},[code,ready,exercise.id,storageKey]);
 const preview=useCallback((tests=false)=> {
  setError("");setMessages([]);channel.current=crypto.randomUUID();
  try{setSrc(buildSandbox(codeRef.current,channel.current,tests?exercise.tests:[]));}catch(e){setError(`Kode belum dapat dijalankan: ${(e as Error).message}`);throw e;}
 },[exercise.tests]);
 useEffect(()=> {if(!ready||running)return;const timer=setTimeout(()=>{try{preview();}catch{}},400);return()=>clearTimeout(timer);},[code,ready,running,preview]);
 useEffect(()=> {
  const listener=(event:MessageEvent)=> {
   if(event.source!==frame.current?.contentWindow||event.origin!=="null"||event.data?.channel!==channel.current)return;
   const data=event.data;
   if(data.type==="console")setMessages(m=>[...m.slice(-99),{level:String(data.level),text:String(data.text).slice(0,2000)}]);
   if(data.type==="test"&&exercise.tests.some(t=>t.id===data.id)) {resultRef.current=[...resultRef.current.filter(t=>t.id!==data.id),{id:data.id,passed:data.passed===true,error:data.error}];setResults(resultRef.current);}
   if(data.type==="complete"&&runRef.current){runRef.current(resultRef.current);runRef.current=null;}
  };
  window.addEventListener("message",listener);return()=>window.removeEventListener("message",listener);
 },[exercise.tests]);
 async function submit() {
  if(exercise.assessment_ready===false){setError(exercise.assessment_note||"Penilaian otomatis belum tersedia; BKT tidak diubah.");return;}
  setRunning(true);setError("");setOutcome(null);setResults([]);resultRef.current=[];
  try{
   await api("drafts","PUT",{exercise_id:exercise.id,code:codeRef.current});
   let tests:TestResult[];
   const pureJS=exercise.tests.every(t=>!(/\bdocument\b|\bgetComputedStyle\b/.test(t.script)))&&!(/\bdocument\b/.test(codeRef.current.js));
   if(exercise.evaluator==="source"||exercise.evaluator==="js"||(!exercise.evaluator&&pureJS)){tests=await runWorker(codeRef.current,exercise.tests,2500,exercise.evaluator==="source"?"source":"js");setResults(tests);}
   else tests=await new Promise<TestResult[]>((resolve,reject)=>{const timer=setTimeout(()=>{runRef.current=null;setSrc("");resolve(exercise.tests.map(t=>resultRef.current.find(r=>r.id===t.id)??{id:t.id,passed:false,error:"Batas waktu pengujian terlampaui."}));},Math.min(20000,exercise.tests.reduce((s,t)=>s+t.timeout_ms,0)+2000));runRef.current=r=>{clearTimeout(timer);resolve(r);};try{preview(true);}catch(e){clearTimeout(timer);runRef.current=null;reject(e);}});
   if(tests.length!==exercise.tests.length)throw new Error("Hasil tes tidak lengkap.");
   const result=await api("attempts","POST",{exercise_id:exercise.id,code:codeRef.current,tests_result:tests,selection:search.get("rec")?"recommended":"manual",recommendation_id:search.get("rec")??undefined});
   setOutcome(result);
  }catch(e){setError((e as Error).message);}finally{setRunning(false);}
 }
 return <><Link href={`/learn/${exercise.kcs[0].id}`} className="back-link">← Materi {exercise.kcs.map(k=>k.id).join(", ")}</Link><div className="page-heading compact"><div><p className="eyebrow">WORKSPACE LATIHAN</p><h1>{exercise.title}</h1></div><span className="badge outline">{status}</span></div><div className="instruction card"><p className="prose">{exercise.instructions}</p>{exercise.assessment_ready===false&&<p className="notice">{exercise.assessment_note} Draft tetap dapat disimpan dan dipratinjau.</p>}<div className="inline-actions"><span className="muted">{exercise.tests.length} test case · Kesulitan {Math.round(exercise.difficulty*100)}%</span><button className="button small secondary" disabled={!ready||running} onClick={async()=>{try{const r=await api("hints","POST",{exercise_id:exercise.id});setHints(r.hints);setHintCount(r.hints_used);}catch(e){setError((e as Error).message);}}}>Buka hint ({hintCount}/{exercise.hints.length})</button></div>{hints.map((h,i)=><p className="hint" key={i}><strong>Petunjuk {i+1}:</strong> {h}</p>)}{exercise.assessment_ready!==false&&hintCount===exercise.hints.length&&hintCount>0&&<small className="muted">Hint penuh digunakan: observasi pertama dihitung salah untuk BKT, walaupun seluruh tes lulus.</small>}</div><div className="workspace-grid"><section className="editor-panel"><div className="panel-toolbar"><div role="tablist" aria-label="Bahasa editor">{(["html","css","js"] as const).map(t=><button key={t} role="tab" aria-selected={tab===t} onClick={()=>setTab(t)} disabled={running} className={tab===t?"selected":""}>{t.toUpperCase()}</button>)}</div><span className="muted">CodeMirror 6</span></div>{ready?<Editor value={code[tab]} language={tab} readOnly={running} onChange={v=>{if(!running){changed.current=true;setCode(c=>({...c,[tab]:v}));}}}/>:<p className="loading">Memuat kode…</p>}</section><section className="preview-panel"><div className="panel-toolbar"><strong>Pratinjau langsung</strong><button className="text-button" disabled={!ready||running} onClick={()=>{try{preview();}catch{}}}>↻ Muat ulang</button></div><iframe ref={frame} title="Pratinjau kode mahasiswa" sandbox="allow-scripts" referrerPolicy="no-referrer" srcDoc={src}/></section></div><div className="workspace-grid results-grid"><section className="card console"><h3>Konsol <small>{messages.length} pesan</small></h3><div role="log" aria-label="Konsol kode">{messages.length?messages.map((m,i)=><pre key={i} className={m.level==="error"?"error-text":""}><span>{m.level}</span> {m.text}</pre>):<p className="muted">Output console.log dan error akan muncul di sini.</p>}</div></section><section className="card"><div className="section-heading compact"><h3>Hasil pengujian</h3><button className="button primary" onClick={submit} disabled={!ready||running||exercise.assessment_ready===false}>{running?"Menguji…":"Jalankan tes & kirim →"}</button></div>{exercise.tests.map(t=>{const r=results.find(r=>r.id===t.id);return <div className="test-row" key={t.id}><span className={r?r.passed?"success-text":"error-text":"muted"}>{r?r.passed?"✓":"✕":"○"}</span><div><strong>{t.description}</strong>{r?.error&&<small>{r.error}</small>}</div></div>;})}</section></div>{error&&<p className="error" role="alert">{error}</p>}{outcome&&<section className={`card result-banner ${outcome.passed?"passed":""}`} role="status"><h2>{outcome.passed?"Seluruh tes lulus":"Masih ada yang perlu diperbaiki"}</h2><p>{outcome.is_first?"Percobaan pertama dicatat dan model penguasaan diperbarui.":"Percobaan tambahan dicatat. Penguasaan BKT tetap memakai observasi pertama latihan ini."}</p>{outcome.mastery.map((m:any)=><p key={m.kc}>{m.kc}: {Math.round(m.p_before*100)}% → <strong>{Math.round(m.p_after*100)}%</strong></p>)}<p>{outcome.next.reason}</p>{outcome.next.exercise_id&&<Link className="button primary" href={`/exercise/${outcome.next.exercise_id}?rec=${outcome.next.id}`}>Latihan berikutnya →</Link>} <Link className="button secondary" href="/dashboard">Lihat progres</Link></section>}</>;
}
