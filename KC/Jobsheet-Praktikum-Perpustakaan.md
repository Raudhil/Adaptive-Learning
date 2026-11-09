# Jobsheet Praktikum — Desain dan Pemrograman Web (Semester 3)

**Studi Kasus Berkelanjutan:** Aplikasi Perpustakaan Sederhana (SIMPUS-Mini)
**Entitas utama:** Buku, Anggota, Petugas (User), Peminjaman
**Stack:** HTML5, CSS3, JavaScript, PHP native, PostgreSQL (PDO_PGSQL)

> Setiap jobsheet adalah kelanjutan langsung dari jobsheet sebelumnya. Kode/berkas yang dibuat di satu minggu **wajib dibawa dan dikembangkan** di minggu berikutnya — bukan proyek baru. Struktur folder proyek disarankan konsisten sejak Jobsheet 1:
>
> ```
> simpus-mini/
> ├── index.php
> ├── includes/        (koneksi.php, header.php, footer.php, auth.php)
> ├── assets/css/
> ├── assets/js/
> ├── buku/            (list.php, tambah.php, edit.php, hapus.php)
> ├── anggota/
> ├── peminjaman/
> └── auth/            (login.php, logout.php, register.php)
> ```

---

## Jobsheet 1 — Minggu 2
### Sub-CPMK: Menyusun struktur halaman web dengan HTML5 semantic

**Keterkaitan:** Titik awal proyek. Halaman yang dibuat di sini menjadi kerangka yang akan di-styling (Jobsheet 2), dibuat responsif (Jobsheet 3), dan akhirnya diberi data dinamis dari database (Jobsheet 8 dst).

**Tujuan:**
- Mahasiswa mampu menyusun struktur HTML5 semantic yang valid untuk 3 halaman: Beranda, Daftar Buku, Form Tambah Buku.

**Dasar Teori Singkat:** tag semantic (`header`, `nav`, `main`, `section`, `article`, `footer`), struktur tabel (`table/thead/tbody`), struktur form (`form/label/input/select/button`).

**Langkah Praktikum:**
1. Buat folder proyek `simpus-mini/` sesuai struktur di atas.
2. Buat `index.html` (nanti akan diubah jadi `.php` di Jobsheet 7) dengan struktur: `header` (judul aplikasi + `nav` berisi link Beranda, Daftar Buku, Tambah Buku, Login), `main`, `footer`.
3. Buat halaman **Daftar Buku** (`buku/list.html`): tabel statis (dummy 5 baris) dengan kolom: Judul, Pengarang, Tahun, Stok, Aksi (tombol Edit/Hapus — belum berfungsi).
4. Buat halaman **Form Tambah Buku** (`buku/tambah.html`): form dengan field `judul`, `pengarang`, `tahun`, `isbn`, `stok`, `kategori` (select), tombol submit (belum diproses).
5. Pastikan HTML lolos validasi (validator.w3.org) — tidak ada tag tak tertutup, atribut `id`/`name` konsisten dengan penamaan yang akan dipakai di PHP nanti (mis. `name="judul"`, bukan `name="Judul"`).

**Tugas Mandiri:** Tambahkan halaman **Daftar Anggota** (`anggota/list.html`) dan **Form Tambah Anggota** dengan struktur semantic serupa (field: nama, no_anggota, alamat, no_hp).

**Kriteria Penilaian (OBA):** kelengkapan tag semantic, validitas HTML, konsistensi penamaan `name`/`id` field (menjadi syarat wajib agar Jobsheet 7 & 8 tidak perlu merombak ulang form).

---

## Jobsheet 2 — Minggu 3
### Sub-CPMK: Mengimplementasikan styling dasar dengan CSS3

**Keterkaitan:** Menstyling seluruh halaman dari Jobsheet 1 tanpa mengubah struktur HTML-nya. File CSS yang dibuat (`assets/css/style.css`) akan dipakai ulang dan disempurnakan di Jobsheet 3 (responsive).

