"use client";
import { useEffect,useState } from "react";
import Link from "next/link";
import { api } from "./api";
import { levelNames,dataKindNames } from "@/lib/labels";

export function PilotTrainingPanel({text,onChange}:{text:string;onChange:(text:string)=>void}){
 const [kind,setKind]=useState("real"),[classId,setClassId]=useState(""),[courses,setCourses]=useState<any[]>([]),[error,setError]=useState(""),[message,setMessage]=useState(""),[busy,setBusy]=useState(false);
 useEffect(()=>{api<any[]>("classes").then(rows=>setCourses(rows.filter(row=>row.purpose==="pilot"))).catch(e=>setError(e.message));},[]);
 let config:any;try{config=JSON.parse(text);}catch{}
 const thresholds=config?.fallbackThresholds??{intermediate:0.4,advanced:0.75};
 function threshold(key:string,value:string){try{const current=JSON.parse(text);onChange(JSON.stringify({...current,fallbackThresholds:{...thresholds,[key]:Number(value)/100}},null,2));setError("");}catch{setError("Perbaiki JSON parameter sebelum mengubah ambang.");}}
 return <section className="card"><h2>Referensi pilot & aturan sementara</h2><p>Siapkan dataset berlabel melalui <Link href="/pilot">Data pilot & rubrik</Link>. Hanya label dengan rubrik disetujui, instrumen yang sesuai, dan persetujuan peserta yang masih aktif dapat dimuat.</p>
  <div className="form-grid"><label>Jenis referensi<select value={kind} onChange={e=>setKind(e.target.value)}><option value="real">Peserta nyata</option><option value="simulation">Simulasi / uji sistem</option></select></label><label>Kelas pilot<select value={classId} onChange={e=>setClassId(e.target.value)}><option value="">Semua kelas pilot sesuai jenis data</option>{courses.filter(course=>course.data_kind===kind).map(course=><option value={course.id} key={course.id}>{course.name}</option>)}</select></label></div>
  <button className="button secondary" disabled={busy} onClick={async()=>{setBusy(true);setError("");setMessage("");try{const current=JSON.parse(text);const params=new URLSearchParams({kind,...(classId?{class_id:classId}:{})});const result=await api(`pilot/dataset?${params}`);if(!result.training.length)throw new Error("Belum ada referensi yang memenuhi syarat. Periksa jenis kelas/data, pretest, persetujuan sejak sebelum pretest, dan label dengan rubrik disetujui.");onChange(JSON.stringify({...current,training:result.training,dataset:result.dataset},null,2));setMessage(`${result.training.length} peserta ${dataKindNames[kind]} dimuat ke draft. Jalankan validasi KNN, lalu simpan versi baru untuk aktivasi.`);}catch(err){setError((err as Error).message);}finally{setBusy(false);}}}>{busy?"Menyiapkan…":"Muat dataset ke draft parameter"}</button>
  <p className="small-text">Sumber draft: {config?.dataset?.source==="pilot"?"Pilot dengan catatan pelabelan":"Manual / belum diverifikasi"} · {dataKindNames[config?.dataset?.kind??"unverified"]} · {config?.training?.length??0} baris. Peserta nyata dan simulasi tidak digabung dalam satu versi.</p>
  <div className="table-scroll"><table><thead><tr><th>Label</th><th>Baris referensi dalam draft</th></tr></thead><tbody>{Object.entries(levelNames).map(([level,name])=><tr key={level}><th>{name}</th><td>{config?.training?.filter((row:any)=>row.label===level).length??0}</td></tr>)}</tbody></table></div>
  <h3>Ambang fallback skor pretest</h3><p className="muted">Dipakai ketika referensi belum cukup. Ini konfigurasi sementara, bukan bobot atau rubrik level final dari SRS. Nilai k, jumlah minimum referensi, dan pemetaan P(L0) tetap tersedia pada parameter JSON di bawah.</p><div className="form-grid"><label>Menengah mulai (%)<input type="number" min={0} max={100} step={0.1} value={thresholds.intermediate*100} onChange={e=>threshold("intermediate",e.target.value)}/></label><label>Mahir mulai (%)<input type="number" min={0} max={100} step={0.1} value={thresholds.advanced*100} onChange={e=>threshold("advanced",e.target.value)}/></label></div>
  {error&&<p role="alert" className="error">{error}</p>}{message&&<p role="status" className="success">{message}</p>}
 </section>;
}
