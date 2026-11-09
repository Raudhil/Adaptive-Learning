# Cheatsheet PHP, HTML & CSS — SIMPUS-Mini

Referensi cepat pola HTML/CSS/PHP yang dipakai sepanjang jobsheet 1–13.
Semua contoh diambil langsung dari kode proyek ini (bukan contoh
generik), supaya konsisten dengan apa yang sudah kamu pelajari.

---

# 1. HTML

## 1.1 Struktur Semantic Dasar

```html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>SIMPUS-Mini | Daftar Buku</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <header>
        <h1>SIMPUS-Mini</h1>
        <nav>
            <ul>
                <li><a href="index.php">Beranda</a></li>
                <li><a href="buku/list.php">Daftar Buku</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section>
            <h2>Judul Halaman</h2>
            ...
        </section>
    </main>

    <footer>
        <p>&copy; 2026 SIMPUS-Mini</p>
    </footer>
</body>
</html>
```

- `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>` —
  tag semantic, menggantikan `<div>` generik supaya struktur halaman
  bermakna (bagus untuk aksesibilitas & SEO).
- `viewport` meta tag **wajib** untuk halaman responsif (dipakai sejak
  jobsheet-03).

## 1.2 Tabel Data

```html
<div class="table-responsive">
<table>
    <thead>
        <tr>
            <th>Judul</th>
            <th>Pengarang</th>
            <th>Aksi</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Laskar Pelangi</td>
            <td>Andrea Hirata</td>
            <td>
                <a href="edit.php?id=1" class="btn-edit">Edit</a>
                <button class="btn-hapus">Hapus</button>
            </td>
        </tr>
    </tbody>
</table>
</div>
```

`<div class="table-responsive">` membungkus tabel supaya bisa
di-scroll horizontal di layar sempit (`overflow-x: auto` di CSS),
bukan memaksa tabel menyempit sampai teksnya tumpang tindih.

## 1.3 Form

```html
<form method="post" action="proses_tambah.php">
    <p>
        <label for="judul">Judul</label><br>
        <input type="text" id="judul" name="judul" required>
    </p>
    <p>
        <label for="tahun">Tahun Terbit</label><br>
        <input type="number" id="tahun" name="tahun" min="1900" max="2026" required>
    </p>
    <p>
        <label for="kategori">Kategori</label><br>
        <select id="kategori" name="kategori">
            <option value="fiksi">Fiksi</option>
            <option value="non-fiksi">Non-Fiksi</option>
        </select>
    </p>
    <p>
        <button type="submit">Simpan</button>
    </p>
</form>
```

- `method="post"` — data tidak tampil di URL, dipakai untuk form yang
  mengubah data (tambah/edit/hapus).
- `method="get"` — dipakai untuk form pencarian (`list.php?q=...`),
  supaya hasil bisa di-bookmark/di-share lewat URL.
- `for="judul"` di `<label>` harus **sama persis** dengan `id` di
  `<input>` — mengklik label otomatis fokus ke input terkait.
- Atribut validasi HTML5 bawaan: `required`, `min`, `max`,
  `minlength` — validasi **client-side pertama**, bisa dilewati kalau
  JS/HTML dimatikan, makanya tetap perlu validasi server (§3.6).

## 1.4 Form Hapus (Tombol di dalam Tabel)

```html
<form class="form-hapus" method="post" action="hapus.php">
    <input type="hidden" name="id" value="1">
    <input type="hidden" name="csrf_token" value="...">
    <button type="submit" class="btn-hapus">Hapus</button>
</form>
```

Tombol Hapus dibungkus `<form>` tersendiri (bukan `<a href="hapus.php?id=1">`)
supaya penghapusan terjadi lewat **POST**, bukan **GET** — mencegah
data terhapus tidak sengaja lewat prefetch browser/crawler, dan
memungkinkan token CSRF disertakan (§3.8).

---

# 2. CSS

## 2.1 Reset & Base

```css
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: "Segoe UI", Arial, sans-serif;
    line-height: 1.5;
}
```

`box-sizing: border-box` membuat `padding`/`border` dihitung **di
dalam** lebar elemen (bukan menambah), supaya layout tidak melebar
tak terduga — ini nyaris selalu dipakai di awal semua proyek CSS.

## 2.2 Navbar dengan Flexbox

```css
header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
}

header nav ul {
    list-style: none;
    display: flex;
    gap: 1.25rem;
}
```

- `justify-content: space-between` — dorong judul ke kiri, menu ke
  kanan, otomatis mengisi ruang di antaranya.