**Tujuan:** Mahasiswa mampu menerapkan CSS3 (box model, Flexbox/Grid) untuk melayout halaman Beranda, Daftar Buku, dan Form Tambah Buku.

**Dasar Teori Singkat:** box model, selector & specificity, Flexbox (navbar), Grid (layout halaman/kartu buku).

**Langkah Praktikum:**
1. Buat `assets/css/style.css`, hubungkan ke semua halaman HTML.
2. Layout `header`+`nav` dengan **Flexbox** (logo kiri, menu kanan/rata tengah).
3. Styling tabel Daftar Buku: border, zebra-stripe (`nth-child`), hover row.
4. Styling form Tambah Buku: label di atas input, spacing konsisten, tombol submit dengan warna aksen.
5. Buat 1 komponen kartu (`.card`) menggunakan **CSS Grid** untuk menampilkan ringkasan statistik di Beranda (Total Buku, Total Anggota, Total Dipinjam — nilai masih statis/dummy).

**Tugas Mandiri:** Styling halaman Daftar Anggota & Form Tambah Anggota agar konsisten secara visual dengan halaman Buku (reuse class CSS yang sama).

**Kriteria Penilaian:** konsistensi visual antar halaman, penggunaan Flexbox/Grid (bukan hanya `float`/margin manual), keterbacaan (kontras warna, spacing).

---

## Jobsheet 3 — Minggu 4
### Sub-CPMK: Membangun tampilan responsif

**Keterkaitan:** Menyempurnakan `style.css` dari Jobsheet 2 agar seluruh halaman yang sudah ada tetap utuh di perangkat mobile — tidak ada halaman baru, murni penyempurnaan.

**Tujuan:** Mahasiswa mampu membuat layout responsif mobile-first untuk seluruh halaman proyek.

**Dasar Teori Singkat:** `meta viewport`, mobile-first, media query (`min-width`), grid/flex responsif, opsional: mengganti sebagian layout dengan Bootstrap grid.

**Langkah Praktikum:**
1. Tambahkan `<meta name="viewport" content="width=device-width, initial-scale=1">` ke semua halaman.
2. Ubah navbar: pada layar < 768px, menu berubah jadi hamburger (boleh murni CSS `checkbox hack` — JS interaktif menyusul di Jobsheet 5).
3. Tabel Daftar Buku: pada layar sempit, buat tabel bisa di-scroll horizontal (`overflow-x: auto` pada wrapper) atau ubah jadi tampilan kartu bertumpuk.
4. Grid kartu statistik di Beranda: 3 kolom di desktop → 1 kolom di mobile via media query.
5. Uji tampilan di 3 breakpoint (mobile ≤480px, tablet ~768px, desktop ≥1024px) menggunakan DevTools.

**Tugas Mandiri:** Terapkan pola responsif yang sama ke halaman Anggota.

**Kriteria Penilaian:** tidak ada elemen terpotong/overflow di layar kecil, navbar berfungsi di semua ukuran, konsistensi breakpoint di seluruh halaman.

---

## Jobsheet 4 — Minggu 5
### Sub-CPMK: Merancang UI/UX aplikasi (proyek)

**Keterkaitan:** Jobsheet 1-3 baru mencakup 4 halaman dasar. Sebelum masuk ke interaktivitas (JS) dan back-end (PHP+PostgreSQL) pada minggu-minggu berikutnya, proyek perlu rancangan UX menyeluruh untuk fitur yang **belum dibangun**: Login, Dashboard Petugas, Form Peminjaman/Pengembalian. Wireframe di jobsheet ini menjadi acuan struktur HTML baru yang akan dibuat mulai Jobsheet 5.

**Tujuan:** Mahasiswa mampu membuat wireframe dan user flow lengkap aplikasi perpustakaan.

