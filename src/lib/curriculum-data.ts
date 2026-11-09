import type { KC } from "./types";
import { CURRICULUM_VERSION } from "./curriculum";
// Metadata transcribed from docs/kc-mapping-proposal.md. Edge 0.9 retains the existing pilot CPT, not importance W.
export const curriculumKCs: KC[] = ([
  {
    "id": "H01",
    "code": "H01",
    "name": "HTML Document Structure",
    "module": "HTML",
    "position": 0,
    "description": "Menulis doctype, html lang, head/title/charset dan body dengan penempatan benar.",
    "importance_weight": 3,
    "difficulty_level": "Beginner",
    "weight_reason": "— Fondasi semua halaman; DOM hasil perbaikan browser tidak membuktikan sumber valid.",
    "sources": [
      "KC/kode-praktikum/jobsheet-01/Dokumentasi/01-konsep-dasar.md",
      "KC/kode-praktikum/jobsheet-01/Dokumentasi/02-index-html.md"
    ],
    "prerequisites": [],
    "external_prerequisites": [
      "F01"
    ],
    "assessment_ready": true,
    "assessment_note": ""
  },
  {
    "id": "H02",
    "code": "H02",
    "name": "Semantic HTML & Accessibility",
    "module": "HTML",
    "position": 1,
    "description": "Memilih landmark/hierarki heading, memberi nama navigasi dan menghubungkan label-kontrol.",
    "importance_weight": 3,
    "difficulty_level": "Beginner",
    "weight_reason": "— Dipakai lintas halaman dan menunjang akses keyboard/pembaca layar.",
    "sources": [
      "KC/kode-praktikum/jobsheet-01/Dokumentasi/01-konsep-dasar.md",
      "KC/kode-praktikum/jobsheet-01/Dokumentasi/02-index-html.md",
      "KC/kode-praktikum/jobsheet-01/Dokumentasi/04-buku-tambah-html.md"
    ],
    "prerequisites": [
      {
        "id": "H01",
        "weight": 0.9
      }
    ],
    "external_prerequisites": [],
    "assessment_ready": true,
    "assessment_note": ""
  },
  {
    "id": "H03",
    "code": "H03",
    "name": "Text, Links & Relative Paths",
    "module": "HTML",
    "position": 2,
    "description": "Menyusun teks/heading serta href/referensi aset pada root dan subfolder.",
    "importance_weight": 2,
    "difficulty_level": "Beginner",
    "weight_reason": "— Fondasi navigasi dengan lingkup lebih sederhana daripada form.",
    "sources": [
      "KC/kode-praktikum/jobsheet-01/Dokumentasi/01-konsep-dasar.md",
      "KC/kode-praktikum/jobsheet-01/Dokumentasi/02-index-html.md",
      "KC/kode-praktikum/jobsheet-01/Dokumentasi/05-anggota-list-html.md",
      "KC/kode-praktikum/jobsheet-02/Dokumentasi/02-perubahan-file-html.md"
    ],
    "prerequisites": [
      {
        "id": "H01",
        "weight": 0.9
      }
    ],
    "external_prerequisites": [],
    "assessment_ready": true,
    "assessment_note": ""
  },
  {
    "id": "H04",
    "code": "H04",
    "name": "HTML Tables",
    "module": "HTML",
    "position": 3,
    "description": "Membuat thead/tbody, header dan baris buku/anggota dengan jumlah sel konsisten.",
    "importance_weight": 3,
    "difficulty_level": "Beginner",
    "weight_reason": "— Pola inti katalog/riwayat yang belum dipisahkan pada KC lama.",
    "sources": [
      "KC/kode-praktikum/jobsheet-01/Dokumentasi/03-buku-list-html.md",
      "KC/kode-praktikum/jobsheet-01/Dokumentasi/05-anggota-list-html.md"
    ],
    "prerequisites": [
      {
        "id": "H02",
        "weight": 0.9
      }
    ],
    "external_prerequisites": [],
    "assessment_ready": true,
    "assessment_note": ""
  },
  {
    "id": "H05",
    "code": "H05",
    "name": "HTML Forms & Constraints",
    "module": "HTML",
    "position": 4,
    "description": "Menyusun name/id, label, tipe input/select dan constraint sesuai skema buku/anggota.",
    "importance_weight": 4,
    "difficulty_level": "Beginner",
    "weight_reason": "— Kontrak field dipakai oleh JS, PHP dan DB; salah name memutus alur.",
    "sources": [
      "KC/kode-praktikum/jobsheet-01/Dokumentasi/04-buku-tambah-html.md",
      "KC/kode-praktikum/jobsheet-01/Dokumentasi/06-anggota-tambah-html.md"
    ],
    "prerequisites": [
      {
        "id": "H02",
        "weight": 0.9
      }
    ],
    "external_prerequisites": [],
    "assessment_ready": true,
    "assessment_note": ""
  },
  {
    "id": "C01",
    "code": "C01",
    "name": "CSS Selectors & Specificity",
    "module": "CSS",
    "position": 5,
    "description": "Memakai selector elemen/class/atribut/descendant/pseudo-class dan menentukan pemenang konflik.",
    "importance_weight": 3,
    "difficulty_level": "Beginner",
    "weight_reason": "— Fondasi seluruh styling; perlu konflik aturan untuk mengukur spesifisitas.",
    "sources": [
      "KC/kode-praktikum/jobsheet-02/Dokumentasi/01-konsep-dasar-css.md",
      "KC/kode-praktikum/jobsheet-02/Dokumentasi/04-css-header-navbar-flexbox.md",
      "KC/kode-praktikum/jobsheet-02/Dokumentasi/06-css-grid-kartu-statistik.md"
    ],
    "prerequisites": [
      {
        "id": "H03",
        "weight": 0.9
      }
    ],
    "external_prerequisites": [],
    "assessment_ready": true,
    "assessment_note": ""
  },
  {
    "id": "C02",
    "code": "C02",
    "name": "CSS Box Model",
    "module": "CSS",
    "position": 6,
    "description": "Mengatur reset, border-box, padding/margin, lebar, satuan dan tipografi dasar.",
    "importance_weight": 3,
    "difficulty_level": "Beginner",
    "weight_reason": "— Menopang perhitungan layout, konsistensi dan Flexbox/Grid.",
    "sources": [
      "KC/kode-praktikum/jobsheet-02/Dokumentasi/01-konsep-dasar-css.md",
      "KC/kode-praktikum/jobsheet-02/Dokumentasi/03-css-reset-dan-body.md",
      "KC/kode-praktikum/jobsheet-02/Dokumentasi/05-css-main-dan-section.md",
      "KC/kode-praktikum/jobsheet-02/Dokumentasi/09-css-footer.md"
    ],
    "prerequisites": [
      {
        "id": "C01",
        "weight": 0.9
      }
    ],
    "external_prerequisites": [],
    "assessment_ready": true,
    "assessment_note": ""
  },
  {
    "id": "C03",
    "code": "C03",
    "name": "Flexbox Layout",
    "module": "CSS",
    "position": 7,
    "description": "Mengatur sumbu, perataan, gap dan wrapping navbar/header.",
    "importance_weight": 4,
    "difficulty_level": "Intermediate",
    "weight_reason": "— Fondasi navbar dan layout berulang lintas proyek.",
    "sources": [
      "KC/kode-praktikum/jobsheet-02/Dokumentasi/04-css-header-navbar-flexbox.md"
    ],
    "prerequisites": [
      {
        "id": "C02",
        "weight": 0.9
      }
    ],
    "external_prerequisites": [],
    "assessment_ready": true,
    "assessment_note": ""
  },
  {
    "id": "C04",
    "code": "C04",
    "name": "CSS Grid Layout",
    "module": "CSS",
    "position": 8,
    "description": "Membuat kartu statistik dengan kolom fr, gap dan aliran baris.",
    "importance_weight": 4,
    "difficulty_level": "Intermediate",
    "weight_reason": "— Fondasi dashboard dan responsive grid.",
    "sources": [
      "KC/kode-praktikum/jobsheet-02/Dokumentasi/06-css-grid-kartu-statistik.md"
    ],
    "prerequisites": [
      {
        "id": "C02",
        "weight": 0.9
      }
    ],
    "external_prerequisites": [],
    "assessment_ready": true,
    "assessment_note": ""
  },
  {
    "id": "C05",
    "code": "C05",
    "name": "Table Styling",
    "module": "CSS",
    "position": 9,
    "description": "Mengatur border-collapse, padding, zebra stripe, hover dan pembeda tombol aksi.",
    "importance_weight": 2,
    "difficulty_level": "Beginner",
    "weight_reason": "— Meningkatkan keterbacaan dengan lingkup lokal.",
    "sources": [
      "KC/kode-praktikum/jobsheet-02/Dokumentasi/07-css-tabel.md"
    ],
    "prerequisites": [
      {
        "id": "C01",
        "weight": 0.9
      },
      {
        "id": "H04",
        "weight": 0.9
      }
    ],
    "external_prerequisites": [],
    "assessment_ready": true,
    "assessment_note": ""
  },
  {
    "id": "C06",
    "code": "C06",
    "name": "Form Styling",
    "module": "CSS",
    "position": 10,
    "description": "Mengatur label blok, lebar/spacing kontrol, tombol dan kelas sukses/error.",
    "importance_weight": 2,
    "difficulty_level": "Beginner",
    "weight_reason": "— Pola styling lokal yang dipakai ulang pada form.",
    "sources": [
      "KC/kode-praktikum/jobsheet-02/Dokumentasi/08-css-form.md",
      "KC/kode-praktikum/jobsheet-07/Dokumentasi/06-css-flash-message.md"
    ],
    "prerequisites": [
      {
        "id": "C02",
        "weight": 0.9
      },
      {
        "id": "H05",
        "weight": 0.9
      }
    ],
    "external_prerequisites": [],
    "assessment_ready": true,
    "assessment_note": ""
  },
  {
    "id": "C07",
    "code": "C07",
    "name": "Responsive Design & Media Queries",
    "module": "CSS",
    "position": 11,
    "description": "Memilih strategi responsive dan mengubah layout pada breakpoint yang ditetapkan.",
    "importance_weight": 4,
    "difficulty_level": "Intermediate",
    "weight_reason": "— Capaian wajib lintas halaman; keberadaan @media saja tidak cukup.",
    "sources": [
      "KC/kode-praktikum/jobsheet-03/Dokumentasi/01-konsep-dasar-responsive.md",
      "KC/kode-praktikum/jobsheet-03/Dokumentasi/02-perubahan-file-html.md",
      "KC/kode-praktikum/jobsheet-03/Dokumentasi/05-css-media-query-breakpoint.md"
    ],
    "prerequisites": [
      {
        "id": "C03",
        "weight": 0.9
      },
      {
        "id": "C04",
        "weight": 0.9
      }
    ],
    "external_prerequisites": [],
    "assessment_ready": false,
    "assessment_note": "Penilaian otomatis ditunda: evaluator multi-viewport belum tersedia. Latihan ini untuk praktik; tidak mengubah BKT."
  },
  {
    "id": "C08",
    "code": "C08",
    "name": "Responsive Table Overflow",
    "module": "CSS",
    "position": 12,
    "description": "Membatasi overflow pada wrapper agar tabel dapat digulir tanpa melebarkan halaman.",
    "importance_weight": 2,
    "difficulty_level": "Intermediate",
    "weight_reason": "— Pelengkap responsive dengan satu pola yang spesifik.",
    "sources": [
      "KC/kode-praktikum/jobsheet-03/Dokumentasi/04-css-table-responsive.md"
    ],
    "prerequisites": [
      {
        "id": "C02",
        "weight": 0.9
      },
      {
        "id": "H04",
        "weight": 0.9
      }
    ],
    "external_prerequisites": [],
    "assessment_ready": false,
    "assessment_note": "Penilaian otomatis ditunda: evaluator multi-viewport belum tersedia. Latihan ini untuk praktik; tidak mengubah BKT."
  },
  {
    "id": "C09",
    "code": "C09",
    "name": "CSS Hamburger Menu",
    "module": "CSS",
    "position": 13,
    "description": "Menghubungkan checkbox, label, :checked dan sibling combinator tanpa JS.",
    "importance_weight": 2,
    "difficulty_level": "Intermediate",
    "weight_reason": "— Teknik lokal sebelum event JS, bukan pengganti KC event.",
    "sources": [
      "KC/kode-praktikum/jobsheet-03/Dokumentasi/02-perubahan-file-html.md",
      "KC/kode-praktikum/jobsheet-03/Dokumentasi/03-css-hamburger-checkbox-hack.md"
    ],
    "prerequisites": [
      {
        "id": "C01",
        "weight": 0.9
      },
      {
        "id": "C07",
        "weight": 0.9
      },
      {
        "id": "H05",
        "weight": 0.9
      }
    ],
    "external_prerequisites": [],
    "assessment_ready": false,
    "assessment_note": "Penilaian otomatis ditunda: evaluator multi-viewport belum tersedia. Latihan ini untuk praktik; tidak mengubah BKT."
  },
  {
    "id": "J01",
    "code": "J01",
    "name": "Variables, Types & Operators",
    "module": "JavaScript",
    "position": 14,
    "description": "Memakai let/const, tipe nilai dan operator untuk menghitung data buku.",
    "importance_weight": 2,
    "difficulty_level": "Beginner",
    "weight_reason": "— Fondasi implisit kode dosen, dapat diuji dengan fungsi kecil.",
    "sources": [
      "KC/kode-praktikum/jobsheet-05/Dokumentasi/04-js-hamburger-menu.md",
      "KC/kode-praktikum/jobsheet-05/Dokumentasi/06-js-filter-tabel.md",
      "KC/kode-praktikum/jobsheet-05/Dokumentasi/07-js-validasi-form.md"
    ],
    "prerequisites": [],
    "external_prerequisites": [],
    "assessment_ready": true,
    "assessment_note": ""
  },
  {
    "id": "J02",
    "code": "J02",
    "name": "Conditions & Loops",
    "module": "JavaScript",
    "position": 15,
    "description": "Memilih cabang dan mengiterasi koleksi untuk menghitung ketersediaan.",
    "importance_weight": 3,
    "difficulty_level": "Beginner",
    "weight_reason": "— Menopang validasi, filter dan rendering.",
    "sources": [
      "KC/kode-praktikum/jobsheet-05/Dokumentasi/06-js-filter-tabel.md",
      "KC/kode-praktikum/jobsheet-05/Dokumentasi/07-js-validasi-form.md",
      "KC/kode-praktikum/jobsheet-06/Dokumentasi/04-js-fetch-render-buku.md"
    ],
    "prerequisites": [
      {
        "id": "J01",
        "weight": 0.9
      }
    ],
    "external_prerequisites": [],
    "assessment_ready": true,
    "assessment_note": ""
  },
  {
    "id": "J03",
    "code": "J03",
    "name": "Functions & Scope",
    "module": "JavaScript",
    "position": 16,
    "description": "Membagi init/helper menjadi fungsi dan menjaga state lokal.",
    "importance_weight": 3,
    "difficulty_level": "Beginner",
    "weight_reason": "— Pola fungsi berulang dan mendukung refactor buku/anggota.",
    "sources": [
      "KC/kode-praktikum/jobsheet-05/Dokumentasi/01-konsep-dasar-javascript-dom.md",
      "KC/kode-praktikum/jobsheet-05/Dokumentasi/04-js-hamburger-menu.md",
      "KC/kode-praktikum/jobsheet-05/Dokumentasi/07-js-validasi-form.md",
      "KC/kode-praktikum/jobsheet-06/Dokumentasi/05-js-fetch-render-anggota.md"
    ],
    "prerequisites": [
      {
        "id": "J02",
        "weight": 0.9
      }
    ],
    "external_prerequisites": [],
    "assessment_ready": true,
    "assessment_note": ""
  },
  {
    "id": "J04",
    "code": "J04",
    "name": "Arrays, Objects & JSON",
    "module": "JavaScript",
    "position": 17,
    "description": "Mengurai JSON, membaca properti dan mengolah koleksi buku/anggota.",
    "importance_weight": 3,
    "difficulty_level": "Beginner",
    "weight_reason": "— Dasar pertukaran data dan fetch/render.",
    "sources": [
      "KC/kode-praktikum/jobsheet-06/Dokumentasi/01-konsep-dasar-fetch-json.md",
      "KC/kode-praktikum/jobsheet-06/Dokumentasi/03-data-json.md",
      "KC/kode-praktikum/jobsheet-06/Dokumentasi/05-js-fetch-render-anggota.md"
    ],
    "prerequisites": [
      {
        "id": "J03",
        "weight": 0.9
      }
    ],
    "external_prerequisites": [],
    "assessment_ready": true,
    "assessment_note": ""
  },
  {
    "id": "J05",
    "code": "J05",
    "name": "DOM Manipulation",
    "module": "JavaScript",
    "position": 18,
    "description": "Memilih node, mengubah teks/class dan merender tabel dari data.",
    "importance_weight": 4,
    "difficulty_level": "Intermediate",
    "weight_reason": "— Penghubung utama data dan UI pada hampir semua interaksi.",
    "sources": [
      "KC/kode-praktikum/jobsheet-05/Dokumentasi/01-konsep-dasar-javascript-dom.md",
      "KC/kode-praktikum/jobsheet-05/Dokumentasi/07-js-validasi-form.md",
      "KC/kode-praktikum/jobsheet-06/Dokumentasi/04-js-fetch-render-buku.md"
    ],
    "prerequisites": [
      {
        "id": "J03",
        "weight": 0.9
      },
      {
        "id": "J04",
        "weight": 0.9
      },
      {
        "id": "H04",
        "weight": 0.9
      }
    ],
    "external_prerequisites": [],
    "assessment_ready": true,
    "assessment_note": ""
  },
  {
    "id": "J06",
    "code": "J06",
    "name": "Event Handling",
    "module": "JavaScript",
    "position": 19,
    "description": "Memasang listener dan mengubah class/state antarklik tanpa reload.",
    "importance_weight": 4,
    "difficulty_level": "Intermediate",
    "weight_reason": "— Fondasi menu, form dan interaksi berikutnya.",
    "sources": [
      "KC/kode-praktikum/jobsheet-05/Dokumentasi/01-konsep-dasar-javascript-dom.md",
      "KC/kode-praktikum/jobsheet-05/Dokumentasi/04-js-hamburger-menu.md"
    ],
    "prerequisites": [
      {
        "id": "J05",
        "weight": 0.9
      }
    ],
    "external_prerequisites": [],
    "assessment_ready": true,
    "assessment_note": ""
  },
  {
    "id": "J07",
    "code": "J07",
    "name": "Form Validation",
    "module": "JavaScript",
    "position": 20,
    "description": "Memeriksa field, tahun/stok dan menampilkan/menghapus error inline.",
    "importance_weight": 4,
    "difficulty_level": "Intermediate",
    "weight_reason": "— Menentukan umpan balik form; tidak menjamin validasi server.",
    "sources": [
      "KC/kode-praktikum/jobsheet-05/Dokumentasi/07-js-validasi-form.md"
    ],
    "prerequisites": [
      {
        "id": "J06",
        "weight": 0.9
      },
      {
        "id": "H05",
        "weight": 0.9
      },
      {
        "id": "J02",
        "weight": 0.9
      }
    ],
    "external_prerequisites": [],
    "assessment_ready": true,
    "assessment_note": ""
  },
  {
    "id": "J08",
    "code": "J08",
    "name": "Client-Side Table Filtering",
    "module": "JavaScript",
    "position": 21,
    "description": "Menyaring baris secara case-insensitive dan memulihkan hasil ketika input kosong.",
    "importance_weight": 3,
    "difficulty_level": "Intermediate",
    "weight_reason": "— Pemrosesan data khusus yang belum dipisah dari DOM/event lama.",
    "sources": [
      "KC/kode-praktikum/jobsheet-05/Dokumentasi/06-js-filter-tabel.md",
      "KC/kode-praktikum/jobsheet-05/Dokumentasi/08-rangkuman-latihan.md"
    ],
    "prerequisites": [
      {
        "id": "J06",
        "weight": 0.9
      },
      {
        "id": "J04",
        "weight": 0.9
      },
      {
        "id": "H04",
        "weight": 0.9
      }
    ],
    "external_prerequisites": [],
    "assessment_ready": true,
    "assessment_note": ""
  },
  {
    "id": "J09",
    "code": "J09",
    "name": "Event Delegation",
    "module": "JavaScript",
    "position": 22,
    "description": "Mendelegasikan event, mencari target/parent dan membatalkan aksi sesuai konfirmasi.",
    "importance_weight": 3,
    "difficulty_level": "Intermediate",
    "weight_reason": "— Diperlukan untuk tombol dinamis setelah fetch, berbeda dari listener statis.",
    "sources": [
      "KC/kode-praktikum/jobsheet-05/Dokumentasi/05-js-konfirmasi-hapus.md",
      "KC/kode-praktikum/jobsheet-06/Dokumentasi/06-js-event-delegation-hapus.md",
      "KC/kode-praktikum/jobsheet-09/Dokumentasi/04-js-update-hapus-confirm.md"
    ],
    "prerequisites": [
      {
        "id": "J06",
        "weight": 0.9
      },
      {
        "id": "J05",
        "weight": 0.9
      }
    ],
    "external_prerequisites": [],
    "assessment_ready": true,
    "assessment_note": ""
  },
  {
    "id": "J10",
    "code": "J10",
    "name": "Fetch API & Async/Await",
    "module": "JavaScript",
    "position": 23,
    "description": "Menunggu respons/json dan memeriksa status HTTP sebelum memakai data.",
    "importance_weight": 4,
    "difficulty_level": "Intermediate",
    "weight_reason": "— Capaian asinkron CPMK-3; salah await/status memutus data.",
    "sources": [
      "KC/kode-praktikum/jobsheet-06/Dokumentasi/01-konsep-dasar-fetch-json.md",
      "KC/kode-praktikum/jobsheet-06/Dokumentasi/04-js-fetch-render-buku.md",
      "KC/kode-praktikum/jobsheet-06/Dokumentasi/07-menjalankan-dengan-server-lokal.md"
    ],
    "prerequisites": [
      {
        "id": "J04",
        "weight": 0.9
      },
      {
        "id": "J03",
        "weight": 0.9
      }
    ],
    "external_prerequisites": [
      "F01"
    ],
    "assessment_ready": true,
    "assessment_note": ""
  },
  {
    "id": "J11",
    "code": "J11",
    "name": "Loading, Error Handling & Retry",
    "module": "JavaScript",
    "position": 24,
    "description": "Mengelola UI selama request tertunda dan memulihkannya melalui finally.",
    "importance_weight": 3,
    "difficulty_level": "Intermediate",
    "weight_reason": "— Melengkapi fetch pada cabang sukses/gagal yang nyata.",
    "sources": [
      "KC/kode-praktikum/jobsheet-06/Dokumentasi/01-konsep-dasar-fetch-json.md",
      "KC/kode-praktikum/jobsheet-06/Dokumentasi/02-perubahan-file-html.md",
      "KC/kode-praktikum/jobsheet-06/Dokumentasi/04-js-fetch-render-buku.md",
      "KC/kode-praktikum/jobsheet-06/Dokumentasi/08-rangkuman-latihan.md"
    ],
    "prerequisites": [
      {
        "id": "J10",
        "weight": 0.9
      },
      {
        "id": "J05",
        "weight": 0.9
      }
    ],
    "external_prerequisites": [],
    "assessment_ready": true,
    "assessment_note": ""
  }
] as KC[]).map(k=>({...k,curriculum_version:CURRICULUM_VERSION}));
