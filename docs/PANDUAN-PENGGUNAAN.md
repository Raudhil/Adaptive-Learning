# Panduan Penggunaan Live Code Adaptif

Petunjuk untuk dosen, mahasiswa, dan pemilik proyek. Diperiksa pada 4 November 2026 berdasarkan kode aplikasi dan SRS draf 0.1, 22 Oktober 2026.

## 1. Pahami alurnya dahulu

**Alur yang sudah bisa dijalankan:**

Dosen membuat kelas > mahasiswa bergabung > Asesmen awal (pretest) > sistem menentukan profil awal > mahasiswa belajar dan mengirim latihan > sistem memperbarui penguasaan > dosen memantau kelas.

**Alur penelitian yang direncanakan SRS:**

Pretest > pembelajaran di kelas adaptif atau kontrol > posttest > analisis hasil belajar. Tahap posttest dan perbandingan nilai pretest-posttest belum tersedia di website.

### Tiga hal yang sering tertukar

| Istilah | Artinya | Status sekarang |
|---|---|---|
| Level awal | Profil pemula, menengah, atau mahir dari pretest | Dihitung dan disimpan; belum ditampilkan di dasbor |
| Penguasaan konsep | Perkiraan sistem tentang penguasaan HTML, CSS, dan konsep lain | Terlihat sebagai persen di dasbor dan heatmap |
| Nilai ujian/akhir | Nilai pretest-posttest atau penilaian dosen dengan rubrik | Belum ada rekap nilai akhir atau input nilai manual |

**Contoh:** penguasaan H1 sebesar 60% berarti perkiraan penguasaan konsep H1. Angka itu bukan otomatis nilai ujian 60 dan tidak berarti mahasiswa sudah naik ke level 2.

### Menu yang dipakai

| Pengguna | Halaman pertama setelah login | Kegunaan utama |
|---|---|---|
| Mahasiswa | Ringkasan, `/dashboard` | Gabung kelas, pretest, rekomendasi, progres |
| Dosen | Kelas & analitik, `/classes` | Buat kelas dan pantau penguasaan |
| Admin | Model & pengguna, `/settings` | Atur model dan peran akun |
| Peneliti | Ekspor penelitian, `/research` | Unduh data penelitian yang diizinkan |

**Posisi Anda sekarang:** bila mahasiswa sudah mengirim latihan, pretest akun itu sudah selesai. Kembali ke Ringkasan untuk melihat progres, lalu buka Kelas & analitik dari akun dosen untuk memantau hasilnya.

<!-- PAGEBREAK -->

## 2. Langkah untuk dosen: siapkan kelas

### A. Buat akun dan kelas

1. Buka aplikasi, biasanya `http://localhost:3000`.
2. Buka **Daftar akun** dan pilih **Dosen** pada dropdown **Daftar sebagai**.
3. Isi nama, email, dan password minimal 12 karakter. Sesudah mendaftar, Anda langsung masuk ke **Kelas & analitik**.
4. Pada **Buat kelas**, isi nama yang mudah dikenali, misalnya `Pemrograman Web A`.
5. Pilih mode **Adaptif** atau **Kontrol - urutan tetap**, lalu klik **Buat kelas +**.
6. Pilih kelas tersebut pada **Pilih kelas**. Salin kode dari kartu **KODE GABUNG** dan bagikan kepada mahasiswa.

Kode dibuat otomatis oleh sistem, bukan kode bawaan seperti `A001`. Satu mahasiswa saat ini hanya dapat bergabung ke satu kelas eksperimen.

### B. Pilih mode yang sesuai

| Mode | Yang dilakukan sistem |
|---|---|
| Adaptif | Memilih rekomendasi berdasarkan penguasaan dan kesiapan prasyarat; dapat menyarankan penguatan |
| Kontrol | Memberikan latihan dalam urutan kurikulum tetap untuk kelompok pembanding |

Kedua mode tetap memakai pretest, latihan, pengujian otomatis, dan pencatatan penguasaan. Perbedaan utamanya adalah cara memilih latihan berikutnya. Menu **Materi & latihan** masih memungkinkan mahasiswa memilih latihan sendiri; pilihan itu dicatat.