**Langkah Praktikum:**
1. Identifikasi aktor: **Tamu** (lihat katalog buku saja) dan **Petugas** (login, kelola buku/anggota/peminjaman).
2. Buat **user flow** (diagram alur) untuk skenario: "Petugas meminjamkan buku ke anggota" dan "Petugas mengembalikan buku".
3. Buat **wireframe** (Figma/Excalidraw/kertas+scan) untuk halaman: Login, Dashboard Petugas (ringkasan + shortcut), Form Peminjaman, Form Pengembalian, Riwayat Peminjaman per anggota.
4. Selaraskan wireframe dengan halaman yang sudah ada (Beranda, Daftar Buku) — pastikan navigasi antar halaman konsisten satu sistem informasi, bukan halaman terpisah-pisah.
5. Presentasikan rancangan (5 menit/kelompok) untuk mendapat umpan balik dosen sebelum diimplementasikan.

**Tugas Mandiri:** Lengkapi wireframe dengan mockup visual (warna, tipografi) mengikuti style guide yang sudah dipakai di Jobsheet 2-3.

**Kriteria Penilaian (Non-tes, rubrik desain):** kejelasan alur, kelengkapan skenario (edge case: buku stok habis, anggota masih ada tunggakan), konsistensi dengan desain visual yang sudah berjalan.

---

## Jobsheet 5 — Minggu 6
### Sub-CPMK: Menerapkan manipulasi DOM & event JavaScript

**Keterkaitan:** Menghidupkan interaksi pada halaman-halaman existing (Jobsheet 1-3) sesuai wireframe Jobsheet 4, murni di sisi client — belum terhubung ke server/database.

**Tujuan:** Mahasiswa mampu memanipulasi DOM dan menangani event untuk menambah interaktivitas.

**Dasar Teori Singkat:** `querySelector`, event listener, manipulasi elemen (`createElement`, `classList`), validasi form client-side.

**Langkah Praktikum:**
1. Buat `assets/js/app.js`, hubungkan ke halaman terkait.
2. **Hamburger menu**: ganti checkbox-hack Jobsheet 3 dengan toggle class via JS (`click` event pada tombol menu).
3. **Validasi form Tambah Buku**: cegah submit bila field wajib kosong atau `tahun` di luar rentang wajar; tampilkan pesan error inline (buat/hapus elemen `<span class="error">` via DOM).
4. **Filter/pencarian buku**: input pencarian di atas tabel Daftar Buku yang menyaring baris tabel secara real-time berdasarkan judul (`keyup` event + `style.display`).
5. **Konfirmasi hapus**: tombol Hapus pada tabel menampilkan dialog konfirmasi (`confirm()`) sebelum menghapus baris dari tampilan (masih front-end saja).

**Tugas Mandiri:** Terapkan validasi & filter yang sama pada halaman Anggota.

**Kriteria Penilaian:** validasi berjalan tanpa reload halaman, filter responsif terhadap ketikan, tidak ada error di console browser.

---

## Jobsheet 6 — Minggu 7
### Sub-CPMK: Menerapkan komunikasi asinkron (AJAX/fetch, JSON)

**Keterkaitan:** Mensimulasikan pola pengambilan data dinamis **sebelum** back-end sungguhan (PHP+PostgreSQL) tersedia di Jobsheet 8 — memakai file JSON statis sebagai pengganti sementara API. Pola `fetch` yang dipelajari di sini akan dipakai ulang untuk memanggil endpoint PHP sungguhan mulai Jobsheet 9.

**Tujuan:** Mahasiswa mampu mengambil dan menampilkan data secara asinkron menggunakan `fetch` dan JSON.

