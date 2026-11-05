"use client";
import { useEffect,useState } from "react";
import Link from "next/link";
import { api } from "./api";
import { levelNames,purposeNames,dataKindNames,methodNames } from "@/lib/labels";
import type { studentDetail } from "@/lib/analytics";

type Detail=Awaited<ReturnType<typeof studentDetail>>;
const date=(value:string)=>new Date(value).toLocaleString("id-ID");
const percent=(value:number)=>`${Math.round(value*100)}%`;

export function StudentDetail({initial}:{initial:Detail}){
 const [data,setData]=useState(initial),[error,setError]=useState(""),[message,setMessage]=useState(""),[busy,setBusy]=useState(false),[rubrics,setRubrics]=useState<any[]>([]),[kc,setKc]=useState(initial.nodes[0]?.id??"");
 const base=`classes/${data.course.id}/students/${data.student.id}`;
 useEffect(()=>{if(data.course.purpose==="pilot")api<any[]>("pilot/rubrics").then(setRubrics).catch(e=>setError(e.message));},[data.course.purpose]);
 async function load(page=data.page){setError("");try{setData(await api<Detail>(`${base}?page=${page}`));}catch(e){setError((e as Error).message);}}
 const p=data.pretest,raw=p?.features?.raw??[],initialProbability=p?.audit?.initialProbability??p?.initial_by_level?.[p?.knn_label];
 const history=data.history.filter(h=>h.kc_id===kc).slice().reverse();
 const observations=data.states.find(s=>s.kc_id===kc)?.observations??0;
 const points=[...(initialProbability!==undefined?[initialProbability]:[]),...history.map(h=>h.p_after)];
 const coords=points.map((value,index)=>`${45+index*500/Math.max(1,points.length-1)},${165-value*140}`).join(" ");

 return <>
  <Link className="back-link" href="/classes">← Kelas & analitik</Link>
  <div className="page-heading"><div><p className="eyebrow">DETAIL MAHASISWA · {data.course.name}</p><h1>{data.student.name}</h1><p className="muted">{data.student.email} · {purposeNames[data.course.purpose]} · {dataKindNames[data.course.data_kind]}</p></div><button className="button secondary" onClick={()=>load()}>Muat ulang data</button></div>
  {error&&<p className="error" role="alert">{error}</p>}{message&&<p role="status" className="success">{message}</p>}
  <div className="stats-grid">
   <div className="stat-card"><small>PROFIL AWAL GLOBAL</small><strong className="stat-word">{p?levelNames[p.knn_label]:"Belum pretest"}</strong><p>{p?methodNames[p.method]??p.method:"Mahasiswa perlu menyelesaikan Asesmen awal"}</p></div>
   <div className="stat-card"><small>LATIHAN BERBEDA</small><strong>{data.totals.exercises}</strong><p>{data.totals.attempts} pengiriman · {data.totals.passed} pengiriman lulus</p></div>
   <div className="stat-card"><small>KONSEP DENGAN OBSERVASI</small><strong>{data.states.filter(s=>s.observations>0).length}<span> / {data.nodes.length}</span></strong><p>Konsep lainnya masih memakai perkiraan awal</p></div>
  </div>
  <section className="card"><h2>Pretest & dasar penentuan level</h2>{p?<>
   <p>Disimpan {date(p.created_at)} · model <strong>{p.model_version}</strong> · instrumen <strong>{p.instrument_version}</strong></p>
   <p className="muted">Label ini adalah titik awal, bukan nilai akhir atau label yang otomatis naik sesudah latihan. Penguasaan awal {initialProbability===undefined?"tidak tercatat":percent(initialProbability)} diterapkan ke seluruh konsep pada versi global.</p>
   <div className="table-scroll"><table><thead><tr><th>Modul</th><th>Skor awal</th><th>Waktu pretest</th></tr></thead><tbody>{["HTML","CSS","JavaScript","React"].map((module,i)=><tr key={module}><th>{module}</th><td>{percent((p.features.scores??raw)[i]??0)}</td><td>{Math.round(raw[i+4]??0)} detik</td></tr>)}</tbody></table></div>
   <p className="small-text">Pengalaman: {raw[8]??"—"}/5 · Nilai prasyarat: {p.features.prerequisiteMissing?"tidak diberikan; fitur netral 50":raw[9]??"—"}</p>
   {p.method==="score-fallback"?<p className="notice">Data referensi belum mencapai syarat model. Level ditentukan oleh rata-rata skor empat modul dengan aturan sementara{p.audit?.fallbackThresholds?`: menengah mulai ${percent(p.audit.fallbackThresholds.intermediate)}, mahir mulai ${percent(p.audit.fallbackThresholds.advanced)}`:" pada versi model tersebut"}. Angka ini bukan rubrik penelitian yang otomatis disahkan.</p>:<p className="notice">Level ditentukan dari tetangga referensi terdekat. Sumber referensi: {dataKindNames[p.audit?.dataset?.kind??"unverified"]}. {p.audit?.dataset?.rubricVersions?.length?`Versi rubrik: ${p.audit.dataset.rubricVersions.join(", ")}.`:""}</p>}
   <details><summary>Jawaban pretest & audit klasifikasi</summary>
    {p.audit?.questions?.length?<div className="table-scroll"><table><thead><tr><th>Soal</th><th>Jawaban mahasiswa</th><th>Hasil</th></tr></thead><tbody>{p.audit.questions.map((q:any)=><tr key={q.id}><td className="wrap-cell">{q.module}: {q.question}</td><td className="wrap-cell">{q.options[p.answers[q.id]]??"Tidak ada"}</td><td>{p.answers[q.id]===q.answer?"Benar":"Salah"}</td></tr>)}</tbody></table></div>:<p>Snapshot soal belum tersedia untuk catatan lama ini.</p>}
    <p>Referensi efektif saat klasifikasi: {p.audit?.effectiveTrainingIds?.length??"tidak tercatat"} · k: {p.audit?.k??"lihat versi model"} · minimum referensi: {p.audit?.minTraining??"lihat versi model"}</p>
    {p.neighbors?.length>0&&<div className="table-scroll"><table><thead><tr><th>Referensi</th><th>Label</th><th>Jarak</th></tr></thead><tbody>{p.neighbors.map((n:any)=><tr key={n.id}><td>{n.id}</td><td>{levelNames[n.label]}</td><td>{n.distance.toFixed(4)}</td></tr>)}</tbody></table></div>}
   </details>
  </>:<p className="muted">Belum ada pretest. Tidak ada level awal yang dapat ditampilkan.</p>}</section>
  <section className="card"><h2>Penguasaan & bukti latihan per konsep</h2><p className="muted">“Perkiraan awal” belum memiliki observasi latihan. Persentase merupakan estimasi model dan berbeda dari nilai ujian.</p><div className="table-scroll"><table><thead><tr><th>Konsep</th><th>Penguasaan</th><th>Kesiapan prasyarat</th><th>Bukti</th></tr></thead><tbody>{data.nodes.map(node=>{const state=data.states.find(s=>s.kc_id===node.id);return <tr key={node.id}><th>{node.code} · {node.name}</th><td>{state?percent(state.p_learned):"Belum pretest"}</td><td>{state?percent(state.readiness):"—"}</td><td>{state?state.observations?`${state.observations} observasi pertama`:"Perkiraan awal":"—"}</td></tr>;})}</tbody></table></div>
   <label className="course-select">Tren penguasaan<select value={kc} onChange={e=>setKc(e.target.value)}>{data.nodes.map(node=><option value={node.id} key={node.id}>{node.code} · {node.name}</option>)}</select></label>
   {history.length?<><svg className="mastery-chart" viewBox="0 0 580 200" role="img" aria-label={`Tren penguasaan ${kc} berdasarkan urutan observasi, bukan nilai ujian`}><title>Penguasaan {kc}</title>{[0,0.5,1].map(value=><g key={value}><line x1="45" y1={165-value*140} x2="545" y2={165-value*140} stroke="#dce4ea"/><text x="6" y={169-value*140}>{percent(value)}</text></g>)}<line x1="45" y1={165-data.masteryThreshold*140} x2="545" y2={165-data.masteryThreshold*140} stroke="#9b6b15" strokeDasharray="5 5"/><polyline points={coords} fill="none" stroke="#08796c" strokeWidth="3"/>{points.map((value,i)=><circle key={i} cx={45+i*500/Math.max(1,points.length-1)} cy={165-value*140} r="4" fill={i===0&&initialProbability!==undefined?"#8298ac":"#08796c"}/>)}<text x="45" y="190">Awal / observasi tertua</text><text x="410" y="190">Observasi terbaru</text></svg><p className="small-text">Garis putus-putus: ambang dikuasai {percent(data.masteryThreshold)}. Ditampilkan {history.length} dari {observations} observasi {kc} dalam 100 perubahan terakhir mahasiswa.</p></>:<p className="muted">Belum ada observasi untuk {kc}; belum ada tren yang dapat disimpulkan.</p>}
  </section>
  <section className="card"><h2>Riwayat pengerjaan & kode jawaban</h2><p className="muted">Klik satu pengiriman untuk membuka kode dan hasil tes. Kode ditampilkan sebagai teks, tanpa dijalankan.</p>
   {data.attempts.map(attempt=>{const snapshot=attempt.context?.exerciseSnapshot;const changes=data.history.filter(h=>h.attempt_id===attempt.id);return <details className="attempt-detail" key={attempt.id}><summary>{date(attempt.created_at)} · {snapshot?.title??attempt.title??attempt.exercise_id} · {attempt.passed?"Tes lulus":"Tes belum lulus"} · {attempt.is_first?"Percobaan pertama":"Pengulangan"}</summary>
    <p>Hint: {attempt.hints_used} · Durasi sejak draft dibuka: {Math.round(attempt.duration_ms/1000)} detik · Pilihan: {attempt.selection==="recommended"?"Rekomendasi":"Manual"} · Parameter: {attempt.context?.param_version??"tidak tercatat"}</p>
    <p>{attempt.is_first?attempt.context?.fullHint?"Hint penuh: observasi BKT salah meskipun tes lulus.":"Pengiriman pertama memperbarui BKT sesuai hasil tes.":"Pengulangan dicatat, tanpa pembaruan BKT lagi."}</p>
    {changes.map(change=><p key={change.id}>{change.kc_id}: {percent(change.p_before)} → <strong>{percent(change.p_after)}</strong> · {change.observed_correct?"observasi benar":"observasi salah"}</p>)}
    <ul>{attempt.tests_result.map((result:any)=><li key={result.id}>{result.passed?"Lulus":"Gagal"} · {snapshot?.tests?.find((t:any)=>t.id===result.id)?.description??result.id}{result.error?`: ${result.error}`:""}</li>)}</ul>
    {(["html","css","js"] as const).map(language=><div key={language}><h3>{language.toUpperCase()}</h3><pre className="submitted-code">{attempt.code[language]||"(kosong)"}</pre></div>)}
   </details>;})}
   {!data.attempts.length&&<p className="muted">Belum ada jawaban yang dikirim.</p>}
   <div className="inline-actions"><button className="button secondary" disabled={data.page===1} onClick={()=>load(data.page-1)}>← Lebih baru</button><span>Halaman {data.page}</span><button className="button secondary" disabled={!data.hasNext} onClick={()=>load(data.page+1)}>Lebih lama →</button></div>
  </section>
  <section className="card"><h2>Rekomendasi terakhir</h2>{data.recommendations.length?data.recommendations.map(rec=><div className="version-row" key={rec.id}><strong>{rec.reason}</strong><small>{date(rec.created_at)} · {rec.kc_id??"Tidak ada KC"} · model {rec.param_version} · {rec.accepted===null?"Belum tercatat diikuti":rec.accepted?"Diikuti":"Pilihan lain"}</small></div>):<p className="muted">Belum ada rekomendasi.</p>}</section>
  {data.course.purpose==="pilot"&&<section className="card"><h2>Label referensi pilot oleh dosen</h2><p>Label ahli ini terpisah dari prediksi sistem. Gunakan bukti pengerjaan dan rubrik yang sudah disepakati. Setiap penyimpanan menjadi catatan baru; label lama tetap dapat ditinjau.</p><p className="muted">Instrumen bawaan saat ini delapan soal pilihan ganda, bukan asesmen coding yang telah divalidasi. Isi alasan dan bukti penilaian yang mendukung label.</p>
   <form onSubmit={async e=>{e.preventDefault();const fd=new FormData(e.currentTarget);setError("");setBusy(true);try{await api(`${base}/label`,"POST",{rubric_version:fd.get("rubric_version"),label:fd.get("label"),rationale:fd.get("rationale")});await load();setMessage("Label ahli dan versi rubrik disimpan.");}catch(err){setError((err as Error).message);}finally{setBusy(false);}}}>
    <div className="form-grid"><label>Rubrik disetujui<select name="rubric_version" required><option value="">Pilih rubrik</option>{rubrics.filter(r=>r.status==="approved").map(r=><option key={r.version} value={r.version}>{r.title} · {r.version}</option>)}</select></label><label>Label ahli<select name="label" required>{Object.entries(levelNames).map(([key,value])=><option value={key} key={key}>{value}</option>)}</select></label></div>
    <label>Alasan dan bukti penilaian<textarea name="rationale" rows={4} minLength={20} maxLength={5000} required placeholder="Jelaskan tugas yang dikerjakan, hasilnya, dan kecocokan dengan kriteria rubrik."/></label>
    <p className="muted">Persetujuan penelitian harus aktif sejak sebelum pretest. Data {dataKindNames[data.course.data_kind]} tetap dipisahkan saat menyiapkan referensi.</p>
    <button className="button primary" disabled={busy||!p||!data.student.consent_at||!rubrics.some(r=>r.status==="approved")}>{busy?"Menyimpan…":"Simpan label ahli"}</button> <Link href="/pilot">Kelola rubrik</Link>
   </form>
   {data.labels.map(label=><div className="version-row" key={label.id}><strong>{levelNames[label.label]} · {label.rubric_title} ({label.rubric_version})</strong><small>{date(label.created_at)}</small><p className="prose">{label.rationale}</p></div>)}
  </section>}
 </>;
}