Untuk mencoba aplikasi, satu kelas adaptif sudah cukup. Untuk penelitian sesuai SRS 10.2, siapkan kelas adaptif dan kelas kontrol, lalu sepakati pembagian peserta serta aturan belajarnya sebelum mulai.

### C. Periksa bahan belajar

Buka **Kelola konten**, lalu periksa tab **Konsep & prasyarat**, **Materi**, serta **Latihan & tes**. Di sini dosen mengatur materi, instruksi latihan, hint, dan test case. Pengubahan materi/latihan masih memakai formulir JSON dan lebih mudah dilakukan bersama pengembang.

Konten saat ini bersifat bersama, belum dipisahkan khusus per kelas. Mengubah sebuah latihan dapat memengaruhi kelas lain yang memakai latihan itu. Siapkan dan periksa konten sebelum sesi dimulai.

**Menguji dua akun:** gunakan browser atau profil browser berbeda untuk dosen dan mahasiswa. Dua tab biasa pada browser yang sama berbagi sesi login, sehingga berganti akun di satu tab dapat mengubah akun di tab lainnya.

<!-- PAGEBREAK -->

## 3. Langkah mahasiswa: bergabung dan pretest

### A. Bergabung ke kelas

1. Daftar akun dengan pilihan **Mahasiswa**, atau login dengan akun mahasiswa yang sudah dibuat.
2. Di **Ringkasan**, cari kartu **Gabung kelasmu**.
3. Masukkan kode dari dosen dan klik **Gabung kelas**.
4. Setelah berhasil, nama kelas muncul di dasbor dan tombol **Mulai asesmen awal** tersedia.

### B. Kerjakan pretest

**Pretest di website bernama Asesmen awal.** Buka tombol **Mulai asesmen awal** atau menu **Asesmen awal**. Alamatnya `/pretest`.

| Tahap | Yang dikerjakan mahasiswa |
|---|---|
| 1. HTML | Dua soal pilihan ganda, lalu klik Lanjut |
| 2. CSS | Dua soal pilihan ganda, lalu klik Lanjut |
| 3. JavaScript | Dua soal pilihan ganda, lalu klik Lanjut |
| 4. React | Dua soal pilihan ganda, lalu klik Lanjut |
| 5. Profil | Pilih pengalaman pemrograman 1-5 dan isi nilai prasyarat jika bersedia |

Totalnya **8 soal dan satu tahap profil**. Pada tahap terakhir klik **Simpan asesmen**. Sistem menyimpan jawaban, skor tiap modul, waktu pengerjaan, serta hasil klasifikasi; mahasiswa kembali ke dasbor.

Nilai mata kuliah prasyarat boleh dikosongkan. Untuk perhitungan profil, sistem memakai nilai netral 50, sambil mencatat bahwa nilai aslinya tidak diberikan.

### C. Setelah pretest

Dasbor mulai menampilkan rekomendasi latihan dan persentase penguasaan awal. Buka **Lanjutkan latihan** untuk mengikuti rekomendasi, atau buka **Materi & latihan** untuk membaca konsep terlebih dahulu.

**Pretest hanya dapat dikirim sekali per akun.** Membuka `/pretest` lagi setelah selesai akan menampilkan **Asesmen awal sudah selesai**. Itu bukan halaman posttest dan tidak mengulang klasifikasi.

Jika sebelumnya Anda sudah berhasil mengerjakan latihan melalui alur normal, pretest akun itu telah tersimpan: aplikasi mensyaratkan pretest sebelum latihan dapat dikirim.

Untuk mencoba alur dari awal, gunakan akun mahasiswa uji yang berbeda. Belum ada tombol reset pretest, pindah kelas, atau mulai periode belajar baru untuk akun yang sama.

<!-- PAGEBREAK -->

## 4. Cara menentukan level 1, 2, atau 3

### A. Arti level pada aplikasi ini

Kode menyimpan label **pemula**, **menengah**, dan **mahir**. Jika ingin menyebutnya sebagai level 1, 2, dan 3 di laporan, pemetaan berikut dapat digunakan sebagai istilah penjelas; angka level tersebut belum menjadi tampilan tersendiri di aplikasi.

| Sebutan penjelas | Label yang disimpan | Penguasaan awal tiap konsep pada parameter pilot |
|---|---|---|
| Level 1 | Pemula, `pemula` | 20% |
| Level 2 | Menengah, `menengah` | 50% |
| Level 3 | Mahir, `mahir` | 80% |

