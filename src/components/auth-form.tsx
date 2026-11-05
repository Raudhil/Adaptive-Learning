"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "./api";

export function AuthForm({register=false}:{register?:boolean}) {
 const router=useRouter();
 const [error,setError]=useState(""),[busy,setBusy]=useState(false);
 const [role,setRole]=useState<"student"|"lecturer">("student");

 return <div className="auth-layout">
  <section className="auth-story">
   <div className="brand"><span className="brand-mark">&lt;/&gt;</span>Live Code</div>
   <div>
    <p className="eyebrow">PEMROGRAMAN WEB ADAPTIF</p>
    <h1>Mulai dari yang<br/>kamu pahami.</h1>
    <p>Tulis kode, lihat hasilnya, dan pelajari konsep berikutnya sesuai perkembanganmu.</p>
    <div className="auth-code"><span>&lt;belajar&gt;</span><br/>&nbsp;&nbsp;HTML · CSS · JavaScript<br/>&nbsp;&nbsp;<em>Satu konsep, satu langkah.</em><br/><span>&lt;/belajar&gt;</span></div>
   </div>
   <small>Latihan langsung · Umpan balik · Jalur belajar personal</small>
  </section>
  <main id="main" className="auth-form-wrap">
   <form className="auth-form" onSubmit={async e=>{
    e.preventDefault();setError("");setBusy(true);
    const fd=new FormData(e.currentTarget);
    try{
     const result=await api(`auth/${register?"register":"login"}`,"POST",{
      email:fd.get("email"),password:fd.get("password"),
      ...(register?{name:fd.get("name"),role:fd.get("role"),consent:role==="student"&&fd.get("consent")==="on"}:{})
     });
     router.replace(result.next);router.refresh();
    }catch(err){setError((err as Error).message);}
    finally{setBusy(false);}
   }}>
    <p className="eyebrow">RUANG BELAJARMU</p>
    <h1>{register?"Buat akun":"Selamat datang kembali"}</h1>
    <p className="muted">{register?"Pilih peran dan daftar dengan email kampus.":"Masuk untuk melanjutkan perjalanan belajarmu."}</p>
    {register&&<>
     <label>Daftar sebagai
      <select name="role" value={role} onChange={e=>setRole(e.target.value==="lecturer"?"lecturer":"student")} disabled={busy} required>
       <option value="student">Mahasiswa</option>
       <option value="lecturer">Dosen</option>
      </select>
      <small>{role==="student"?"Bergabung ke kelas dan mulai belajar.":"Buat kelas, kelola materi, dan pantau mahasiswa."}</small>
     </label>
     <label>Nama lengkap<input name="name" required minLength={2} maxLength={120} autoComplete="name"/></label>
    </>}
    <label>Email kampus<input name="email" type="email" required autoComplete="email" maxLength={254}/></label>
    <label>Kata sandi<input name="password" type="password" required minLength={register?12:1} maxLength={72} autoComplete={register?"new-password":"current-password"}/>{register&&<small>Minimal 12 karakter.</small>}</label>
    {register&&role==="student"&&<div className="consent-box">
     <strong>Persetujuan penelitian (opsional)</strong>
     <p>Jika setuju, hasil pretest, kode, percobaan, waktu belajar, dan penguasaan konsep dapat dipakai untuk penelitian pembelajaran. Ekspor menggunakan pseudonim tanpa nama dan email. Keikutsertaan tidak memengaruhi akses belajar. Anda dapat menarik persetujuan di dasbor; ekspor berikutnya akan mengecualikan data Anda.</p>
     <label className="check"><input type="checkbox" name="consent"/>Saya memahami dan menyetujui penggunaan data untuk penelitian.</label>
    </div>}
    {error&&<p role="alert" className="error">{error}</p>}
    <button className="button primary full" disabled={busy}>{busy?"Memproses…":register?"Buat akun":"Masuk"} <span>→</span></button>
    <p className="center muted">{register?"Sudah punya akun? ":"Belum punya akun? "}<Link href={register?"/login":"/register"}>{register?"Masuk":"Daftar akun"}</Link></p>
   </form>
  </main>
 </div>;
}
