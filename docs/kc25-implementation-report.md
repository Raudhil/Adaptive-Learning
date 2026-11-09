# Laporan implementasi kurikulum SIMPUS-Mini: 25 KC

Tanggal: **9 November 2026**. Referensi desain: [proposal pemetaan KC](kc-mapping-proposal.md), RPS dan jobsheet dalam [KC](../KC/README.md). Status: **sudah diterapkan pada kode dan database lokal**, dengan batas penilaian otomatis yang disebutkan di bawah.

## 1. Hasil yang tersedia

- Katalog utama **25 KC**: H01-H05, C01-C09, J01-J11. Nama mengikuti daftar pengguna; deskripsi, kesulitan KC, bobot kepentingan dan alasan, sumber, serta prasyarat mengikuti proposal.
- **50 materi**: satu penjelasan ringkas dan satu cuplikan kode dosen per KC. Cuplikan dibaca dari berkas asli HTML/CSS/JS/JSON, dengan path sumber dan konteks SIMPUS-Mini. J07/J11 menyertakan fungsi sumber hingga alur validasi/error/finally.
- **75 latihan**: tiga tugas per KC, masing-masing dengan starter, instruksi, tiga hint dan konteks perpustakaan. Bentuk tugas mencakup katalog/anggota/riwayat, layout, validasi, delegasi dinamis, fetch mock, pemulihan kontrol dan retry.
- **66 latihan pada 22 KC** memiliki penilaian otomatis, dengan **234 test case**. H01 memakai sumber asli; HTML body/CSS/DOM/event memakai iframe; fungsi JS dan async murni memakai Worker.
- **9 latihan pada C07/C08/C09 adalah praktik tanpa penilaian**, bukan latihan yang telah lulus tes otomatis. Pratinjau dan draft tersedia; submit penilaian dinonaktifkan, server menolak hasil yang dipaksakan, BKT tidak berubah, dan rekomendasi tidak memilihnya sebagai latihan bernilai.
- Dataset KNN baru kosong. Sistem memakai fallback skor secara eksplisit sampai tersedia data berlabel yang cocok dengan instrumen baru. Tidak dibuat data pilot mahasiswa palsu.

### Registri aktif

| ID | Nama | Level KC | W | Prasyarat langsung | Penilaian otomatis |
|---|---|---|---:|---|---|
| H01 | HTML Document Structure | Beginner | 3 | - | Siap |
| H02 | Semantic HTML & Accessibility | Beginner | 3 | H01 | Siap |
| H03 | Text, Links & Relative Paths | Beginner | 2 | H01 | Siap |
| H04 | HTML Tables | Beginner | 3 | H02 | Siap |
| H05 | HTML Forms & Constraints | Beginner | 4 | H02 | Siap |
| C01 | CSS Selectors & Specificity | Beginner | 3 | H03 | Siap |
| C02 | CSS Box Model | Beginner | 3 | C01 | Siap |
| C03 | Flexbox Layout | Intermediate | 4 | C02 | Siap |
| C04 | CSS Grid Layout | Intermediate | 4 | C02 | Siap |
| C05 | Table Styling | Beginner | 2 | C01, H04 | Siap |
| C06 | Form Styling | Beginner | 2 | C02, H05 | Siap |
| C07 | Responsive Design & Media Queries | Intermediate | 4 | C03, C04 | Belum; praktik saja |
| C08 | Responsive Table Overflow | Intermediate | 2 | C02, H04 | Belum; praktik saja |
| C09 | CSS Hamburger Menu | Intermediate | 2 | C01, C07, H05 | Belum; praktik saja |
| J01 | Variables, Types & Operators | Beginner | 2 | - | Siap |
| J02 | Conditions & Loops | Beginner | 3 | J01 | Siap |
| J03 | Functions & Scope | Beginner | 3 | J02 | Siap |
| J04 | Arrays, Objects & JSON | Beginner | 3 | J03 | Siap |
| J05 | DOM Manipulation | Intermediate | 4 | J03, J04, H04 | Siap |
| J06 | Event Handling | Intermediate | 4 | J05 | Siap |
| J07 | Form Validation | Intermediate | 4 | J06, H05, J02 | Siap |
| J08 | Client-Side Table Filtering | Intermediate | 3 | J06, J04, H04 | Siap |
| J09 | Event Delegation | Intermediate | 3 | J06, J05 | Siap |
| J10 | Fetch API & Async/Await | Intermediate | 4 | J04, J03 | Siap |
| J11 | Loading, Error Handling & Retry | Intermediate | 3 | J10, J05 | Siap |

Bobot kepentingan berjumlah **77** pada subset 25 KC ini; bukan persentase nilai mata kuliah. Metadata W tidak dipakai untuk mengganti Q atau CPT. Level KC pada tabel berbeda dari level latihan. Variasi latihan menggunakan skala authoring pilot yang sudah tercantum dalam proposal: 0,3/0,5/0,7 (Beginner/Intermediate/Advanced); tingkat tersebut belum merupakan hasil kalibrasi empiris.