Level ini adalah **profil awal global** untuk memulai pembelajaran. Semua konsep diinisialisasi dari label tersebut. Sistem belum menetapkan level terpisah untuk setiap modul atau menaikkan label global setelah setiap latihan.

### B. Jika data latih KNN belum cukup

Konfigurasi bawaan memiliki data latih kosong, `k=3`, dan minimum data latih 15. Dalam kondisi itu aplikasi menggunakan **aturan skor pengganti**, bukan hasil KNN yang sudah dilatih.

Skor dasar adalah rata-rata proporsi benar dari empat modul. Karena konten bawaan berisi dua soal per modul, hasilnya setara dengan jumlah benar dibagi delapan.

| Jawaban benar dari 8 soal bawaan | Skor dasar | Label awal |
|---|---|---|
| 0-3 | Kurang dari 40% | Pemula |
| 4-5 | Mulai 40%, kurang dari 75% | Menengah |
| 6-8 | Mulai 75% | Mahir |

Contoh: benar 5 dari 8 menghasilkan 62,5%, sehingga label awalnya menengah dan penguasaan awal tiap konsep 50%. Angka 62,5% dan 50% mengukur hal yang berbeda.

### C. Jika data latih KNN sudah cukup

KNN memakai 10 masukan: empat skor modul, empat waktu modul, pengalaman, dan nilai prasyarat. Sistem membandingkannya dengan peserta berlabel ahli, lalu memilih label berdasarkan tetangga terdekat. Tabel ambang skor di atas tidak lagi menjadi aturan utama.

**Siapa yang menetapkan?** Sistem menetapkan label awal; ahli memberi label pada data pelatihan; admin memasukkan data dan mengaktifkan parameter. Dosen belum memiliki tombol untuk menetapkan level mahasiswa secara manual.

Label tersimpan dalam `pretest_results.knn_label`, tetapi belum ada kartu level di dasbor mahasiswa atau tabel kelas dosen. Cara melihatnya saat ini dijelaskan pada bagian 6. Angka parameter di halaman ini adalah bawaan pilot; konfigurasi aktif bisa berbeda.

<!-- PAGEBREAK -->

## 5. Mengerjakan latihan dan membaca progres

### A. Urutan klik mahasiswa

1. Dari Ringkasan, klik **Lanjutkan latihan**. Untuk membaca materi, buka **Materi & latihan**, pilih konsep, lalu pilih latihan di sebelah materi.
2. Baca instruksi. Gunakan tab **HTML**, **CSS**, dan **JS** untuk menulis kode.
3. Perhatikan **Pratinjau langsung** dan **Konsol**. Pratinjau berubah saat Anda berhenti mengetik.
4. Jika perlu, klik **Buka hint** secara bertahap.
5. Klik **Jalankan tes & kirim**. Tombol ini sekaligus menguji dan mencatat percobaan, termasuk ketika ada tes yang gagal.
6. Baca hasil setiap test case dan perubahan penguasaan. Lanjutkan melalui **Latihan berikutnya** atau kembali lewat **Lihat progres**.

**Kode tersimpan otomatis bukan berarti jawaban sudah dinilai.** Mengedit kode atau melihat pratinjau saja belum mencatat percobaan penilaian; gunakan tombol kirim.

### B. Apa yang membuat penguasaan berubah?

| Keadaan | Dampaknya |
|---|---|
| Pengiriman pertama untuk satu latihan | Memperbarui penguasaan konsep terkait dengan BKT |
| Semua test case lulus tanpa membuka seluruh hint | Dicatat sebagai observasi benar untuk BKT |
| Ada test case gagal, atau seluruh hint sudah dibuka | Dicatat sebagai observasi salah untuk BKT |
| Mengirim ulang latihan yang sama | Riwayat bertambah, tetapi penguasaan BKT tidak diperbarui lagi |

Contoh dengan parameter pilot: penguasaan H1 dari 20% menjadi 60% setelah pengiriman pertama yang benar tanpa hint penuh. Ini bukan nilai dosen dan bukan kenaikan label dari pemula menjadi menengah.

