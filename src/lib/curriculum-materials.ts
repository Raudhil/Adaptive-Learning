// Excerpts read directly from KC/; explanations aligned to kc-mapping-proposal.md.
export const curriculumMaterials = [
  {
    "id": "simpus-mat-H01-v1",
    "kc_id": "H01",
    "type": "text",
    "title": "H01: konsep dan penerapan",
    "content": "Metadata head menjelaskan dokumen; body berisi konten. Browser dapat memperbaiki sumber salah, sehingga evaluator membaca sumber asli untuk memeriksa doctype, lang, title dan struktur eksplisit.\n\nSumber materi dosen:\nKC/kode-praktikum/jobsheet-01/Dokumentasi/01-konsep-dasar.md\nKC/kode-praktikum/jobsheet-01/Dokumentasi/02-index-html.md",
    "url": null
  },
  {
    "id": "simpus-code-H01-v1",
    "kc_id": "H01",
    "type": "code",
    "title": "Cuplikan kode dosen: jobsheet-01/index.html",
    "content": "Sumber: KC/kode-praktikum/jobsheet-01/index.html\nCuplikan berikut perlu konteks berkas lengkap.\n\n<!DOCTYPE html>\n<html lang=\"id\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title>SIMPUS-Mini | Beranda</title>\n</head>\n<body>\n    <header>\n        <h1>SIMPUS-Mini</h1>\n        <nav>\n            <ul>\n                <li><a href=\"index.html\">Beranda</a></li>\n                <li><a href=\"buku/list.html\">Daftar Buku</a></li>\n                <li><a href=\"buku/tambah.html\">Tambah Buku</a></li>\n                <li><a href=\"anggota/list.html\">Daftar Anggota</a></li>\n            </ul>\n        </nav>\n    </header>\n\n    <main>\n        <section>\n            <h2>Selamat Datang di Sistem Perpustakaan Mini</h2>\n            <p>Aplikasi sederhana untuk mengelola data buku dan anggota perpustakaan.</p>\n        </section>\n\n        <section>\n            <h2>Ringkasan</h2>\n            <article>",
    "url": null
  },
  {
    "id": "simpus-mat-H02-v1",
    "kc_id": "H02",
    "type": "text",
    "title": "H02: konsep dan penerapan",
    "content": "Gunakan header/nav/main/footer menurut maknanya, satu h1 dan h2 untuk bagian setingkat. Label for harus sama dengan id input; nama navigasi membantu pengguna memahami tujuan menu.\n\nSumber materi dosen:\nKC/kode-praktikum/jobsheet-01/Dokumentasi/01-konsep-dasar.md\nKC/kode-praktikum/jobsheet-01/Dokumentasi/02-index-html.md\nKC/kode-praktikum/jobsheet-01/Dokumentasi/04-buku-tambah-html.md",
    "url": null
  },
  {
    "id": "simpus-code-H02-v1",
    "kc_id": "H02",
    "type": "code",
    "title": "Cuplikan kode dosen: jobsheet-01/index.html",
    "content": "Sumber: KC/kode-praktikum/jobsheet-01/index.html\nCuplikan berikut perlu konteks berkas lengkap.\n\n    <header>\n        <h1>SIMPUS-Mini</h1>\n        <nav>\n            <ul>\n                <li><a href=\"index.html\">Beranda</a></li>\n                <li><a href=\"buku/list.html\">Daftar Buku</a></li>\n                <li><a href=\"buku/tambah.html\">Tambah Buku</a></li>\n                <li><a href=\"anggota/list.html\">Daftar Anggota</a></li>\n            </ul>\n        </nav>\n    </header>\n\n    <main>\n        <section>\n            <h2>Selamat Datang di Sistem Perpustakaan Mini</h2>\n            <p>Aplikasi sederhana untuk mengelola data buku dan anggota perpustakaan.</p>\n        </section>\n\n        <section>\n            <h2>Ringkasan</h2>\n            <article>\n                <h3>Total Buku</h3>\n                <p>12</p>\n            </article>\n            <article>\n                <h3>Total Anggota</h3>\n                <p>8</p>\n            </article>",
    "url": null
  },
  {
    "id": "simpus-mat-H03-v1",
    "kc_id": "H03",
    "type": "text",
    "title": "H03: konsep dan penerapan",
    "content": "Dari buku/list.html, ../index.html kembali ke Beranda dan ../anggota/list.html menuju Anggota. Path relatif menjaga aplikasi berjalan di subfolder; jangan memakai path komputer sendiri.\n\nSumber materi dosen:\nKC/kode-praktikum/jobsheet-01/Dokumentasi/01-konsep-dasar.md\nKC/kode-praktikum/jobsheet-01/Dokumentasi/02-index-html.md\nKC/kode-praktikum/jobsheet-01/Dokumentasi/05-anggota-list-html.md\nKC/kode-praktikum/jobsheet-02/Dokumentasi/02-perubahan-file-html.md",
    "url": null
  },
  {
    "id": "simpus-code-H03-v1",
    "kc_id": "H03",
    "type": "code",
    "title": "Cuplikan kode dosen: jobsheet-01/buku/list.html",
    "content": "Sumber: KC/kode-praktikum/jobsheet-01/buku/list.html\nCuplikan berikut perlu konteks berkas lengkap.\n\n        <nav>\n            <ul>\n                <li><a href=\"../index.html\">Beranda</a></li>\n                <li><a href=\"list.html\">Daftar Buku</a></li>\n                <li><a href=\"tambah.html\">Tambah Buku</a></li>\n                <li><a href=\"../anggota/list.html\">Daftar Anggota</a></li>\n            </ul>\n        </nav>\n    </header>\n\n    <main>\n        <section>\n            <h2>Daftar Buku</h2>\n            <table>\n                <thead>\n                    <tr>\n                        <th>Judul</th>\n                        <th>Pengarang</th>\n                        <th>Tahun</th>\n                        <th>Stok</th>\n                        <th>Aksi</th>\n                    </tr>\n                </thead>\n                <tbody>\n                    <tr>\n                        <td>Laskar Pelangi</td>\n                        <td>Andrea Hirata</td>\n                        <td>2005</td>",
    "url": null
  },
  {
    "id": "simpus-mat-H04-v1",
    "kc_id": "H04",
    "type": "text",
    "title": "H04: konsep dan penerapan",
    "content": "thead menjelaskan kolom, tbody mengelompokkan data, th menjadi header dan td nilai. Pertahankan pasangan data-kolom pada Buku, Anggota dan Riwayat; caption dan scope memperjelas maknanya.\n\nSumber materi dosen:\nKC/kode-praktikum/jobsheet-01/Dokumentasi/03-buku-list-html.md\nKC/kode-praktikum/jobsheet-01/Dokumentasi/05-anggota-list-html.md",
    "url": null
  },
  {
    "id": "simpus-code-H04-v1",
    "kc_id": "H04",
    "type": "code",
    "title": "Cuplikan kode dosen: jobsheet-01/buku/list.html",
    "content": "Sumber: KC/kode-praktikum/jobsheet-01/buku/list.html\nCuplikan berikut perlu konteks berkas lengkap.\n\n            <table>\n                <thead>\n                    <tr>\n                        <th>Judul</th>\n                        <th>Pengarang</th>\n                        <th>Tahun</th>\n                        <th>Stok</th>\n                        <th>Aksi</th>\n                    </tr>\n                </thead>\n                <tbody>\n                    <tr>\n                        <td>Laskar Pelangi</td>\n                        <td>Andrea Hirata</td>\n                        <td>2005</td>\n                        <td>4</td>\n                        <td>\n                            <button type=\"button\">Edit</button>\n                            <button type=\"button\">Hapus</button>\n                        </td>\n                    </tr>\n                    <tr>\n                        <td>Bumi Manusia</td>\n                        <td>Pramoedya Ananta Toer</td>\n                        <td>1980</td>\n                        <td>2</td>\n                        <td>\n                            <button type=\"button\">Edit</button>",
    "url": null
  },
  {
    "id": "simpus-mat-H05-v1",
    "kc_id": "H05",
    "type": "text",
    "title": "H05: konsep dan penerapan",
    "content": "name adalah kontrak data yang kelak dibaca PHP. Nomor A001 memakai text, stok memakai number dengan min=0. Validasi browser membantu pengguna tetapi tidak menggantikan validasi server di luar editor ini.\n\nSumber materi dosen:\nKC/kode-praktikum/jobsheet-01/Dokumentasi/04-buku-tambah-html.md\nKC/kode-praktikum/jobsheet-01/Dokumentasi/06-anggota-tambah-html.md",
    "url": null
  },
  {
    "id": "simpus-code-H05-v1",
    "kc_id": "H05",
    "type": "code",
    "title": "Cuplikan kode dosen: jobsheet-01/buku/tambah.html",
    "content": "Sumber: KC/kode-praktikum/jobsheet-01/buku/tambah.html\nCuplikan berikut perlu konteks berkas lengkap.\n\n            <form>\n                <p>\n                    <label for=\"judul\">Judul</label><br>\n                    <input type=\"text\" id=\"judul\" name=\"judul\" required>\n                </p>\n                <p>\n                    <label for=\"pengarang\">Pengarang</label><br>\n                    <input type=\"text\" id=\"pengarang\" name=\"pengarang\" required>\n                </p>\n                <p>\n                    <label for=\"tahun\">Tahun Terbit</label><br>\n                    <input type=\"number\" id=\"tahun\" name=\"tahun\" min=\"1900\" max=\"2026\" required>\n                </p>\n                <p>\n                    <label for=\"isbn\">ISBN</label><br>\n                    <input type=\"text\" id=\"isbn\" name=\"isbn\">\n                </p>\n                <p>\n                    <label for=\"stok\">Stok</label><br>\n                    <input type=\"number\" id=\"stok\" name=\"stok\" min=\"0\" required>\n                </p>\n                <p>\n                    <label for=\"kategori\">Kategori</label><br>\n                    <select id=\"kategori\" name=\"kategori\">\n                        <option value=\"fiksi\">Fiksi</option>\n                        <option value=\"non-fiksi\">Non-Fiksi</option>\n                        <option value=\"referensi\">Referensi</option>\n                    </select>",
    "url": null
  },
  {
    "id": "simpus-mat-C01-v1",
    "kc_id": "C01",
    "type": "text",
    "title": "C01: konsep dan penerapan",
    "content": "Selector menentukan sasaran; specificity dan urutan menentukan pemenang konflik. header nav a lebih spesifik daripada a. Pakai class bermakna untuk aksi agar perubahan urutan tombol tidak mengubah warna Hapus.\n\nSumber materi dosen:\nKC/kode-praktikum/jobsheet-02/Dokumentasi/01-konsep-dasar-css.md\nKC/kode-praktikum/jobsheet-02/Dokumentasi/04-css-header-navbar-flexbox.md\nKC/kode-praktikum/jobsheet-02/Dokumentasi/06-css-grid-kartu-statistik.md",
    "url": null
  },
  {
    "id": "simpus-code-C01-v1",
    "kc_id": "C01",
    "type": "code",
    "title": "Cuplikan kode dosen: jobsheet-02/assets/css/style.css",
    "content": "Sumber: KC/kode-praktikum/jobsheet-02/assets/css/style.css\nCuplikan berikut perlu konteks berkas lengkap.\n\nheader nav a {\n    color: #fff;\n    font-weight: 500;\n}\n\n/* ===== Main Layout ===== */\nmain {\n    max-width: 1000px;\n    margin: 2rem auto;\n    padding: 0 1.5rem;\n}\n\nsection {\n    background-color: #fff;\n    border-radius: 8px;\n    padding: 1.5rem;\n    margin-bottom: 1.5rem;\n    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);\n}\n\nsection h2 {\n    margin-bottom: 1rem;\n    color: #1d5b8a;\n}\n\n/* ===== Kartu Statistik (CSS Grid) ===== */\nmain section:nth-of-type(2) {\n    display: grid;",
    "url": null
  },
  {
    "id": "simpus-mat-C02-v1",
    "kc_id": "C02",
    "type": "text",
    "title": "C02: konsep dan penerapan",
    "content": "Box model terdiri dari content, padding, border dan margin. border-box memasukkan padding/border ke width; reset dan pewarisan font menjaga konsistensi. max-width dan margin auto membatasi serta memusatkan main.\n\nSumber materi dosen:\nKC/kode-praktikum/jobsheet-02/Dokumentasi/01-konsep-dasar-css.md\nKC/kode-praktikum/jobsheet-02/Dokumentasi/03-css-reset-dan-body.md\nKC/kode-praktikum/jobsheet-02/Dokumentasi/05-css-main-dan-section.md\nKC/kode-praktikum/jobsheet-02/Dokumentasi/09-css-footer.md",
    "url": null
  },
  {
    "id": "simpus-code-C02-v1",
    "kc_id": "C02",
    "type": "code",
    "title": "Cuplikan kode dosen: jobsheet-02/assets/css/style.css",
    "content": "Sumber: KC/kode-praktikum/jobsheet-02/assets/css/style.css\nCuplikan berikut perlu konteks berkas lengkap.\n\n/* ===== Reset & Base ===== */\n* {\n    box-sizing: border-box;\n    margin: 0;\n    padding: 0;\n}\n\nbody {\n    font-family: \"Segoe UI\", Arial, sans-serif;\n    color: #2b2b2b;\n    background-color: #f5f6f8;\n    line-height: 1.5;\n}\n\na {\n    color: #1d5b8a;\n    text-decoration: none;\n}\n\na:hover {\n    text-decoration: underline;\n}\n\n/* ===== Header & Navbar (Flexbox) ===== */\nheader {\n    background-color: #1d5b8a;\n    color: #fff;\n    padding: 1rem 1.5rem;",
    "url": null
  },
  {
    "id": "simpus-mat-C03-v1",
    "kc_id": "C03",
    "type": "text",
    "title": "C03: konsep dan penerapan",
    "content": "Flexbox mengatur satu sumbu untuk logo dan menu. justify-content mengatur sumbu utama, align-items sumbu silang, gap jarak, dan flex-wrap memungkinkan pindah baris. Periksa posisi nyata pada fixture sempit.\n\nSumber materi dosen:\nKC/kode-praktikum/jobsheet-02/Dokumentasi/04-css-header-navbar-flexbox.md",
    "url": null
  },
  {
    "id": "simpus-code-C03-v1",
    "kc_id": "C03",
    "type": "code",
    "title": "Cuplikan kode dosen: jobsheet-02/assets/css/style.css",
    "content": "Sumber: KC/kode-praktikum/jobsheet-02/assets/css/style.css\nCuplikan berikut perlu konteks berkas lengkap.\n\nheader {\n    background-color: #1d5b8a;\n    color: #fff;\n    padding: 1rem 1.5rem;\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    flex-wrap: wrap;\n}\n\nheader h1 {\n    font-size: 1.4rem;\n}\n\nheader nav ul {\n    list-style: none;\n    display: flex;\n    gap: 1.25rem;\n}\n\nheader nav a {\n    color: #fff;\n    font-weight: 500;\n}\n\n/* ===== Main Layout ===== */\nmain {\n    max-width: 1000px;",
    "url": null
  },
  {
    "id": "simpus-mat-C04-v1",
    "kc_id": "C04",
    "type": "text",
    "title": "C04: konsep dan penerapan",
    "content": "Grid membagi ruang menjadi baris/kolom; repeat(3,1fr) menyamakan kartu Buku/Anggota/Dipinjam. Gap ikut perhitungan lebar; kartu tambahan mengalir ke baris baru tanpa posisi manual.\n\nSumber materi dosen:\nKC/kode-praktikum/jobsheet-02/Dokumentasi/06-css-grid-kartu-statistik.md",
    "url": null
  },
  {
    "id": "simpus-code-C04-v1",
    "kc_id": "C04",
    "type": "code",
    "title": "Cuplikan kode dosen: jobsheet-02/assets/css/style.css",
    "content": "Sumber: KC/kode-praktikum/jobsheet-02/assets/css/style.css\nCuplikan berikut perlu konteks berkas lengkap.\n\n    grid-template-columns: repeat(3, 1fr);\n    gap: 1rem;\n}\n\nmain section:nth-of-type(2) article {\n    background-color: #eef4fa;\n    border-radius: 8px;\n    padding: 1.25rem;\n    text-align: center;\n}\n\nmain section:nth-of-type(2) article h3 {\n    font-size: 0.95rem;\n    color: #55677a;\n    margin-bottom: 0.5rem;\n}\n\nmain section:nth-of-type(2) article p {\n    font-size: 1.8rem;\n    font-weight: 700;\n    color: #1d5b8a;\n}\n\n/* ===== Tabel ===== */\ntable {\n    width: 100%;\n    border-collapse: collapse;\n}",
    "url": null
  },
  {
    "id": "simpus-mat-C05-v1",
    "kc_id": "C05",
    "type": "text",
    "title": "C05: konsep dan penerapan",
    "content": "border-collapse menggabungkan garis sel; padding dan zebra stripe meningkatkan keterbacaan. Gunakan class Edit/Hapus berdasarkan makna, bukan posisi. Hover melengkapi tetapi bukan satu-satunya petunjuk.\n\nSumber materi dosen:\nKC/kode-praktikum/jobsheet-02/Dokumentasi/07-css-tabel.md",
    "url": null
  },
  {
    "id": "simpus-code-C05-v1",
    "kc_id": "C05",
    "type": "code",
    "title": "Cuplikan kode dosen: jobsheet-02/assets/css/style.css",
    "content": "Sumber: KC/kode-praktikum/jobsheet-02/assets/css/style.css\nCuplikan berikut perlu konteks berkas lengkap.\n\ntable {\n    width: 100%;\n    border-collapse: collapse;\n}\n\nth, td {\n    text-align: left;\n    padding: 0.65rem 0.75rem;\n    border-bottom: 1px solid #e2e6ea;\n}\n\nthead {\n    background-color: #1d5b8a;\n    color: #fff;\n}\n\ntbody tr:nth-child(even) {\n    background-color: #f7f9fb;\n}\n\ntbody tr:hover {\n    background-color: #eef4fa;\n}\n\ntd button {\n    padding: 0.35rem 0.7rem;\n    margin-right: 0.35rem;\n    border: none;",
    "url": null
  },
  {
    "id": "simpus-mat-C06-v1",
    "kc_id": "C06",
    "type": "text",
    "title": "C06: konsep dan penerapan",
    "content": "Label di atas kontrol, spacing, lebar kontrol dan pesan yang jelas memudahkan form. Gunakan border-box untuk lebar penuh. Pesan sukses/error memerlukan teks selain warna; pola flash memakai class dasar dan class status.\n\nSumber materi dosen:\nKC/kode-praktikum/jobsheet-02/Dokumentasi/08-css-form.md\nKC/kode-praktikum/jobsheet-07/Dokumentasi/06-css-flash-message.md",
    "url": null
  },
  {
    "id": "simpus-code-C06-v1",
    "kc_id": "C06",
    "type": "code",
    "title": "Cuplikan kode dosen: jobsheet-02/assets/css/style.css",
    "content": "Sumber: KC/kode-praktikum/jobsheet-02/assets/css/style.css\nCuplikan berikut perlu konteks berkas lengkap.\n\nform label {\n    display: block;\n    margin-bottom: 0.35rem;\n    font-weight: 600;\n    color: #444;\n}\n\nform input,\nform select {\n    width: 100%;\n    max-width: 400px;\n    padding: 0.55rem 0.7rem;\n    border: 1px solid #cdd4da;\n    border-radius: 4px;\n    font-size: 1rem;\n}\n\nform button[type=\"submit\"] {\n    background-color: #1d5b8a;\n    color: #fff;\n    border: none;\n    padding: 0.6rem 1.5rem;\n    border-radius: 4px;\n    font-size: 1rem;\n    cursor: pointer;\n}\n\nform button[type=\"submit\"]:hover {",
    "url": null
  },
  {
    "id": "simpus-mat-C07-v1",
    "kc_id": "C07",
    "type": "text",
    "title": "C07: konsep dan penerapan",
    "content": "RPS membahas mobile-first, sedangkan kode JS03 memakai desktop-first max-width 768/480. Jelaskan strategi dan uji sebelum/pada/sesudah breakpoint. KC ini masih praktik tanpa observasi BKT karena evaluator viewport produksi belum tersedia.\n\nSumber materi dosen:\nKC/kode-praktikum/jobsheet-03/Dokumentasi/01-konsep-dasar-responsive.md\nKC/kode-praktikum/jobsheet-03/Dokumentasi/02-perubahan-file-html.md\nKC/kode-praktikum/jobsheet-03/Dokumentasi/05-css-media-query-breakpoint.md",
    "url": null
  },
  {
    "id": "simpus-code-C07-v1",
    "kc_id": "C07",
    "type": "code",
    "title": "Cuplikan kode dosen: jobsheet-03/assets/css/style.css",
    "content": "Sumber: KC/kode-praktikum/jobsheet-03/assets/css/style.css\nCuplikan berikut perlu konteks berkas lengkap.\n\n@media (max-width: 768px) {\n    main section:nth-of-type(2) {\n        grid-template-columns: repeat(2, 1fr);\n    }\n}\n\n/* Mobile */\n@media (max-width: 480px) {\n    header {\n        position: relative;\n    }\n\n    .nav-toggle-label {\n        display: block;\n    }\n\n    header nav {\n        display: none;\n        width: 100%;\n        order: 3;\n        margin-top: 1rem;\n    }\n\n    .nav-toggle:checked ~ nav {\n        display: block;\n    }\n\n    header nav ul {",
    "url": null
  },
  {
    "id": "simpus-mat-C08-v1",
    "kc_id": "C08",
    "type": "text",
    "title": "C08: konsep dan penerapan",
    "content": "Tabel boleh lebih lebar dari wrapper yang memiliki overflow-x:auto; halaman lain tidak boleh ikut melebar. Uji di DevTools 375/768/1280px. KC ini belum dinilai otomatis dan tidak memperbarui BKT.\n\nSumber materi dosen:\nKC/kode-praktikum/jobsheet-03/Dokumentasi/04-css-table-responsive.md",
    "url": null
  },
  {
    "id": "simpus-code-C08-v1",
    "kc_id": "C08",
    "type": "code",
    "title": "Cuplikan kode dosen: jobsheet-03/assets/css/style.css",
    "content": "Sumber: KC/kode-praktikum/jobsheet-03/assets/css/style.css\nCuplikan berikut perlu konteks berkas lengkap.\n\n.table-responsive {\n    overflow-x: auto;\n}\n\n/* ===== Hamburger Menu (checkbox hack) ===== */\n.nav-toggle {\n    display: none;\n}\n\n.nav-toggle-label {\n    display: none;\n    font-size: 1.6rem;\n    color: #fff;\n    cursor: pointer;\n}\n\n/* ===== Responsive Breakpoints ===== */\n\n/* Tablet ke bawah */\n@media (max-width: 768px) {\n    main section:nth-of-type(2) {\n        grid-template-columns: repeat(2, 1fr);\n    }\n}\n\n/* Mobile */\n@media (max-width: 480px) {\n    header {",
    "url": null
  },
  {
    "id": "simpus-mat-C09-v1",
    "kc_id": "C09",
    "type": "text",
    "title": "C09: konsep dan penerapan",
    "content": "Checkbox, label, :checked dan sibling combinator ~ menghubungkan state ke menu. Nav harus sesudah checkbox pada parent sama. JS03 memakai teknik ini sebelum JS05 beralih ke JS; praktik viewport KC ini belum memperbarui BKT.\n\nSumber materi dosen:\nKC/kode-praktikum/jobsheet-03/Dokumentasi/02-perubahan-file-html.md\nKC/kode-praktikum/jobsheet-03/Dokumentasi/03-css-hamburger-checkbox-hack.md",
    "url": null
  },
  {
    "id": "simpus-code-C09-v1",
    "kc_id": "C09",
    "type": "code",
    "title": "Cuplikan kode dosen: jobsheet-03/assets/css/style.css",
    "content": "Sumber: KC/kode-praktikum/jobsheet-03/assets/css/style.css\nCuplikan berikut perlu konteks berkas lengkap.\n\n    .nav-toggle:checked ~ nav {\n        display: block;\n    }\n\n    header nav ul {\n        flex-direction: column;\n        gap: 0.75rem;\n    }\n\n    main section:nth-of-type(2) {\n        grid-template-columns: 1fr;\n    }\n\n    form input,\n    form select {\n        max-width: 100%;\n    }\n}",
    "url": null
  },
  {
    "id": "simpus-mat-J01-v1",
    "kc_id": "J01",
    "type": "text",
    "title": "J01: konsep dan penerapan",
    "content": "Bedakan angka dan string sebelum operasi stok/harga. Nomor anggota tetap string agar nol awal utuh. const untuk referensi tetap, let untuk state berubah; uji nol, negatif dan input tak sah.\n\nSumber materi dosen:\nKC/kode-praktikum/jobsheet-05/Dokumentasi/04-js-hamburger-menu.md\nKC/kode-praktikum/jobsheet-05/Dokumentasi/06-js-filter-tabel.md\nKC/kode-praktikum/jobsheet-05/Dokumentasi/07-js-validasi-form.md",
    "url": null
  },
  {
    "id": "simpus-code-J01-v1",
    "kc_id": "J01",
    "type": "code",
    "title": "Cuplikan kode dosen: jobsheet-05/assets/js/app.js",
    "content": "Sumber: KC/kode-praktikum/jobsheet-05/assets/js/app.js\nCuplikan berikut perlu konteks berkas lengkap.\n\nfunction initNavToggle() {\n    const toggleBtn = document.getElementById(\"nav-toggle-btn\");\n    const nav = document.querySelector(\"header nav\");\n    if (!toggleBtn || !nav) return;\n\n    toggleBtn.addEventListener(\"click\", function () {\n        nav.classList.toggle(\"nav-open\");\n    });\n}\n\n// ===== Konfirmasi hapus (front-end only, belum ke server) =====\nfunction initHapusConfirm() {\n    document.querySelectorAll(\".btn-hapus\").forEach(function (btn) {\n        btn.addEventListener(\"click\", function () {\n            const row = btn.closest(\"tr\");\n            const nama = row ? row.querySelector(\"td\")?.textContent : \"data ini\";\n            const yakin = confirm(\"Yakin ingin menghapus \\\"\" + nama + \"\\\"?\");\n            if (yakin && row) {\n                row.remove();\n            }\n        });\n    });\n}\n\n// ===== Filter/pencarian tabel real-time =====\nfunction initTableFilter() {\n    const input = document.getElementById(\"search-input\");\n    const table = document.querySelector(\".table-responsive table\");",
    "url": null
  },
  {
    "id": "simpus-mat-J02-v1",
    "kc_id": "J02",
    "type": "text",
    "title": "J02: konsep dan penerapan",
    "content": "Percabangan menentukan validitas dan loop memproses semua baris. Accumulator dibuat sebelum iterasi. Terlambat >14 hari berbeda dari >=14; uji batas, data campuran dan array kosong.\n\nSumber materi dosen:\nKC/kode-praktikum/jobsheet-05/Dokumentasi/06-js-filter-tabel.md\nKC/kode-praktikum/jobsheet-05/Dokumentasi/07-js-validasi-form.md\nKC/kode-praktikum/jobsheet-06/Dokumentasi/04-js-fetch-render-buku.md",
    "url": null
  },
  {
    "id": "simpus-code-J02-v1",
    "kc_id": "J02",
    "type": "code",
    "title": "Cuplikan kode dosen: jobsheet-05/assets/js/app.js",
    "content": "Sumber: KC/kode-praktikum/jobsheet-05/assets/js/app.js\nCuplikan berikut perlu konteks berkas lengkap.\n\nfunction initTableFilter() {\n    const input = document.getElementById(\"search-input\");\n    const table = document.querySelector(\".table-responsive table\");\n    if (!input || !table) return;\n\n    input.addEventListener(\"keyup\", function () {\n        const keyword = input.value.toLowerCase();\n        const rows = table.querySelectorAll(\"tbody tr\");\n        rows.forEach(function (row) {\n            const teks = row.textContent.toLowerCase();\n            row.style.display = teks.includes(keyword) ? \"\" : \"none\";\n        });\n    });\n}\n\n// ===== Validasi form (client-side) =====\nfunction tampilkanError(input, pesan) {\n    hapusError(input);\n    const span = document.createElement(\"span\");\n    span.className = \"error\";\n    span.textContent = pesan;\n    input.insertAdjacentElement(\"afterend\", span);\n}\n\nfunction hapusError(input) {\n    const next = input.nextElementSibling;\n    if (next && next.classList.contains(\"error\")) {\n        next.remove();",
    "url": null
  },
  {
    "id": "simpus-mat-J03-v1",
    "kc_id": "J03",
    "type": "text",
    "title": "J03: konsep dan penerapan",
    "content": "app.js memisahkan initNavToggle, initTableFilter dan helper validasi. Parameter memungkinkan pemakaian ulang Buku/Anggota; scope dan closure mempertahankan state masing-masing instance tanpa variabel global bersama.\n\nSumber materi dosen:\nKC/kode-praktikum/jobsheet-05/Dokumentasi/01-konsep-dasar-javascript-dom.md\nKC/kode-praktikum/jobsheet-05/Dokumentasi/04-js-hamburger-menu.md\nKC/kode-praktikum/jobsheet-05/Dokumentasi/07-js-validasi-form.md\nKC/kode-praktikum/jobsheet-06/Dokumentasi/05-js-fetch-render-anggota.md",
    "url": null
  },
  {
    "id": "simpus-code-J03-v1",
    "kc_id": "J03",
    "type": "code",
    "title": "Cuplikan kode dosen: jobsheet-05/assets/js/app.js",
    "content": "Sumber: KC/kode-praktikum/jobsheet-05/assets/js/app.js\nCuplikan berikut perlu konteks berkas lengkap.\n\nfunction tampilkanError(input, pesan) {\n    hapusError(input);\n    const span = document.createElement(\"span\");\n    span.className = \"error\";\n    span.textContent = pesan;\n    input.insertAdjacentElement(\"afterend\", span);\n}\n\nfunction hapusError(input) {\n    const next = input.nextElementSibling;\n    if (next && next.classList.contains(\"error\")) {\n        next.remove();\n    }\n}\n\nfunction initValidasiForm() {\n    const form = document.getElementById(\"form-tambah\");\n    if (!form) return;\n\n    form.addEventListener(\"submit\", function (e) {\n        let valid = true;\n\n        const judul = form.querySelector(\"[name='judul'], [name='nama']\");\n        if (judul && judul.value.trim() === \"\") {\n            tampilkanError(judul, \"Field ini wajib diisi.\");\n            valid = false;\n        } else if (judul) {\n            hapusError(judul);",
    "url": null
  },
  {
    "id": "simpus-mat-J04-v1",
    "kc_id": "J04",
    "type": "text",
    "title": "J04: konsep dan penerapan",
    "content": "JSON adalah teks; setelah parsing hasilnya array/object JS. Nama field pada data/buku.json konsisten dengan form. map/filter/reduce atau loop mengolah koleksi; tangani JSON rusak/array kosong dan jangan mengubah data input.\n\nSumber materi dosen:\nKC/kode-praktikum/jobsheet-06/Dokumentasi/01-konsep-dasar-fetch-json.md\nKC/kode-praktikum/jobsheet-06/Dokumentasi/03-data-json.md\nKC/kode-praktikum/jobsheet-06/Dokumentasi/05-js-fetch-render-anggota.md",
    "url": null
  },
  {
    "id": "simpus-code-J04-v1",
    "kc_id": "J04",
    "type": "code",
    "title": "Cuplikan kode dosen: jobsheet-06/data/buku.json",
    "content": "Sumber: KC/kode-praktikum/jobsheet-06/data/buku.json\nCuplikan berikut perlu konteks berkas lengkap.\n\n[\n    { \"judul\": \"Laskar Pelangi\", \"pengarang\": \"Andrea Hirata\", \"tahun\": 2005, \"stok\": 4 },\n    { \"judul\": \"Bumi Manusia\", \"pengarang\": \"Pramoedya Ananta Toer\", \"tahun\": 1980, \"stok\": 2 },\n    { \"judul\": \"Negeri 5 Menara\", \"pengarang\": \"Ahmad Fuadi\", \"tahun\": 2009, \"stok\": 0 },\n    { \"judul\": \"Filosofi Teras\", \"pengarang\": \"Henry Manampiring\", \"tahun\": 2018, \"stok\": 5 },\n    { \"judul\": \"Ronggeng Dukuh Paruk\", \"pengarang\": \"Ahmad Tohari\", \"tahun\": 1982, \"stok\": 1 },\n    { \"judul\": \"Cantik Itu Luka\", \"pengarang\": \"Eka Kurniawan\", \"tahun\": 2002, \"stok\": 3 },\n    { \"judul\": \"Pulang\", \"pengarang\": \"Tere Liye\", \"tahun\": 2015, \"stok\": 2 },\n    { \"judul\": \"Sang Pemimpi\", \"pengarang\": \"Andrea Hirata\", \"tahun\": 2006, \"stok\": 6 },\n    { \"judul\": \"Perahu Kertas\", \"pengarang\": \"Dee Lestari\", \"tahun\": 2009, \"stok\": 0 },\n    { \"judul\": \"Gadis Kretek\", \"pengarang\": \"Ratih Kumala\", \"tahun\": 2012, \"stok\": 4 }\n]",
    "url": null
  },
  {
    "id": "simpus-mat-J05-v1",
    "kc_id": "J05",
    "type": "text",
    "title": "J05: konsep dan penerapan",
    "content": "Pilih elemen, buat node, gunakan textContent/classList dan append. Render ulang membersihkan hasil lama. Kode dosen memakai innerHTML untuk fixture; latihan menyempurnakannya dengan textContent agar data tidak menjadi markup.\n\nSumber materi dosen:\nKC/kode-praktikum/jobsheet-05/Dokumentasi/01-konsep-dasar-javascript-dom.md\nKC/kode-praktikum/jobsheet-05/Dokumentasi/07-js-validasi-form.md\nKC/kode-praktikum/jobsheet-06/Dokumentasi/04-js-fetch-render-buku.md",
    "url": null
  },
  {
    "id": "simpus-code-J05-v1",
    "kc_id": "J05",
    "type": "code",
    "title": "Cuplikan kode dosen: jobsheet-06/assets/js/buku.js",
    "content": "Sumber: KC/kode-praktikum/jobsheet-06/assets/js/buku.js\nCuplikan berikut perlu konteks berkas lengkap.\n\n        daftarBuku.forEach(function (buku) {\n            const tr = document.createElement(\"tr\");\n            tr.innerHTML =\n                \"<td>\" + buku.judul + \"</td>\" +\n                \"<td>\" + buku.pengarang + \"</td>\" +\n                \"<td>\" + buku.tahun + \"</td>\" +\n                \"<td>\" + buku.stok + \"</td>\" +\n                \"<td>\" +\n                \"<button type=\\\"button\\\">Edit</button> \" +\n                \"<button type=\\\"button\\\" class=\\\"btn-hapus\\\">Hapus</button>\" +\n                \"</td>\";\n            tbody.appendChild(tr);\n        });\n    } catch (err) {\n        tbody.innerHTML =\n            \"<tr><td colspan=\\\"5\\\">Gagal memuat data: \" + err.message + \"</td></tr>\";\n    } finally {\n        loading.style.display = \"none\";\n    }\n}\n\ndocument.addEventListener(\"DOMContentLoaded\", muatDaftarBuku);",
    "url": null
  },
  {
    "id": "simpus-mat-J06-v1",
    "kc_id": "J06",
    "type": "text",
    "title": "J06: konsep dan penerapan",
    "content": "addEventListener menjalankan callback pada click/change/submit. State harus bertahan antarklik tetapi terpisah antarwidget. Guard mencegah error di halaman tanpa target; aria-expanded melengkapi toggle nav-open.\n\nSumber materi dosen:\nKC/kode-praktikum/jobsheet-05/Dokumentasi/01-konsep-dasar-javascript-dom.md\nKC/kode-praktikum/jobsheet-05/Dokumentasi/04-js-hamburger-menu.md",
    "url": null
  },
  {
    "id": "simpus-code-J06-v1",
    "kc_id": "J06",
    "type": "code",
    "title": "Cuplikan kode dosen: jobsheet-05/assets/js/app.js",
    "content": "Sumber: KC/kode-praktikum/jobsheet-05/assets/js/app.js\nCuplikan berikut perlu konteks berkas lengkap.\n\nfunction initNavToggle() {\n    const toggleBtn = document.getElementById(\"nav-toggle-btn\");\n    const nav = document.querySelector(\"header nav\");\n    if (!toggleBtn || !nav) return;\n\n    toggleBtn.addEventListener(\"click\", function () {\n        nav.classList.toggle(\"nav-open\");\n    });\n}\n\n// ===== Konfirmasi hapus (front-end only, belum ke server) =====\nfunction initHapusConfirm() {\n    document.querySelectorAll(\".btn-hapus\").forEach(function (btn) {\n        btn.addEventListener(\"click\", function () {\n            const row = btn.closest(\"tr\");\n            const nama = row ? row.querySelector(\"td\")?.textContent : \"data ini\";\n            const yakin = confirm(\"Yakin ingin menghapus \\\"\" + nama + \"\\\"?\");\n            if (yakin && row) {\n                row.remove();\n            }\n        });\n    });\n}\n\n// ===== Filter/pencarian tabel real-time =====\nfunction initTableFilter() {\n    const input = document.getElementById(\"search-input\");\n    const table = document.querySelector(\".table-responsive table\");",
    "url": null
  },
  {
    "id": "simpus-mat-J07-v1",
    "kc_id": "J07",
    "type": "text",
    "title": "J07: konsep dan penerapan",
    "content": "Periksa field wajib/rentang lalu tampilkan error inline dan hapus saat valid. Sandbox sendiri membatalkan submit, sehingga defaultPrevented saja bukan bukti validasi. Latihan menguji validator serta siklus pesan invalid ke valid.\n\nSumber materi dosen:\nKC/kode-praktikum/jobsheet-05/Dokumentasi/07-js-validasi-form.md",
    "url": null
  },
  {
    "id": "simpus-code-J07-v1",
    "kc_id": "J07",
    "type": "code",
    "title": "Cuplikan kode dosen: jobsheet-05/assets/js/app.js",
    "content": "Sumber: KC/kode-praktikum/jobsheet-05/assets/js/app.js\nCuplikan fungsi dosen, membutuhkan konteks halaman terkait.\n\nfunction initValidasiForm() {\n    const form = document.getElementById(\"form-tambah\");\n    if (!form) return;\n\n    form.addEventListener(\"submit\", function (e) {\n        let valid = true;\n\n        const judul = form.querySelector(\"[name='judul'], [name='nama']\");\n        if (judul && judul.value.trim() === \"\") {\n            tampilkanError(judul, \"Field ini wajib diisi.\");\n            valid = false;\n        } else if (judul) {\n            hapusError(judul);\n        }\n\n        const pengarang = form.querySelector(\"[name='pengarang']\");\n        if (pengarang && pengarang.value.trim() === \"\") {\n            tampilkanError(pengarang, \"Pengarang wajib diisi.\");\n            valid = false;\n        } else if (pengarang) {\n            hapusError(pengarang);\n        }\n\n        const tahun = form.querySelector(\"[name='tahun']\");\n        if (tahun) {\n            const nilai = parseInt(tahun.value, 10);\n            if (isNaN(nilai) || nilai < 1900 || nilai > 2026) {\n                tampilkanError(tahun, \"Tahun harus di antara 1900-2026.\");\n                valid = false;\n            } else {\n                hapusError(tahun);\n            }\n        }\n\n        const stok = form.querySelector(\"[name='stok']\");\n        if (stok) {\n            const nilai = parseInt(stok.value, 10);\n            if (isNaN(nilai) || nilai < 0) {\n                tampilkanError(stok, \"Stok tidak boleh negatif.\");\n                valid = false;\n            } else {\n                hapusError(stok);\n            }\n        }\n\n        if (!valid) {\n            e.preventDefault();\n        }\n    });\n}",
    "url": null
  },
  {
    "id": "simpus-mat-J08-v1",
    "kc_id": "J08",
    "type": "text",
    "title": "J08: konsep dan penerapan",
    "content": "Filter client hanya melihat baris termuat. Normalisasikan teks/keyword ke huruf kecil dan sembunyikan baris tanpa menghapusnya. Input kosong memulihkan semua; latihan memakai input/hidden, sumber memakai keyup/style.display dengan prinsip sama.\n\nSumber materi dosen:\nKC/kode-praktikum/jobsheet-05/Dokumentasi/06-js-filter-tabel.md\nKC/kode-praktikum/jobsheet-05/Dokumentasi/08-rangkuman-latihan.md",
    "url": null
  },
  {
    "id": "simpus-code-J08-v1",
    "kc_id": "J08",
    "type": "code",
    "title": "Cuplikan kode dosen: jobsheet-05/assets/js/app.js",
    "content": "Sumber: KC/kode-praktikum/jobsheet-05/assets/js/app.js\nCuplikan berikut perlu konteks berkas lengkap.\n\nfunction initTableFilter() {\n    const input = document.getElementById(\"search-input\");\n    const table = document.querySelector(\".table-responsive table\");\n    if (!input || !table) return;\n\n    input.addEventListener(\"keyup\", function () {\n        const keyword = input.value.toLowerCase();\n        const rows = table.querySelectorAll(\"tbody tr\");\n        rows.forEach(function (row) {\n            const teks = row.textContent.toLowerCase();\n            row.style.display = teks.includes(keyword) ? \"\" : \"none\";\n        });\n    });\n}\n\n// ===== Validasi form (client-side) =====\nfunction tampilkanError(input, pesan) {\n    hapusError(input);\n    const span = document.createElement(\"span\");\n    span.className = \"error\";\n    span.textContent = pesan;\n    input.insertAdjacentElement(\"afterend\", span);\n}\n\nfunction hapusError(input) {\n    const next = input.nextElementSibling;\n    if (next && next.classList.contains(\"error\")) {\n        next.remove();",
    "url": null
  },
  {
    "id": "simpus-mat-J09-v1",
    "kc_id": "J09",
    "type": "text",
    "title": "J09: konsep dan penerapan",
    "content": "Tombol dinamis belum ada saat listener statis dipasang. Delegasikan event ke parent, gunakan bubbling/closest agar klik anak tombol tetap dikenali. Confirmer diinjeksi supaya jalur setuju/tolak dapat diuji tanpa dialog modal.\n\nSumber materi dosen:\nKC/kode-praktikum/jobsheet-05/Dokumentasi/05-js-konfirmasi-hapus.md\nKC/kode-praktikum/jobsheet-06/Dokumentasi/06-js-event-delegation-hapus.md\nKC/kode-praktikum/jobsheet-09/Dokumentasi/04-js-update-hapus-confirm.md",
    "url": null
  },
  {
    "id": "simpus-code-J09-v1",
    "kc_id": "J09",
    "type": "code",
    "title": "Cuplikan kode dosen: jobsheet-06/assets/js/app.js",
    "content": "Sumber: KC/kode-praktikum/jobsheet-06/assets/js/app.js\nCuplikan berikut perlu konteks berkas lengkap.\n\nfunction initHapusConfirm() {\n    document.addEventListener(\"click\", function (e) {\n        const btn = e.target.closest(\".btn-hapus\");\n        if (!btn) return;\n\n        const row = btn.closest(\"tr\");\n        const nama = row ? row.querySelector(\"td\")?.textContent : \"data ini\";\n        const yakin = confirm(\"Yakin ingin menghapus \\\"\" + nama + \"\\\"?\");\n        if (yakin && row) {\n            row.remove();\n        }\n    });\n}\n\n// ===== Filter/pencarian tabel real-time =====\nfunction initTableFilter() {\n    const input = document.getElementById(\"search-input\");\n    const table = document.querySelector(\".table-responsive table\");\n    if (!input || !table) return;\n\n    input.addEventListener(\"keyup\", function () {\n        const keyword = input.value.toLowerCase();\n        const rows = table.querySelectorAll(\"tbody tr\");\n        rows.forEach(function (row) {\n            const teks = row.textContent.toLowerCase();\n            row.style.display = teks.includes(keyword) ? \"\" : \"none\";\n        });\n    });",
    "url": null
  },
  {
    "id": "simpus-mat-J10-v1",
    "kc_id": "J10",
    "type": "text",
    "title": "J10: konsep dan penerapan",
    "content": "Await respons dan response.json secara terpisah. Periksa response.ok karena HTTP 404 tidak otomatis menjadi network rejection. Fetcher mock menggantikan jaringan yang diblokir sandbox; ini bukan latihan menjalankan backend.\n\nSumber materi dosen:\nKC/kode-praktikum/jobsheet-06/Dokumentasi/01-konsep-dasar-fetch-json.md\nKC/kode-praktikum/jobsheet-06/Dokumentasi/04-js-fetch-render-buku.md\nKC/kode-praktikum/jobsheet-06/Dokumentasi/07-menjalankan-dengan-server-lokal.md",
    "url": null
  },
  {
    "id": "simpus-code-J10-v1",
    "kc_id": "J10",
    "type": "code",
    "title": "Cuplikan kode dosen: jobsheet-06/assets/js/buku.js",
    "content": "Sumber: KC/kode-praktikum/jobsheet-06/assets/js/buku.js\nCuplikan berikut perlu konteks berkas lengkap.\n\n        const res = await fetch(\"../data/buku.json\");\n        if (!res.ok) {\n            throw new Error(\"Gagal mengambil data (status \" + res.status + \")\");\n        }\n        const daftarBuku = await res.json();\n\n        daftarBuku.forEach(function (buku) {\n            const tr = document.createElement(\"tr\");\n            tr.innerHTML =\n                \"<td>\" + buku.judul + \"</td>\" +\n                \"<td>\" + buku.pengarang + \"</td>\" +\n                \"<td>\" + buku.tahun + \"</td>\" +\n                \"<td>\" + buku.stok + \"</td>\" +\n                \"<td>\" +\n                \"<button type=\\\"button\\\">Edit</button> \" +\n                \"<button type=\\\"button\\\" class=\\\"btn-hapus\\\">Hapus</button>\" +\n                \"</td>\";\n            tbody.appendChild(tr);\n        });\n    } catch (err) {\n        tbody.innerHTML =\n            \"<tr><td colspan=\\\"5\\\">Gagal memuat data: \" + err.message + \"</td></tr>\";\n    } finally {\n        loading.style.display = \"none\";\n    }\n}\n\ndocument.addEventListener(\"DOMContentLoaded\", muatDaftarBuku);",
    "url": null
  },
  {
    "id": "simpus-mat-J11-v1",
    "kc_id": "J11",
    "type": "text",
    "title": "J11: konsep dan penerapan",
    "content": "Tampilkan loading sebelum await; catch menampilkan gagal dan finally selalu menyembunyikan loading. Retry membersihkan error dan mengganti hasil tanpa duplikasi. Tes menggunakan Promise tertunda yang dikendalikan, bukan network nyata.\n\nSumber materi dosen:\nKC/kode-praktikum/jobsheet-06/Dokumentasi/01-konsep-dasar-fetch-json.md\nKC/kode-praktikum/jobsheet-06/Dokumentasi/02-perubahan-file-html.md\nKC/kode-praktikum/jobsheet-06/Dokumentasi/04-js-fetch-render-buku.md\nKC/kode-praktikum/jobsheet-06/Dokumentasi/08-rangkuman-latihan.md",
    "url": null
  },
  {
    "id": "simpus-code-J11-v1",
    "kc_id": "J11",
    "type": "code",
    "title": "Cuplikan kode dosen: jobsheet-06/assets/js/buku.js",
    "content": "Sumber: KC/kode-praktikum/jobsheet-06/assets/js/buku.js\nCuplikan fungsi dosen, membutuhkan konteks halaman terkait.\n\nasync function muatDaftarBuku() {\n    const tbody = document.querySelector(\".table-responsive table tbody\");\n    const loading = document.getElementById(\"loading-indicator\");\n    if (!tbody) return;\n\n    loading.style.display = \"block\";\n    tbody.innerHTML = \"\";\n\n    try {\n        // simulasi delay jaringan agar loading indicator terlihat\n        await new Promise((resolve) => setTimeout(resolve, 600));\n\n        const res = await fetch(\"../data/buku.json\");\n        if (!res.ok) {\n            throw new Error(\"Gagal mengambil data (status \" + res.status + \")\");\n        }\n        const daftarBuku = await res.json();\n\n        daftarBuku.forEach(function (buku) {\n            const tr = document.createElement(\"tr\");\n            tr.innerHTML =\n                \"<td>\" + buku.judul + \"</td>\" +\n                \"<td>\" + buku.pengarang + \"</td>\" +\n                \"<td>\" + buku.tahun + \"</td>\" +\n                \"<td>\" + buku.stok + \"</td>\" +\n                \"<td>\" +\n                \"<button type=\\\"button\\\">Edit</button> \" +\n                \"<button type=\\\"button\\\" class=\\\"btn-hapus\\\">Hapus</button>\" +\n                \"</td>\";\n            tbody.appendChild(tr);\n        });\n    } catch (err) {\n        tbody.innerHTML =\n            \"<tr><td colspan=\\\"5\\\">Gagal memuat data: \" + err.message + \"</td></tr>\";\n    } finally {\n        loading.style.display = \"none\";\n    }\n}",
    "url": null
  }
];