**Langkah Praktikum:**
1. Buat `data/buku.json` berisi array 10 objek buku (judul, pengarang, tahun, stok).
2. Ubah tabel Daftar Buku: kosongkan `<tbody>`, isi baris tabel secara dinamis via `fetch('data/buku.json')` → `.then(res => res.json())` → render baris dengan `map`/loop dan `innerHTML` atau `createElement`.
3. Tambahkan **loading indicator** sederhana yang tampil selama proses fetch berlangsung (gunakan `setTimeout` untuk simulasi delay jaringan agar loading terlihat).
4. Tangani error (`catch`) — tampilkan pesan "Gagal memuat data" bila fetch gagal (uji dengan salah ketik nama file).
5. Terapkan pola `async/await` sebagai alternatif `.then()` pada salah satu fungsi.

**Tugas Mandiri:** Buat `data/anggota.json` dan terapkan pola fetch yang sama pada halaman Daftar Anggota.

**Kriteria Penilaian:** data tampil dari JSON tanpa hardcode di HTML, penanganan loading & error ada, kode memakai `async/await` minimal di satu tempat.

---

## Jobsheet 7 — Minggu 9
### Sub-CPMK: Mengimplementasikan dasar PHP & pengolahan form

**Keterkaitan:** Titik peralihan dari front-end murni ke server-side. Form Tambah Buku dari Jobsheet 1 (yang sudah divalidasi client-side di Jobsheet 5) sekarang diproses di server. Belum tersambung database — data sementara ditampung di `$_SESSION` sebagai jembatan menuju Jobsheet 8.

**Tujuan:** Mahasiswa mampu memproses input form menggunakan PHP (superglobal, kontrol alur, validasi server-side).

**Langkah Praktikum:**
1. Aktifkan PHP di lingkungan lab (XAMPP), rename `index.html` → `index.php`, dst untuk seluruh halaman yang butuh logika server.
2. Ubah `buku/tambah.html` → `buku/tambah.php`: `method="post" action="proses_tambah.php"`.
3. Buat `buku/proses_tambah.php`: ambil `$_POST`, validasi server-side (field wajib, `tahun` numerik, `stok >= 0`) — **mengapa perlu validasi server padahal sudah divalidasi JS di Jobsheet 5**: validasi client bisa dilewati (nonaktifkan JS/kirim request manual), jadi validasi server wajib sebagai lapisan kedua.
4. Bila valid, simpan sementara ke `$_SESSION['buku'][]` (array), lalu redirect ke `buku/list.php`.
5. `buku/list.php`: render tabel dari `$_SESSION['buku']` menggunakan `foreach` (menggantikan data dummy statis dari Jobsheet 1).
6. Tampilkan pesan sukses/error menggunakan flash message sederhana via `$_SESSION`.

**Tugas Mandiri:** Terapkan pola yang sama (form → proses → session → list) untuk entitas Anggota.

**Kriteria Penilaian:** validasi server-side berfungsi independen dari JS, data baru tampil di list setelah submit, tidak ada notice/warning PHP di layar.

---

## Jobsheet 8 — Minggu 10
### Sub-CPMK: Menghubungkan aplikasi dengan basis data PostgreSQL

**Keterkaitan:** Menggantikan penyimpanan sementara `$_SESSION` (Jobsheet 7) dengan PostgreSQL sungguhan — struktur form & alur proses PHP tetap sama, hanya sumber datanya berubah permanen mulai jobsheet ini.

**Tujuan:** Mahasiswa mampu merancang ERD, membuat koneksi PDO_PGSQL, dan menjalankan query dasar.

**Langkah Praktikum:**
1. Rancang **ERD**: tabel `buku` (id SERIAL, judul, pengarang, tahun, isbn, stok, kategori), `anggota` (id, nama, no_anggota, alamat, no_hp), relasi ke `peminjaman` disiapkan strukturnya (dipakai penuh di Jobsheet 12).
2. Buat database `simpus_mini` di PostgreSQL (pgAdmin/psql), jalankan DDL `CREATE TABLE` sesuai ERD.
3. Buat `includes/koneksi.php`:
   ```php
   <?php
   $host = "localhost"; $db = "simpus_mini"; $user = "postgres"; $pass = "";
   try {
       $pdo = new PDO("pgsql:host=$host;dbname=$db", $user, $pass);
       $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
   } catch (PDOException $e) {
       die("Koneksi gagal: " . $e->getMessage());
   }
   ```
