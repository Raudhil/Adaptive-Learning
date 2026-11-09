# Proposal pemetaan Knowledge Component berdasarkan materi Pemrograman Web 2026

> Status lanjutan 9 November 2026: subset 25 KC sudah diimplementasikan atas permintaan pengguna. Dokumen ini tetap menjadi proposal/desain historis; status kode, database dan pengujian terbaru ada pada [laporan implementasi KC25](kc25-implementation-report.md).

Tanggal proposal: **9 November 2026**; pembacaan sumber dimulai 8 November 2026. Status: **draf untuk pemeriksaan mahasiswa dan dosen pembimbing; belum disetujui untuk implementasi**.

Dokumen ini hanya mengusulkan kurikulum, bobot, relasi prasyarat, dan asesmen. Tidak ada perubahan kode aplikasi, skema/data database, bank soal aktif, parameter, atau algoritma KNN, BKT, dan Bayesian Network (BN).

Panduan pemeriksaan: [ringkasan dan sumber](#1-kesimpulan-utama-dan-batas-analisis), [aturan bobot](#3-aturan-bobot-kesulitan-prasyarat-dan-evaluasi), [registri KC](#4-registri-kc-yang-direkomendasikan), [soal dan tes](#5-contoh-tugas-kriteria-keberhasilan-dan-rancangan-test-case), [perbandingan aplikasi](#6-validasi-terhadap-struktur-aplikasi-saat-ini), [kompatibilitas SRS](#7-kompatibilitas-terhadap-srs-dan-kebutuhan-evaluasi-teknis), [rekomendasi](#8-rekomendasi-perubahan-aplikasi-setelah-proposal-disetujui).

## 1. Kesimpulan utama dan batas analisis

1. Repository dosen mengajarkan pengembangan **SIMPUS-Mini** secara bertahap: HTML, CSS, UI/UX, JavaScript, PHP native, PostgreSQL melalui PDO_PGSQL, CRUD, autentikasi, keamanan, integrasi peminjaman, deployment, dan dokumentasi. CPMK-6 juga menilai tanggung jawab dan kontribusi individu/tim.
2. Diusulkan **64 komponen pada jalur utama, termasuk tugas mandiri, serta 7 komponen pengayaan opsional**. Jumlah 71 adalah katalog kompetensi untuk ditinjau, **bukan usulan mengaktifkan 71 node BN sekaligus**. Kompetensi desain/proses/dokumentasi tetap memerlukan rubrik; tidak semuanya merupakan KC prosedural yang layak dilacak otomatis dengan BKT.
3. Baseline kode menyediakan **20 KC**: H1-H4, C1-C5, J1-J8, R1-R3. Sebanyak **17 KC HTML/CSS/JS masih relevan**; konten dan instrumennya perlu diselaraskan. Tiga KC React/Next.js tidak ditemukan sebagai materi ajar dalam repository dosen, tetapi tercantum dalam SRS. Usul: pertahankan riwayatnya dan tempatkan sebagai pengayaan di luar jalur kurikulum dosen setelah keputusan revisi ruang lingkup; jangan dihapus sekarang.
4. SRS versi 0.1 **secara eksplisit mengecualikan eksekusi backend Node/PHP** pada versi 1.0. Penggunaan PostgreSQL untuk menyimpan data aplikasi tidak berarti tersedia evaluator SQL mahasiswa. PHP, SQL, cookie/session, HTTP, dan transaksi harus dinilai melalui lingkungan praktikum terpisah atau runner terisolasi yang memerlukan perubahan kebutuhan.
5. **Bobot kepentingan KC, bobot Q-matrix, bobot busur BN, kesulitan latihan, dan nilai mata kuliah adalah variabel berbeda.** Tidak ada dasar untuk menyalin persentase RPS ke salah satu parameter model tersebut.

### 1.1 Sumber dan metode pemeriksaan

Materi ditemukan langsung pada `KC/`, bukan direktori bersarang bernama `PemogramanWeb2026-main/`. Arsip `KC/PemogramanWeb2026-main.zip` memiliki root bernama `PemogramanWeb2026-main`. Analisis menggunakan salinan materi yang sudah tersedia di `KC/`; arsip tidak diekstrak ulang dan kesamaan semua berkas terhadap arsip belum diaudit.

Sumber utama:

- [README repository dosen](../KC/README.md), [RPS](../KC/RPS-Desain-Pemrograman-Web.md), dan [jobsheet induk](../KC/Jobsheet-Praktikum-Perpustakaan.md).
- Seluruh README jobsheet 01-13, varian `jobsheet-03-bootstrap`, indeks/subbab dokumentasinya, rangkuman/latihan, serta inspeksi kode HTML/CSS/JS/PHP/SQL yang relevan. Inventaris Markdown `KC/` berjumlah 143 berkas. Pemetaan menggabungkan capaian RPS, petunjuk jobsheet, dokumentasi, dan perilaku kode; tidak hanya mengambil judul jobsheet.
- [Panduan setup PostgreSQL](../KC/Setup-Database-PostgreSQL-Laragon.md), wireframe, checklist keamanan, serta manual pengguna pada jobsheet akhir.
- SRS asli: `D:/Kuliah/Skripsi/SRS.pdf`, 16 halaman, versi 0.1 tanggal 22 Oktober 2026; teks seluruh halaman dibaca. Rujukan halaman dalam dokumen ini menggunakan nomor halaman PDF tersebut.
- [README aplikasi](../README.md), [ketertelusuran SRS](SRS-TRACEABILITY.md), [tindak lanjut](TINDAK-LANJUT.md), serta kode sumber dan skema yang dirujuk pada bagian 6.

`KC/README.md` dan `KC/RPS-Desain-Pemrograman-Web.md` identik secara SHA-256 pada saat analisis; keduanya bukan dua kurikulum berbeda. Beberapa identitas CPL/dosen/kode MK masih berupa isian contoh. Validasi pengampu tetap diperlukan.

**Batas verifikasi:** daftar KC/latihan lama adalah baseline pada seed dan kode, bukan hasil query database aktif. `scripts/seed.ts` memakai `ON CONFLICT DO NOTHING`, sehingga konten yang pernah diedit dosen dapat berbeda. Database tidak dibuka melalui modul aplikasi karena pembukaan koneksi di `src/lib/db.ts` juga menjalankan DDL skema. Tidak dilakukan seed, migrasi, submit latihan, perubahan model, eksekusi proyek PHP, atau pengujian aplikasi dalam pekerjaan ini. Seluruh test case di bagian 5 adalah **rancangan asesmen**, belum test yang telah dijalankan atau divalidasi.

### 1.2 Urutan otoritas saat sumber berbeda

RPS dipakai untuk menetapkan capaian; jobsheet induk untuk tugas dan kriteria; dokumentasi serta kode untuk menjelaskan realisasi konkret. Jika bertentangan, perbedaannya dicatat dan dimintakan keputusan pengampu, bukan dipilih diam-diam.

Temuan yang memengaruhi penyusunan latihan:

| Perbedaan sumber | Dampak terhadap proposal |
|---|---|
| RPS dan jobsheet induk menekankan mobile-first; dokumentasi/kode JS03 menggunakan desktop-first, `max-width` 768/480 dan grid 3/2/1 kolom. | KC C07 menilai perilaku responsif dan kemampuan menjelaskan strategi. Latihan harus menyebut strategi serta breakpoint yang diuji; jangan menganggap kode contoh sudah mobile-first. |
| JS03 Bootstrap adalah alternatif, sedangkan RPS minggu 4 menyebut CSS native tanpa framework. | B01-B03 menjadi pengayaan opsional; tidak menggantikan pengukuran Flexbox/Grid/media query native. |
| Jobsheet induk JS09 menyebut pagination di atas 10 baris; kode memakai 5 baris/halaman. | D09 menerima ukuran halaman sebagai kontrak soal/fixture, bukan angka universal. |
| Narasi JS06 menyebut pemakaian fetch ke endpoint PHP mulai JS09; kode JS07 memindahkan rendering utama ke PHP dan menghapus berkas fetch/JSON. | Pisahkan kompetensi fetch client dari server rendering. Jangan mengklaim repository menyediakan REST API atau integrasi fetch-PHP lengkap. |
| Narasi JS12 menyebut relasi ke `users` dan histori JOIN tiga tabel. SQL aktual `peminjaman` hanya memiliki FK `buku_id` dan `anggota_id`; `riwayat.php` JOIN `peminjaman` dengan `buku` setelah anggota dipilih. | I01 mengikuti skema aktual; I05 menilai JOIN yang diperlukan. Penambahan pencatat petugas/`user_id` atau JOIN tambahan merupakan perluasan, bukan fakta kode saat ini. |
| Tugas mandiri role admin dan larangan pinjam bagi anggota terlambat >14 hari belum diterapkan pada snapshot. | A04 dan I06 tetap dicakup sebagai tugas mandiri yang diminta materi, dengan penanda bahwa implementasinya perlu dikerjakan mahasiswa. |
| Narasi audit menyebut seluruh query harus prepared; kode memakai `query()` untuk SQL konstan tanpa masukan pengguna. | D04/S01 menilai pemisahan data tak tepercaya dari SQL, bukan melarang semua query konstan. Satu payload SQLi yang gagal bukan bukti keamanan menyeluruh. |
| Dokumentasi CSRF sesekali menyebut token sekali pakai; implementasi menyimpan token per session dan menggunakannya ulang. | S03 mengikuti token per session. Jangan membuat tes yang mewajibkan token berganti pada setiap submit jika kontrak belum diubah. |
| Manual akhir masih memiliki placeholder screenshot; beberapa snapshot awal sengaja belum diberi hardening. | Kelengkapan dokumentasi/keamanan harus dibuktikan dengan rubrik dan tes; keberadaan contoh kode tidak otomatis berarti sudah memenuhi capaian. |

## 2. Ringkasan cakupan materi dan kompetensi

| Sumber/tahap | Kompetensi yang dipetakan | ID proposal |
|---|---|---|
| RPS minggu 1 | Client-server, HTTP, setup VS Code/Laragon/browser/Git, debugging dasar. | F01-F02 |
| JS01, minggu 2 | Struktur dokumen, semantik, navigasi/path, tabel buku/anggota, form dan label, validasi HTML dasar. | H01-H05 |
| JS02, minggu 3 | Selektor/spesifisitas, reset/pewarisan, box model, ukuran/warna/tipografi, Flexbox, Grid, tabel, form dan konsistensi gaya. | C01-C06 |
| JS03, minggu 4 | Viewport, strategi responsif, media query, breakpoint, overflow tabel, hamburger checkbox. | C07-C09 |
| JS03 Bootstrap alternatif | Grid 12 kolom, card, navbar collapse, utility tabel/form dan override tema. | B01-B03, opsional |
| JS04, minggu 5 | Aktor, hak akses yang dirancang, user flow pinjam/kembali beserta edge case, wireframe dan penerjemahannya ke antarmuka. | U01-U02 |
| JS05, minggu 6 | Fondasi JS dalam kode, DOM, fungsi, event, hamburger JS, validasi client, filter dan konfirmasi hapus. | J01-J03, J05-J09 |
| JS06, minggu 7 | Array/object/JSON, fetch, Promise/async-await, HTTP status, render dinamis, loading/error/finally, event delegation dan server lokal/CORS. | J04, J05, J09-J11, F01-F02 |
| UTS, minggu 8 | Integrasi front-end sesuai rancangan. | Bukti gabungan H/C/U/J; bukan KC baru bernama UTS |
| JS07, minggu 9 | PHP dasar, include/template/path relatif, superglobal, validasi server, session sementara, render/flash/redirect. | P01-P06 |
| JS08, minggu 10 | Instalasi PostgreSQL dan pdo_pgsql, ERD/DDL, tipe/constraint, PDO, INSERT berparameter/RETURNING, SELECT/COUNT dan persistensi. | D01-D05 |
| JS09, minggu 11 | Update, delete POST, pencarian ILIKE, pagination LIMIT/OFFSET dan siklus CRUD dua entitas. | D06-D09, J09 |
| JS10, minggu 12 | Register/hash, login/verifikasi, logout, session/cookie, guard, navbar berdasarkan status; role sebagai tugas mandiri. | A01-A04 |
| JS11, minggu 13 | Audit SQLi, XSS/escaping, CSRF, session fixation, validasi/whitelist, checklist bukti before/after. | S01-S05, P04 |
| JS12, minggu 14 | FK, transaksi atomik, row locking/race condition, pengembalian sekali, JOIN, aturan keterlambatan, pengujian end-to-end dan statistik nyata. | I01-I07 |
| JS13, minggu 15 | Environment/config, deployment lintas root/subfolder, ekspor/impor skema, README/ERD/manual dan persiapan demo. | O01-O03 |
| UAS minggu 16 dan CPMK-6 sepanjang semester | Produk terintegrasi, argumentasi teknis, dokumentasi, logbook serta kontribusi individu. | Bukti gabungan; T01 dan O03 untuk proses/dokumentasi |
| Latihan tambahan dokumentasi | Impor JSON ke DB, cookie persisten, pembatasan login, pembelajaran CSP. | X01-X04, opsional |

Tidak semua variasi latihan perlu KC baru. Contoh penambahan kolom tabel, validasi ISBN, counter hasil filter, perubahan warna/breakpoint, refactor fungsi generik, tanggal jatuh tempo, dan perbandingan CSS/Bootstrap dipetakan ke KC yang sama jika keterampilan intinya sama. Gambar/`alt` pada KC lama H2 tetap dapat menjadi pengayaan aksesibilitas; gambar bukan fokus eksplisit kode JS01. Git diperkenalkan sebagai tool, bukan kurikulum branching/CI/CD yang tidak diajarkan repository.

## 3. Aturan bobot, kesulitan, prasyarat, dan evaluasi

### 3.1 Bobot kepentingan KC

Kolom **W** pada bagian 4 adalah usulan bobot relatif **1-5**, untuk menyatakan prioritas capaian dan alokasi instrumen. Bobot ini belum tersedia sebagai kolom pada tabel `knowledge_components` dan belum digunakan mesin rekomendasi saat ini.

| W | Dasar penentuan |
|---|---|
| 1 | Pengenalan atau keterampilan pendukung dengan dampak langsung terbatas. |
| 2 | Fondasi/pelengkap dengan pengujian sederhana atau lingkup lokal. |
| 3 | Keterampilan inti yang dipakai ulang beberapa halaman/fitur. |
| 4 | Fondasi lintas fitur, integrasi penting, atau kegagalan yang berdampak besar pada pengalaman/data. |
| 5 | Keterampilan kritis untuk keamanan, identitas, persistensi atau konsistensi transaksi; kesalahan dapat merusak fungsi utama. |

Pertimbangan setiap baris: peran sebagai fondasi, frekuensi transfer antarmodul, konsekuensi kesalahan, dan tuntutan penalaran/integrasi. Alasan ditulis spesifik pada tiap KC. Nilai ini adalah **penilaian desain awal**, bukan estimasi statistik atau bobot yang telah disahkan ahli. Tidak semua kategori harus memakai seluruh angka skala.

Jika kelak diperlukan rekap capaian, bentuk ilustratifnya `kontribusi_k = W_k / jumlah W pada cakupan yang dinilai`. Penyebut harus memakai cakupan yang sama dan dibekukan per versi kurikulum; pengayaan opsional tidak otomatis masuk penyebut jalur utama. W **tidak otomatis menjadi skor akhir**, rata-rata mastery berbobot, ataupun aturan rekomendasi.

### 3.2 Pisahkan lima jenis angka

| Angka | Makna dan status |
|---|---|
| Persentase RPS | Komposisi penilaian mata kuliah (UTS/UAS/praktik/proses). Tidak dipakai sebagai W, Q, CPT atau parameter BKT. |
| W per KC | Kepentingan relatif capaian pada proposal ini, rentang 1-5; metadata yang perlu desain lebih lanjut bila diadopsi. |
| `exercise_kc.weight` (Q) | Besarnya kontribusi observasi latihan terhadap KC; aplikasi memakai fractional likelihood BKT. Soal diagnostik satu KC sebaiknya Q=1. Contoh soal gabungan dapat mengusulkan Q utama=1 dan pendukung=0,5 setelah validasi; itu bukan persentase RPS dan belum aktif. |
| `kc_prerequisites.weight` | Kekuatan penghambatan dalam CPT noisy-AND BN. Seed memakai 0,9 untuk semua busur; nilai itu pilot, bukan bukti hubungan empiris. |
| `exercises.difficulty` | Angka 0-1 untuk pemilihan latihan. Beginner/Intermediate/Advanced di sini adalah kategori pedagogis, bukan probabilitas mastery. Titik awal 0,3/0,5/0,7 hanya kandidat authoring yang perlu pilot. |

Tidak menyalin W=5 ke Q/CPT yang dibatasi maksimum 1. Bobot busur BN perlu elisitasi per hubungan: tanyakan kemungkinan menguasai anak saat masing-masing induk belum dikuasai, lalu uji diagnosis dengan ahli. Proposal ini **belum menetapkan angka CPT baru**, karena repository tidak memuat data probabilistik tersebut.

### 3.3 Arti prasyarat dan unit observasi

Prasyarat pada tabel adalah **prasyarat belajar langsung yang diusulkan**, arahnya `prasyarat -> KC`, bukan salinan semua jobsheet sebelumnya. Daftar disusun tanpa siklus dan maksimum lima induk langsung agar cocok dengan batas validator saat ini. Keterkaitan proyek yang hanya menunjukkan urutan pengerjaan tidak otomatis menjadi ketergantungan mastery.

F01-F02, U01-U02, S05, O03, T01, serta bagian penilaian rubrik merupakan konteks/orientasi atau capaian yang tidak sepenuhnya teramati lewat tes otomatis. Jangan memasukkannya sebagai pengunci BN sampai ada bukti individu dan aturan observasi yang disetujui. Untuk pilot front-end, kandidat KC prosedural H01-H05, C01-C09, J01-J11 berjumlah **25**; F01/F02 diperlakukan sebagai orientasi sebelum jalur ini, bukan node laten wajib tanpa asesmen. Daftar 25 masih memerlukan pemeriksaan kesiapan evaluator, khususnya H01 dan C07-C09.

Setiap latihan hendaknya satu KC utama dan beberapa fixture terkontrol. Sediakan tugas berbeda untuk buku dan anggota, bukan hanya salinan soal dengan judul berbeda. Asesmen proyek gabungan tidak boleh mengirim satu boolean yang otomatis mengklaim semua KC terkuasai: perlu butir/subtes yang dapat diatribusikan dan kebijakan Q yang tervalidasi.

### 3.4 Kode metode evaluasi

| Kode | Metode | Ketersediaan dan batas |
|---|---|---|
| BR | Test DOM/CSS/event di iframe, memakai `document`, computed style dan simulasi event. | Mekanisme dasar tersedia; soal baru dan tesnya belum dibuat. Bukan validator HTML sumber, pengujian multi-halaman atau audit aksesibilitas penuh. |
| JS | Tes fungsi JavaScript murni di Worker dengan input normal, batas dan negatif. | Mekanisme dasar tersedia; kontrak fungsi perlu disediakan pada soal. |
| MO | Mock/injeksi dependensi untuk fetch/konfirmasi/waktu. | Pola fetcher injeksi sudah ada pada J8 lama. Fixture loading/error dan dialog perlu dirancang; jangan membuka jaringan untuk membuat contoh berjalan. |
| RAW | Pemeriksaan sumber mentah/AST/validator statis. | Belum tersedia sebagai evaluator latihan sumber HTML. Diperlukan untuk doctype/head/meta dan sebagian persyaratan sintaks. |
| VP | Browser automation pada viewport dan interaksi nyata. | Belum tersedia pada alur penilaian latihan. Diperlukan untuk responsive/overflow/hover/collapse lintas ukuran. |
| PHP | PHP CLI/lint/unit test dalam lingkungan terisolasi. | Belum didukung aplikasi. `php -l` hanya menguji sintaks, bukan kebenaran perilaku. |
| PG | Query/DDL diuji pada PostgreSQL fixture terisolasi. | Belum didukung aplikasi; tidak memakai DB aplikasi sebagai arena SQL mahasiswa. |
| HTTP | Pengujian integrasi request/response, cookie/session, redirect dan efek DB pada PHP + PostgreSQL terisolasi. | Belum didukung aplikasi. HTML akhir saja tidak membuktikan logika server. |
| OPS | Pemeriksaan environment/deployment/restore di lingkungan praktikum yang dikendalikan. | Belum menjadi alur penilaian aplikasi; dapat dikerjakan di lab. |
| AS | Inspeksi kode/AST/scan statis pendukung. | Bukan bukti tunggal bebas kerentanan atau algoritma benar. Instrumentasi AST sandbox sekarang bertujuan membatasi eksekusi, bukan grader struktur solusi. |
| RV | Rubrik dosen, demonstrasi, review artefak/logbook dan tanya jawab individu. | Belum ada input nilai/rubrik umum untuk latihan di aplikasi. Hasil eksternal disimpan sebagai bukti terpisah sampai ada rancangan integrasi. Tidak otomatis mengubah BKT. |

Pada bagian 5, `T1/T2/T3` adalah identitas kasus lokal pada baris KC, bukan KC baru. Kriteria default untuk soal otomatis: semua kasus wajib lulus, tanpa runtime error; full hint dan first-attempt tetap mengikuti kebijakan BKT SRS. Rubrik yang diusulkan memakai skala 0-3 (tidak ada/salah/sebagian/tepat), lulus bila setiap indikator wajib minimal 2; ambang ini perlu validasi pengampu.

## 4. Registri KC yang direkomendasikan

ID baru memakai dua digit, misalnya **H01**, agar tidak dianggap otomatis sama dengan ID database lama **H1**. Seluruh ID adalah namespace proposal, bukan instruksi rename/migrasi. Setiap tabel memuat nama, deskripsi yang dapat diukur, sumber, kesulitan, W beserta alasan, dan prasyarat. Contoh tugas serta test case per ID ada pada bagian 5.

### 4.1 Fondasi web dan tool

| ID | Nama dan deskripsi kompetensi | Sumber | Kesulitan | W dan alasan | Prasyarat |
|---|---|---|---|---|---|
| F01 | **Alur client-server dan HTTP**. Membedakan GET/POST, respons HTML/JSON, eksekusi browser/server dan penyimpanan session/DB. | [RPS](../KC/RPS-Desain-Pemrograman-Web.md); [JS07 §1](../KC/kode-praktikum/jobsheet-07/Dokumentasi/01-konsep-dasar-php.md); [JS06 §7](../KC/kode-praktikum/jobsheet-06/Dokumentasi/07-menjalankan-dengan-server-lokal.md) | Beginner | **2** — Orientasi untuk memilih evaluator yang tepat; belum keterampilan integrasi tersendiri. | - |
| F02 | **Setup tool dan diagnosis dasar**. Menyiapkan editor/server lokal, membaca console/Network dan mencatat perubahan dengan Git dasar. | [RPS](../KC/RPS-Desain-Pemrograman-Web.md); [JS02 §10](../KC/kode-praktikum/jobsheet-02/Dokumentasi/10-rangkuman-latihan.md); [JS08 §8](../KC/kode-praktikum/jobsheet-08/Dokumentasi/08-instalasi-postgresql-laragon.md); [JS13 §4](../KC/kode-praktikum/jobsheet-13/Dokumentasi/04-rangkuman-latihan.md) | Beginner | **2** — Mendukung semua praktikum tetapi bukan ukuran penguasaan bahasa. | - |

### 4.2 HTML

| ID | Nama dan deskripsi kompetensi | Sumber | Kesulitan | W dan alasan | Prasyarat |
|---|---|---|---|---|---|
| H01 | **Kerangka dokumen HTML**. Menulis doctype, html lang, head/title/charset dan body dengan penempatan benar. | [JS01 §1](../KC/kode-praktikum/jobsheet-01/Dokumentasi/01-konsep-dasar.md); [JS01 §2](../KC/kode-praktikum/jobsheet-01/Dokumentasi/02-index-html.md) | Beginner | **3** — Fondasi semua halaman; DOM hasil perbaikan browser tidak membuktikan sumber valid. | F01 |
| H02 | **Semantik dan aksesibilitas dasar**. Memilih landmark/hierarki heading, memberi nama navigasi dan menghubungkan label-kontrol. | [JS01 §1](../KC/kode-praktikum/jobsheet-01/Dokumentasi/01-konsep-dasar.md); [JS01 §2](../KC/kode-praktikum/jobsheet-01/Dokumentasi/02-index-html.md); [JS01 §4](../KC/kode-praktikum/jobsheet-01/Dokumentasi/04-buku-tambah-html.md) | Beginner | **3** — Dipakai lintas halaman dan menunjang akses keyboard/pembaca layar. | H01 |
| H03 | **Teks, tautan dan path relatif**. Menyusun teks/heading serta href/referensi aset pada root dan subfolder. | [JS01 §1](../KC/kode-praktikum/jobsheet-01/Dokumentasi/01-konsep-dasar.md); [JS01 §2](../KC/kode-praktikum/jobsheet-01/Dokumentasi/02-index-html.md); [JS01 §5](../KC/kode-praktikum/jobsheet-01/Dokumentasi/05-anggota-list-html.md); [JS02 §2](../KC/kode-praktikum/jobsheet-02/Dokumentasi/02-perubahan-file-html.md) | Beginner | **2** — Fondasi navigasi dengan lingkup lebih sederhana daripada form. | H01 |
| H04 | **Tabel data HTML**. Membuat thead/tbody, header dan baris buku/anggota dengan jumlah sel konsisten. | [JS01 §3](../KC/kode-praktikum/jobsheet-01/Dokumentasi/03-buku-list-html.md); [JS01 §5](../KC/kode-praktikum/jobsheet-01/Dokumentasi/05-anggota-list-html.md) | Beginner | **3** — Pola inti katalog/riwayat yang belum dipisahkan pada KC lama. | H02 |
| H05 | **Form dan constraint HTML**. Menyusun name/id, label, tipe input/select dan constraint sesuai skema buku/anggota. | [JS01 §4](../KC/kode-praktikum/jobsheet-01/Dokumentasi/04-buku-tambah-html.md); [JS01 §6](../KC/kode-praktikum/jobsheet-01/Dokumentasi/06-anggota-tambah-html.md) | Beginner | **4** — Kontrak field dipakai oleh JS, PHP dan DB; salah name memutus alur. | H02 |

### 4.3 CSS native dan responsive

| ID | Nama dan deskripsi kompetensi | Sumber | Kesulitan | W dan alasan | Prasyarat |
|---|---|---|---|---|---|
| C01 | **Selektor, cascade dan spesifisitas**. Memakai selector elemen/class/atribut/descendant/pseudo-class dan menentukan pemenang konflik. | [JS02 §1](../KC/kode-praktikum/jobsheet-02/Dokumentasi/01-konsep-dasar-css.md); [JS02 §4](../KC/kode-praktikum/jobsheet-02/Dokumentasi/04-css-header-navbar-flexbox.md); [JS02 §6](../KC/kode-praktikum/jobsheet-02/Dokumentasi/06-css-grid-kartu-statistik.md) | Beginner | **3** — Fondasi seluruh styling; perlu konflik aturan untuk mengukur spesifisitas. | H03 |
| C02 | **Box model dan gaya dasar**. Mengatur reset, border-box, padding/margin, lebar, satuan dan tipografi dasar. | [JS02 §1](../KC/kode-praktikum/jobsheet-02/Dokumentasi/01-konsep-dasar-css.md); [JS02 §3](../KC/kode-praktikum/jobsheet-02/Dokumentasi/03-css-reset-dan-body.md); [JS02 §5](../KC/kode-praktikum/jobsheet-02/Dokumentasi/05-css-main-dan-section.md); [JS02 §9](../KC/kode-praktikum/jobsheet-02/Dokumentasi/09-css-footer.md) | Beginner | **3** — Menopang perhitungan layout, konsistensi dan Flexbox/Grid. | C01 |
| C03 | **Layout Flexbox**. Mengatur sumbu, perataan, gap dan wrapping navbar/header. | [JS02 §4](../KC/kode-praktikum/jobsheet-02/Dokumentasi/04-css-header-navbar-flexbox.md) | Intermediate | **4** — Fondasi navbar dan layout berulang lintas proyek. | C02 |
| C04 | **Layout Grid**. Membuat kartu statistik dengan kolom fr, gap dan aliran baris. | [JS02 §6](../KC/kode-praktikum/jobsheet-02/Dokumentasi/06-css-grid-kartu-statistik.md) | Intermediate | **4** — Fondasi dashboard dan responsive grid. | C02 |
| C05 | **Styling tabel dan state baris**. Mengatur border-collapse, padding, zebra stripe, hover dan pembeda tombol aksi. | [JS02 §7](../KC/kode-praktikum/jobsheet-02/Dokumentasi/07-css-tabel.md) | Beginner | **2** — Meningkatkan keterbacaan dengan lingkup lokal. | C01, H04 |
| C06 | **Styling form dan pesan**. Mengatur label blok, lebar/spacing kontrol, tombol dan kelas sukses/error. | [JS02 §8](../KC/kode-praktikum/jobsheet-02/Dokumentasi/08-css-form.md); [JS07 §6](../KC/kode-praktikum/jobsheet-07/Dokumentasi/06-css-flash-message.md) | Beginner | **2** — Pola styling lokal yang dipakai ulang pada form. | C02, H05 |
| C07 | **Viewport dan media query**. Memilih strategi responsive dan mengubah layout pada breakpoint yang ditetapkan. | [JS03 §1](../KC/kode-praktikum/jobsheet-03/Dokumentasi/01-konsep-dasar-responsive.md); [JS03 §2](../KC/kode-praktikum/jobsheet-03/Dokumentasi/02-perubahan-file-html.md); [JS03 §5](../KC/kode-praktikum/jobsheet-03/Dokumentasi/05-css-media-query-breakpoint.md) | Intermediate | **4** — Capaian wajib lintas halaman; keberadaan @media saja tidak cukup. | C03, C04 |
| C08 | **Overflow responsif**. Membatasi overflow pada wrapper agar tabel dapat digulir tanpa melebarkan halaman. | [JS03 §4](../KC/kode-praktikum/jobsheet-03/Dokumentasi/04-css-table-responsive.md) | Intermediate | **2** — Pelengkap responsive dengan satu pola yang spesifik. | C02, H04 |
| C09 | **Hamburger CSS berbasis checkbox**. Menghubungkan checkbox, label, :checked dan sibling combinator tanpa JS. | [JS03 §2](../KC/kode-praktikum/jobsheet-03/Dokumentasi/02-perubahan-file-html.md); [JS03 §3](../KC/kode-praktikum/jobsheet-03/Dokumentasi/03-css-hamburger-checkbox-hack.md) | Intermediate | **2** — Teknik lokal sebelum event JS, bukan pengganti KC event. | C01, C07, H05 |

### 4.4 Perancangan UI/UX

| ID | Nama dan deskripsi kompetensi | Sumber | Kesulitan | W dan alasan | Prasyarat |
|---|---|---|---|---|---|
| U01 | **Aktor dan user flow**. Merancang hak Tamu/Petugas serta alur pinjam/kembali dengan edge case. | [JS04 §1](../KC/kode-praktikum/jobsheet-04/Dokumentasi/01-konsep-uiux-design.md); [JS04 §3](../KC/kode-praktikum/jobsheet-04/Dokumentasi/03-user-flow-peminjaman-pengembalian.md); [JS04 §4](../KC/kode-praktikum/jobsheet-04/Dokumentasi/04-aktor-dan-otorisasi.md); [JS04 §5](../KC/kode-praktikum/jobsheet-04/Dokumentasi/05-keterhubungan-dengan-kode.md) | Intermediate | **3** — Menetapkan kebutuhan lintas modul; kualitas alur perlu penilaian ahli. | F01 |
| U02 | **Wireframe dan kesesuaian UI**. Merancang login/dashboard/pinjam/kembali/riwayat lalu menerjemahkan rancangan ke HTML. | [JS04 §2](../KC/kode-praktikum/jobsheet-04/Dokumentasi/02-cara-membaca-wireframe.md); [JS04 §5](../KC/kode-praktikum/jobsheet-04/Dokumentasi/05-keterhubungan-dengan-kode.md); [JS04 §6](../KC/kode-praktikum/jobsheet-04/Dokumentasi/06-rangkuman-latihan.md) | Intermediate | **3** — Menjembatani kebutuhan dan antarmuka, memerlukan kesesuaian desain. | U01, H05, C06 |

### 4.5 JavaScript

| ID | Nama dan deskripsi kompetensi | Sumber | Kesulitan | W dan alasan | Prasyarat |
|---|---|---|---|---|---|
| J01 | **Variabel, tipe dan operator JS**. Memakai let/const, tipe nilai dan operator untuk menghitung data buku. | [JS05 §4](../KC/kode-praktikum/jobsheet-05/Dokumentasi/04-js-hamburger-menu.md); [JS05 §6](../KC/kode-praktikum/jobsheet-05/Dokumentasi/06-js-filter-tabel.md); [JS05 §7](../KC/kode-praktikum/jobsheet-05/Dokumentasi/07-js-validasi-form.md) | Beginner | **2** — Fondasi implisit kode dosen, dapat diuji dengan fungsi kecil. | - |
| J02 | **Percabangan dan iterasi JS**. Memilih cabang dan mengiterasi koleksi untuk menghitung ketersediaan. | [JS05 §6](../KC/kode-praktikum/jobsheet-05/Dokumentasi/06-js-filter-tabel.md); [JS05 §7](../KC/kode-praktikum/jobsheet-05/Dokumentasi/07-js-validasi-form.md); [JS06 §4](../KC/kode-praktikum/jobsheet-06/Dokumentasi/04-js-fetch-render-buku.md) | Beginner | **3** — Menopang validasi, filter dan rendering. | J01 |
| J03 | **Fungsi, parameter dan scope JS**. Membagi init/helper menjadi fungsi dan menjaga state lokal. | [JS05 §1](../KC/kode-praktikum/jobsheet-05/Dokumentasi/01-konsep-dasar-javascript-dom.md); [JS05 §4](../KC/kode-praktikum/jobsheet-05/Dokumentasi/04-js-hamburger-menu.md); [JS05 §7](../KC/kode-praktikum/jobsheet-05/Dokumentasi/07-js-validasi-form.md); [JS06 §5](../KC/kode-praktikum/jobsheet-06/Dokumentasi/05-js-fetch-render-anggota.md) | Beginner | **3** — Pola fungsi berulang dan mendukung refactor buku/anggota. | J02 |
| J04 | **Array, object dan JSON**. Mengurai JSON, membaca properti dan mengolah koleksi buku/anggota. | [JS06 §1](../KC/kode-praktikum/jobsheet-06/Dokumentasi/01-konsep-dasar-fetch-json.md); [JS06 §3](../KC/kode-praktikum/jobsheet-06/Dokumentasi/03-data-json.md); [JS06 §5](../KC/kode-praktikum/jobsheet-06/Dokumentasi/05-js-fetch-render-anggota.md) | Beginner | **3** — Dasar pertukaran data dan fetch/render. | J03 |
| J05 | **Seleksi dan rendering DOM**. Memilih node, mengubah teks/class dan merender tabel dari data. | [JS05 §1](../KC/kode-praktikum/jobsheet-05/Dokumentasi/01-konsep-dasar-javascript-dom.md); [JS05 §7](../KC/kode-praktikum/jobsheet-05/Dokumentasi/07-js-validasi-form.md); [JS06 §4](../KC/kode-praktikum/jobsheet-06/Dokumentasi/04-js-fetch-render-buku.md) | Intermediate | **4** — Penghubung utama data dan UI pada hampir semua interaksi. | J03, J04, H04 |
| J06 | **Event listener dan state UI**. Memasang listener dan mengubah class/state antarklik tanpa reload. | [JS05 §1](../KC/kode-praktikum/jobsheet-05/Dokumentasi/01-konsep-dasar-javascript-dom.md); [JS05 §4](../KC/kode-praktikum/jobsheet-05/Dokumentasi/04-js-hamburger-menu.md) | Intermediate | **4** — Fondasi menu, form dan interaksi berikutnya. | J05 |
| J07 | **Validasi form client-side**. Memeriksa field, tahun/stok dan menampilkan/menghapus error inline. | [JS05 §7](../KC/kode-praktikum/jobsheet-05/Dokumentasi/07-js-validasi-form.md) | Intermediate | **4** — Menentukan umpan balik form; tidak menjamin validasi server. | J06, H05, J02 |
| J08 | **Filter tabel client**. Menyaring baris secara case-insensitive dan memulihkan hasil ketika input kosong. | [JS05 §6](../KC/kode-praktikum/jobsheet-05/Dokumentasi/06-js-filter-tabel.md); [JS05 §8](../KC/kode-praktikum/jobsheet-05/Dokumentasi/08-rangkuman-latihan.md) | Intermediate | **3** — Pemrosesan data khusus yang belum dipisah dari DOM/event lama. | J06, J04, H04 |
| J09 | **Konfirmasi dan delegasi event hapus**. Mendelegasikan event, mencari target/parent dan membatalkan aksi sesuai konfirmasi. | [JS05 §5](../KC/kode-praktikum/jobsheet-05/Dokumentasi/05-js-konfirmasi-hapus.md); [JS06 §6](../KC/kode-praktikum/jobsheet-06/Dokumentasi/06-js-event-delegation-hapus.md); [JS09 §4](../KC/kode-praktikum/jobsheet-09/Dokumentasi/04-js-update-hapus-confirm.md) | Intermediate | **3** — Diperlukan untuk tombol dinamis setelah fetch, berbeda dari listener statis. | J06, J05 |
| J10 | **Promise, async-await dan fetch**. Menunggu respons/json dan memeriksa status HTTP sebelum memakai data. | [JS06 §1](../KC/kode-praktikum/jobsheet-06/Dokumentasi/01-konsep-dasar-fetch-json.md); [JS06 §4](../KC/kode-praktikum/jobsheet-06/Dokumentasi/04-js-fetch-render-buku.md); [JS06 §7](../KC/kode-praktikum/jobsheet-06/Dokumentasi/07-menjalankan-dengan-server-lokal.md) | Intermediate | **4** — Capaian asinkron CPMK-3; salah await/status memutus data. | J04, J03, F01 |
| J11 | **Loading, error dan retry**. Mengelola UI selama request tertunda dan memulihkannya melalui finally. | [JS06 §1](../KC/kode-praktikum/jobsheet-06/Dokumentasi/01-konsep-dasar-fetch-json.md); [JS06 §2](../KC/kode-praktikum/jobsheet-06/Dokumentasi/02-perubahan-file-html.md); [JS06 §4](../KC/kode-praktikum/jobsheet-06/Dokumentasi/04-js-fetch-render-buku.md); [JS06 §8](../KC/kode-praktikum/jobsheet-06/Dokumentasi/08-rangkuman-latihan.md) | Intermediate | **3** — Melengkapi fetch pada cabang sukses/gagal yang nyata. | J10, J05 |

### 4.6 PHP dasar dan form

| ID | Nama dan deskripsi kompetensi | Sumber | Kesulitan | W dan alasan | Prasyarat |
|---|---|---|---|---|---|
| P01 | **Sintaks dan rendering PHP**. Memakai variabel/operator/kondisi/foreach PHP untuk menghasilkan HTML dari array. | [JS07 §1](../KC/kode-praktikum/jobsheet-07/Dokumentasi/01-konsep-dasar-php.md); [JS07 §5](../KC/kode-praktikum/jobsheet-07/Dokumentasi/05-list-php-render-dan-flash.md) | Beginner | **3** — Fondasi bahasa server sebelum form, session dan DB. | F01, H04 |
| P02 | **Include, template dan path PHP**. Memecah header/footer serta menghitung path relatif root/subfolder tanpa duplikasi output. | [JS07 §2](../KC/kode-praktikum/jobsheet-07/Dokumentasi/02-includes-header-footer.md) | Intermediate | **3** — Dipakai semua halaman; salah urutan/path merusak aset dan header HTTP. | P01, H03 |
| P03 | **Superglobal dan form handling**. Memilih GET/POST, membaca parameter dan membedakan parameter hilang dari nilai kosong. | [JS07 §1](../KC/kode-praktikum/jobsheet-07/Dokumentasi/01-konsep-dasar-php.md); [JS07 §4](../KC/kode-praktikum/jobsheet-07/Dokumentasi/04-proses-tambah-validasi-server.md); [JS09 §3](../KC/kode-praktikum/jobsheet-09/Dokumentasi/03-hapus-delete-data.md) | Intermediate | **4** — Menghubungkan kontrak form ke seluruh operasi server. | P01, H05, F01 |
| P04 | **Validasi server dan whitelist**. Memvalidasi tipe/rentang/panjang/field wajib serta pilihan kategori/role tanpa bergantung JS. | [JS07 §4](../KC/kode-praktikum/jobsheet-07/Dokumentasi/04-proses-tambah-validasi-server.md); [JS11 §5](../KC/kode-praktikum/jobsheet-11/Dokumentasi/05-audit-sql-injection-dan-checklist.md) | Intermediate | **5** — Mencegah masukan invalid dan manipulasi langsung request pada semua modul. | P03, P01 |
| P05 | **Session untuk state sementara**. Memulai session sebelum output dan menyimpan array data lintas request dalam satu sesi. | [JS07 §3](../KC/kode-praktikum/jobsheet-07/Dokumentasi/03-session-dan-alur-data.md); [JS07 §5](../KC/kode-praktikum/jobsheet-07/Dokumentasi/05-list-php-render-dan-flash.md) | Intermediate | **3** — Jembatan penyimpanan sebelum PostgreSQL dan dasar autentikasi. | P03, P04 |
| P06 | **Redirect dan flash sekali baca**. Menggunakan alur POST-redirect-GET serta flash yang dihapus setelah ditampilkan. | [JS07 §4](../KC/kode-praktikum/jobsheet-07/Dokumentasi/04-proses-tambah-validasi-server.md); [JS07 §5](../KC/kode-praktikum/jobsheet-07/Dokumentasi/05-list-php-render-dan-flash.md); [JS07 §6](../KC/kode-praktikum/jobsheet-07/Dokumentasi/06-css-flash-message.md) | Intermediate | **3** — Pola alur/error berulang pada CRUD dan autentikasi. | P05, P02 |

### 4.7 PostgreSQL dan CRUD

| ID | Nama dan deskripsi kompetensi | Sumber | Kesulitan | W dan alasan | Prasyarat |
|---|---|---|---|---|---|
| D01 | **Setup PostgreSQL dan PDO_PGSQL**. Menyiapkan layanan/port/ekstensi, database dan impor skema sesuai urutan. | [JS08 §3](../KC/kode-praktikum/jobsheet-08/Dokumentasi/03-persiapan-database.md); [JS08 §8](../KC/kode-praktikum/jobsheet-08/Dokumentasi/08-instalasi-postgresql-laragon.md) | Beginner | **2** — Prasyarat operasional, bukan bukti kemampuan query atau transaksi. | F02 |
| D02 | **ERD, DDL dan constraint dasar**. Memilih tipe/PK/UNIQUE/NOT NULL/default untuk tabel buku/anggota/users dan menjelaskan rancangan. | [JS08 §2](../KC/kode-praktikum/jobsheet-08/Dokumentasi/02-skema-database-sql.md); [JS10 §2](../KC/kode-praktikum/jobsheet-10/Dokumentasi/02-skema-users-dan-registrasi.md) | Intermediate | **4** — Fondasi persistensi/identitas untuk semua query berikutnya. | D01 |
| D03 | **Koneksi PDO dan penanganan error**. Membuat DSN PostgreSQL, mengatur exception dan mengelola kegagalan koneksi. | [JS08 §4](../KC/kode-praktikum/jobsheet-08/Dokumentasi/04-koneksi-pdo.md); [JS13 §2](../KC/kode-praktikum/jobsheet-13/Dokumentasi/02-config-dan-koneksi.md) | Intermediate | **3** — Penghubung semua operasi PHP-DB, tetapi lingkup koneksi terlokalisasi. | D01, P01 |
| D04 | **INSERT berparameter dan RETURNING**. Memisahkan nilai input dari SQL serta menyimpan data dengan ID hasil PostgreSQL. | [JS08 §5](../KC/kode-praktikum/jobsheet-08/Dokumentasi/05-insert-prepared-statement.md) | Intermediate | **5** — Titik persistensi kritis; fondasi integritas dan pencegahan SQLi. | D02, D03, P04 |
| D05 | **SELECT, ORDER BY dan COUNT**. Membaca data terurut, menangani hasil kosong dan menghitung statistik nyata. | [JS08 §6](../KC/kode-praktikum/jobsheet-08/Dokumentasi/06-membaca-data-select.md); [JS12 §6](../KC/kode-praktikum/jobsheet-12/Dokumentasi/06-rangkuman-latihan.md) | Intermediate | **4** — Inti katalog/dashboard dan verifikasi persistensi. | D03, D02, P01 |
| D06 | **SELECT by ID dan UPDATE**. Mengisi form edit dari record lalu memperbarui tepat satu entitas yang dipilih. | [JS09 §2](../KC/kode-praktikum/jobsheet-09/Dokumentasi/02-edit-update-data.md) | Intermediate | **4** — Operasi CRUD utama dengan risiko mengubah record keliru. | D04, D05, P03 |
| D07 | **DELETE melalui POST**. Menghapus record berdasarkan ID dengan pemeriksaan method dan query berparameter. | [JS09 §3](../KC/kode-praktikum/jobsheet-09/Dokumentasi/03-hapus-delete-data.md); [JS09 §4](../KC/kode-praktikum/jobsheet-09/Dokumentasi/04-js-update-hapus-confirm.md) | Intermediate | **4** — Operasi destruktif memerlukan kontrak aksi yang tepat dan integritas. | D04, D05, P03 |
| D08 | **Pencarian server dengan ILIKE**. Mencari seluruh dataset secara case-insensitive dengan parameter keyword. | [JS09 §5](../KC/kode-praktikum/jobsheet-09/Dokumentasi/05-pagination-dan-pencarian-server.md) | Intermediate | **3** — Berbeda dari filter client yang hanya melihat baris termuat. | D05, D04, P03 |
| D09 | **Pagination LIMIT/OFFSET**. Menghitung offset/totalPages, bind integer dan mempertahankan query pencarian di navigasi. | [JS09 §5](../KC/kode-praktikum/jobsheet-09/Dokumentasi/05-pagination-dan-pencarian-server.md); [JS09 §6](../KC/kode-praktikum/jobsheet-09/Dokumentasi/06-css-pendukung.md) | Intermediate | **3** — Menggabungkan pembatasan query dan state navigasi pada dataset besar. | D08, J02 |

### 4.8 Autentikasi dan otorisasi

| ID | Nama dan deskripsi kompetensi | Sumber | Kesulitan | W dan alasan | Prasyarat |
|---|---|---|---|---|---|
| A01 | **Registrasi dan password hashing**. Membuat user unik, memvalidasi input dan menyimpan password_hash, bukan plaintext. | [JS10 §1](../KC/kode-praktikum/jobsheet-10/Dokumentasi/01-konsep-dasar-autentikasi.md); [JS10 §2](../KC/kode-praktikum/jobsheet-10/Dokumentasi/02-skema-users-dan-registrasi.md) | Intermediate | **5** — Identitas dan kerahasiaan kredensial adalah fungsi kritis. | D04, P04 |
| A02 | **Login dan identitas sesi**. Memverifikasi kredensial lalu menyimpan identitas/role session hanya pada login sukses. | [JS10 §3](../KC/kode-praktikum/jobsheet-10/Dokumentasi/03-login-dan-logout.md) | Intermediate | **5** — Menentukan autentikasi semua fitur terlindungi. | A01, D05, P05 |
| A03 | **Logout dan penghentian sesi**. Menghapus state autentikasi sehingga cookie/session lama tidak memberi akses berikutnya. | [JS10 §3](../KC/kode-praktikum/jobsheet-10/Dokumentasi/03-login-dan-logout.md) | Intermediate | **4** — Menutup siklus identitas; kegagalan dapat menyisakan akses tanpa disadari. | A02 |
| A04 | **Guard, role dan navbar dinamis**. Memeriksa akses di server sebelum output serta menyesuaikan menu Tamu/Petugas/admin. | [JS10 §4](../KC/kode-praktikum/jobsheet-10/Dokumentasi/04-guard-auth-php.md); [JS10 §5](../KC/kode-praktikum/jobsheet-10/Dokumentasi/05-navbar-dinamis-dan-css.md); [JS10 §6](../KC/kode-praktikum/jobsheet-10/Dokumentasi/06-rangkuman-latihan.md); [JS04 §4](../KC/kode-praktikum/jobsheet-04/Dokumentasi/04-aktor-dan-otorisasi.md) | Advanced | **5** — Batas akses kritis; menyembunyikan tombol saja tidak melindungi endpoint. | A02, P02, U01 |

### 4.9 Keamanan web

| ID | Nama dan deskripsi kompetensi | Sumber | Kesulitan | W dan alasan | Prasyarat |
|---|---|---|---|---|---|
| S01 | **Audit SQL injection**. Menemukan interpolasi input pada query dan membuktikan data tetap menjadi parameter. | [JS11 §5](../KC/kode-praktikum/jobsheet-11/Dokumentasi/05-audit-sql-injection-dan-checklist.md); [JS08 §5](../KC/kode-praktikum/jobsheet-08/Dokumentasi/05-insert-prepared-statement.md) | Advanced | **5** — Serangan query dapat melewati autentikasi atau merusak data. | D04, D08, A02 |
| S02 | **Escaping output HTML dan atribut**. Menggunakan htmlspecialchars/ENT_QUOTES pada konteks teks dan atribut yang menerima data tak tepercaya. | [JS11 §2](../KC/kode-praktikum/jobsheet-11/Dokumentasi/02-xss-dan-fungsi-e.md) | Advanced | **5** — Data tersimpan dan reflected input dapat menjalankan script bagi pengguna lain. | P01, D05, H05 |
| S03 | **CSRF token per session**. Membuat token acak, menyisipkan form dan memverifikasi hash_equals sebelum mutasi. | [JS11 §3](../KC/kode-praktikum/jobsheet-11/Dokumentasi/03-csrf-dan-token.md) | Advanced | **5** — Melindungi mutasi menggunakan identitas sesi pengguna. | A02, P03, D07 |
| S04 | **Pencegahan session fixation**. Meregenerasi ID sesi tepat setelah login sukses dan menonaktifkan ID lama. | [JS11 §4](../KC/kode-praktikum/jobsheet-11/Dokumentasi/04-session-fixation.md) | Advanced | **4** — Perubahan kecil dengan dampak besar pada keamanan sesi. | A02, P05 |
| S05 | **Audit keamanan berbasis bukti**. Menyusun checklist kerentanan, lokasi kode, before/after dan prosedur pengujian yang dapat diulang. | [JS11 §1](../KC/kode-praktikum/jobsheet-11/Dokumentasi/01-konsep-dasar-keamanan-web.md); [JS11 §5](../KC/kode-praktikum/jobsheet-11/Dokumentasi/05-audit-sql-injection-dan-checklist.md); [JS11 §6](../KC/kode-praktikum/jobsheet-11/Dokumentasi/06-rangkuman-latihan.md) | Advanced | **3** — Mengintegrasikan bukti keamanan; kualitas audit memerlukan penilaian manusia. | S01, S02, S03, S04, P04 |

### 4.10 Integrasi data dan pengujian

| ID | Nama dan deskripsi kompetensi | Sumber | Kesulitan | W dan alasan | Prasyarat |
|---|---|---|---|---|---|
| I01 | **Relasi FK dan tanggal peminjaman**. Merancang tabel peminjaman yang mereferensikan buku/anggota dengan tanggal/status yang tepat. | [JS12 §1](../KC/kode-praktikum/jobsheet-12/Dokumentasi/01-konsep-dasar-integrasi-dan-transaksi.md); [JS12 §2](../KC/kode-praktikum/jobsheet-12/Dokumentasi/02-skema-peminjaman-dan-relasi.md) | Intermediate | **4** — Fondasi relasi lintas entitas dan konsistensi histori. | D02 |
| I02 | **Transaksi atomik dan rollback**. Menggabungkan pencatatan pinjam dan perubahan stok sebagai satu transaksi sukses/gagal. | [JS12 §1](../KC/kode-praktikum/jobsheet-12/Dokumentasi/01-konsep-dasar-integrasi-dan-transaksi.md); [JS12 §3](../KC/kode-praktikum/jobsheet-12/Dokumentasi/03-peminjaman-baru-dan-transaction.md) | Advanced | **5** — Mencegah histori dan stok berbeda ketika satu langkah gagal. | I01, D04, D06, P04 |
| I03 | **Row locking dan konkurensi stok**. Mengunci row terkait dan memeriksa stok dalam transaksi agar dua peminjam tidak memakai stok sama. | [JS12 §3](../KC/kode-praktikum/jobsheet-12/Dokumentasi/03-peminjaman-baru-dan-transaction.md); [JS12 §6](../KC/kode-praktikum/jobsheet-12/Dokumentasi/06-rangkuman-latihan.md) | Advanced | **5** — Race condition menyebabkan stok negatif/overselling dan membutuhkan bukti multi-koneksi. | I02 |
| I04 | **Pengembalian tepat sekali**. Memeriksa status/lock pinjaman, mencatat tanggal kembali dan menambah stok sekali secara atomik. | [JS12 §4](../KC/kode-praktikum/jobsheet-12/Dokumentasi/04-pengembalian-buku.md) | Advanced | **5** — Mencegah stok bertambah ganda dan status tidak konsisten. | I02, I03 |
| I05 | **JOIN histori dan filter anggota**. Menggabungkan data relasional dengan alias/ON serta menyaring histori untuk anggota terpilih. | [JS12 §5](../KC/kode-praktikum/jobsheet-12/Dokumentasi/05-riwayat-peminjaman-join.md); [JS12 §4](../KC/kode-praktikum/jobsheet-12/Dokumentasi/04-pengembalian-buku.md) | Intermediate | **4** — Capaian query relasional utama untuk laporan lintas entitas. | I01, D05, D08 |
| I06 | **Aturan bisnis keterlambatan**. Menghitung selisih tanggal dan menolak pinjam baru bagi anggota dengan pinjaman aktif >14 hari. | [JS12 §6](../KC/kode-praktikum/jobsheet-12/Dokumentasi/06-rangkuman-latihan.md); [RPS](../KC/RPS-Desain-Pemrograman-Web.md) | Advanced | **4** — Aturan domain yang menggabungkan query, tanggal dan validasi; tugas mandiri belum diimplementasikan contoh. | I02, I05, P04 |
| I07 | **Pengujian integrasi end-to-end**. Merancang dan menjalankan skenario lintas modul serta memeriksa UI/statistik terhadap state DB. | [JS12 §6](../KC/kode-praktikum/jobsheet-12/Dokumentasi/06-rangkuman-latihan.md); [JS13 §4](../KC/kode-praktikum/jobsheet-13/Dokumentasi/04-rangkuman-latihan.md) | Advanced | **4** — Memastikan fitur yang lulus sendiri tetap konsisten sebagai sistem utuh. | I04, I05, S05, A03 |

### 4.11 Konfigurasi, deployment dan dokumentasi

| ID | Nama dan deskripsi kompetensi | Sumber | Kesulitan | W dan alasan | Prasyarat |
|---|---|---|---|---|---|
| O01 | **Konfigurasi environment**. Memisahkan DB config dari kode, membaca getenv/default dan menggunakan konfigurasi lintas environment. | [JS13 §1](../KC/kode-praktikum/jobsheet-13/Dokumentasi/01-konsep-dasar-deployment-config.md); [JS13 §2](../KC/kode-praktikum/jobsheet-13/Dokumentasi/02-config-dan-koneksi.md) | Intermediate | **4** — Menentukan portabilitas dan mencegah kredensial produksi tertanam di source. | D03, P02 |
| O02 | **Deployment dan pemulihan skema**. Menjalankan aplikasi pada environment baru/root/subfolder dan mengimpor ekspor skema dengan urutan benar. | [JS13 §3](../KC/kode-praktikum/jobsheet-13/Dokumentasi/03-dokumentasi-proyek-final.md); [JS13 §4](../KC/kode-praktikum/jobsheet-13/Dokumentasi/04-rangkuman-latihan.md) | Advanced | **3** — Tahap operasional akhir dengan kebutuhan khusus di luar editor browser. | O01, D02, I01, I07 |
| O03 | **Dokumentasi dan demonstrasi teknis**. Menyusun README/ERD/matriks role/manual dan menjelaskan keputusan teknis berdasarkan implementasi. | [JS13 §3](../KC/kode-praktikum/jobsheet-13/Dokumentasi/03-dokumentasi-proyek-final.md); [JS13 §4](../KC/kode-praktikum/jobsheet-13/Dokumentasi/04-rangkuman-latihan.md); [RPS](../KC/RPS-Desain-Pemrograman-Web.md) | Intermediate | **3** — Diperlukan untuk instalasi ulang dan evaluasi produk, dinilai lewat artefak/penjelasan. | U01, O01 |

### 4.12 Proses pembelajaran dan kontribusi

| ID | Nama dan deskripsi kompetensi | Sumber | Kesulitan | W dan alasan | Prasyarat |
|---|---|---|---|---|---|
| T01 | **Kontribusi individu dan refleksi**. Mencatat kontribusi, keputusan, perbaikan serta refleksi yang dapat dijelaskan per mahasiswa. | [RPS](../KC/RPS-Desain-Pemrograman-Web.md); [JS13 §4](../KC/kode-praktikum/jobsheet-13/Dokumentasi/04-rangkuman-latihan.md) | Intermediate | **2** — CPMK-6 wajib dicakup tetapi bukan probabilitas kemampuan coding dari satu test case. | - |

### 4.13 Pengayaan opsional: Bootstrap

| ID | Nama dan deskripsi kompetensi | Sumber | Kesulitan | W dan alasan | Prasyarat |
|---|---|---|---|---|---|
| B01 | **Grid dan card Bootstrap**. Memakai container/row/col-* dan card serta menyesuaikan tema tanpa kehilangan perilaku responsif. | [JSB §1](../KC/kode-praktikum/jobsheet-03-bootstrap/Dokumentasi/01-konsep-dasar-bootstrap.md); [JSB §4](../KC/kode-praktikum/jobsheet-03-bootstrap/Dokumentasi/04-grid-dan-card.md); [JSB §6](../KC/kode-praktikum/jobsheet-03-bootstrap/Dokumentasi/06-rangkuman-dan-perbandingan.md) | Intermediate | **2** — Alternatif framework eksplisit, tidak menggantikan pemahaman Grid native. | C04, C07, H02 |
| B02 | **Navbar collapse Bootstrap**. Menghubungkan toggler, target collapse dan atribut aksesibilitas dengan komponen Bootstrap. | [JSB §2](../KC/kode-praktikum/jobsheet-03-bootstrap/Dokumentasi/02-perubahan-file-html.md); [JSB §3](../KC/kode-praktikum/jobsheet-03-bootstrap/Dokumentasi/03-navbar-responsive-bootstrap.md) | Intermediate | **2** — Pola komponen framework spesifik yang berbeda dari menulis event handler sendiri. | B01, H05 |
| B03 | **Utility tabel dan form Bootstrap**. Memilih class table/form/button yang tepat dan mempertahankan semantik/label saat styling framework. | [JSB §5](../KC/kode-praktikum/jobsheet-03-bootstrap/Dokumentasi/05-tabel-dan-form-bootstrap.md); [JSB §6](../KC/kode-praktikum/jobsheet-03-bootstrap/Dokumentasi/06-rangkuman-dan-perbandingan.md) | Beginner | **2** — Transfer styling dengan konvensi class, sebagai pengayaan opsional. | B01, H04, H05 |

### 4.14 Pengayaan opsional: latihan lanjutan

| ID | Nama dan deskripsi kompetensi | Sumber | Kesulitan | W dan alasan | Prasyarat |
|---|---|---|---|---|---|
| X01 | **Impor data JSON ke PostgreSQL**. Membaca fixture JSON, memvalidasi record dan memasukkannya ke tabel melalui PHP. | [JS08 §7](../KC/kode-praktikum/jobsheet-08/Dokumentasi/07-rangkuman-latihan.md); [JS06 §3](../KC/kode-praktikum/jobsheet-06/Dokumentasi/03-data-json.md) | Advanced | **2** — Latihan tambahan transfer antarformat, bukan syarat jalur utama. | J04, D04, P04, I02 |
| X02 | **Cookie persisten dan risikonya**. Membedakan session biasa dan cookie berumur panjang serta merancang remember-me yang dapat dicabut. | [JS10 §6](../KC/kode-praktikum/jobsheet-10/Dokumentasi/06-rangkuman-latihan.md) | Advanced | **2** — Ide riset latihan tambahan; repository belum menyediakan implementasi aman siap pakai. | A03, S04 |
| X03 | **Pembatasan kegagalan login**. Menghitung kegagalan dan menerapkan batas/jendela waktu yang ditentukan pada latihan. | [JS10 §6](../KC/kode-praktikum/jobsheet-10/Dokumentasi/06-rangkuman-latihan.md) | Advanced | **2** — Pengayaan pertahanan login yang belum wajib pada snapshot kurikulum utama. | A02, P05 |
| X04 | **CSP sebagai pertahanan tambahan**. Menyusun kebijakan CSP minimal dan menjelaskan hubungannya dengan escaping output. | [JS11 §6](../KC/kode-praktikum/jobsheet-11/Dokumentasi/06-rangkuman-latihan.md) | Advanced | **2** — Tugas eksplorasi opsional; CSP tidak menggantikan pencegahan XSS utama. | S02, F01 |

## 5. Contoh tugas, kriteria keberhasilan, dan rancangan test case

Kontrak fixture, nama fungsi, selector dan pesan pada tabel berikut adalah **contoh authoring yang diusulkan**. Perbedaan dari contoh dosen harus dinyatakan pada instruksi soal. Kasus negatif dijalankan hanya pada proyek uji/fixture sendiri. Bukti hasil asesmen eksternal tidak boleh dipalsukan menjadi hasil tes DOM.

### 5.1 Fondasi web dan tool

| ID | Contoh tugas live coding/artefak | Kriteria keberhasilan dan automated test cases yang diusulkan | Metode |
|---|---|---|---|
| F01 | Lengkapi handler JS untuk fixture status HTTP lalu jelaskan diagram request form ke PHP. | T1 status 200 memakai data dan 404 masuk cabang gagal; T2 rubrik menempatkan PHP/DB di server dan DOM di browser; T3 jelaskan kendala file:// pada fetch. Hasil JS bukan bukti seluruh kompetensi konsep. | JS+RV |
| F02 | Perbaiki path script pada proyek fixture; tulis langkah server dan catatan perubahan. | T1 aset ditemukan pada root/subfolder; T2 tunjukkan error awal dan console/Network setelah perbaikan; T3 logbook/commit dapat dijelaskan. Tidak menguji branching/CI yang tidak diajarkan. | OPS+RV |

### 5.2 HTML

| ID | Contoh tugas live coding/artefak | Kriteria keberhasilan dan automated test cases yang diusulkan | Metode |
|---|---|---|---|
| H01 | Buat dokumen Beranda lengkap dengan judul tab dan heading utama. | T1 doctype dan satu struktur html/head/body valid; T2 title/charset di head; T3 heading di body. Periksa sumber asli/validator, bukan head milik wrapper sandbox. | RAW |
| H02 | Susun header/nav/main/footer Beranda dengan navigasi bernama. | T1 satu main dan landmark wajib; T2 hierarki heading mengikuti konten; T3 navigasi bernama dan kontrol berlabel. Rubrik memeriksa makna/keyboard; keberadaan tag bukan bukti WCAG penuh. | BR+RV |
| H03 | Lengkapi menu pada buku/list.html dengan tautan Beranda dan Anggota. | T1 teks tautan benar; T2 resolver base /simpus/buku/list.html menuju /simpus/index.html dan /simpus/anggota/list.html; T3 tidak ada path mesin lokal. Navigasi nyata butuh fixture terpisah karena sandbox mencegah klik pindah halaman. | BR+RAW |
| H04 | Buat tabel 5 buku: Judul, Pengarang, Tahun, Stok, Aksi. | T1 lima header dan lima baris fixture; T2 tiap baris memiliki lima sel dengan pasangan data benar; T3 tabel kosong tetap memiliki header dan struktur table yang sah. | BR |
| H05 | Buat form judul, pengarang, tahun, isbn, stok, kategori dan tombol simpan. | T1 name/id/label/pilihan cocok kontrak; T2 required, stok min=0 dan rentang tahun benar; T3 validitas membedakan kosong/negatif/valid, nomor anggota bertipe text. Tidak mengirim POST nyata dari sandbox. | BR |

### 5.3 CSS native dan responsive

| ID | Contoh tugas live coding/artefak | Kriteria keberhasilan dan automated test cases yang diusulkan | Metode |
|---|---|---|---|
| C01 | Beri warna berbeda pada link navbar dan link umum. | T1 navbar mendapat warna khusus; T2 link main tetap warna umum; T3 perubahan urutan aturan berbeda spesifisitas tidak merusak hasil. Larangan !important harus disebut dalam soal. | BR |
| C02 | Buat kartu dengan total lebar 240px serta main terpusat berbatas maksimum. | T1 bounding width 240px dengan toleransi 1px; T2 padding/border/box-sizing benar; T3 font/line-height diwariskan dan main tidak melebihi kontainer fixture. | BR |
| C03 | Susun logo dan menu dengan Flexbox yang membungkus saat ruang sempit. | T1 computed display flex; T2 perataan/gap dan posisi sesuai; T3 kontainer fixture sempit menghasilkan wrap tanpa item bertumpuk. Ukuran kontainer dikendalikan tes. | BR |
| C04 | Susun tiga kartu statistik dalam tiga kolom seimbang. | T1 computed display grid; T2 tiga kolom berlebar seimbang dengan toleransi 1px; T3 kartu keempat mengalir ke baris berikutnya. Terima sintaks ekuivalen, bukan hanya repeat(). | BR |
| C05 | Style tabel buku dengan zebra stripe dan pembeda Edit/Hapus. | T1 border-collapse/padding sesuai; T2 warna baris genap/ganjil berbeda; T3 VP menguji hover dan tombol Detail tambahan tidak mengubah makna warna aksi. | BR+VP |
| C06 | Style form buku/anggota dengan label di atas kontrol dan pesan jelas. | T1 label display block dan kontrol tidak melebihi parent; T2 spacing konsisten; T3 error/sukses dibedakan melalui teks serta gaya. Keterbacaan/kontras perlu rubrik jika belum ada evaluatornya. | BR+RV |
| C07 | Buat grid 3/2/1 kolom desktop/tablet/mobile dan meta viewport. | T1 RAW memeriksa viewport pada sumber; T2 VP 375/768/1280px memeriksa 1/2/3 kolom sesuai kontrak; T3 uji 479/480/481 dan 767/768/769px. Soal menetapkan hasil tepat pada batas. | RAW+VP |
| C08 | Buat wrapper tabel horizontal-scroll di layar kecil. | T1 overflow-x auto/scroll; T2 fixture lebar menghasilkan scrollWidth > clientWidth pada wrapper; T3 VP 375px memastikan halaman tidak ikut overflow dan semua kolom dapat dicapai. | BR+VP |
| C09 | Buat menu CSS-only yang tersembunyi di mobile dan selalu tampil di desktop. | T1 VP mobile: klik label membuka menu; T2 uncheck menutupnya; T3 desktop tampil tanpa bergantung checkbox dan for/id sesuai. | BR+VP |

### 5.4 Perancangan UI/UX

| ID | Contoh tugas live coding/artefak | Kriteria keberhasilan dan automated test cases yang diusulkan | Metode |
|---|---|---|---|
| U01 | Tulis flow Markdown lalu prototipe langkah peminjaman berdasarkan aktor. | T1 lint artefak memastikan aktor/langkah/cabang tercantum; T2 RV memeriksa Tamu tidak memutasi data dan stok habis ditangani; T3 peserta menjelaskan pengembalian/tunggakan. Prototipe tidak membuktikan guard server. | RV+BR |
| U02 | Buat wireframe lima layar lalu implementasikan satu prototipe HTML. | T1 BR memeriksa kontrol/label wajib; T2 RV memeriksa kelengkapan lima layar; T3 istilah, urutan dan umpan balik sesuai flow. Lulus DOM tidak otomatis lulus desain. | BR+RV |

### 5.5 JavaScript

| ID | Contoh tugas live coding/artefak | Kriteria keberhasilan dan automated test cases yang diusulkan | Metode |
|---|---|---|---|
| J01 | Buat hitungTotal(stok,harga) sesuai kontrak input numerik. | T1 (3,10000) menjadi 30000; T2 stok 0 menjadi 0; T3 nilai negatif/nonangka ditolak sesuai kontrak. Tambah AS bila bentuk deklarasi tertentu merupakan target. | JS |
| J02 | Buat jumlahTersedia(daftar) untuk stok >0 memakai iterasi. | T1 stok [0,1,2] menghasilkan 2; T2 [] menghasilkan 0; T3 stok negatif tidak dihitung. AS diperlukan bila penggunaan loop adalah syarat; keluaran saja dapat di-hardcode. | JS+AS |
| J03 | Buat pembuatFilter(kunci) yang mengembalikan pencocok tanpa variabel global tambahan. | T1 filter judul/nama bekerja pada fixture berbeda; T2 pemanggilan berulang stabil; T3 AS/tes global mendeteksi kebocoran scope. Kontrak ekspor fungsi untuk Worker dinyatakan pada soal. | JS+AS |
| J04 | Buat ringkasBuku(jsonText) yang mengembalikan judul dan total stok. | T1 dua buku stok 2/3 menghasilkan total 5 dan judul benar; T2 [] menghasilkan [] dan 0; T3 JSON rusak/nonarray ditangani sesuai kontrak. | JS |
| J05 | Buat renderBuku(data,tbody) yang dapat dipanggil ulang tanpa duplikasi. | T1 dua object menjadi dua baris benar; T2 render ulang mengganti isi dan [] memberi state kosong; T3 markup dalam judul tampil sebagai teks pada kontrak aman usulan. textContent adalah penyempurnaan terhadap innerHTML contoh. | BR |
| J06 | Buat tombol toggle nav-open dan aria-expanded. | T1 klik membuka menu; T2 klik kedua menutup dan memperbarui aria-expanded; T3 init tanpa elemen target tidak error. aria-expanded adalah perincian aksesibilitas soal usulan. | BR |
| J07 | Validasi judul/pengarang, tahun 1900-2026 dan stok integer nonnegatif. | T1 kosong/spasi, 1899/2027 dan -1 gagal per field; T2 batas 1900/2026 serta 0 valid; T3 perbaikan membersihkan error. Tes preventDefault mahasiswa harus terisolasi karena harness sendiri selalu membatalkan submit. | BR+MO |
| J08 | Tambahkan filter judul real-time; counter hasil sebagai variasi. | T1 web cocok WEB/Web; T2 tanpa kecocokan semua baris data tersembunyi; T3 input kosong memulihkan semua dan header tidak tersaring. Kolom sasaran dinyatakan dalam soal. | BR |
| J09 | Buat handler delegasi hapus lalu variasi submit form tanpa request server. | T1 tombol yang muncul sesudah init bekerja saat confirmer=true; T2 false mempertahankan baris; T3 klik child tombol bekerja dan klik luar diabaikan. Confirmer diinjeksi untuk menghindari dialog modal. | BR+MO |
| J10 | Buat ambilBuku(fetcher,url) dengan fetcher injeksi, tanpa jaringan nyata. | T1 mock mencatat URL dan dua buku diperoleh setelah await respons/json; T2 ok=false/404 ditolak; T3 network rejection dan JSON rusak ditangani. Tidak menilai kemampuan membuat server. | MO+JS |
| J11 | Buat muatDaftar(fetcher) dengan loading, error dan Muat Ulang. | T1 deferred Promise membuat loading terlihat; T2 resolve menampilkan data dan menyembunyikan loading; T3 rejection menyembunyikan loading, lalu retry sukses mengganti error tanpa duplikasi. Hindari delay wall-clock tetap. | MO+BR |

### 5.6 PHP dasar dan form

| ID | Contoh tugas live coding/artefak | Kriteria keberhasilan dan automated test cases yang diusulkan | Metode |
|---|---|---|---|
| P01 | Tulis fungsi PHP renderDaftar($data) untuk menampilkan daftar buku. | T1 php -l lolos; T2 dua/zero buku menghasilkan HTML sesuai fixture; T3 variabel tidak tersedia tidak memunculkan notice. Tes sintaks saja tidak cukup; eksekusi hanya di lingkungan PHP terisolasi. | PHP |
| P02 | Susun header/footer bersama untuk index.php dan buku/list.php. | T1 kedua halaman memiliki tepat satu landmark wajib; T2 aset/menu benar di root dan /simpus/; T3 tidak ada output sebelum operasi header ketika redirect diperlukan. Uji lewat server fixture, bukan preview HTML. | PHP+HTTP |
| P03 | Buat endpoint proses Tambah Buku yang menerima POST dan menolak method yang tidak diizinkan. | T1 POST valid mencapai handler; T2 GET tidak memutasi data; T3 parameter hilang/array tak terduga ditangani tanpa warning. Status/redirect untuk penolakan ditetapkan pada soal. | HTTP |
| P04 | Tulis validasi PHP buku yang tetap bekerja ketika request dikirim tanpa JS. | T1 kosong, string numerik tak sah, stok negatif/pecahan dan tahun di luar kontrak ditolak; T2 batas sah diterima; T3 kategori/role di luar whitelist dan string terlalu panjang tidak tersimpan. Sanitasi tidak menggantikan validasi. | PHP+HTTP |
| P05 | Simpan buku ke session lalu tampilkan di list.php tanpa DB. | T1 dua request dengan cookie jar sama mempertahankan data; T2 cookie jar berbeda tidak melihat data sesi lain; T3 setelah session dihapus data sementara hilang. Tidak menyimpulkan persistensi DB dari session. | HTTP |
| P06 | Sesudah simpan, redirect ke daftar dan tampilkan pesan sekali. | T1 respons POST memiliki Location benar sebelum body; T2 GET pertama menampilkan flash, GET berikutnya tidak; T3 refresh GET tidak menambah entri baru. Kontrak ini bukan jaminan idempotensi seluruh POST. | HTTP |

### 5.7 PostgreSQL dan CRUD

| ID | Contoh tugas live coding/artefak | Kriteria keberhasilan dan automated test cases yang diusulkan | Metode |
|---|---|---|---|
| D01 | Pada lab terisolasi, lengkapi konfigurasi dan perintah setup database fixture. | T1 driver pdo_pgsql terdeteksi; T2 database/tabel fixture ada dan koneksi uji berhasil; T3 diagnosis port/driver salah dapat dijelaskan tanpa mengubah service/data utama. Pemeriksaan environment dicatat sebagai bukti OPS. | OPS+RV |
| D02 | Tulis CREATE TABLE buku dan anggota sesuai kontrak kebutuhan. | T1 katalog DB menunjukkan tipe/PK/default benar; T2 no_anggota duplikat dan field wajib NULL ditolak; T3 stok default 0 dan ERD sesuai tabel. Normalisasi diperiksa RV; CHECK tambahan hanya diwajibkan jika ditetapkan soal. | PG+RV |
| D03 | Buat koneksi.php yang membaca konfigurasi fixture dan menghasilkan PDO. | T1 driver pgsql tersambung ke DB fixture benar; T2 host/credential salah memberi error terkendali; T3 detail kredensial tidak bocor ke output pengguna pada kontrak usulan. Jangan menyalin die(exception) sebagai standar keamanan produksi. | PHP+PG |
| D04 | Simpan buku lewat prepare/execute dan kembalikan ID dengan RETURNING. | T1 data valid menjadi tepat satu row dan ID sesuai; T2 judul mengandung apostrof disimpan utuh; T3 kegagalan UNIQUE tidak menyisipkan data parsial dan pesan terkendali. AS memastikan input tidak dikonkatenasi ke SQL. | PHP+PG+AS |
| D05 | Tampilkan buku terbaru dan total buku/anggota dari DB fixture. | T1 urutan ID menurun benar; T2 tabel kosong menghasilkan pesan dan count 0; T3 INSERT dari koneksi lain mengubah count/daftar pada request berikutnya. Buktikan data bertahan melewati sesi browser. | PG+HTTP |
| D06 | Implementasikan edit buku berdasarkan ID berparameter. | T1 form berisi data record sasaran; T2 update mengubah hanya ID itu dan row lain tetap; T3 ID tidak ada atau input invalid menghasilkan penolakan tanpa update massal. | HTTP+PG |
| D07 | Buat hapus.php untuk Buku dan variasi Anggota memakai POST. | T1 GET tidak menghapus; T2 POST valid menghapus tepat ID sasaran; T3 ID hilang/tidak ada dan record terikat FK ditangani tanpa menghapus record lain. Konfirmasi JS bukan kontrol keamanan server. | HTTP+PG |
| D08 | Implementasikan pencarian judul via GET q dan ILIKE :kw. | T1 kata web cocok variasi huruf di semua halaman fixture; T2 keyword kosong dan tanpa hasil sesuai kontrak; T3 apostrof diperlakukan sebagai data, bukan SQL. Kebijakan wildcard %/_ dijelaskan pada soal. | PG+HTTP |
| D09 | Tampilkan fixture 12 buku dengan perPage=5 dan link pencarian tetap. | T1 halaman 1/2/3 berisi 5/5/2 row tanpa duplikasi dengan urutan stabil; T2 page 0/negatif dinormalisasi sesuai kontrak; T3 filter menyesuaikan totalPages dan link mempertahankan q ter-encode. Jangan mengunci 5 jika soal memilih 10. | PG+HTTP |

### 5.8 Autentikasi dan otorisasi

| ID | Contoh tugas live coding/artefak | Kriteria keberhasilan dan automated test cases yang diusulkan | Metode |
|---|---|---|---|
| A01 | Implementasikan registrasi petugas dengan username unik. | T1 stored hash berbeda dari password dan password_verify benar; T2 password salah gagal verify; T3 username duplikat/field invalid tidak membuat user tambahan dan role tidak dapat dinaikkan lewat parameter. Bukan pencocokan string hash yang berubah karena salt. | HTTP+PG |
| A02 | Buat proses_login.php dengan password_verify dan redirect sukses/gagal. | T1 kredensial benar membuat session user_id dan redirect; T2 password salah/user tidak ada tidak membuat sesi terautentikasi; T3 pesan kegagalan sesuai kontrak umum. Regenerasi ID sesi dinilai terpisah pada S04. | HTTP+PG |
| A03 | Implementasikan logout lalu coba kembali mengakses halaman terlindungi. | T1 setelah logout tidak ada user_id aktif; T2 cookie lama tidak memberi akses CRUD; T3 login ulang sah tetap bekerja. Header cookie dan state diuji HTTP, bukan sekadar hilangnya nama di navbar. | HTTP |
| A04 | Lindungi CRUD dan batasi Hapus Anggota untuk admin sebagai tugas mandiri. | T1 Tamu ditolak/redirect pada URL proses langsung dan guard bekerja sebelum koneksi DB; T2 petugas biasa ditolak pada hapus admin tetapi boleh aksi lain; T3 admin diizinkan dan menu konsisten. Katalog buku tetap publik sesuai snapshot JS10. | HTTP+PG |

### 5.9 Keamanan web

| ID | Contoh tugas live coding/artefak | Kriteria keberhasilan dan automated test cases yang diusulkan | Metode |
|---|---|---|---|
| S01 | Audit login/pencarian/update dan perbaiki query yang memakai input mentah. | T1 apostrof/payload SQLi tidak membuka akses atau mengubah cakupan query; T2 alur normal tetap lolos; T3 AS meninjau semua sink yang menerima input. SQL konstan boleh query(); beberapa payload gagal bukan bukti bebas SQLi penuh. | HTTP+PG+AS |
| S02 | Implementasikan e() dan gunakan pada judul, nama, serta value pencarian. | T1 markup/script tersimpan menjadi teks pada respons asli; T2 tanda kutip pada atribut tidak membuat atribut/node baru; T3 teks normal dan karakter khusus tetap terbaca. Jangan memakai sanitizer preview aplikasi sebagai bukti PHP aman. | HTTP+AS |
| S03 | Tambahkan CSRF pada form edit/hapus dan endpoint pemrosesnya. | T1 sesi login dengan token valid boleh memutasi; T2 token hilang/salah ditolak HTTP 403 tanpa perubahan DB; T3 token sesi A ditolak pada sesi B, Tamu tetap melewati guard login lebih dulu. Token per session tidak wajib berganti tiap submit. | HTTP+PG |
| S04 | Tambahkan session_regenerate_id(true) pada jalur login sukses. | T1 ID sebelum/sesudah sukses berbeda; T2 cookie lama tidak dapat mengakses identitas login baru; T3 login gagal tidak memperoleh session terautentikasi. Uji cookie jar terpisah pada server fixture. | HTTP |
| S05 | Tulis security-checklist.md lalu demonstrasikan satu temuan dan perbaikannya. | T1 lint dokumen memastikan kolom temuan/lokasi/tes/hasil ada; T2 RV memeriksa minimal SQLi/XSS/CSRF/validasi/fixation dengan bukti; T3 dosen mengulang satu kasus dan hasil sesuai. Checklist terisi tidak otomatis berarti sistem aman. | RV+AS |

### 5.10 Integrasi data dan pengujian

| ID | Contoh tugas live coding/artefak | Kriteria keberhasilan dan automated test cases yang diusulkan | Metode |
|---|---|---|---|
| I01 | Tulis DDL peminjaman dengan FK, DATE/default dan status. | T1 katalog DB memuat kedua FK; T2 ID buku/anggota tidak ada ditolak; T3 tanggal pinjam default tanggal fixture dan tanggal kembali boleh NULL. FK users tidak diwajibkan karena tidak ada pada SQL aktual. | PG |
| I02 | Implementasikan pinjam buku dengan beginTransaction/commit/rollBack. | T1 sukses menghasilkan satu pinjaman dan stok berkurang satu; T2 injeksi kegagalan setelah INSERT membuat kedua perubahan rollback; T3 stok nol/anggota invalid tidak meninggalkan perubahan parsial. Uji normal saja tidak membuktikan atomicity. | HTTP+PG |
| I03 | Tambahkan SELECT FOR UPDATE pada peminjaman terakhir dengan stok awal 1. | T1 dua koneksi PostgreSQL independen dijadwalkan bersamaan memakai barrier; T2 tepat satu pinjaman berhasil, stok akhir 0; T3 koneksi gagal di-rollback dan lock dilepas. Dua panggilan berurutan atau satu koneksi PGlite bukan bukti konkurensi. | PG+HTTP |
| I04 | Implementasikan proses_kembali yang aman dari submit ulang. | T1 pinjaman aktif menjadi dikembalikan dan stok +1; T2 submit ulang/dua koneksi tidak menambah stok lagi; T3 ID tak ada atau kegagalan tengah proses tidak mengubah sebagian data. Cek method dan CSRF lewat fixture terintegrasi. | HTTP+PG |
| I05 | Tampilkan histori anggota dengan judul buku, tanggal dan status. | T1 fixture dua anggota/buku hanya mengembalikan histori sasaran; T2 anggota tanpa histori menampilkan state kosong; T3 judul/tanggal/status dan urutan benar tanpa duplikasi cartesian. JOIN dua tabel cukup untuk query aktual; tiga tabel dapat menjadi variasi. | PG+HTTP |
| I06 | Lengkapi pengecekan tunggakan sebelum INSERT peminjaman. | T1 pinjaman aktif 15 hari menolak tanpa perubahan DB; T2 tepat 14 hari diizinkan sesuai arti >14; T3 yang sudah dikembalikan tidak memblokir. Bekukan tanggal fixture, jangan bergantung tanggal host. | PG+HTTP |
| I07 | Lengkapi bagian modul yang gagal pada fixture kemudian uji register hingga logout. | T1 register-login-CRUD-pinjam-kembali-riwayat-logout lolos; T2 COUNT dashboard selalu sesuai DB; T3 skenario invalid/akses Tamu dan bug regresi diuji ulang. Bukti per fitur tetap terpisah; satu sukses E2E bukan observasi benar bagi semua KC. | HTTP+RV |

### 5.11 Konfigurasi, deployment dan dokumentasi

| ID | Contoh tugas live coding/artefak | Kriteria keberhasilan dan automated test cases yang diusulkan | Metode |
|---|---|---|---|
| O01 | Buat config.php dan .env.example berisi nama variabel tanpa secret asli. | T1 DB_NAME/PORT fixture berbeda dipakai tanpa edit source; T2 default lokal bekerja sesuai kontrak; T3 AS/review memastikan tidak ada secret fixture/produksi tertanam dan error tidak membocorkan nilai. Scan bukan jaminan secret-free. | PHP+OPS+AS |
| O02 | Siapkan perintah pg_dump --schema-only, impor ke DB kosong dan perbaiki path deployment. | T1 schema-only dapat diimpor tanpa data pribadi; T2 aplikasi fixture berjalan pada host/path baru dan aset/redirect benar; T3 smoke login/CRUD/pinjam berhasil pada deployment baru. Tidak menjalankan deploy publik atau dump DB utama dalam analisis ini. | OPS+HTTP |
| O03 | Lengkapi README/manual termasuk screenshot nyata lalu demonstrasikan instalasi dan satu alur. | T1 lint memastikan seksi instalasi/config/ERD/role/manual tersedia dan tidak ada placeholder wajib; T2 orang lain mengikuti petunjuk pada fixture bersih; T3 RV menilai penjelasan desain, bukan jumlah kata atau screenshot saja. | RV+OPS |

### 5.12 Proses pembelajaran dan kontribusi

| ID | Contoh tugas live coding/artefak | Kriteria keberhasilan dan automated test cases yang diusulkan | Metode |
|---|---|---|---|
| T01 | Kerjakan perbaikan kecil pada tugas individu/tim lalu tulis logbook dan jelaskan perubahan saat demo. | T1 pemeriksaan artefak memastikan log bertanggal dan rujukan perubahan ada; T2 RV mencocokkan kontribusi dengan kode/demo individu; T3 penjelasan refleksi dan tanggung jawab dinilai. Jumlah commit bukan ukuran kualitas/kejujuran dan tidak mengubah BKT otomatis. | RV |

### 5.13 Pengayaan opsional: Bootstrap

| ID | Contoh tugas live coding/artefak | Kriteria keberhasilan dan automated test cases yang diusulkan | Metode |
|---|---|---|---|
| B01 | Buat tiga kartu dengan col-12/col-md-4 serta override warna brand. | T1 VP sempit satu kolom dan lebar tiga kolom sesuai versi fixture; T2 card/spacing benar; T3 override tema tidak merusak komponen lain. CSS Bootstrap versi tetap harus disediakan fixture terkurasi, bukan CDN bebas. | BR+VP |
| B02 | Buat navbar-expand-lg dengan toggler yang menunjuk ID collapse benar. | T1 tombol membuka/menutup di viewport mobile; T2 aria-expanded dan target konsisten; T3 desktop menampilkan menu sesuai breakpoint fixture. Membutuhkan JS Bootstrap terkurasi; script CDN akan dihapus sanitizer saat ini. | BR+VP |
| B03 | Style tabel dan form memakai utility Bootstrap serta warna aksi yang bermakna. | T1 tabel striped/hover dan kontrol form mendapat computed style dari asset fixture; T2 label/name masih benar; T3 tombol Edit/Hapus berbeda makna dan penambahan tombol Detail tidak merusak style. Class saja tanpa asset tidak membuktikan tampilan. | BR |

### 5.14 Pengayaan opsional: latihan lanjutan

| ID | Contoh tugas live coding/artefak | Kriteria keberhasilan dan automated test cases yang diusulkan | Metode |
|---|---|---|---|
| X01 | Tulis importer buku.json dengan kebijakan duplikasi dan rollback yang dinyatakan. | T1 dua record valid tersimpan benar; T2 record invalid tidak menyebabkan partial import jika kontrak all-or-nothing; T3 impor ulang mengikuti kebijakan skip/reject yang ditetapkan, bukan duplikasi diam-diam. | PHP+PG |
| X02 | Rancang remember-me pada fixture dan jelaskan siklus expiry/revocation. | T1 HTTP memeriksa expiry dan atribut cookie sesuai kontrak; T2 token kadaluarsa/dicabut tidak mengautentikasi; T3 RV memeriksa token bukan password/plain user_id dan risiko perangkat bersama. Pembahasan setcookie saja tidak membuktikan desain aman. | HTTP+RV |
| X03 | Batasi login gagal pada fixture dengan ambang dan reset yang eksplisit. | T1 percobaan sampai ambang memberi perilaku tepat; T2 setelah batas login ditunda sesuai kontrak; T3 setelah waktu/reset sah dapat login lagi. Gunakan clock fixture; counter session saja memiliki batas cakupan yang perlu dijelaskan. | HTTP+RV |
| X04 | Tambahkan header CSP pada proyek uji dan jelaskan resource yang diperlukan. | T1 respons memuat kebijakan fixture; T2 browser terpisah memblokir script uji yang tidak diizinkan tetapi aset sah tetap berjalan; T3 RV menegaskan escaping tetap wajib. Jangan memakai CSP host aplikasi untuk menilai CSP proyek mahasiswa. | HTTP+VP+RV |

### 5.15 Contoh bentuk tes yang dapat ditinjau

Berikut contoh **spesifikasi** tes, bukan tambahan kode aplikasi. Fixture/kontrak fungsi perlu ditulis dahulu. Kode BR/JS menggunakan bentuk ekspresi boolean seperti `test_cases.script` saat ini; desain PHP/SQL/HTTP memakai runner lain.

```javascript
// H04: satu bagian dari asesmen tabel; bukan seluruh bukti kompetensi.
document.querySelectorAll('#daftar-buku thead th').length === 5 &&
document.querySelectorAll('#daftar-buku tbody tr').length === 5

// J10: kontrak fungsi global di Worker; akses network tetap diblokir.
(await window.ambilBuku(
  async url => ({ ok: url === '/fixture/buku', json: async () => [{ judul: 'Web' }] }),
  '/fixture/buku'
))[0].judul === 'Web'
```

Contoh uji I02 di runner eksternal: seed stok=2; jalankan peminjaman valid; assert `stok=1` dan jumlah pinjaman=1. Reset fixture; paksa kegagalan antara INSERT dan UPDATE; assert stok tetap 2 dan jumlah pinjaman=0. I03 menambahkan dua koneksi dengan barrier dan stok awal 1. Pengecekan string `beginTransaction` atau `FOR UPDATE` saja tidak membuktikan dua kompetensi ini.

Contoh uji S02 harus membaca respons PHP asli, memasukkan teks berisi `<script>` dan karakter kutip, lalu memeriksa output ter-escape serta tidak terbentuk node/atribut berbahaya pada browser uji terpisah. Jika output hanya dimasukkan ke preview aplikasi yang sudah disanitasi, mahasiswa dapat memperoleh kelulusan palsu meski PHP tidak melakukan escaping.

Kontrak J07 perlu membedakan validasi HTML bawaan, validasi handler mahasiswa dan handler pembatalan submit milik sandbox. Observasi `event.defaultPrevented === true` di iframe saat ini **tidak cukup**, karena harness memasang pembatalan submit sendiri. Pilihan asesmen: fungsi validator murni dengan tabel input dan tes render pesan; atau fixture event yang mengamati pemanggilan handler mahasiswa secara terpisah setelah harness didesain untuk itu.

## 6. Validasi terhadap struktur aplikasi saat ini

### 6.1 Struktur dan alur yang ditemukan pada kode

| Area | Bukti kode | Hasil analisis dan implikasi |
|---|---|---|
| Aplikasi/stack | [package.json](../package.json), [README](../README.md), `src/app/(portal)` | Next.js App Router/TypeScript, React sebagai teknologi pembangun, CodeMirror. Framework aplikasi tidak otomatis menjadi materi perkuliahan yang harus diuji. |
| Daftar KC/materi | [seed-data.ts](../src/lib/seed-data.ts), [seed.ts](../scripts/seed.ts), [content.ts](../src/lib/content.ts) | Seed 20 KC, materi teks per KC, 17 templat tugas front-end yang masing-masing digandakan menjadi tiga latihan: total 51. ID berbeda tidak membuat ketiganya instrumen independen; instruksi/solusi/tes inti sama, difficulty 0,3/0,5/0,7. Tidak ada latihan executable untuk R1-R3 pada seed. |
| Pretest | [pretest.tsx](../src/components/pretest.tsx), `pretestQuestions` dan `submitPretest` | Delapan MCQ: dua per HTML/CSS/JavaScript/React. Pretest diselesaikan sekali per pengguna setelah bergabung kelas, sebelum submit latihan. Belum ada pretest PHP/SQL atau posttest implementatif. |
| Fitur KNN | [knn.ts](../src/lib/adaptive/knn.ts), [learning.ts](../src/lib/learning.ts), [validation.ts](../src/lib/validation.ts) | Vektor tetap 10 angka: 4 skor modul, 4 waktu dalam detik (0-1800), pengalaman (1-5), nilai prasyarat (0-100; hilang diimputasi 50). Normalisasi min-max memakai bounds tetap dan clamp. Jarak Euclidean biasa antarfitur; **voting** memakai bobot invers jarak, bukan bobot W KC. |
| Klasifikasi dan data latih | `classify`, `selectK`, [pilot.ts](../src/lib/pilot.ts) | Satu label global pemula/menengah/mahir. Nilai k seed=3, minimum training=15. Training seed kosong, sehingga seed murni memakai fallback rerata empat skor dengan ambang 0,4/0,75. Data aktif dapat berbeda. CV deterministik stratified tersedia; pilot tertaut memeriksa rubric approved, consent dan versi instrumen. Baris manual tanpa tautan pilot tetap bertanda unverified dan tidak otomatis terlindungi dari ketidakcocokan versi fitur. |
| Inisialisasi mastery | `submitPretest` pada `learning.ts` | Semua KC yang dibaca `getKCs` diberi probabilitas sama dari label global: seed 0,2/0,5/0,8. Ini tidak membuktikan kemampuan PHP/SQL bila KC tersebut kelak ditambahkan; skor React juga tidak boleh dianggap bukti backend. |
| Pembaruan BKT | [bkt.ts](../src/lib/adaptive/bkt.ts), `recordAttempt` pada `learning.ts` | Hanya attempt pertama pengguna-latihan menjadi observasi. Semua tes lulus = benar; hint penuh mengubah observasi menjadi salah meski hasil latihan passed. Q-weight menjadi pangkat likelihood dan faktor transisi belajar (fractional update). Retry tetap disimpan tetapi tidak menambah mastery_log. Nilai seed initial/learn/guess/slip=0,2/0,15/0,2/0,1 masih pilot. |
| BN dan prasyarat | [bayes-net.ts](../src/lib/adaptive/bayes-net.ts) | Node biner, noisy-AND, evidence likelihood `[1-p,p]` dari BKT, inferensi eksak variable elimination. Readiness adalah probabilitas **gabungan** semua induk mastered, bukan rerata W atau sekadar perkalian mastery BKT. Posterior BN berbeda dari P(L) BKT. Validator menolak siklus/duplikasi, maksimal 5 induk; perkalian faktor menolak ukuran variabel >22. |
| Rekomendasi | [recommender.ts](../src/lib/adaptive/recommender.ts), `buildRecommendation` | Menggunakan frontier mastery/readiness, diagnosis induk terlemah, posisi kurikulum dan prediksi dekat target (seed 0,7). Difficulty menggeser odds prediksi. Tidak memakai W kepentingan KC. Kontrol mengikuti posisi KC lalu ID latihan; materi tanpa latihan tidak menjadi target latihan, tetapi node tetap dapat ikut inferensi graf global. |
| Editor/preview | [editor.tsx](../src/components/editor.tsx), [workspace.tsx](../src/components/workspace.tsx) | Hanya tiga tab HTML/CSS/JS, Code `{html,css,js}`, preview debounce 400ms, draft server/lokal. Bukan IDE file proyek, tidak ada PHP/SQL tab/runtime, file tree, multi-route server atau import dump mahasiswa. |
| Test harness | [runner.ts](../src/lib/sandbox/runner.ts), [instrument.ts](../src/lib/sandbox/instrument.ts), [Worker route](../src/app/sandbox-worker.js/route.ts) | JS murni dapat dijalankan dalam Worker yang dapat dihentikan. DOM/CSS/event di iframe native dengan instrumentasi/timer. Pemilihan Worker berbasis deteksi teks `document`/`getComputedStyle`, bukan tipe evaluator formal. Batas ini perlu diperhitungkan pada authoring. |
| Pembersihan HTML/CSP | `sanitizeHTML`, `buildSandbox` pada `runner.ts` | Hanya body hasil parsing yang dipakai; script/iframe/meta/link dan atribut event inline dibuang. Wrapper membuat head/title/lang/CSP sendiri. Network `connect-src 'none'`, script eksternal dan form/navigation dibatasi. Metadata sumber, CSS `<link>`, Bootstrap CDN serta fetch file dosen tidak langsung bekerja. |
| Hasil penilaian | `Workspace.submit`, `recordAttempt` | Klien mengirim daftar hasil; server memeriksa kesesuaian ID/jumlah tes, tidak mengeksekusi ulang kode. Bukan grading anti-kecurangan. Hasil HTTP/SQL eksternal tidak memiliki jalur bukti tepercaya tersendiri. |
| Manajemen konten | [content-manager.tsx](../src/components/content-manager.tsx), [validation.ts](../src/lib/validation.ts) | Module dibatasi enum HTML/CSS/JavaScript/React di type, validasi dan UI. KC maksimum 5 induk; latihan 1-5 KC, 1-15 tes, timeout 100-5000ms, kode awal hanya HTML/CSS/JS. Kolom module di SQL berupa text tidak menghilangkan pembatasan API/UI ini. |
| Pengujian existing | [adaptive.test.ts](../tests/adaptive.test.ts), [learning.test.ts](../tests/learning.test.ts), [sandbox.test.ts](../tests/sandbox.test.ts), [pilot.test.ts](../tests/pilot.test.ts) | Ada pengujian hitungan/model/alur/skrip harness/pilot. Tes sandbox memakai stub DOMParser dan VM, sehingga tidak membuktikan DOM native, metadata sumber, layout responsive atau keamanan lintas browser. Pada tugas ini tes tidak dijalankan ulang; status dokumen lama tidak diubah menjadi hasil verifikasi baru. |

### 6.2 Struktur database dan celah metadata

Sumber: [db/schema.sql](../db/schema.sql). Aplikasi menggunakan `pg` untuk PostgreSQL eksternal atau PGlite lokal bila `DATABASE_URL` tidak tersedia. Kedua mode menyimpan **data platform**, bukan menyediakan hak eksekusi SQL mahasiswa.

| Kelompok tabel | Tabel/kolom yang relevan | Analisis kompatibilitas |
|---|---|---|
| Identitas dan kelas | users, sessions, login_limits, classes, enrollments | Empat role platform dan mode adaptive/control sudah ada. Role platform tidak sama dengan Tamu/Petugas pada proyek latihan. Satu enrollment per pengguna dibatasi UNIQUE(user_id). |
| Kurikulum | knowledge_components(id/code/name/module/position), kc_prerequisites(weight) | Tidak ada deskripsi/sumber/kategori kesulitan/W/status aktif/versi kurikulum terstruktur. W tidak boleh ditumpangkan ke `position` atau edge weight. Relasi graf dikelola global, belum per kurikulum/kelas. |
| Materi/latihan | materials, exercises, exercise_kc, test_cases | Bisa menyimpan materi teks/kode/video. Belum ada tipe evaluator PHP/SQL/rubrik, paket banyak berkas, metadata source repository, test fixture DB, atau bukti grading eksternal. `difficulty` melekat pada latihan, bukan KC. |
| Pretest/model awal | pretest_results(features/answers/label/neighbors/model_version/instrument_version/audit) | Versi instrumen/audit sudah tersedia. PK user_id membatasi satu hasil; perubahan kurikulum tidak boleh menimpa hasil lama atau menafsir ulang vektor React sebagai PHP. |
| Interaksi/mastery | drafts, attempts, mastery_states, mastery_log | Attempt menyimpan snapshot latihan/model dan flag first; mastery_states kuncinya user+KC, belum user+versi kurikulum+KC. Tidak ada hasil rubrik dosen umum atau status not-assessed sebagai konsep terpisah. Jangan mengisi passed=true hanya karena unggah dokumen. |
| Rekomendasi/parameter | recommendations, model_params | Keputusan menyimpan input/snapshot graf/latihan dan versi, parameter aktif berversi. Perubahan katalog dan semantik KC tetap memerlukan versi kurikulum/asesmen, bukan hanya mengganti versi parameter probabilistik. |
| Pilot | pilot_rubrics, pilot_labels; classes purpose/data_kind | Rubrik ini khusus label awal KNN dan provenance pilot. Keberadaannya bukan fitur penilaian rubrik umum untuk wireframe, keamanan, atau dokumen tugas. |

Foreign key dari materi, Q-matrix, mastery dan attempt berkaitan dengan ID lama. Menghapus/rename/mengubah arti KC lama dapat memutus relasi atau merusak interpretasi riwayat. Saran desain masa depan: simpan metadata kurikulum dan pemetaan ekuivalensi/split secara eksplisit; nama tabel/kolom final ditentukan setelah persetujuan, bukan migration yang dijalankan sekarang.

### 6.3 Perbandingan lengkap 20 KC lama dengan proposal

“Pertahankan” berarti konstruk keterampilannya masih cocok; contoh perpustakaan dan kualitas instrumen tetap perlu diperbaiki. “Perbarui” mencakup perluasan, pemecahan, atau perbaikan bukti, bukan perintah mengganti ID/data saat ini.

| ID/nama lama | Prasyarat seed lama | Padanan proposal | Keputusan dan alasan |
|---|---|---|---|
| H1 Struktur dokumen HTML | - | H01 | **Perbarui bukti tes**: soal meminta head/body, tetapi tes awal hanya memeriksa h1/p pada DOM. Sanitizer/wrapper tidak memungkinkan bukti doctype/head asli. |
| H2 Elemen teks, tautan, gambar | H1 | H03; aksesibilitas H02 | **Pertahankan** teks/tautan/path dan ganti konteks Profil menjadi menu SIMPUS. Gambar/alt tetap pengayaan aksesibilitas; jangan menghapusnya sebagai materi “salah”, tetapi tidak mewajibkannya sebagai pusat kurikulum dosen. |
| H3 Form dan input | H2 | H05 | **Perbarui** dari email generik menjadi form buku/anggota, name/id, tipe dan constraint yang dipakai PHP. |
| H4 HTML semantik dan aksesibilitas | H2 | H02 | **Pertahankan**; gunakan landmark/hierarki/label pada Beranda/katalog dan rubrik makna. |
| C1 Selektor dan spesifisitas | H2 | C01 | **Perbarui tes**: tes warna satu class belum membuktikan konflik cascade/spesifisitas. |
| C2 Box model | C1 | C02 | **Pertahankan**; konteks kartu/form, reset, margin/padding dan pengukuran total lebar. |
| C3 Flexbox | C2 | C03 | **Pertahankan**; navbar merupakan contoh langsung materi dosen. Tambahkan wrapping fixture. |
| C4 Grid | C2 | C04 | **Pertahankan**; kartu statistik menggantikan galeri generik. |
| C5 Responsive dan media query | C3, C4 | C07; C08; C09 | **Perbarui/pecah**: keberadaan aturan @media belum membuktikan viewport, overflow dan menu CSS bekerja. |
| J1 Variabel, tipe, operator | - | J01 | **Pertahankan** sebagai fondasi yang muncul pada kode JS05; konteks harga/stok buku dengan input bervariasi. |
| J2 Percabangan dan perulangan | J1 | J02 | **Pertahankan**; validasi/iterasi buku, hindari tes hanya angka 30 yang bisa di-hardcode. |
| J3 Fungsi dan scope | J2 | J03 | **Pertahankan**; pola init/helper pada app.js dan refactor buku/anggota. |
| J4 Array dan object | J3 | J04 | **Perbarui** agar memasukkan kontrak JSON dan array objek buku/anggota. |
| J5 Seleksi/manipulasi DOM | J3, H2 | J05 | **Perbarui** dari ubah satu teks/class menjadi render tabel, state kosong dan render ulang. |
| J6 Event handling | J5 | J06; kelanjutan J09 | **Pertahankan** listener/state; pisahkan delegasi/konfirmasi dinamis agar bukti lebih spesifik. |
| J7 Validasi form JS | J6, H3 | J07 | **Perbarui** validasi field/rentang serta tes cabang valid. Tes lama pesan kosong tidak membuktikan handler hanya membatalkan input invalid. |
| J8 Asynchronous/Fetch API | J4, J6 | J10; J11 | **Perbarui/pecah**; pola injeksi fetcher tetap tepat untuk sandbox, perlu HTTP error, JSON rusak, loading/finally/retry. |
| R1 Komponen dan props | J4, J6 | Tidak ada padanan wajib | **Tinjau sebagai pengayaan terpisah**: tercantum SRS tetapi tidak diajarkan repository dosen; jangan dihapus. |
| R2 State dan hooks | R1 | Tidak ada padanan wajib | **Tinjau sebagai pengayaan terpisah**; modul belum punya eksekusi JSX dan bukan pengganti PHP/session. |
| R3 Routing App Router Next.js | R1 | Tidak ada padanan wajib | **Tinjau sebagai pengayaan terpisah**; Next.js pembangun platform berbeda dari materi PHP native mahasiswa. |

Ringkasan keputusan baseline: **9 konstruk dapat dipertahankan, 8 perlu pembaruan/pemecahan, 3 memerlukan keputusan ruang lingkup**. Keseluruhan 17 KC front-end tetap memiliki padanan; tidak ada dasar menghapusnya massal.

Tambahan yang belum tercakup memadai pada baseline: H04 tabel; C05/C06 styling tabel/form; C08 overflow; C09 hamburger CSS; J08 filter; J09 delegasi/konfirmasi; J11 loading/error; F/U untuk fondasi/desain; seluruh P/D/A/S/I/O/T untuk kurikulum server, proses, dan operasi. B/X merupakan pengayaan opsional. Sebagian ID tambahan memisahkan konstruk lama yang terlalu luas, bukan selalu konsep yang sama sekali baru.

### 6.4 Implikasi untuk model adaptif dan validitas penelitian

- **KNN:** menambah modul PHP/PostgreSQL akan mengubah arti/dimensi fitur. Lima modul berfitur skor+waktu menghasilkan contoh 12 fitur, tetapi itu hanya alternatif desain, belum keputusan. Jangan sekadar mengganti label React menjadi PHP sambil mempertahankan data latih lama 10 fitur. Bahkan menghapus React dan memakai tiga modul akan memerlukan penyesuaian kontrak/features/fallback. Validasi instrumen, label ahli, bounds, imputasi, provenance dan CV harus mengikuti versi baru; data manual lama perlu pemeriksaan eksplisit.
- **BKT:** W tidak mengubah learn/guess/slip/initial. Satu boolean proyek multi-KC saat ini akan memperbarui semua KC Q berdasarkan hasil agregat yang sama; itu dapat menuduh semua keterampilan salah saat hanya satu subtes gagal. Solusi yang disarankan sebelum implementasi adalah soal diagnostik dengan satu KC utama; perubahan atribusi observasi per subtes memerlukan keputusan metodologi terpisah. Aturan first-only/full-hint tetap dipertahankan.
- **Bank latihan:** tiga salinan tugas saat ini tidak memberi bukti transfer kemampuan. Siapkan beberapa tugas independen dengan data/struktur masalah berbeda per KC, termasuk perpindahan Buku ke Anggota; jumlah final mengikuti pilot dan peluang mencapai mastery, bukan angka tiga sebagai jaminan validitas. Mengulang exercise_id yang sama tidak menambah bukti BKT. Perubahan isi soal bermakna memerlukan ID/versi asesmen baru, bukan overwrite soal lama.
- **Pemisahan KC:** P(L) pada J8 lama tidak bisa disalin sebagai P(L) terpisah untuk J10/J11; bukti fetch lama belum mencakup loading/error. Simpan riwayat lama, gunakan diagnostik tambahan untuk konstruk baru, lalu sepakati inisialisasi. Tidak mereset state atau menggandakan attempt saat analisis ini.
- **BN:** katalog 71 jauh melebihi perkiraan SRS 20-30 node. Kompleksitas bergantung juga pada struktur/faktor/treewidth, bukan jumlah node saja. Jangan mengaktifkan semua node tanpa pengukuran NFR-02 dan batas faktor 22 variabel. Pengelompokan graf per jalur/modul dan integrasi cross-module adalah pilihan desain masa depan yang perlu validasi; bukan alasan mengganti algoritma eksak sekarang.
- **Capaian noncoding:** F/U/S05/O03/T01 dapat menjadi materi, checklist atau rubrik terpisah. Jika dipasang sebagai prasyarat laten tanpa observasi yang sah, siswa bisa terus “terkunci”. Assessment scope dan kriteria keberhasilan harus ditetapkan sebelum pemakaian dalam frontier.
- **Kontrol vs adaptif:** urutan kurikulum, latihan, kesempatan mencoba dan evaluator harus sebanding antarkelompok. Bekukan versi kurikulum/instrumen/model sebelum eksperimen; jangan mencampur mastery/fitur/hasil pretest dari definisi KC yang berbeda. SRS mengusulkan pretest-posttest; posttest berbasis kurikulum dosen masih harus dirancang dan belum tersedia pada aplikasi.

## 7. Kompatibilitas terhadap SRS dan kebutuhan evaluasi teknis

### 7.1 Matriks dampak kebutuhan

| Usulan | Rujukan SRS asli | Penilaian |
|---|---|---|
| Mengontekstualkan H/C/J menjadi SIMPUS-Mini, menambah soal/test DOM yang memang terdukung | Bagian 3 hlm. 6-7; FR-15/16/32-35 hlm. 10-11 | Selaras dengan manajemen konten dan kewajiban validasi daftar KC draf. Peta serta soal final perlu persetujuan ahli sebelum aktivasi. |
| Memecah KC dan mengubah graf menjadi 25 kandidat front-end | Bagian 3; 4.3 hlm. 8; FR-21/35; NFR-02 | Selaras secara tujuan granularitas, tetapi memerlukan validasi DAG, bukti asesmen, kalibrasi dan pengukuran inferensi. Bukan penggantian algoritma. |
| W kepentingan KC sebagai metadata | Bagian 3/Q-matrix; model data hlm. 13 | Belum didefinisikan sebagai properti KC. Perlu tambahan spesifikasi bila disimpan/dipakai; menggunakannya dalam ranking akan mengubah aturan rekomendasi Bagian 4.4/FR-24. Proposal hanya metadata, tanpa aktivasi. |
| Mengeluarkan React dari jalur wajib atau mengganti modul pretest | Daftar R1-R3 hlm. 7; Bagian 4.1; FR-05-09; FR-14 prioritas C | Perubahan cakupan/instrumen SRS. Menunda JSX sudah diizinkan prioritas C, tetapi itu bukan persetujuan otomatis menghapus modul/KC React dari definisi kurikulum/pretest. Perlu revisi yang tercatat. |
| Menambah materi PHP/PostgreSQL sebagai bacaan/rujukan praktikum luar | FR-33; batasan Bagian 1.2/2.3 | Dapat disajikan sebagai pengetahuan/rujukan dengan batas evaluasi jelas. Label module dan metadata aplikasi tetap perlu desain jika memakai modul baru. Tidak boleh mengklaim mastery otomatis hanya dari membuka materi. |
| Menjalankan kode PHP mahasiswa di server aplikasi atau runner backend | Bagian 1.2 hlm. 4, Bagian 2.3 hlm. 5, arsitektur hlm. 12 | **Bertentangan dengan batas eksplisit versi 1.0**: backend mahasiswa di luar cakupan; server tidak menjalankan kode pengguna. Runner terpisah tetap memerlukan revisi cakupan dan antarmuka bila dijadikan bagian sistem. |
| Evaluasi SQL native dan transaksi multi-koneksi | FR-10/16, arsitektur dan model test_cases | Belum didukung kontrak editor/test DOM/JS. PostgreSQL sebagai DB platform tidak memenuhi kebutuhan grader SQL. Perlu lingkungan/schema fixture terpisah dan spesifikasi baru. |
| Pemeriksaan sumber/validator dan multi-viewport | FR-10/11/16; NFR-01/05-07 | Melengkapi bukti asesmen HTML/CSS tanpa harus menjalankan backend mahasiswa. Tetap merupakan pengembangan harness yang harus diperinci, menjaga isolasi/CSP dan diuji browser. |
| Rubrik dosen dan pengumpulan artefak/deployment | FR-15-20/31; model data hlm. 13 | Penilaian otomatis yang ada tidak menyediakan gradebook rubrik umum. Integrasi nilai eksternal/perubahan menjadi observasi BKT perlu kebutuhan baru, provenance penilai, kebijakan hint/first-attempt dan audit. |
| Mengaktifkan katalog 71 sebagai satu graf | Bagian 4.3 “sekitar 20-30 node”; NFR-02/04/14 | Asumsi skala berubah. Tidak dapat menyatakan inferensi masih memenuhi target tanpa benchmark pada graf yang disetujui dan data nyata/sintetis terkontrol. |
| Memakai nilai rubrik/UTS/UAS sebagai mastery BKT | Bagian 4.2 hlm. 7-8; FR-19 | Tidak ekuivalen dengan observasi benar/salah first-attempt latihan. Memerlukan rancangan validitas; tidak direkomendasikan sebagai konversi langsung. |

SRS PDF mencatat rumus BKT tidak tersedia dalam teks sumber. Implementasi memiliki rumus dan tes hitung manual; proposal tidak mengisi kekosongan itu dengan metode baru. Revisi metodologi sebaiknya mendokumentasikan rumus implementasi, fractional Q, dan interpretasi soft evidence BN yang memang dipakai.

### 7.2 Jalur evaluasi yang realistis

| Jenis materi | Yang dapat dibuktikan di browser saat ini | Yang belum dapat dibuktikan dan alternatif |
|---|---|---|
| HTML body/tabel/form/semantik | DOM, attribute, label, isi tabel dan constraint client pada fixture. | Validitas sumber lengkap, doctype/head/title/viewport asli perlu RAW. Navigasi multi-halaman memerlukan fixture/browser terpisah. |
| CSS layout/responsive | Computed style dan layout dalam ukuran iframe yang sedang aktif. | Viewport 375/768/1280 dan batas breakpoint belum diorkestrasi. Tambah VP/fixture ukuran; inspeksi string media query saja tidak cukup. |
| JS fungsi/DOM/event | JS Worker dan BR; async dengan fetcher mock dapat diuji tanpa network. | Fetch JSON lokal dosen tidak bisa dijalankan apa adanya karena CSP. Gunakan mock deterministik; kemampuan mengelola endpoint/server dinilai terpisah. |
| Bootstrap | Struktur class dapat diperiksa. | Efek CSS dan collapse tidak terbukti tanpa CSS/JS framework. Bundle versi tetap sebagai fixture tepercaya di harness setelah desain ditinjau, atau nilai di lab eksternal. Jangan mengaktifkan CDN/jaringan bebas atau allow-same-origin demi contoh. |
| PHP syntax/template/form | Teks kode dapat disimpan sebagai bacaan, tetapi browser tidak mengeksekusi PHP. | PHP CLI/lint/unit test untuk fungsi; HTTP runner untuk superglobal, session/redirect/cookie. Alternatif minimum: praktikum lab + review source + rubrik bukti individu. |
| PostgreSQL query/DDL | Simulasi JS terhadap data array hanya membuktikan logika JS. | PostgreSQL fixture untuk semantik tipe, constraint, ILIKE, RETURNING, JOIN, rollback dan error. Pemeriksaan AST/string SQL adalah tambahan, bukan bukti eksekusi benar. |
| SQLi/XSS/CSRF/session | Simulasi konsep hanya untuk pembelajaran awal. | Pengujian pada respons/request asli PHP, cookie jar terpisah dan efek DB. Sanitizer/CSP platform tidak dapat menggantikan pertahanan proyek mahasiswa. |
| Transaksi/row lock | Tidak dapat dibuktikan dari DOM atau mock array. | PostgreSQL sungguhan dengan ≥2 koneksi, pengendalian jadwal/barrier, injeksi kegagalan dan reset fixture. |
| UI/UX, audit, dokumentasi, kontribusi | Keberadaan kontrol/struktur artefak dapat dibantu lint. | Rubrik dan demonstrasi individu; nilai substantif tidak diturunkan dari jumlah tag/kata/commit. |
| Deployment | Preview browser tidak membuktikan instalasi ulang/config/restore. | Environment lab/hosting uji yang dikendalikan, database kosong, smoke test dan verifikasi orang kedua. |

### 7.3 Syarat minimum jika nanti dipilih runner eksternal

Ini kebutuhan desain untuk ditinjau, **bukan instruksi memasang atau menyalakan layanan sekarang**:

1. Runner terpisah dari proses/API/DB aplikasi; lingkungan sekali pakai per penilaian, filesystem dan user nonprivileged, batas CPU/RAM/proses/output/waktu, network keluar ditolak secara default. Kode mahasiswa tidak diberi credential platform.
2. Runtime PHP dan driver PDO_PGSQL ditetapkan versinya. Proyek multi-file dan entry point HTTP perlu kontrak berbeda dari Code `{html,css,js}`. Lint, unit test, HTTP dan E2E dipisahkan agar jenis kegagalan dapat dijelaskan.
3. Database/schema fixture dan role terbatas per penilaian; seed/reset deterministik, tanggal uji tetap, hasil/efek samping diperiksa, lalu lingkungan dibuang. SQL siswa tidak diarahkan ke `DATABASE_URL` platform. Uji konkurensi perlu koneksi PostgreSQL independen.
4. API job/result dengan job ID, versi soal/fixture/evaluator, status timeout/error/lulus, bukti per tes dan validasi sumber hasil. Log sanitasi tidak membocorkan secret. Hasil grader tidak cukup dipercaya hanya karena klien mengirim boolean passed.
5. Tetapkan observasi pedagogis: bedakan kesalahan solusi, kesalahan layanan runner dan tugas belum dinilai. Gangguan infrastruktur tidak otomatis menjadi observasi salah BKT. Aturan hint, attempt pertama dan retry harus konsisten dengan SRS atau direvisi secara eksplisit.
6. Uji sandbox, HTTP/session, pemisahan peserta dan kapasitas; revisi NFR dan alur antrean karena penilaian backend tidak memiliki profil latensi preview browser 400ms. Jangan menyatakan target lama terpenuhi tanpa pengukuran.

Opsi WASM PHP/PostgreSQL di browser dapat dipelajari kemudian, tetapi tidak diasumsikan tersedia. Dukungan extension/session/HTTP/konkurensi dan kesetaraan hasil perlu dibuktikan. PGlite milik platform saat ini bukan sandbox SQL mahasiswa; menambahkan editor SQL ke koneksi tersebut tidak memenuhi isolasi.

## 8. Rekomendasi perubahan aplikasi setelah proposal disetujui

### 8.1 Keputusan cakupan yang direkomendasikan

**Rekomendasi awal:** gunakan katalog lengkap ini sebagai peta kurikulum, lalu fokuskan pilot adaptif versi 1.0 pada subset prosedural front-end yang memiliki evaluator sah dan stok latihan memadai. Materi PHP/PostgreSQL, desain, keamanan server, deployment dan proses tetap diakui sebagai capaian mata kuliah serta dinilai di praktikum eksternal/rubrik. Dashboard/laporan harus menyatakan batas cakupan; hasil front-end tidak disebut mastery seluruh mata kuliah.

Pilihan perluasan penuh PHP/PostgreSQL layak dipertimbangkan bila skripsi memang mengukur seluruh kurikulum, tetapi memerlukan revisi SRS, editor/runner, skema metadata, instrumen awal dan protokol penelitian. Pilihan ini bukan sekadar penggantian isi seed. Tidak ada keputusan perluasan yang dianggap sudah diberikan oleh permintaan analisis saat ini.

| Tahap usulan | Pekerjaan konkret | Kriteria sebelum melanjutkan |
|---|---|---|
| A. Validasi akademik | Dosen meninjau 71 baris, W, granularitas, tugas mandiri vs pengayaan, hubungan prasyarat dan ruang lingkup penelitian. | Daftar KC jalur utama/opsional dan evaluator masing-masing disetujui; definisi mastery dan capaian noncoding jelas. |
| B. Bekukan baseline | Setelah ada otorisasi implementasi, inventaris konten DB aktif lewat mekanisme baca yang aman; catat versi/hash/ID lama, dataset dan parameter. | Pemetaan baseline aktual tersedia, tanpa menghapus riwayat. Dokumen ini belum menganggap database identik dengan seed. |
| C. Siapkan konten front-end | Materi ringkas per KC, latihan perpustakaan independen, starter, hint, fixture normal/batas/negatif dan Q-matrix utama. | Review dosen dan walkthrough solusi rujukan lolos seluruh kasus; tes membedakan solusi benar dari hardcode/solusi salah umum. |
| D. Lengkapi bukti evaluator | Rancang RAW/VP serta mock event/async; tangani metadata yang dihapus dan pencegahan submit oleh harness. | H01/C07 dan KC terkait tidak diaktifkan sebelum targetnya benar-benar terukur; CSP/isolasi tetap terjaga. |
| E. Versikan kurikulum/instrumen | Desain metadata sumber/W/level/status/evaluator/versi dan cakupan kelas. Susun kebijakan padanan KC/ID latihan serta penempatan React. | Tidak menafsir ulang histori atau vektor lama. Tidak menyalin P(L) pada split KC tanpa bukti. Rencana data/migrasi dapat ditinjau sebelum eksekusi. |
| F. Validasi model | Pilot berizin, label ahli, CV KNN sesuai fitur, kalibrasi BKT per KC dan penilaian diagnosis BN; benchmark graf final. | Metrik dan interval ketidakpastian dilaporkan; parameter tetap asumsi sampai ada bukti. Batas NFR diuji pada konfigurasi yang benar. |
| G. Perluasan server jika dipilih | Revisi SRS dan desain runner PHP/PG/HTTP serta bukti rubrik; implementasi terpisah setelah persetujuan. | Kebutuhan keamanan, isolasi, runtime, observasi BKT dan operasional disetujui serta diuji sebelum penggunaan mahasiswa. |
| H. Eksperimen | Pretest/posttest tervalidasi dan sebanding, kelas kontrol/adaptif, versi beku dan analisis yang sesuai desain studi. | Cakupan klaim sama dengan cakupan asesmen; consent dan provenance terjaga. |

### 8.2 Metadata yang perlu dirancang, tanpa perubahan skema sekarang

- **KC:** curriculum/version, ID stabil, padanan ID lama, nama/deskripsi/sumber/CPMK, kategori kesulitan, W, jalur utama/opsional, status active/material-only/external-assessment dan alasan prasyarat. Nama status ini contoh desain, bukan enum yang sudah ada.
- **Asesmen:** evaluator kind/version, soal/starter/solusi rujukan, fixture, per-test target KC, Q, difficulty, hint, timeout/resource budget, grading origin dan provenance penilai/rubrik.
- **Hasil:** pisahkan passed, observed_correct, not-assessed/pending/infrastructure-error, hasil rubrik dan skor mata kuliah. Tetapkan transisi yang sah ke model mastery. Tidak menganggap materi dibaca, deployment diunggah atau nilai rubrik baik sebagai “lulus semua tes”.
- **Reprodusibilitas:** versi kurikulum, instrumen pre/posttest, definisi fitur, soal, parameter, graf/CPT dan evaluator pada log/ekspor. Snapshot existing berguna tetapi belum menggantikan semua versi semantik tersebut.

### 8.3 Pertanyaan validasi untuk pertemuan dengan dosen

1. Apakah skripsi meneliti adaptasi front-end dalam mata kuliah full-stack, atau seluruh kompetensi full-stack? Keputusan ini menentukan batas klaim serta kebutuhan revisi SRS.
2. Apakah Bootstrap dan X01-X04 diperlakukan sebagai pengayaan saja? Apakah tugas role admin dan tunggakan >14 hari wajib untuk semua peserta?
3. Apakah granularitas 25 kandidat KC prosedural front-end sudah cukup, dan kompetensi mana perlu digabung/dipecah setelah melihat bukti kesalahan mahasiswa?
4. Apakah alasan W tiap KC diterima? W digunakan untuk alokasi instrumen/rekap capaian atau juga perlu peran baru dalam rekomendasi? Peran baru harus didefinisikan dan diuji terpisah.
5. Apa instrumen individu untuk desain, audit, deployment dan kontribusi? Jika hasilnya hendak masuk BKT, apa dasar pemetaan observasi, kesempatan pertama, dan aturan bantuan dosen?
6. Hubungan prasyarat mana yang benar-benar wajib dan bagaimana CPT-nya dielisitasi? Apakah urutan jobsheet hanya konteks proyek untuk sebagian hubungan?

Pertanyaan ini adalah agenda validasi; pekerjaan analisis/proposal telah diselesaikan tanpa menunggu jawaban atau memulai implementasi.

## 9. Ketertelusuran, pemeriksaan dokumen, dan batas hasil

### 9.1 Sumber primer yang mengunci interpretasi

| Sumber | Lokasi dan bagian penting |
|---|---|
| Kurikulum dosen | [RPS](../KC/RPS-Desain-Pemrograman-Web.md) §3 CPMK, §5 matriks 16 minggu, §6 bobot penilaian dan lampiran pemadatan; README root identik dengan RPS. |
| Tugas dan kriteria | [Jobsheet induk](../KC/Jobsheet-Praktikum-Perpustakaan.md) JS01-JS13, termasuk tugas mandiri. Nomor jobsheet tidak sama dengan minggu karena pengantar/UTS/UAS. |
| Realisasi front-end | [JS01](../KC/kode-praktikum/jobsheet-01/Dokumentasi/README.md), [JS02](../KC/kode-praktikum/jobsheet-02/Dokumentasi/README.md), [JS03](../KC/kode-praktikum/jobsheet-03/Dokumentasi/README.md), [JS04](../KC/kode-praktikum/jobsheet-04/Dokumentasi/README.md), [JS05](../KC/kode-praktikum/jobsheet-05/assets/js/app.js), [JS06](../KC/kode-praktikum/jobsheet-06/assets/js/buku.js). Tautan subbab spesifik tersedia pada setiap KC di bagian 4. |
| Varian framework | [JS03 Bootstrap](../KC/kode-praktikum/jobsheet-03-bootstrap/Dokumentasi/README.md) dan [rangkuman perbandingan](../KC/kode-praktikum/jobsheet-03-bootstrap/Dokumentasi/06-rangkuman-dan-perbandingan.md). |
| Realisasi server | [JS07](../KC/kode-praktikum/jobsheet-07/Dokumentasi/README.md), [JS08](../KC/kode-praktikum/jobsheet-08/Dokumentasi/README.md), [JS09 list](../KC/kode-praktikum/jobsheet-09/buku/list.php), [JS10](../KC/kode-praktikum/jobsheet-10/Dokumentasi/README.md), [JS11 CSRF](../KC/kode-praktikum/jobsheet-11/includes/csrf.php), [checklist](../KC/kode-praktikum/jobsheet-11/docs/security-checklist.md). |
| Integrasi transaksi | [DDL peminjaman](../KC/kode-praktikum/jobsheet-12/sql/03_peminjaman.sql), [pinjam](../KC/kode-praktikum/jobsheet-12/peminjaman/proses_tambah.php), [kembali](../KC/kode-praktikum/jobsheet-12/peminjaman/proses_kembali.php), [riwayat](../KC/kode-praktikum/jobsheet-12/peminjaman/riwayat.php). |
| Produk akhir dan environment | [JS13 README](../KC/kode-praktikum/jobsheet-13/README.md), [config](../KC/kode-praktikum/jobsheet-13/includes/config.php), [manual](../KC/kode-praktikum/jobsheet-13/docs/manual-pengguna.md), [setup](../KC/Setup-Database-PostgreSQL-Laragon.md). |
| SRS asli | `D:/Kuliah/Skripsi/SRS.pdf`: cakupan/batas hlm. 4-5; daftar KC hlm. 6-7; model hlm. 7-8; FR hlm. 9-11; NFR/arsitektur hlm. 11-12; data hlm. 13; evaluasi hlm. 15-16. |

Jejak sumber saat pemeriksaan (SHA-256):

```text
KC/README.md dan KC/RPS-Desain-Pemrograman-Web.md
b15af345cdc7b219b862e55971c4a66b0b68d07cbcef4cc8fa32db9a534359dc
KC/Jobsheet-Praktikum-Perpustakaan.md
d3ca042c685960aa359097bc9dcf777bd9bf43467fe3860e714b2f62841292cb
D:/Kuliah/Skripsi/SRS.pdf
2117e780914b49824bbd057113a26456415c60f2dec1176e34438fbc0788d698
```

### 9.2 Checklist pemeriksaan proposal

- Setiap ID memiliki nama/deskripsi, sumber lokal, kesulitan, W dan alasan, prasyarat, contoh tugas, kasus keberhasilan/negatif, serta metode evaluator.
- Katalog utama: F2 + H5 + C9 + U2 + J11 + P6 + D9 + A4 + S5 + I7 + O3 + T1 = **64**. Pengayaan: B3 + X4 = **7**. Total **71**; bagian 4 dan 5 memakai ID yang sama.
- Jumlah W jalur utama **224** dan pengayaan **14**; angka ini untuk pemeriksaan aritmetika, bukan NAM 100% dan bukan normalisasi parameter probabilistik. Contoh H05 memiliki 4/224 dari total W jalur utama jika cakupan itu dipilih; tidak otomatis menjadi nilai mata kuliah.
- Daftar prasyarat diperiksa untuk referensi ID, siklus, self-edge dan maksimum lima induk. Lulus pemeriksaan struktural tidak berarti hubungan pedagogis/CPT sudah tervalidasi.
- Seluruh 20 KC seed lama memiliki keputusan pemetaan; tidak ada penghapusan KC atau reset mastery yang dijalankan.
- Rancangan tes dibedakan dari tes yang telah lulus; tidak ada klaim PHP/SQL dapat dinilai oleh DOM, tidak ada klaim seluruh mata kuliah telah didukung aplikasi.

Hasil pekerjaan ini adalah satu dokumen proposal. Implementasi, pengesahan bobot/prasyarat, audit konten database aktif, pengembangan runner dan pengambilan data penelitian tetap merupakan pekerjaan berikutnya setelah pemeriksaan serta keputusan pemilik proyek/pembimbing.