## 2. Materi, latihan dan evaluator

Kode katalog/materi/latihan:

- [curriculum-data.ts](../src/lib/curriculum-data.ts): metadata dan alasan W.
- [curriculum-materials.ts](../src/lib/curriculum-materials.ts): penjelasan dan cuplikan sumber.
- [curriculum-exercises.ts](../src/lib/curriculum-exercises.ts): tugas, hint, kasus tes dan solusi rujukan untuk verifikasi offline.
- [source.ts](../src/lib/sandbox/source.ts), [runner.ts](../src/lib/sandbox/runner.ts), [Worker](../src/app/sandbox-worker.js/route.ts): evaluasi sumber/DOM/JS.

Contoh perbedaan tugas: H04 mengerjakan katalog buku, identitas anggota, dan riwayat dengan skema kolom berbeda; J03 mengerjakan pencocok berdasarkan field, state counter terisolasi dan formatter; J09 menangani hapus/toggle/arsip pada target dinamis; J10 menangani array katalog, jumlah anggota dan request berantai; J11 menangani daftar katalog, pilihan anggota yang mempertahankan data lama saat gagal, serta statistik yang mempertahankan nilai terakhir dan menerima nol.

Solusi rujukan tidak dikirim melalui API materi/latihan. Materi memang menyediakan contoh kode pembelajaran. Tes fungsi menggunakan beberapa input, kosong/invalid/batas, dan perubahan state; tes statis memeriksa struktur atau hasil styling yang relevan. Tidak dinyatakan tahan terhadap seluruh bentuk kecurangan atau solusi yang mengetahui seluruh test case.

**Tambahan H01:** parse5 membaca sumber mentah dan lokasi tag, sehingga head/title/lang/doctype milik mahasiswa tidak tertukar dengan wrapper pratinjau. Parser JS menghasilkan fakta AST untuk beberapa persyaratan sintaks. Parsing statis tidak menjalankan kode mahasiswa pada server/halaman induk. Penilaian sumber dilakukan melalui Worker dan tidak mengeksekusi JS mahasiswa. Ini pemeriksaan kontrak soal, bukan sertifikasi lengkap validitas HTML seluruh standar.

**Perbaikan harness:** tes DOM/layout menunggu load dan dua frame render. Pengujian Chromium menemukan bahwa evaluasi terlalu dini dapat menghasilkan ukuran nol untuk solusi CSS yang benar. Hasil referensi setelah perbaikan sudah diuji ulang.

**Batas yang dipertahankan:** tidak membuka akses jaringan, CDN atau same-origin pada iframe. Fetcher/konfirmasi disuntikkan sebagai mock. Penilaian validasi form tidak memakai defaultPrevented sebagai satu-satunya bukti, sebab harness sendiri membatalkan submit. Tidak ditambahkan PHP/PostgreSQL live coding.

## 3. Pretest dan KNN

Instrumen **simpus-mcq-v2** berisi 25 MCQ: 5 HTML, 9 CSS, 11 JavaScript, satu butir pengantar per KC. Struktur UI menjadi tiga modul lalu profil. Ini draf instrumen berbasis materi, **belum instrumen penelitian yang divalidasi ahli**.

Vektor baru berisi delapan angka:

1. Skor HTML, CSS, JavaScript, masing-masing 0-1.
2. Waktu tiga modul, masing-masing 0-1800 detik.
3. Pengalaman 1-5 dan nilai prasyarat 0-100; nilai yang tidak diberikan tetap diimputasi 50.

Metode tetap Euclidean dengan voting invers jarak, label global pemula/menengah/mahir, CV stratified dan fallback ambang lama 0,4/0,75. Tidak ada perubahan algoritma menjadi metode lain. Pengurangan dimensi berasal dari penghapusan React pada jalur utama yang diminta pengguna.

Data latih wajib memiliki delapan fitur dan instrument_version yang sesuai. Vektor lama sepuluh fitur serta baris tanpa provenance versi ditolak/disaring, bukan dipotong atau diberi label baru. Label pilot harus cocok dengan pretest baru, consent dan rubrik approved; label historis lama tidak menjadi referensi baru. Versi parameter lama tetap tersimpan.

## 4. BKT dan Bayesian Network

