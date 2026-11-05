"use client";
export default function ErrorPage({reset}:{error:Error;reset:()=>void}){return <main id="main" className="standalone card"><h1>Halaman belum dapat dimuat</h1><p>Pastikan basis data sudah disiapkan dengan npm run db:seed. Lihat terminal server untuk detail kesalahan.</p><button className="button primary" onClick={reset}>Coba lagi</button></main>;}
