import Link from "next/link";
import { notFound } from "next/navigation";
import { pageUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getKCs,getExercises } from "@/lib/content";
export default async function Page({params}:{params:Promise<{kcId:string}>}){
 await pageUser(["student"]);const {kcId}=await params,nodes=await getKCs(),node=nodes.find(k=>k.id===kcId);if(!node)notFound();
 const materials=(await db.query("SELECT * FROM materials WHERE kc_id=$1 ORDER BY title",[kcId])).rows,exercises=(await getExercises()).filter(e=>e.kcs.some(k=>k.id===kcId));
 return <><Link href="/learn" className="back-link">← Semua materi</Link><div className="page-heading"><div><p className="eyebrow">{node.module} / {node.code}</p><h1>{node.name}</h1><p className="muted">{node.prerequisites.length?`Prasyarat: ${node.prerequisites.map(p=>p.id).join(", ")}`:"Fondasi awal tanpa prasyarat."}</p></div></div><div className="detail-grid"><section>{materials.map(m=><article className="card material" key={m.id}><h2>{m.title}</h2>{m.type==="code"?<pre>{m.content}</pre>:<p className="prose">{m.content}</p>}{m.url&&<a href={m.url} target="_blank" rel="noopener noreferrer" className="button secondary">{m.type==="video"?"Tonton video":"Buka referensi"} ↗</a>}</article>)}{!materials.length&&<div className="empty card">Materi belum ditambahkan dosen.</div>}</section><aside className="card"><p className="eyebrow">UJI PEMAHAMAN</p><h2>Latihan konsep</h2>{exercises.map(e=><Link href={`/exercise/${e.id}`} className="exercise-link" key={e.id}><div><strong>{e.title}</strong><small>{e.tests.length} tes · Kesulitan {Math.round(e.difficulty*100)}%</small></div><span>→</span></Link>)}{!exercises.length&&<p className="muted">Latihan interaktif belum tersedia untuk konsep ini. Modul React/Next.js saat ini berupa materi.</p>}</aside></div></>;
}
