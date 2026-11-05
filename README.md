# Live Code Pemrograman Web Adaptif

Implementasi lokal SRS draf 0.1 (22 Oktober 2026). Next.js App Router + TypeScript, CodeMirror 6, PostgreSQL, KNN, BKT, dan Bayesian Network. Antarmuka Bahasa Indonesia; empat peran: mahasiswa, dosen, admin, peneliti.

## Panduan penggunaan

Baca [Panduan Penggunaan untuk Dosen dan Mahasiswa](docs/PANDUAN-PENGGUNAAN.md) untuk urutan klik, letak pretest, cara menentukan level awal, membaca progres, serta mencocokkan fitur dengan SRS. Versi cetak tersedia di [PDF panduan](output/pdf/panduan-penggunaan-live-code.pdf) setelah dibuat di workspace ini; folder `output/` tidak dilacak Git.

**Alur saat ini:** dosen membuat kelas → mahasiswa bergabung → **Asesmen awal (pretest)** → profil awal → materi/latihan → **Jalankan tes & kirim** → penguasaan diperbarui → dosen melihat heatmap. **Posttest, input nilai manual dosen, dan rekap nilai akhir belum tersedia.** Label pemula/menengah/mahir tersimpan tetapi belum tampil di dasbor; persentase penguasaan bukan nilai ujian.

## Menjalankan di Windows / PowerShell

Node.js 20.9+ diperlukan; lingkungan pengembangan ini memakai Node 24. Gunakan `npm.cmd` bila PowerShell memblokir `npm.ps1`.

```powershell
npm.cmd install
Copy-Item .env.example .env.local
npm.cmd run db:seed
npm.cmd run dev
```

Buka **http://localhost:3000**. Basis data awal sudah disiapkan di folder ini, sehingga `db:seed` dapat dijalankan kembali tanpa menimpa konten yang diedit.

Tanpa `DATABASE_URL`, aplikasi memakai **PGlite**, PostgreSQL tertanam dengan data persisten di `.data/postgres`. Ini untuk **satu proses lokal**. Hentikan server sebelum menjalankan seed atau skrip akun pada basis data yang sama. Untuk deployment dan beberapa proses, isi `DATABASE_URL` dengan PostgreSQL terpisah. Skema yang sama dipakai keduanya melalui query berparameter; ORM Prisma pada SRS adalah usulan dan tidak ditambahkan sebagai lapisan kedua yang tidak digunakan.

Tidak ada akun atau password bawaan. Di halaman **Daftar akun**, pilih **Mahasiswa** atau **Dosen** pada dropdown **Daftar sebagai**. Role disimpan di tabel `users`; login menggunakan email dan kata sandi yang sama tanpa memilih role lagi. Mahasiswa diarahkan ke `/dashboard`, dosen ke `/classes`, admin ke `/settings`, dan peneliti ke `/research`. Persetujuan penelitian saat pendaftaran hanya ditampilkan untuk mahasiswa.

Akun **admin** dan **peneliti** dibuat lewat terminal, sebelum menyalakan server. Skrip ini juga tetap dapat digunakan untuk membuat akun dosen:

```powershell
# Masukkan password tanpa mencatatnya sebagai argumen command line.
$accountSecure = Read-Host 'Password baru (minimal 12 karakter)' -AsSecureString
$env:ACCOUNT_PASSWORD = [System.Net.NetworkCredential]::new('', $accountSecure).Password
npm.cmd run account:create -- dosen@kampus.ac.id "Dosen Pengampu" lecturer
# Ganti email, nama, dan peran untuk akun admin / researcher.
Remove-Item Env:ACCOUNT_PASSWORD
```

Alur awal: dosen membuat kelas → membagikan kode → mahasiswa mendaftar dan bergabung → pretest → dasbor rekomendasi → materi / editor → tes & submit → penguasaan diperbarui. Peneliti hanya dapat mengekspor peserta dengan consent aktif. Set `RESEARCH_SECRET` acak minimal 32 karakter di `.env.local` untuk mengaktifkan ekspor; simpan kunci yang sama untuk mempertahankan pseudonim antarekspor.

## Yang tersedia

- Login email/password bcrypt, cookie httpOnly, CSRF Origin + header, pembatasan percobaan login, dan otorisasi API per peran.
- Kelas adaptif atau kontrol; satu mahasiswa satu kelas eksperimen agar kelompok tidak tercampur.
- Pretest empat modul + profil pengalaman, normalisasi 10 fitur, weighted KNN atau fallback skor, audit tetangga, dan CV k ganjil melalui admin.
- Editor HTML/CSS/JS, autocomplete, pratinjau debounce 400 ms, konsol, draft server dan pemulihan lokal, hint bertingkat, tes DOM/JS.
- 20 KC sesuai SRS, materi awal, 51 latihan pilot pada 17 KC HTML/CSS/JS. Tiga latihan per KC adalah latihan penguatan, **bukan tiga instrumen penelitian yang telah divalidasi**. React/Next.js berisi materi; editor JSX (FR-14, prioritas C) belum dibuat.
- BKT hanya observasi pertama tiap latihan; hint penuh menghasilkan observasi salah. Riwayat menyimpan versi parameter. Bobot Q-matrix memakai fractional likelihood; perlu disepakati dalam metodologi.
- BN noisy-AND dengan **inferensi eksak variable elimination** dan soft evidence BKT; readiness memakai probabilitas gabungan semua prasyarat. Graf menolak siklus.
- Rekomendasi deterministik, diagnosis remedial, mode kontrol urutan tetap, serta log input, snapshot graf/latihan, dan versi model.
- Heatmap kelas dan penanda risiko; CRUD konsep/prasyarat, materi, latihan/test case; konfigurasi model berversi dan manajemen peran.
- Ekspor CSV percobaan, pretest/audit KNN, dan keputusan rekomendasi tanpa kolom nama/email, menggunakan HMAC pseudonim, tanggal UTC inklusif, serta filter consent. Kode mentah tidak diekspor karena dapat mengandung identitas dalam komentar.