4. Ubah `buku/proses_tambah.php` (dari Jobsheet 7): ganti `$_SESSION['buku'][] = ...` menjadi `INSERT INTO buku (...) VALUES (...) RETURNING id` via `$pdo->prepare()`.
5. Ubah `buku/list.php`: ganti `foreach($_SESSION['buku'])` menjadi `SELECT * FROM buku ORDER BY id DESC` lalu `fetchAll()`.
6. Uji: data yang diinput tetap ada setelah browser ditutup-buka lagi (bukti sudah persisten di DB, bukan session).

**Tugas Mandiri:** Buat tabel `anggota` dan sambungkan form Tambah/Daftar Anggota ke PostgreSQL dengan pola yang sama.

**Kriteria Penilaian:** ERD logis & ternormalisasi, koneksi PDO_PGSQL tanpa error, query pakai prepared statement (bukan concatenation string).

---

## Jobsheet 9 — Minggu 11
### Sub-CPMK: Membangun fitur CRUD pada proyek

**Keterkaitan:** Melengkapi operasi database dari Jobsheet 8 (baru Create + Read) dengan Update dan Delete — pada entitas yang sama (`buku`, `anggota`).

**Tujuan:** Mahasiswa mampu mengimplementasikan CRUD penuh dengan PHP & PostgreSQL.

**Langkah Praktikum:**
1. `buku/edit.php`: ambil data by `id` (`SELECT ... WHERE id = :id`), tampilkan pra-isi di form (reuse form Jobsheet 1, tambahkan hidden input `id`).
2. `buku/proses_edit.php`: `UPDATE buku SET judul=:judul, ... WHERE id=:id` via prepared statement.
3. `buku/hapus.php`: `DELETE FROM buku WHERE id=:id` — panggil dari tombol Hapus di `list.php` (gunakan konfirmasi JS dari Jobsheet 5 sebelum request dikirim, method POST bukan GET untuk aksi delete).
4. Tambahkan **pagination sederhana** pada `list.php` bila data > 10 baris (`LIMIT`/`OFFSET`).
5. Ulangi langkah 1-3 untuk entitas `anggota`.
6. Uji seluruh siklus: tambah → tampil → ubah → tampil berubah → hapus → hilang dari list.

**Tugas Mandiri:** Tambahkan fitur pencarian buku server-side (`WHERE judul ILIKE :keyword`) sebagai pengganti filter client-side Jobsheet 5 yang hanya bekerja pada data yang sudah ter-load.

**Kriteria Penilaian:** keempat operasi CRUD berfungsi penuh untuk 2 entitas, delete memakai POST + prepared statement, tidak ada data korup akibat query gagal.

---

## Jobsheet 10 — Minggu 12
### Sub-CPMK: Menerapkan autentikasi & manajemen sesi pengguna

**Keterkaitan:** Semua halaman CRUD (Jobsheet 8-9) sampai saat ini bisa diakses siapa saja. Jobsheet ini menerapkan wireframe Login/Dashboard dari Jobsheet 4 dan **mengunci** akses CRUD hanya untuk Petugas yang login.

**Tujuan:** Mahasiswa mampu membangun autentikasi (register/login/logout) dan melindungi halaman dengan session.

**Langkah Praktikum:**
1. Buat tabel `users` (id, nama, username, password, role) di PostgreSQL.
2. `auth/register.php` + proses: simpan password dengan `password_hash()` (**bukan** plaintext).
3. `auth/login.php` + proses: verifikasi `password_verify()`, bila cocok set `$_SESSION['user_id']`, `$_SESSION['role']`, redirect ke Dashboard (wireframe Jobsheet 4).
4. `auth/logout.php`: `session_destroy()`.
5. Buat `includes/auth.php` (guard clause) yang di-`include` di baris paling atas setiap halaman `buku/*.php` dan `anggota/*.php`:
   ```php
   session_start();
   if (!isset($_SESSION['user_id'])) {
       header("Location: /auth/login.php");
       exit;
   }
   ```