- Rumus BKT, parameter global pilot dan initialByLevel dipertahankan. Parameter per KC lama tidak disalin sebagai kalibrasi KC baru; versi lama tetap tersedia.
- Ambang mastery tetap **0,95**. Hanya first attempt pengguna-latihan memperbarui BKT; semua tes wajib lulus; full hint menjadi observasi salah. Retry dicatat tanpa observasi tambahan.
- Setiap latihan baru memakai satu KC utama dengan Q=1. W kepentingan tidak dikalikan ke P(L), learn/guess/slip atau skor kelulusan.
- CPT/bobot busur **0,9** mempertahankan asumsi pilot lama; bukan probabilitas yang disimpulkan dari W atau RPS. Nilai ini tetap memerlukan validasi ahli. Noisy-AND, soft evidence dan exact variable elimination tidak diganti.
- Graf 25 KC bebas siklus. F01/F02 yang ada pada proposal dicatat sebagai prasyarat orientasi eksternal, bukan node tambahan tanpa observasi. Graf BN hanya memuat 25 KC yang diminta.
- Rekomendasi dan mode kontrol hanya memilih latihan yang siap dinilai. C07-C09 tidak diberi status mastered oleh penilaian otomatis; rata-rata penguasaan aktif mengecualikan KC praktik.

Pengukuran lokal inferensi BN pada tiga nilai prior menghasilkan sekitar **110-155 ms**. Smoke test lokal mencatat pretest 303 ms dan submit attempt 151/145 ms (maksimum 303 ms). Ini bukti lokal untuk ukuran graf saat ini, bukan uji beban banyak kelas atau jaminan produksi.

## 5. Migrasi, versioning dan pemeliharaan riwayat

Versi baru: **simpus-web-2026-v1**. Versi lama: **legacy-srs-v1**.

ID lama tetap ada. Pemetaan yang disimpan:

| KC lama | Padanan baru |
|---|---|
| H1; H2; H3; H4 | H01; H03/H02; H05; H02 |
| C1; C2; C3; C4; C5 | C01; C02; C03; C04; C07/C08/C09 |
| J1; J2; J3; J4; J5 | J01; J02; J03; J04; J05 |
| J6; J7; J8 | J06/J09; J07; J10/J11 |
| R1; R2; R3 | Tetap disimpan pada arsip; tidak menjadi KC wajib baru |

Pemetaan menunjukkan hubungan isi, **bukan ekuivalensi probabilitas**. Mastery lama tidak disalin ke KC hasil pemecahan. Nomor latihan baru berbeda, sehingga aturan first attempt tidak mencampurkan observasi lama.

Skema ditambah metadata kurikulum/KC/evaluator, tabel versi dan pemetaan. Primary key pretest menjadi user+instrument_version tanpa menghapus row: pengguna dapat memiliki pretest lama dan baru. View current_pretests memilih instrumen baru. Materi, dashboard dan latihan utama membaca katalog aktif; ekspor menyertakan versi sehingga catatan historis dapat dibedakan.

Backup lokal sebelum migrasi:

- output/backups/before-kc25-20261108-164006/postgres
- output/backups/kc25-1794157721281/postgres dan migration-report.json

Nama timestamp backup memakai waktu mesin/UTC; tanggal laporan memakai Asia/Taipei. Folder backup dan output tidak dilacak Git.

| Bukti mahasiswa pada database utama | Sebelum | Sesudah | Verifikasi |
|---|---:|---:|---|
| attempts | 20 | 20 | SHA-256 seluruh row sama |
| mastery_states | 40 | 40 | SHA-256 seluruh row sama |
| mastery_log | 7 | 7 | SHA-256 seluruh row sama |
| pretest_results | 2 | 2 | SHA-256 seluruh row sama |

Database sekarang menyimpan 45 KC, 126 latihan dan 70 materi secara keseluruhan karena versi lama tetap ada; katalog aktif yang ditampilkan adalah 25 KC, 75 latihan dan 50 materi. Dua pretest lama belum diganti oleh pretest baru. **Mahasiswa lama perlu mengerjakan asesmen awal versi baru**, lalu dapat memulai latihan. Catatan lama dapat diakses lewat tautan Riwayat kurikulum lama pada dasbor.

Penyempurnaan authoring J11 dan cuplikan J07/J11 dilakukan sebelum ada pretest/attempt kurikulum baru pada database utama, dengan guard transaksi yang menolak overwrite jika sudah ada bukti baru. Pemeriksaan akhir mencocokkan seluruh materi/soal/tes database aktif terhadap sumber kode, lalu mengecek ulang hash riwayat lama. API menolak overwrite latihan yang sudah memiliki attempt dan menolak perubahan/penghapusan konten arsip.

Migrasi dapat diulang secara idempoten melalui [migrate-kc25.ts](../scripts/migrate-kc25.ts) untuk PGlite lokal (aplikasi harus berhenti). Skrip menyimpan backup dan memeriksa hash sebelum commit. Instalasi kurikulum memakai transaksi melalui [curriculum-install.ts](../src/lib/curriculum-install.ts). Pada PostgreSQL eksternal, backup server dan jendela migrasi perlu disiapkan sebelum db:seed. Tidak dijalankan rollback destruktif atau penghapusan data.

