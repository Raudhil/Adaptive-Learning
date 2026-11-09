# Cheatsheet PostgreSQL — SIMPUS-Mini (Laragon)

Referensi cepat perintah PostgreSQL yang dipakai di jobsheet 8–13. Semua
contoh memakai kredensial default proyek ini: user `postgres`, password
`postgres`, database `simpus_mini`, host `127.0.0.1`, port `5432`.

## 1. Koneksi & Terminal

```bash
# Login ke psql (server default localhost:5432)
psql -U postgres

# Login eksplisit ke host/port tertentu (kalau port bukan default)
psql -h 127.0.0.1 -p 5432 -U postgres

# Login langsung ke database tertentu
psql -U postgres -d simpus_mini

# Jalankan file .sql tanpa masuk interaktif
psql -U postgres -d simpus_mini -f sql/01_buku_anggota.sql

# Jalankan satu perintah tanpa masuk interaktif
psql -U postgres -c "CREATE DATABASE simpus_mini;"
```

Di Laragon, buka **Terminal bawaan** (Menu → Laragon → Terminal, atau
`Ctrl + `` ` saat jendela Laragon aktif) supaya `psql` langsung dikenali
tanpa perlu mengatur PATH manual.

## 2. Meta-Command `psql` (diawali `\`)

| Perintah | Fungsi |
|---|---|
| `\l` | List semua database |
| `\c nama_db` | Pindah/connect ke database lain |
| `\dt` | List semua tabel di database aktif |
| `\d nama_tabel` | Lihat struktur tabel (kolom, tipe, constraint) |
| `\d+ nama_tabel` | Sama seperti `\d`, plus ukuran & deskripsi |
| `\du` | List semua role/user |
| `\dn` | List semua schema |
| `\di` | List semua index |
| `\x` | Toggle **expanded display** — cocok untuk tabel dengan banyak kolom |
| `\timing` | Toggle tampilkan waktu eksekusi tiap query |
| `\q` | Keluar dari psql |
| `\?` | Bantuan daftar meta-command |
| `\h PERINTAH` | Bantuan sintaks SQL tertentu, mis. `\h CREATE TABLE` |

## 3. Manajemen Database

```sql
CREATE DATABASE simpus_mini;
DROP DATABASE simpus_mini;              -- hapus permanen, hati-hati
```

```bash
# Alternatif lewat shell (di luar psql)
createdb -U postgres simpus_mini
dropdb -U postgres simpus_mini
```

## 4. Manajemen User/Role

```sql
-- Buat user baru dengan password
CREATE USER produser WITH PASSWORD 'rahasia';

-- Ubah password user yang sudah ada
ALTER USER postgres WITH PASSWORD 'postgres';

-- Beri hak akses penuh ke database tertentu
GRANT ALL PRIVILEGES ON DATABASE simpus_mini TO produser;

-- List semua role
\du
```

## 5. Membuat & Mengubah Tabel

```sql
CREATE TABLE IF NOT EXISTS buku (
    id SERIAL PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    pengarang VARCHAR(255) NOT NULL,
    tahun INTEGER NOT NULL,
    isbn VARCHAR(50),
    stok INTEGER NOT NULL DEFAULT 0,
    kategori VARCHAR(50)
);

-- Foreign key (relasi antar tabel, contoh dari peminjaman)
CREATE TABLE IF NOT EXISTS peminjaman (
    id SERIAL PRIMARY KEY,
    buku_id INTEGER NOT NULL REFERENCES buku(id),
    anggota_id INTEGER NOT NULL REFERENCES anggota(id),
    tanggal_pinjam DATE NOT NULL DEFAULT CURRENT_DATE,
    tanggal_kembali DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'dipinjam'
);

-- Ubah struktur tabel yang sudah ada
ALTER TABLE buku ADD COLUMN deskripsi TEXT;
ALTER TABLE buku ALTER COLUMN stok SET DEFAULT 1;
ALTER TABLE buku RENAME COLUMN kategori TO genre;
ALTER TABLE buku DROP COLUMN deskripsi;

DROP TABLE IF EXISTS buku;
TRUNCATE TABLE buku;                    -- kosongkan isi tabel, struktur tetap
TRUNCATE TABLE buku RESTART IDENTITY;   -- + reset counter SERIAL ke 1
```

**Tipe data yang sering dipakai:**

| Tipe | Kegunaan |
|---|---|
| `SERIAL` | Integer auto-increment, biasa untuk `id` (setara `AUTO_INCREMENT` di MySQL) |
| `VARCHAR(n)` | Teks pendek, maksimal `n` karakter |
| `TEXT` | Teks panjang tanpa batas |
| `INTEGER` | Bilangan bulat |
| `NUMERIC(p,s)` | Angka desimal presisi tetap (uang, dll.) |
| `BOOLEAN` | `TRUE`/`FALSE` |
| `DATE` | Tanggal saja |
| `TIMESTAMP` | Tanggal + jam |
| `TIMESTAMPTZ` | Timestamp dengan timezone (disarankan untuk data produksi) |

## 6. CRUD Dasar

```sql
-- Create
INSERT INTO buku (judul, pengarang, tahun, stok)
VALUES ('Laskar Pelangi', 'Andrea Hirata', 2005, 5);

INSERT INTO buku (judul, pengarang, tahun, stok)
VALUES ('Bumi Manusia', 'Pramoedya A.T.', 1980, 3)
RETURNING id;                            -- ambil id yang baru dibuat

-- Read
SELECT * FROM buku;
SELECT judul, pengarang FROM buku WHERE tahun > 2000;
SELECT * FROM buku ORDER BY judul ASC LIMIT 5 OFFSET 10;   -- pagination
SELECT * FROM buku WHERE judul ILIKE '%laskar%';           -- LIKE case-insensitive

-- Update
UPDATE buku SET stok = stok - 1 WHERE id = 1;

-- Delete
DELETE FROM buku WHERE id = 1;
```