6. Sesuaikan navbar (Jobsheet 2-3): tampilkan menu Login jika belum login, atau nama user + Logout jika sudah login.

**Tugas Mandiri:** Bedakan tampilan menu berdasarkan `role` (mis. hanya `admin` yang bisa akses Hapus Anggota).

**Kriteria Penilaian:** password ter-hash, halaman CRUD tidak bisa diakses tanpa login (uji dengan akses URL langsung), session konsisten di seluruh halaman.

---

## Jobsheet 11 — Minggu 13
### Sub-CPMK: Menerapkan prinsip keamanan web dasar

**Keterkaitan:** Audit dan perkuat seluruh kode yang sudah dibangun Jobsheet 7-10 — tidak menambah fitur baru, murni hardening.

**Tujuan:** Mahasiswa mampu mengidentifikasi dan menutup kerentanan dasar pada aplikasi yang sudah berjalan.

**Langkah Praktikum:**
1. **SQL Injection**: audit ulang seluruh query di `buku/`, `anggota/`, `auth/` — pastikan 100% memakai prepared statement PDO_PGSQL (bukan `$pdo->query("... $_POST[x] ...")`). Uji coba input `' OR '1'='1` pada form login untuk membuktikan sudah aman.
2. **XSS**: bungkus semua output data user ke HTML dengan `htmlspecialchars()` (mis. saat menampilkan `judul` buku atau `nama` anggota di tabel) — uji dengan menyimpan judul buku berisi `<script>alert(1)</script>`.
3. **CSRF dasar**: tambahkan hidden token (`bin2hex(random_bytes(32))`) tersimpan di session pada form Hapus/Edit, verifikasi token saat proses submit.
4. **Validasi & sanitasi input** (review menyeluruh): tipe data (`(int)`, `filter_var`), panjang string, whitelist untuk `kategori`/`role`.
5. Buat checklist keamanan (dokumen singkat) mencatat kerentanan yang ditemukan dan cara perbaikannya per halaman.

**Tugas Mandiri:** Terapkan `session_regenerate_id()` setelah login berhasil untuk mencegah session fixation.

**Kriteria Penilaian:** checklist keamanan terisi lengkap dengan bukti before/after, uji SQL injection & XSS pada form gagal (tidak tereksploitasi).

---

## Jobsheet 12 — Minggu 14
### Sub-CPMK: Mengintegrasikan front-end dan back-end proyek secara utuh

**Keterkaitan:** Melengkapi modul terakhir yang belum dibangun — **Peminjaman & Pengembalian** — yang menghubungkan tabel `buku`, `anggota`, dan `users` (Jobsheet 8-10) sekaligus, lalu menguji seluruh aplikasi sebagai satu sistem.

**Tujuan:** Mahasiswa mampu mengintegrasikan seluruh modul menjadi satu alur kerja yang utuh dan mengujinya secara end-to-end.

**Langkah Praktikum:**
1. Buat tabel `peminjaman` (id, buku_id FK, anggota_id FK, tanggal_pinjam, tanggal_kembali, status).
2. `peminjaman/tambah.php` (sesuai wireframe Jobsheet 4): pilih anggota (dropdown dari tabel `anggota`) + pilih buku (dropdown, hanya tampilkan `stok > 0`), simpan record + **kurangi stok buku** (`UPDATE buku SET stok = stok - 1`) dalam satu transaksi (`$pdo->beginTransaction()` / `commit()`).
3. `peminjaman/kembali.php`: update `status` jadi "dikembalikan", `tanggal_kembali = now()`, **tambah kembali stok buku**.
4. `peminjaman/riwayat.php`: tampilkan histori per anggota (JOIN 3 tabel).
5. Perbarui kartu statistik di Beranda (Jobsheet 2) agar mengambil angka **real** dari database: `COUNT(*)` buku, anggota, dan peminjaman aktif (menggantikan angka dummy sejak awal).
6. Lakukan **pengujian end-to-end** menyeluruh: registrasi → login → tambah buku/anggota → pinjam → kembalikan → cek riwayat → logout, catat bug yang ditemukan dan perbaiki.