## Pemeriksaan

```powershell
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
npm.cmd run test:smoke
```

`test:smoke` membutuhkan hasil build dan memakai basis data terpisah di `.tmp`, port 3107, serta akun sintetis. Ia menguji autentikasi/CSRF/hak akses, kelas, pretest, draft, hint, attempt, BKT, analitik, rollback graf siklik, versi model, ekspor consent, serta respons SSR. Tidak ada akun uji pada basis data utama.

Build lokal produksi:

```powershell
$env:ALLOW_LOCAL_DB = 'true' # hanya untuk mencoba build produksi dengan PGlite lokal
npm.cmd run start
```

Untuk produksi sungguhan, gunakan PostgreSQL, `APP_URL=https://...`, `CAMPUS_EMAIL_DOMAINS`, `RESEARCH_SECRET`, HTTPS, dan backup. Jangan set `ALLOW_LOCAL_DB=true` di deployment kampus.

## Batas verifikasi dan keamanan

Iframe memakai `sandbox="allow-scripts"` tanpa same-origin, CSP menolak jaringan/subframe/form, HTML dibersihkan dari script dan event inline, dan channel pesan diperiksa berdasarkan source, origin, serta token per render. Kode mahasiswa tidak pernah dijalankan server.

**NFR-07 baru terpenuhi sebagian:** tes JavaScript murni berjalan pada Worker yang dapat di-terminate. Tes DOM/CSS berjalan pada iframe native, dengan instrumentasi AST untuk loop dan fungsi serta timer pengujian. Ini bukan jaminan penghentian semua kode berbahaya: operasi native yang memblokir, konsumsi memori, dan bypass instrumentasi perlu pengujian lebih lanjut. Worker tidak mempunyai DOM native sehingga klaim semua tes DOM dijalankan dalam Worker tidak dibuat. Jangan membuka aplikasi ke publik sebelum audit sandbox lintas browser. Hasil tes dilaporkan klien sebagaimana arsitektur SRS; bukan sistem ujian anti-kecurangan.

Build dan tes lokal sudah diperiksa; QA visual/DOM interaktif melalui browser belum selesai karena alat computer-use tidak dapat memverifikasi URL aktif. WCAG AA, kompatibilitas tiga browser, target beban, uptime, dan SUS belum dapat dinyatakan terpenuhi.

Nilai parameter `pilot-v1` adalah asumsi eksplisit, bukan hasil kalibrasi. Detail implementasi dan status tiap FR: [docs/SRS-TRACEABILITY.md](docs/SRS-TRACEABILITY.md). Daftar yang perlu Anda lengkapi: [docs/TINDAK-LANJUT.md](docs/TINDAK-LANJUT.md).

## Kalibrasi / evaluasi penelitian

`scripts/calibrate_bkt.py` adalah alat offline opsional berbasis pyBKT + pandas, dipasang pada environment riset terpisah. Script memisahkan **peserta**, mengeluarkan draft `bktByKc`, dan menolak parameter di luar batas aplikasi; fitting dengan data pilot nyata belum dilakukan. Tinjau hasil sebelum mengaktifkan versi baru. Tidak ada pemasangan dependensi riset ke aplikasi.

```powershell
python scripts/calibrate_bkt.py interaksi-penelitian.csv --output output/bkt-draft.json
python scripts/evaluate_bkt.py heldout-interaksi.csv --output output/bkt-evaluation.json
```

Evaluasi menghitung AUC, RMSE, dan interval bootstrap peserta dari prediksi yang diekspor. Ekspor harus berasal dari peserta held-out yang tidak dipakai fitting; skrip evaluasi tidak dapat membuktikan pemisahan itu. Kalibrasi `initial` per KC disimpan untuk audit; siswa baru saat ini diinisialisasi dari `initialByLevel` sesuai klasifikasi global KNN. Tetapkan pemetaan level/KC bersama ahli sebelum penelitian.

Rujukan implementasi: [Next.js App Router](https://nextjs.org/docs/app/getting-started), [CodeMirror](https://codemirror.net/examples/autocompletion/), [PGlite filesystem](https://pglite.dev/docs/filesystems), [pyBKT](https://github.com/CAHLR/pyBKT). Sumber kebutuhan: dokumen lokal `D:\Kuliah\Skripsi\SRS.pdf`.
