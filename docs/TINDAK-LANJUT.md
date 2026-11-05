# Yang perlu dilakukan pemilik proyek

1. **Siapkan akses awal:** mahasiswa dan dosen dapat mendaftar lewat halaman register dengan pilihan peran. Buat akun admin/peneliti dengan `npm.cmd run account:create`; dosen membuat kelas dan membagikan kode. Tidak ada akun bawaan atau kredensial yang ditentukan agen. Lihat [panduan penggunaan](PANDUAN-PENGGUNAAN.md) untuk urutan klik.
2. **Lengkapi `.env.local`:** domain email kampus dan kunci `RESEARCH_SECRET` acak minimal 32 karakter. Untuk deployment: PostgreSQL terpisah, URL HTTPS, kebijakan backup, dan lokasi server sesuai kebijakan institusi. Akun dan data lokal PGlite tidak otomatis dipindahkan ke PostgreSQL.
3. **Validasi konten dengan dosen:** peta 20 KC, prasyarat, bobot noisy-AND, materi, pretest, hint, dan test case. Latihan penguatan yang disediakan bukan instrumen yang tervalidasi; tambah latihan independen terutama setelah percobaan pertama gagal karena mengulang latihan yang sama tidak memperbarui BKT.
4. **Tentukan parameter kosong SRS:** k dan minimum data KNN; P(L0) per level/KC; learn/guess/slip per KC; CPT/leak; readiness threshold; target peluang benar; jumlah sesi anti-pengulangan; ambang kegagalan dan hari tidak aktif. Nilai pilot tersedia di halaman admin dan dapat diganti tanpa deploy.
5. **Kumpulkan data pilot berizin:** satu baris per siswa untuk KNN, label ahli, dan log observasi pertama untuk BKT. Jalankan CV/kalibrasi dengan split peserta, catat versi, lalu evaluasi pada peserta berbeda. Jangan menggunakan label prediksi KNN sebagai ground truth pelatihan ulang.
6. **Lengkapi persetujuan penelitian:** nama peneliti/penanggung jawab, kontak, tujuan rinci, masa retensi, hak penarikan/penghapusan, lokasi penyimpanan, serta persetujuan etik jika diperlukan. Form saat ini menjelaskan jenis data dan pilihan consent, tetapi belum menggantikan formulir etik institusi.
7. **Tetapkan rancangan eksperimen:** jumlah sampel dari power analysis, kelas kontrol/adaptif, posttest, anotasi ahli untuk diagnosis BN, pembanding model, effect size, dan prosedur SUS. Pengambilan data mahasiswa belum dilakukan.
8. **Jalankan QA browser dan keamanan sandbox:** uji Chrome/Edge/Firefox, pemulihan draft, konsol, seluruh test case, akses cookie/parent, jaringan/navigasi, infinite loop, recursion, regex berat, dan konsumsi memori. NFR-07 DOM belum memenuhi penghentian keras penuh; selesaikan sebelum akses publik.
9. **Tentukan kapasitas dan operasional:** jumlah mahasiswa/kelas bersamaan, target render/inferensi, uji beban pada PostgreSQL sungguhan, jadwal backup/restore, pemantauan, dan uptime. Pengukuran lokal bukan bukti SLA.
10. **Tentukan nama aplikasi final.** Nama kerja sekarang “Live Code Adaptif”. Jika SSO dipilih kemudian, sediakan konfigurasi IdP kampus; login email/password tersedia saat ini. Verifikasi kepemilikan email dan pemulihan password memerlukan penyedia email/integrasi tambahan sebelum pemakaian nyata.

# Masukan atas SRS

- Rumus BKT hilang pada PDF; kode menerapkan posterior Bayes + transisi belajar standar dan memiliki tes hitung manual. Masukkan rumus serta aturan bobot multi-KC ke revisi SRS/metodologi.
- Soft evidence BKT pada BN perlu disepakati: implementasi memakai likelihood `[1-P(L), P(L)]`, bukan menyamakan angka BKT dengan posterior BN. Readiness gabungan dihitung eksak dan dapat berbeda dari perkalian P(L) prasyarat.
- SRS meminta DOM native di iframe dan terminasi semua tes dalam Worker. Worker tidak menyediakan DOM native; desain perlindungan perlu diperjelas. Saat ini Worker untuk JS murni, iframe + instrumentasi untuk DOM/CSS, dengan keterbatasan eksplisit.
- Pretest contoh hanya dua soal per modul dan pengulangan latihan mirip mudah menimbulkan efek hafalan. Tambahkan bank soal/latihan independen yang divalidasi sebelum mengukur efektivitas adaptasi.
- React/JSX berprioritas C. Materi React tersedia, sedangkan eksekusi JSX dan server-side Next.js mahasiswa tidak ditambahkan.
- Durasi percobaan saat ini adalah waktu dinding sejak draft pertama dibuka, bukan waktu aktif mengetik. Tentukan definisi durasi penelitian agar interpretasinya konsisten.
- Kelas/kelompok dikunci melalui satu enrollment per siswa. Jika studi membutuhkan perpindahan atau beberapa kelas per siswa, tentukan kebijakan identitas model dan pemisahan riwayat sebelum mengubahnya.
- Jangan memakai instrumen ini untuk klaim kepatuhan hukum, WCAG, keamanan penuh, atau efektivitas penelitian tanpa penilaian institusi dan pengujian yang relevan.