- `list-style: none` — hilangkan bullet default `<ul>`.
- `gap` — jarak antar item flex, tanpa perlu `margin` manual di
  setiap `<li>`.

## 2.3 Kartu Statistik dengan CSS Grid

```css
main section:nth-of-type(2) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
}
```

`repeat(3, 1fr)` — 3 kolom sama lebar (`1fr` = 1 fraction dari ruang
tersedia). Dipakai untuk kartu "Total Buku / Total Anggota / Sedang
Dipinjam" di Beranda.

## 2.4 Tabel

```css
table {
    width: 100%;
    border-collapse: collapse;
}

th, td {
    text-align: left;
    padding: 0.65rem 0.75rem;
    border-bottom: 1px solid #e2e6ea;
}

tbody tr:nth-child(even) {
    background-color: #f7f9fb;
}

tbody tr:hover {
    background-color: #eef4fa;
}
```

`border-collapse: collapse` menyatukan garis antar sel (default
`separate` membuat garis dobel). `:nth-child(even)` = *zebra striping*,
mempermudah mata mengikuti baris panjang.

## 2.5 Form

```css
form input,
form select {
    width: 100%;
    max-width: 400px;
    padding: 0.55rem 0.7rem;
    border: 1px solid #cdd4da;
    border-radius: 4px;
}

form button[type="submit"] {
    background-color: #1d5b8a;
    color: #fff;
    border: none;
    padding: 0.6rem 1.5rem;
    border-radius: 4px;
    cursor: pointer;
}
```

`button[type="submit"]` — *attribute selector*, hanya menarget
`<button>` yang punya atribut `type="submit"` persis, tidak menimpa
tombol lain (mis. `.btn-hapus`).

## 2.6 Responsive — Media Query

```css
/* Tablet ke bawah */
@media (max-width: 768px) {
    main section:nth-of-type(2) {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* Mobile */
@media (max-width: 480px) {
    .nav-toggle-label {
        display: block;
    }

    header nav {
        display: none;
        width: 100%;
    }

    header nav.nav-open {
        display: block;
    }

    header nav ul {
        flex-direction: column;
    }
}
```

- `@media (max-width: Npx)` — aturan di dalamnya **hanya** berlaku
  kalau lebar layar ≤ `Npx`. Selalu ditulis **setelah** aturan
  dasarnya (CSS "menang" berdasarkan urutan kalau spesifisitasnya
  sama) supaya bisa **menimpa**.
- Pola hamburger menu: `nav` disembunyikan (`display: none`) di layar
  kecil, class `.nav-open` (ditambahkan lewat JavaScript saat tombol
  hamburger diklik) memunculkannya lagi.

## 2.7 Konvensi Warna Status

```css
.flash-success { background-color: #d4edda; color: #155724; }
.flash-error   { background-color: #f8d7da; color: #721c24; }
```

Hijau = sukses, merah = gagal — konvensi universal yang dipakai
konsisten untuk flash message di seluruh jobsheet 7–13.

---

# 3. PHP

## 3.1 Sintaks Dasar

```php
<?php
$judul = "Laskar Pelangi";          // variabel selalu diawali $
$totalBuku = count($daftarBuku);
echo $totalBuku;                     // cetak nilai ke output HTML
$flash = $_SESSION['flash'] ?? null; // ?? = null coalescing ("kalau tidak ada, pakai ini")
?>
```

Campur PHP + HTML dalam satu file — kode PHP diapit `<?php ... ?>`,
di luar itu semua teks dianggap HTML biasa apa adanya.

## 3.2 `include` — Header/Footer Bersama

```php
<?php
$page_title = "Beranda";
include __DIR__ . '/includes/header.php';
?>
        <section>...konten khusus halaman ini...</section>
<?php include __DIR__ . '/includes/footer.php'; ?>
```

`__DIR__` selalu berisi folder file yang sedang berjalan — dikombinasikan
dengan path relatif (`/includes/header.php` dari root,
`/../includes/header.php` dari folder satu level ke dalam seperti
`buku/`), hasilnya **selalu benar** tidak peduli halaman mana yang
meng-`include`.

## 3.3 Path Relatif Otomatis (`$base`) di `header.php`

```php
$__jobsheetRoot = dirname(__DIR__);
$__scriptDir = dirname($_SERVER['SCRIPT_FILENAME']);
$__rel = ltrim(str_replace('\\', '/', substr($__scriptDir, strlen($__jobsheetRoot))), '/');
$base = $__rel === '' ? '' : str_repeat('../', substr_count($__rel, '/') + 1);
```

