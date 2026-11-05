# Ketertelusuran implementasi SRS 0.1

Sumber: `D:\Kuliah\Skripsi\SRS.pdf`, 16 halaman, dokumen 22 Oktober 2026. Status “tersedia” berarti kode/alur lokal tersedia; tidak menyatakan instrumen sudah divalidasi atau siap produksi.

Panduan operasional: [Panduan Penggunaan](PANDUAN-PENGGUNAAN.md). SRS bagian 10.2 merencanakan evaluasi pretest-posttest; aplikasi saat ini belum memiliki posttest, rekap pretest-posttest, atau input nilai manual dosen. FR-15-16 memakai penilaian otomatis test case. Label awal FR-08 disimpan untuk audit tetapi belum ditampilkan pada dasbor mahasiswa/dosen. FR-05 dijalankan setelah gabung kelas, sebelum pengiriman latihan pertama.

| ID | Implementasi | Status / verifikasi |
|---|---|---|
| FR-01 | `/login`, `/register`, bcrypt + session server; filter domain email | Tersedia. SSO alternatif belum diperlukan; verifikasi email/SMTP belum tersedia. |
| FR-02 | Empat role, pemeriksaan halaman dan API | Tersedia, HTTP RBAC diperiksa. |
| FR-03 | Consent opsional, waktu persetujuan, penarikan, filter ekspor | Tersedia, ekspor sebelum/setelah penarikan diuji. Form etik final memerlukan institusi. |
| FR-04 | Dosen membuat kelas adaptif/kontrol dan kode gabung | Tersedia; HTTP create/join diperiksa. |
| FR-05 | Pretest 4 modul + pengalaman/nilai prasyarat opsional | Tersedia; satu kali per siswa, latihan dibatasi sebelum pretest. |
| FR-06 | 10 fitur, min-max bounds tetap, weighted Euclidean KNN | Tersedia, hitungan/fallback diuji; data nyata belum tersedia. |
| FR-07 | Klasifikasi global → initialByLevel seluruh KC | Tersedia; inisialisasi diuji. Level per modul bukan versi minimum ini. |
| FR-08 | Label, metode, jarak/tetangga, versi dalam pretest_results | Tersedia. |
| FR-09 | Data training pada admin, stratified CV k ganjil, confusion/P/R/F1 | Tersedia; CV sintetis diuji, aktivasi eksplisit lewat versi baru. |
| FR-10 | CodeMirror HTML/CSS/JS + autocomplete | Kode tersedia; QA interaktif browser belum selesai. |
| FR-11 | srcDoc iframe opaque origin, debounce 400 ms | Kode tersedia; target render lintas browser belum diukur. |
| FR-12 | Console/error postMessage dengan source/origin/channel | Kode tersedia; QA browser belum selesai. |
| FR-13 | Draft DB + localStorage bernamespace user/latihan | API simpan/pulih diperiksa, QA keyboard/browser belum selesai. |
| FR-14 (C) | Editor JSX/React | Ditunda; materi React tersedia. |
| FR-15 | Instruksi, kode awal, tingkat kesulitan, Q-matrix, tests | 51 latihan pilot pada 17 KC; CRUD tersedia. |
| FR-16 | Harness DOM/JS, hasil per tes, Worker JS murni | Kode tersedia; DOM runtime/browser belum diverifikasi, lihat NFR-07. |
| FR-17 | Attempt kode/hasil/hint/waktu/first/selection/snapshot model | API dan penyimpanan diuji. Hasil tes dilaporkan klien. |
| FR-18 | Hint 3 tingkat, jumlah server-side | Tersedia; API diuji. |
| FR-19 | First-only BKT, full hint = observasi salah | Unit + integrasi lulus, retry tidak menambah mastery_log. |
| FR-20 | mastery_log dengan before/after/prediksi/versi | Tersedia; endpoint history dan ekspor. |
| FR-21 | Noisy-AND factors, soft evidence, variable elimination eksak | Unit hitung manual dan korelasi readiness lulus. |
| FR-22 | Jumlah kegagalan beruntun → posterior prasyarat terlemah | Tersedia; parameter dapat diubah admin. |
| FR-23 | JSON model_params berversi, bktByKc + edge weight | API aktivasi versi diperiksa. |
| FR-24 | Frontier, kurikulum, peluang benar, anti-pengulangan | Deterministik dan unit-tested; pengulangan ditandai bila stok habis. |
| FR-25 | Alasan rekomendasi Bahasa Indonesia | Tersedia di dasbor/hasil submit, log alasan disimpan. |
| FR-26 | Pilihan materi/latihan bebas + selection attempt | Tersedia; identitas rekomendasi dicocokkan server. |
| FR-27 | Control mengikuti urutan kurikulum dan ID latihan | Tersedia dan unit-tested; mode kelas dipilih sebelum studi. |
| FR-28 | Peta per modul, persen dan status dikuasai/siap/terkunci | Tersedia; memakai ambang aktif admin. |
| FR-29 | Heatmap mahasiswa × KC, akses hanya pemilik kelas/admin | API dan akses diuji; visual belum diperiksa. |
| FR-30 | Risiko penguasaan rendah/tidak aktif + aktivitas | Tersedia, rata-rata rendah saat ini <0.4 dan hari dari parameter. |
| FR-31 | CSV attempts/pretest/recommendations, HMAC + consent | CSV attempts/penarikan diuji; data identitas langsung tidak diekspor. |
| FR-32 | CRUD KC + checklist prasyarat/bobot dan peta arah | API tersedia. |
| FR-33 | CRUD materi teks/video/contoh kode | Tersedia, URL HTTPS dibatasi. |
| FR-34 | CRUD latihan + ekspresi tes, timeout, hint, Q-matrix | Tersedia; pemformatan JSON untuk detail konten. |
| FR-35 | Validasi DAG dalam transaksi | Unit siklus dan HTTP rollback lulus. |