Jika pengiriman pertama gagal, perbaiki kode untuk memahami kesalahan. Untuk memperoleh observasi penguasaan baru, kerjakan **latihan berbeda** pada konsep tersebut. Sekadar mengulang ID latihan yang sama tidak menaikkan penguasaan.

### C. Arti status di dasbor

**Dikuasai** berarti penguasaan mencapai ambang aktif, bawaan 95%. **Siap dipelajari** berarti prasyarat dinilai cukup siap, bawaan kesiapan 60%. **Terkunci** menandai kesiapan yang belum cukup pada peta; mahasiswa tetap dapat membuka materi atau memilih latihan secara manual.

Angka **Kesulitan 30%, 50%, atau 70%** pada latihan adalah parameter kesulitan soal. Angka itu berbeda dari level mahasiswa, nilai ujian, dan persen penguasaan.

<!-- PAGEBREAK -->

## 6. Dosen memantau dan menilai dari mana?

### A. Pemantauan yang tersedia

1. Masuk sebagai dosen, lalu buka **Kelas & analitik**.
2. Pilih kelas yang tadi diikuti mahasiswa.
3. Lihat jumlah **PESERTA** dan tabel **Heatmap penguasaan**.
4. Cari baris nama mahasiswa dan kolom konsep, misalnya H1, C1, atau J1. Persennya menunjukkan perkiraan penguasaan konsep.
5. Lihat **Mahasiswa yang perlu didampingi** untuk menentukan siapa yang perlu dibantu.

Tanda kosong pada heatmap berarti belum ada hasil penguasaan, umumnya karena mahasiswa belum menyelesaikan pretest. Semakin hijau selnya, semakin tinggi penguasaannya. Muat ulang halaman dosen setelah mahasiswa mengirim latihan agar data terbaru dimuat.

Daftar pendampingan saat ini menandai rata-rata penguasaan di bawah 40% atau tidak aktif melebihi ambang hari, bawaan 7 hari. Ini indikator bantuan belajar, bukan keputusan mahasiswa gagal mata kuliah.

### B. Bedakan tiga jenis penilaian

| Jenis | Cara kerjanya sekarang |
|---|---|
| Penilaian otomatis latihan | Test case menentukan lulus/gagal; mahasiswa melihat hasil per tes |
| Pemantauan dosen | Heatmap, rata-rata pada daftar pendampingan, jumlah percobaan, aktivitas terakhir |
| Nilai manual/rubrik/ujian akhir | Belum ada halaman memasukkan nilai, komentar per jawaban, atau rekap nilai akhir |

Dosen berperan menyiapkan instruksi dan test case, memeriksa kesesuaian materi, serta memberi pendampingan. Belum ada halaman dosen untuk membuka detail kode setiap jawaban dan memberi skor rubrik. Jangan menganggap angka heatmap sebagai nilai akhir tanpa aturan penilaian yang disepakati.

### C. Bagaimana melihat label awal yang tersimpan?

Gunakan akun **Peneliti** atau **Admin**: buka **Ekspor penelitian** > pilih **Pretest & audit KNN** > pilih kelas dan rentang tanggal yang mencakup waktu pretest > klik **Unduh CSV**. Kolom `knn_label` berisi label dan `method` menunjukkan metode klasifikasi.

Ekspor memakai pseudonim dan tidak memuat nama/email; belum ada pencocokan nama mahasiswa di layar ini. Data hanya masuk jika persetujuan penelitian aktif dan pretest dilakukan setelah persetujuan diberikan. Kunci `RESEARCH_SECRET` juga harus dikonfigurasi. Karena itu CSV bukan pengganti daftar nilai bernama untuk dosen.

<!-- PAGEBREAK -->

## 7. Posttest dan alur penelitian sesuai SRS

### A. Mengapa tidak menemukan posttest?

**Belum ada fitur posttest di website.** Tidak ada halaman, tombol, atau tabel khusus hasil posttest. Tombol **Jalankan tes & kirim** adalah pengujian latihan; halaman **Asesmen awal** adalah pretest satu kali.

SRS bagian **10.2 Evaluasi Efektivitas Pembelajaran**, halaman 15, merencanakan kuasi-eksperimen pretest-posttest: kelompok adaptif dibandingkan dengan kelompok kontrol. Implementasi saat ini mendukung kelompok dan log pembelajaran, tetapi belum mengelola seluruh tahap evaluasi itu.