```php
<link rel="stylesheet" href="<?php echo $base; ?>assets/css/style.css">
<li><a href="<?php echo $base; ?>index.php">Beranda</a></li>
```

Menghitung otomatis berapa banyak `../` dibutuhkan supaya link CSS/JS/menu
tetap benar dari halaman di kedalaman folder mana pun (`index.php` di
root vs `buku/list.php` satu folder lebih dalam) — detail lengkap di
[`kode-praktikum/jobsheet-07/Dokumentasi/02-includes-header-footer.md` §2.3](kode-praktikum/jobsheet-07/Dokumentasi/02-includes-header-footer.md#23-path-relatif-otomatis-di-includesheaderphp).

## 3.4 Session

```php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$_SESSION['user_id'] = $user['id'];      // simpan
$sudahLogin = isset($_SESSION['user_id']); // baca
unset($_SESSION['flash']);                // hapus satu kunci
session_destroy();                        // hapus semua (logout)
```

`session_status() === PHP_SESSION_NONE` mencegah error "session
already started" kalau `session_start()` dipanggil lebih dari satu
kali per request (umum terjadi karena dipanggil di `header.php` **dan**
`includes/auth.php`).

## 3.5 Koneksi Database (PDO)

```php
$pdo = new PDO("pgsql:host=$host;port=$port;dbname=$db", $user, $pass);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// SELECT banyak baris
$stmt = $pdo->prepare("SELECT * FROM buku WHERE judul ILIKE :kw");
$stmt->execute(['kw' => '%' . $keyword . '%']);
$hasil = $stmt->fetchAll(PDO::FETCH_ASSOC);

// SELECT satu nilai (mis. COUNT)
$total = $pdo->query("SELECT COUNT(*) FROM buku")->fetchColumn();

// INSERT
$stmt = $pdo->prepare("INSERT INTO buku (judul, tahun) VALUES (:judul, :tahun)");
$stmt->execute(['judul' => $judul, 'tahun' => $tahun]);
```

**Selalu** pakai *prepared statement* (`:parameter` + `execute([...])`)
untuk data dari `$_POST`/`$_GET` — **jangan pernah** menempelkan
langsung ke string SQL (celah SQL Injection). Detail lebih lengkap ada
di [`Cheatsheet-PostgreSQL.md`](Cheatsheet-PostgreSQL.md).

## 3.6 Validasi Form Server-Side

```php
$nama = trim($_POST['nama'] ?? '');
$tahun = $_POST['tahun'] ?? '';

$errors = [];
if ($nama === '') {
    $errors[] = "Nama wajib diisi.";
}
if (!is_numeric($tahun) || $tahun < 1900) {
    $errors[] = "Tahun tidak valid.";
}

if (!empty($errors)) {
    $_SESSION['flash'] = ['type' => 'error', 'pesan' => implode(' ', $errors)];
    header('Location: tambah.php');
    exit;
}
```

- `trim()` — buang spasi di awal/akhir sebelum divalidasi.
- Validasi server **wajib ada** meski sudah ada `required`/validasi JS
  di form — keduanya berjalan di browser dan **bisa dinonaktifkan**
  pengguna, validasi PHP tidak bisa dilewati karena berjalan di server.
- `header('Location: ...')` **harus** dipanggil sebelum ada output
  HTML apa pun (sebelum `include header.php`), diikuti `exit;` supaya
  kode di bawahnya tidak ikut jalan.

## 3.7 Escaping Output — Mencegah XSS

```php
// includes/helpers.php
function e($value) {
    return htmlspecialchars((string) ($value ?? ''), ENT_QUOTES, 'UTF-8');
}
```

```php
<td><?php echo e($buku['judul']); ?></td>
```

**Setiap** data yang berasal dari input pengguna (nama, judul, hasil
pencarian, dst.) harus dibungkus `e()` sebelum dicetak ke HTML —
mengubah karakter seperti `<script>` menjadi teks biasa yang aman
ditampilkan, bukan dieksekusi browser.

## 3.8 CSRF Protection

```php
// includes/csrf.php
function csrf_token() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function csrf_field() {
    return '<input type="hidden" name="csrf_token" value="' . csrf_token() . '">';
}

function csrf_verify() {
    $token = $_POST['csrf_token'] ?? '';
    if ($token === '' || !hash_equals($_SESSION['csrf_token'] ?? '', $token)) {
        http_response_code(403);
        die('Permintaan ditolak: token CSRF tidak valid atau kedaluwarsa.');
    }
}
```

Dipakai: `<?php echo csrf_field(); ?>` di setiap `<form method="post">`,
dan `csrf_verify();` di baris pertama setiap `proses_*.php`/`hapus.php`
yang menerima POST. `hash_equals()` (bukan `===`) dipakai supaya
perbandingan token tahan terhadap *timing attack*.

## 3.9 Guard Login (`includes/auth.php`)

```php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id'])) {
    header('Location: ../auth/login.php');
    exit;
}
```

Di-`require` sebagai **baris pertama** halaman yang butuh login
(sebelum `include header.php`) — urutan ini wajib, karena
`header('Location: ...')` gagal kalau sudah ada HTML yang terlanjur
terkirim ke browser.

```php
<?php
require __DIR__ . '/../includes/auth.php';   // baris pertama
$page_title = "Tambah Buku";
include __DIR__ . '/../includes/header.php'; // setelah auth.php
```

## 3.10 Password Hashing

```php
$hash = password_hash($password, PASSWORD_DEFAULT);   // saat registrasi
// simpan $hash ke kolom `password` di database

password_verify($inputPassword, $hash);                // saat login, true/false
```

**Tidak pernah** simpan password asli — `password_hash()` satu arah
(tidak bisa dibalik), `password_verify()` membandingkan tanpa perlu
membalik hash-nya.

## 3.11 Pagination & Pencarian Server-Side

```php
$perPage = 5;
$page = max(1, (int) ($_GET['page'] ?? 1));
$offset = ($page - 1) * $perPage;

$stmt = $pdo->prepare("SELECT * FROM buku ORDER BY id DESC LIMIT :limit OFFSET :offset");
$stmt->bindValue('limit', $perPage, PDO::PARAM_INT);
$stmt->bindValue('offset', $offset, PDO::PARAM_INT);
$stmt->execute();
```

`bindValue(..., PDO::PARAM_INT)` dipakai (bukan `execute([...])` biasa)
supaya `LIMIT`/`OFFSET` dikirim sebagai **integer**, bukan string —
beberapa driver PDO menolak `LIMIT`/`OFFSET` bertipe string.

## 3.12 Transaction (Multi-Query yang Harus Atomik)

```php
try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("INSERT INTO peminjaman (buku_id, anggota_id) VALUES (:b, :a)");
    $stmt->execute(['b' => $bukuId, 'a' => $anggotaId]);

    $pdo->prepare("UPDATE buku SET stok = stok - 1 WHERE id = :id")
        ->execute(['id' => $bukuId]);

    $pdo->commit();
    header('Location: ../index.php');
    exit;
} catch (Exception $e) {
    $pdo->rollBack();
    $_SESSION['flash'] = ['type' => 'error', 'pesan' => 'Gagal: ' . $e->getMessage()];
    header('Location: tambah.php');
    exit;
}
```

Dipakai saat beberapa query **harus** berhasil bersamaan (catat
peminjaman + kurangi stok) — kalau salah satu gagal di tengah jalan,
`rollBack()` membatalkan **semuanya**, mencegah data setengah-jadi
(mis. stok berkurang tapi transaksi peminjaman gagal tercatat).

## 3.13 Superglobal yang Sering Dipakai

| Superglobal | Isinya |
|---|---|
| `$_SESSION` | Data antar-halaman untuk satu pengunjung selama sesi aktif |
| `$_POST` | Data form `method="post"` |
| `$_GET` | Data dari query string URL (`?q=...`, `?page=...`) |
| `$_SERVER['SCRIPT_FILENAME']` | Path lengkap file PHP yang pertama dijalankan untuk request ini |

---

# 4. Ringkasan Alur Satu Halaman CRUD Lengkap

```
[GET tambah.php]
    require auth.php        → cek login, redirect kalau belum
    include header.php      → cetak <head>, navbar, buka <main>
    tampilkan <form method="post" action="proses_tambah.php">
                             → sertakan csrf_field()
    include footer.php      → tutup </main>, </body>

[POST proses_tambah.php]
    require auth.php
    require csrf.php + csrf_verify()
    ambil & validasi $_POST
    kalau invalid → flash error, redirect kembali ke tambah.php
    kalau valid   → prepared statement INSERT, redirect ke list.php

[GET list.php]
    require koneksi.php
    prepared statement SELECT (+ pagination/pencarian)
    foreach hasil → cetak <tr> pakai e() untuk tiap kolom teks
```