## 6. Pengujian yang benar-benar dijalankan

| Pemeriksaan | Hasil |
|---|---|
| npm.cmd run typecheck | Lulus |
| npm.cmd test | 18 tes lulus: hitung manual model, first/retry/full-hint, rollback, pilot/provenance, isolasi instrumen, migrasi idempoten/preservasi, penolakan KC pending, sumber HTML dan graf |
| npm.cmd run test:grading | Chromium: seluruh 66 solusi rujukan lulus (234 test case); jawaban kosong ditolak pada 66 latihan; enam mutant terpilih ditolak |
| npm.cmd run build | Build produksi lulus |
| npm.cmd run test:smoke | API autentikasi/CSRF/RBAC, kelas, pretest, draft/hint/attempt/BKT, analitik, rollback siklus graf, parameter berversi, ekspor consent, SSR dan seluruh 25 halaman materi lulus |
| UI melalui Chromium | Wizard 25 soal/3 modul, katalog 25 KC tanpa React, edit CodeMirror dan submit H01 sumber asli, tombol C07 nonaktif, halaman riwayat; tidak ada page error |
| Database utama | Metadata/prasyarat, 50 materi, 75 soal dan tes cocok dengan sumber; hash empat tabel riwayat sama sebelum/sesudah |

Enam mutant meliputi dokumen hanya h1 tanpa kerangka sumber, fungsi hasil konstan, loop diganti angka konstan, state counter global bersama, fetch yang mengabaikan HTTP error, dan listener statis yang gagal menangani tombol dinamis. Kasus batas/invalid lain berada di test case masing-masing latihan (nol, rentang tahun, input kosong, dataset kosong, JSON rusak, network/HTTP gagal, target anak tombol, render ulang dan retry).

Bukti terstruktur lokal:

- output/validation/kc25-grading.json
- output/validation/kc25-ui.json dan kc25-history.png
- output/validation/kc25-http.json
- output/validation/kc25-database.json

Tes memakai database .tmp terpisah dan akun sintetis, tidak membuat akun/attempt/pretest pilot palsu di database utama. Verifikasi browser memakai Chrome/Chromium yang tersedia pada mesin; Edge/Firefox dan beban kelas belum diuji. Kelulusan tes bukan pengesahan validitas instrumen penelitian atau audit keamanan penuh.

## 7. Penyesuaian SRS yang perlu dikonfirmasi kepada dosen

1. Bagian 3: ganti katalog draf H1-R3 dengan 25 KC front-end beserta namespace/versi dan orientasi eksternal. React/Next.js dipindah keluar jalur utama sesuai keputusan pengguna; PDF SRS asli belum direvisi/disahkan.
2. Bagian 4.1 dan FR-05–09: tiga modul, delapan fitur, instrumen MCQ baru, syarat provenance, serta asesmen ulang saat perubahan versi.
3. Model data Bagian 8: metadata W/level/sumber/readiness evaluator, versi kurikulum, mapping dan primary key pretest berversi. W tetap terpisah dari Q/CPT/difficulty.
4. FR-16/19/28: tambahkan evaluator sumber dan status praktik tanpa observasi. C07-C09 belum memenuhi penilaian otomatis penuh; jangan menyatakan 25 KC semuanya teruji otomatis.
5. NFR-07: perlindungan iframe DOM masih memiliki keterbatasan penghentian keras yang telah ada. Worker dapat dihentikan untuk JS/sumber; perubahan ini tidak mengklaim DOM arbitrer sudah sepenuhnya aman.

Tidak ada perluasan menjadi eksekusi backend PHP/PostgreSQL mahasiswa, tidak ada pergantian rumus BKT atau metode inferensi BN.

## 8. Pekerjaan yang masih diperlukan

- Implementasi evaluator multi-viewport produksi dan validasi solusi C07/C08/C09 sebelum mengaktifkan observasi BKT untuk ketiganya.
- Validasi ahli atas granularitas/prasyarat, bobot W, CPT pilot, materi, hint, tingkat kesulitan soal dan pretest. Cakupan tes semantik/aksesibilitas/styling tetap terbatas pada kontrak tugas, bukan seluruh standar.
- Pengumpulan data berizin untuk KNN versi baru, kalibrasi BKT dan evaluasi diagnosis BN; belum ada klaim model terlatih dari data mahasiswa nyata.
- Posttest, rubrik penelitian dan desain kontrol/adaptif yang dibekukan per versi; fitur posttest dan input nilai manual umum belum tersedia.
- QA Edge/Firefox, uji beban dan audit sandbox lanjutan sesuai SRS.

Pembaruan kode/database lokal sudah dilaksanakan. Pengesahan perubahan ruang lingkup SRS dan validasi akademik tetap merupakan keputusan dosen pembimbing.