### B. Cara menjalankan penelitian sambil menunggu fitur

Langkah berikut adalah **prosedur di luar fitur website**, yang perlu ditetapkan bersama dosen pembimbing.

1. Siapkan kelas adaptif dan kontrol. Sepakati peserta, durasi pembelajaran, instrumen, dan aturan penggunaan latihan pada kedua kelompok.
2. Laksanakan pretest. Pretest bawaan membantu penentuan profil awal; delapan soal pilot ini belum otomatis menjadi instrumen efektivitas yang tervalidasi. Bila memakai instrumen lain, catat nilainya secara terpisah.
3. Jalankan pembelajaran di website. Mahasiswa mengikuti aturan kelompok; dosen memantau penguasaan dan memberikan pendampingan sesuai prosedur.
4. Setelah periode belajar yang ditentukan selesai, berikan posttest setara melalui LMS, formulir, atau ujian terpisah. Nilai dengan instrumen/rubrik yang disepakati.
5. Catat skor pretest dan posttest dengan identitas penelitian yang dapat dicocokkan sesuai prosedur persetujuan. Ekspor pseudonim aplikasi belum otomatis terhubung ke nilai di sistem lain.
6. Analisis hasil belajar kedua kelompok. Website belum menghitung N-gain, perbandingan statistik, atau nilai akhir secara otomatis.

Jika N-gain digunakan untuk skor maksimum 100, rumusnya `(posttest - pretest) / (100 - pretest)`. Contoh skor 40 menjadi 70 menghasilkan 0,5. Pretest 100 membuat rumus ini tidak terdefinisi; tentukan penanganannya dalam metodologi. Persen penguasaan BKT tidak dipakai sebagai pengganti skor ujian.

### C. Kapan mahasiswa dianggap selesai?

Belum ada tombol **Selesaikan pembelajaran**, penjadwalan posttest, atau penutupan kelas. Tetapkan batas sesi/durasi dan cakupan konsep sebelum kegiatan dimulai. Habisnya rekomendasi juga bukan bukti mahasiswa sudah lulus posttest.

Data bawaan memiliki 20 konsep, dengan 51 latihan pada 17 konsep HTML/CSS/JavaScript. Tiga konsep React/Next.js masih berupa materi tanpa latihan interaktif. Jadi jangan mensyaratkan progres 20/20 sebagai satu-satunya tanda selesai pada versi ini.

<!-- PAGEBREAK -->

## 8. Mencocokkan website dengan SRS

Tabel ini membedakan kebutuhan yang sudah memiliki alur penggunaan dan bagian yang perlu dilengkapi. Acuannya SRS draf 0.1; status tidak menyatakan instrumen atau model sudah tervalidasi penelitian.

| Kebutuhan SRS | Kondisi website | Yang perlu Anda lakukan |
|---|---|---|
| FR-01-04: akun, peran, kelas | Tersedia; mahasiswa/dosen dapat mendaftar | Buat kelas, lalu bagikan kode |
| FR-05-08: pretest dan profil awal | Tersedia setelah gabung kelas; label tersimpan | Kenali nama Asesmen awal; tambahkan tampilan label bila diperlukan |
| FR-09: data latih KNN | Form admin dan pemilihan k tersedia | Siapkan data berlabel ahli; bawaan masih memakai aturan skor |
| FR-15-20: latihan, tes, log, BKT | Tersedia; BKT dari pengiriman pertama tiap latihan | Siapkan latihan berbeda, bukan hanya mengulang soal yang sama |
| FR-21-27: prasyarat dan rekomendasi | Adaptif/kontrol tersedia | Sepakati parameter dan prosedur tiap kelompok |
| FR-28-30: dasbor mahasiswa/dosen | Peta progres dan heatmap tersedia | Pakai untuk pendampingan, bukan langsung menjadi nilai akhir |
| FR-31: ekspor penelitian | CSV dengan persetujuan dan pseudonim | Konfigurasikan akses dan prosedur pencocokan data |
| FR-32-35: pengelolaan konten | Konsep, materi, latihan/test case tersedia | Validasi isi dengan dosen sebelum digunakan |
| FR-14: editor JSX/React, prioritas C | Belum tersedia; materi React ada | Tetapkan apakah masuk cakupan penelitian |
| Bagian 10.2: evaluasi pretest-posttest | Posttest dan analisisnya belum terintegrasi | Lakukan di luar sistem atau tambahkan fitur khusus |