**Tugas Mandiri:** Tambahkan validasi bisnis: anggota dengan peminjaman terlambat (`tanggal_pinjam` > 14 hari & belum kembali) tidak bisa meminjam buku baru.

**Kriteria Penilaian:** transaksi pinjam/kembali konsisten (stok tidak minus/dobel), seluruh alur end-to-end berjalan tanpa error, data Beranda real-time sesuai database.

---

## Jobsheet 13 — Minggu 15
### Sub-CPMK: Mendeploy dan mendokumentasikan aplikasi

**Keterkaitan:** Menyiapkan aplikasi utuh dari Jobsheet 1-12 agar bisa diakses/dinilai sebagai produk akhir pada UAS (Minggu 16).

**Tujuan:** Mahasiswa mampu men-deploy aplikasi dan menyusun dokumentasi teknis yang memadai.

**Langkah Praktikum:**
1. Siapkan **environment deployment** (pilih salah satu): server lab lokal (XAMPP + PostgreSQL diakses via jaringan lab) atau hosting gratis yang mendukung PHP+PostgreSQL.
2. Pisahkan kredensial database dari kode (`includes/koneksi.php` menggunakan variabel environment atau file config yang tidak ikut ke repository publik).
3. Ekspor struktur database (`pg_dump --schema-only`) sebagai bagian dokumentasi instalasi.
4. Susun **dokumentasi teknis** (README.md di root proyek) mencakup: deskripsi aplikasi, ERD final, cara instalasi (clone → import DB → konfigurasi koneksi → jalankan), daftar fitur per role.
5. Susun **manual pengguna** singkat (screenshot alur utama: login, tambah buku, pinjam buku, kembalikan buku).
6. Uji aplikasi dari environment deployment (bukan `localhost` development) untuk memastikan tidak ada path/URL yang hardcode salah.

**Tugas Mandiri:** Siapkan draf naskah presentasi (5-7 menit) untuk demo UAS mencakup alasan desain teknis (mengapa memilih struktur tabel/alur tertentu).

**Kriteria Penilaian:** aplikasi dapat diakses & berjalan di environment deployment, dokumentasi lengkap dan bisa diikuti orang lain untuk instalasi ulang, tidak ada kredensial sensitif ter-commit ke kode.

---

## Ringkasan Keterhubungan Antar Jobsheet

```
JS1 (HTML skeleton) → JS2 (CSS styling) → JS3 (responsive)
        ↓
JS4 (UX redesign utuh: + Login, Dashboard, Peminjaman)
        ↓
JS5 (JS interaktif on existing pages) → JS6 (fetch + JSON dummy)
        ↓
JS7 (PHP form handling, session sbg DB sementara)
        ↓
JS8 (PostgreSQL menggantikan session) → JS9 (lengkapi jadi CRUD penuh)
        ↓
JS10 (Login mengunci akses CRUD) → JS11 (hardening keamanan seluruh kode)
        ↓
JS12 (modul Peminjaman menyatukan semua entitas + uji end-to-end)
        ↓
JS13 (deploy + dokumentasi produk akhir) → UAS (demo aplikasi utuh)
```

Setiap jobsheet secara eksplisit menyatakan bagian mana dari kode jobsheet sebelumnya yang dipakai ulang, diubah, atau disempurnakan — sehingga di akhir Minggu 15, hasil akhirnya adalah **satu aplikasi perpustakaan utuh**, bukan 13 potongan latihan terpisah.
