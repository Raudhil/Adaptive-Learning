# Setup Database PostgreSQL (SIMPUS-Mini) di Laragon

Panduan ini untuk menyiapkan database PostgreSQL yang dipakai jobsheet 8–13 (`simpus_mini`), khusus di Laragon Full (yang sudah membundel PostgreSQL sebagai layanan opsional).

## Prasyarat

- Laragon **Full** (bukan Lite) — cek `PostgreSQL` muncul di menu Laragon.
- Ekstensi PHP `pdo_pgsql` dan `pgsql` aktif di `php.ini` (cek: buka `php.ini` versi PHP aktif, pastikan baris `extension=pdo_pgsql` dan `extension=pgsql` **tidak** diawali `;`). Laragon Full biasanya sudah begini secara default.
- Tidak ada aplikasi/service lain yang menempati port `5432` (lihat bagian Troubleshooting jika ini terjadi).

## Langkah 1 — Nyalakan PostgreSQL lewat Laragon

1. Buka Laragon, klik **Start All** (atau klik kanan tray icon → pastikan `PostgreSQL` berstatus **started** dengan port `5432`).
2. Jika muncul error *"waiting for server to start...."*, artinya port `5432` sudah dipakai proses lain — lihat bagian **Troubleshooting** di bawah sebelum lanjut.

## Langkah 2 — Buat database `simpus_mini`

Buka **Terminal** dari menu Laragon (atau cmd/PowerShell biasa), lalu jalankan:

```bash
psql -h 127.0.0.1 -U postgres -c "CREATE DATABASE simpus_mini;"
```

Kredensial default: user `postgres`, password `postgres` (sesuai yang dipakai di `includes/koneksi.php` tiap jobsheet). Karena `pg_hba.conf` bawaan Laragon menggunakan mode `trust` untuk koneksi lokal, password biasanya tidak benar-benar divalidasi.

## Langkah 3 — Jalankan skema tabel

Skema dipecah per jobsheet dan bersifat kumulatif — jalankan file SQL sesuai jobsheet paling akhir yang ingin diuji. Paling praktis: pakai folder `sql/` milik **jobsheet-13** (paling lengkap, berisi ketiganya), karena semua `CREATE TABLE` memakai `IF NOT EXISTS` sehingga aman dijalankan berulang.

```bash
cd C:\laragon\www\DP2026\kode-praktikum\jobsheet-13\sql

psql -h 127.0.0.1 -U postgres -d simpus_mini -f 01_buku_anggota.sql
psql -h 127.0.0.1 -U postgres -d simpus_mini -f 02_users.sql
psql -h 127.0.0.1 -U postgres -d simpus_mini -f 03_peminjaman.sql
```

Referensi tabel per jobsheet (kalau hanya ingin menguji sampai jobsheet tertentu):

| File SQL | Tabel dibuat | Dibutuhkan mulai |
|---|---|---|
| `01_buku_anggota.sql` | `buku`, `anggota` | Jobsheet 8 |
| `02_users.sql` | `users` (petugas/auth) | Jobsheet 10 |
| `03_peminjaman.sql` | `peminjaman` | Jobsheet 12 |

## Langkah 4 — Verifikasi

```bash
psql -h 127.0.0.1 -U postgres -d simpus_mini -c "\dt"
```

Harus muncul 4 tabel: `anggota`, `buku`, `peminjaman`, `users`.

## Langkah 5 — Sesuaikan kredensial (opsional)

Semua jobsheet 8–12 memakai kredensial hardcode di `includes/koneksi.php`:

```php
$host = "localhost";
$port = "5432";
$db   = "simpus_mini";
$user = "postgres";
$pass = "postgres";
```

Jobsheet 13 memakai `includes/config.php` yang bisa dioverride lewat environment variable (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`). Kalau kredensial PostgreSQL di komputer kamu berbeda dari default, ubah di file yang sesuai.

## Troubleshooting

**Laragon PostgreSQL gagal start / "waiting for server to start...."**
Biasanya port `5432` sudah dipakai instalasi PostgreSQL lain (mis. instalasi standalone dari installer EDB, terdaftar sebagai Windows Service). Cek:

```powershell
netstat -ano | findstr ":5432"
Get-Process -Id <PID_dari_hasil_di_atas>
```

Kalau ternyata service PostgreSQL lain (Running as Administrator diperlukan untuk langkah ini):

```powershell
Stop-Service -Name "<nama-service>" -Force
Set-Service -Name "<nama-service>" -StartupType Manual
```

`StartupType Manual` supaya service itu tidak otomatis menyala lagi saat restart PC dan merebut port `5432` dari Laragon. Service-nya tetap terinstall, bisa dinyalakan manual lagi kalau memang dibutuhkan untuk keperluan lain.

**`psql: FATAL: password authentication failed`**
Berarti yang merespons di port `5432` bukan PostgreSQL bawaan Laragon (lihat poin di atas), atau `pg_hba.conf` Laragon (`C:\laragon\data\postgresql-14\pg_hba.conf`) tidak diset `trust`.

**Error di browser "Koneksi database gagal"**
Cek ekstensi PHP aktif dengan `php -m` (cari `pdo_pgsql`), lalu cek isi `includes/koneksi.php` sudah sesuai Langkah 5.
