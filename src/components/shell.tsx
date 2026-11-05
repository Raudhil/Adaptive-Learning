"use client";
import Link from "next/link";
import { usePathname,useRouter } from "next/navigation";
import type { User } from "@/lib/types";
import { api } from "./api";
const labels={student:"Mahasiswa",lecturer:"Dosen",admin:"Admin",researcher:"Peneliti"};
export function Shell({user,children}:{user:User;children:React.ReactNode}) {
 const pathname=usePathname(),router=useRouter();
 const links=[{href:"/dashboard",label:"Ringkasan",icon:"◫"},
 ...(user.role==="student"?[{href:"/learn",label:"Materi & latihan",icon:"⌘"},{href:"/pretest",label:"Asesmen awal",icon:"✓"}]:[]),
 ...(["lecturer","admin"].includes(user.role)?[{href:"/classes",label:"Kelas & analitik",icon:"▦"},{href:"/pilot",label:"Data pilot & rubrik",icon:"◇"},{href:"/content",label:"Kelola konten",icon:"≡"}]:[]),
 ...(user.role==="admin"?[{href:"/settings",label:"Model & pengguna",icon:"⚙"}]:[]),
 ...(["researcher","admin"].includes(user.role)?[{href:"/research",label:"Ekspor penelitian",icon:"↗"}]:[])];
 return <div className="app-shell"><aside className="sidebar"><Link href="/dashboard" className="brand"><span className="brand-mark">&lt;/&gt;</span><span>Live Code<small>PEMBELAJARAN ADAPTIF</small></span></Link><div className="nav-caption">RUANG BELAJAR</div><nav aria-label="Menu utama">{links.map(l=><Link key={l.href} href={l.href} className={pathname===l.href||l.href!=="/dashboard"&&pathname.startsWith(l.href+"/")?"active":""}><span aria-hidden>{l.icon}</span>{l.label}</Link>)}</nav><div className="sidebar-foot"><div className="avatar">{user.name.slice(0,1).toUpperCase()}</div><div><strong>{user.name}</strong><small>{labels[user.role]}</small></div><button className="icon-button" aria-label="Keluar" onClick={async()=>{await api("auth/logout","POST");router.push("/login");router.refresh();}}>↪</button></div></aside><div className="main-column"><header className="topbar"><span>Pemrograman Web <span className="muted">/ {labels[user.role]}</span></span><span className="badge outline">Pilot lokal</span></header><main id="main" className="main-content">{children}</main><footer className="footer">Live Code Adaptif <span>Belajar bertahap. Pahami setiap konsep.</span></footer></div></div>;
}