## 7. JOIN & Agregasi

```sql
-- INNER JOIN — riwayat peminjaman dengan nama buku & anggota
SELECT p.id, b.judul, a.nama, p.tanggal_pinjam, p.status
FROM peminjaman p
JOIN buku b ON p.buku_id = b.id
JOIN anggota a ON p.anggota_id = a.id
WHERE p.anggota_id = 3
ORDER BY p.tanggal_pinjam DESC;

-- LEFT JOIN — semua buku, termasuk yang belum pernah dipinjam
SELECT b.judul, COUNT(p.id) AS total_dipinjam
FROM buku b
LEFT JOIN peminjaman p ON p.buku_id = b.id
GROUP BY b.id, b.judul;

-- Agregasi umum
SELECT COUNT(*) FROM buku;
SELECT COUNT(*) FROM peminjaman WHERE status = 'dipinjam';
SELECT SUM(stok), AVG(stok), MAX(tahun), MIN(tahun) FROM buku;
```

## 8. Transaction (BEGIN / COMMIT / ROLLBACK)

Dipakai saat satu "aksi logis" butuh beberapa query yang harus **semua
berhasil atau semua dibatalkan** — contoh nyata: proses peminjaman buku
(kurangi stok + catat transaksi harus terjadi bersamaan).

```sql
BEGIN;

INSERT INTO peminjaman (buku_id, anggota_id) VALUES (1, 2);
UPDATE buku SET stok = stok - 1 WHERE id = 1;

COMMIT;      -- simpan permanen kedua perubahan
-- atau:
ROLLBACK;    -- batalkan semua perubahan sejak BEGIN
```

Di PDO (PHP), pola yang sama dipakai di `peminjaman/proses_tambah.php`:

```php
try {
    $pdo->beginTransaction();
    // ...beberapa query INSERT/UPDATE...
    $pdo->commit();
} catch (Exception $e) {
    $pdo->rollBack();
}
```

## 9. Koneksi dari PHP (PDO)

Pola koneksi yang dipakai di `includes/koneksi.php` sepanjang jobsheet
8–13:

```php
<?php
$host = "localhost";
$port = "5432";
$db   = "simpus_mini";
$user = "postgres";
$pass = "postgres";

try {
    $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Koneksi database gagal: " . $e->getMessage());
}
```

**Prepared statement** (mencegah SQL Injection — selalu pakai ini,
jangan concatenation string):

```php
$stmt = $pdo->prepare("SELECT * FROM buku WHERE judul ILIKE :kw");
$stmt->execute(['kw' => '%' . $keyword . '%']);
$hasil = $stmt->fetchAll(PDO::FETCH_ASSOC);

$stmt = $pdo->prepare("INSERT INTO buku (judul, pengarang, tahun) VALUES (:judul, :pengarang, :tahun)");
$stmt->execute(['judul' => $judul, 'pengarang' => $pengarang, 'tahun' => $tahun]);
```

## 10. Laragon — Hal Spesifik

- PostgreSQL bawaan Laragon Full ada di `C:\laragon\bin\postgresql\`,
  data-nya di `C:\laragon\data\postgresql-XX\`.
- Port default `5432`, sama seperti PostgreSQL pada umumnya — kalau ada
  instalasi PostgreSQL **lain** di komputer yang sama (mis. lewat
  installer resmi), keduanya bisa **bentrok rebutan port** (Laragon
  gagal start dengan pesan *"waiting for server to start...."*). Cara
  cek & atasi ada di
  [`kode-praktikum/jobsheet-08/Dokumentasi/08-instalasi-postgresql-laragon.md` §8.9](kode-praktikum/jobsheet-08/Dokumentasi/08-instalasi-postgresql-laragon.md#89-kalau-service-postgresql-laragon-gagal-start-bentrok-port-5432).
- Ekstensi PHP wajib aktif: `pdo_pgsql` dan `pgsql` (cek lewat
  `php -m | findstr pgsql` di Windows).
- Panduan setup lengkap step-by-step: lihat
  [`Setup-Database-PostgreSQL-Laragon.md`](Setup-Database-PostgreSQL-Laragon.md)
  di root repo ini.

## 11. Troubleshooting Umum

| Gejala | Kemungkinan Penyebab | Solusi |
|---|---|---|
| `could not connect to server` | Service PostgreSQL belum jalan | Start lewat Laragon, cek indikator hijau |
| `password authentication failed` | Password salah, atau port dijawab instance PostgreSQL lain | Cek `netstat -ano \| findstr ":5432"`, pastikan PID-nya benar-benar punya Laragon |
| `relation "xxx" does not exist` | Tabel belum dibuat / skema belum dijalankan | Jalankan ulang file `sql/*.sql` yang relevan |
| `database "simpus_mini" does not exist` | Database belum dibuat | `CREATE DATABASE simpus_mini;` |
| `could not find driver` (di PHP) | Ekstensi `pdo_pgsql` belum aktif | Aktifkan di `php.ini`, restart Apache |
| Port 5432 dipakai proses lain | Ada instalasi PostgreSQL standalone lain yang jalan otomatis | `Stop-Service` proses itu, `Set-Service -StartupType Manual` (lihat §10 di atas) |