## Non-fungsional

| ID | Status |
|---|---|
| NFR-01–04 | Debounce 400 ms; model ringan TypeScript. Target server, render, concurrency belum dibuktikan uji beban kampus. |
| NFR-05 | Iframe sandbox allow-scripts tanpa allow-same-origin. Uji cookie/parent lintas browser masih wajib. |
| NFR-06 | CSP iframe default-src none, jaringan dan form/subframe dibatasi; HTML event/script dibersihkan. Audit termasuk self-navigation masih perlu. |
| NFR-07 | **Sebagian:** Worker termination untuk JS murni; DOM memakai instrumentasi AST dan timer, tanpa jaminan hard termination kode arbitrer. |
| NFR-08 | bcrypt cost 12, token session hash server, httpOnly/SameSite, cookie Secure ketika APP_URL HTTPS, CSRF Origin/header. HTTP CSRF diuji. |
| NFR-09 | Pseudonim HMAC + filter consent dan tidak mengekspor kode mentah. Penilaian hukum/etik, retensi, dan SOP institusi belum dilakukan. |
| NFR-10–12 | Uptime/SUS/cross-browser/layar belum dievaluasi formal; CSS responsif dan label keyboard tersedia. |
| NFR-13 | Parameter disimpan DB, konfigurasi aktif dibaca runtime. Angka awal seed terdokumentasi sebagai pilot. |
| NFR-14 | Rekomendasi menyimpan input, snapshot KC/latihan, versi parameter/algoritma; attempt menyimpan snapshot soal. |
| NFR-15 | Label, skip link, focus indicator, navigasi semantik; audit WCAG AA belum selesai. |

## Pengujian yang tersedia

- `tests/adaptive.test.ts`: hitungan BKT, weighted KNN/CV, BN eksak/joint evidence, determinisme/control, guard loop/rekursi, pseudonim/CSV.
- `tests/learning.test.ts`: DB terpisah, pretest → first/retry/full hint → mastery/recommendation log, rollback transaksi.
- `scripts/smoke.ts`: API black-box dan SSR menggunakan build produksi serta DB terpisah, tanpa mengubah data utama.
- Skrip Python evaluasi AUC/RMSE + bootstrap peserta dan draft kalibrasi pyBKT disediakan; fitting nyata belum dijalankan.
- Pemeriksaan browser dihentikan alat karena URL Chrome tidak dapat dipastikan. Tidak ada klaim tes DOM visual, sandbox lintas browser, SUS, atau beban telah lulus.
