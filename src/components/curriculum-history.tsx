"use client";
import { useEffect,useState } from "react";
import Link from "next/link";
import { api } from "./api";
export function CurriculumHistory(){
 const [data,setData]=useState<any>(null),[error,setError]=useState("");
 useEffect(()=>{api("curriculum/history").then(setData).catch(e=>setError(e.message));},[]);
 return <><Link href="/dashboard">← Dasbor kurikulum aktif</Link><h1>Riwayat kurikulum lama</h1><p className="notice">Data lama tetap tersimpan. Probabilitas penguasaan dan label berikut tidak dipindahkan ke 25 KC baru. Kerjakan asesmen awal kurikulum baru dari dasbor.</p>{error&&<p role="alert">{error}</p>}{data?<><section className="card"><h2>Asesmen terdahulu</h2>{data.pretests.map((p:any)=><p key={p.instrument_version}>{p.instrument_version} · {p.knn_label} · {new Date(p.created_at).toLocaleString('id-ID')}</p>)}{!data.pretests.length&&<p>Belum ada asesmen terdahulu.</p>}</section><section className="card"><h2>Penguasaan terdahulu</h2><div className="table-scroll"><table><thead><tr><th>KC lama</th><th>Estimasi lama</th></tr></thead><tbody>{data.states.map((s:any)=><tr key={s.kc_id}><td>{s.code} · {s.name}</td><td>{Math.round(s.p_learned*100)}%</td></tr>)}</tbody></table></div></section><section className="card"><h2>Pengiriman terdahulu</h2>{data.attempts.map((a:any)=><details key={a.id}><summary>{a.title} · {a.passed?'Tes lulus':'Tes belum lulus'} · {new Date(a.created_at).toLocaleString('id-ID')}</summary>{(['html','css','js'] as const).map(lang=><div key={lang}><h3>{lang.toUpperCase()}</h3><pre>{a.code[lang]}</pre></div>)}</details>)}</section></>:<p>Memuat riwayat…</p>}</>;
}