### Prioritas pengembangan agar alurnya lebih jelas

1. Tampilkan status **Belum pretest / Sedang belajar / Selesai periode belajar** di dasbor mahasiswa dan daftar kelas dosen.
2. Tampilkan label awal, metode klasifikasi, skor awal, dan tanggal pretest dengan akses sesuai peran.
3. Tambahkan instrumen posttest, waktu pelaksanaan, penyimpanan hasil, dan laporan pretest-posttest yang terpisah dari penguasaan BKT.
4. Jika dosen membutuhkan nilai manual, sepakati rubrik, halaman pemeriksaan jawaban, komentar, dan rekap nilai. Ini kebutuhan tambahan; FR-15-16 saat ini menekankan penilaian otomatis.

**Catatan kesesuaian:** SRS FR-05 menyebut pretest saat login pertama. Website meminta mahasiswa bergabung ke kelas dahulu agar kelompok eksperimen jelas. SRS bagian 4.1 mengizinkan satu label global pada versi minimum; itulah yang digunakan sekarang.

<!-- PAGEBREAK -->

## 9. Contoh uji coba dan pertanyaan umum

### Coba alur lengkap dengan dua akun

1. Di browser dosen, daftar sebagai Dosen, buat kelas adaptif, dan salin kode.
2. Di browser/profil lain, daftar sebagai Mahasiswa, lalu gabung dengan kode tersebut.
3. Kerjakan **Asesmen awal**, klik **Simpan asesmen**, lalu lihat rekomendasi di Ringkasan.
4. Kerjakan satu latihan dan klik **Jalankan tes & kirim**. Baca hasil tes dan perubahan penguasaan.
5. Muat ulang **Kelas & analitik** di browser dosen dan periksa heatmap mahasiswa.
6. Lanjutkan ke latihan berbeda. Sesi berhenti sesuai rencana belajar; tidak ada posttest otomatis.

### Jika mengalami kebingungan

| Pertanyaan | Jawaban atau tindakan |
|---|---|
| Pretest saya ada di mana? | Menu Asesmen awal atau `/pretest`; jika sudah selesai, tidak dapat dikirim ulang |
| Kode kelas tidak ditemukan | Salin KODE GABUNG dari kelas yang dipilih pada akun dosen |
| Saya sudah mengetik, mengapa dosen belum melihat perubahan? | Klik Jalankan tes & kirim; setelah itu muat ulang halaman dosen |
| Mengapa persen tidak naik setelah memperbaiki jawaban? | BKT hanya memakai pengiriman pertama tiap latihan; coba latihan berbeda |
| Mengapa soal lulus tetapi penguasaan turun? | Jika semua hint dibuka pada pengiriman pertama, observasi BKT dihitung salah |
| Di mana level 1/2/3 saya? | Label awal belum ditampilkan di dasbor; gunakan penjelasan dan akses ekspor pada bagian 4 dan 6 |
| Di mana input nilai dosen dan posttest? | Kedua fitur belum tersedia; penilaian latihan sekarang otomatis |
| Mengapa akun dosen berubah menjadi mahasiswa di tab lain? | Tab browser berbagi sesi; gunakan profil/browser berbeda |
| CSV kosong atau gagal? | Periksa akun Admin/Peneliti, kelas, tanggal UTC, waktu persetujuan, dan RESEARCH_SECRET |

### Sumber pemeriksaan

**SRS sumber:** `D:\Kuliah\Skripsi\SRS.pdf`, halaman 7 (KNN), 9-10 (pretest, latihan, dasbor), dan 15 (pretest-posttest).

**Verifikasi kode:** komponen pretest, workspace, kelas, dan ekspor; `src/lib/learning.ts`; `src/lib/adaptive/knn.ts`; serta `db/schema.sql`. Rincian status ada di `docs/SRS-TRACEABILITY.md`.

Nilai contoh memakai parameter bawaan pilot; akun nyata mengikuti konfigurasi aktif. Panduan ini tidak menambahkan fitur posttest atau penilaian manual.
