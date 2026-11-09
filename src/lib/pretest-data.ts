/** Draft jobsheet-aligned MCQ instrument; expert validation remains required. */
export const pretestQuestions=[
  {
    "id": "h01",
    "module": "HTML",
    "kc": "H01",
    "question": "Metadata judul tab SIMPUS-Mini ditempatkan di mana?",
    "options": [
      "title di head",
      "h1 di footer",
      "title di main",
      "nav di body"
    ],
    "answer": 0
  },
  {
    "id": "h02",
    "module": "HTML",
    "kc": "H02",
    "question": "Bagaimana label Nama dihubungkan dengan input anggota?",
    "options": [
      "label for sama dengan input id",
      "warna label sama dengan input",
      "label name sama dengan class",
      "letakkan label dalam script"
    ],
    "answer": 0
  },
  {
    "id": "h03",
    "module": "HTML",
    "kc": "H03",
    "question": "Dari buku/list.html, path relatif menuju index.html di root proyek?",
    "options": [
      "index.html",
      "../index.html",
      "/buku/index.html",
      "../../index.html"
    ],
    "answer": 1
  },
  {
    "id": "h04",
    "module": "HTML",
    "kc": "H04",
    "question": "Bagian yang mengelompokkan baris data tabel buku?",
    "options": [
      "thead",
      "caption",
      "tbody",
      "nav"
    ],
    "answer": 2
  },
  {
    "id": "h05",
    "module": "HTML",
    "kc": "H05",
    "question": "Constraint HTML stok tidak negatif?",
    "options": [
      "type=text max=0",
      "type=number min=0",
      "name=positive saja",
      "label=0"
    ],
    "answer": 1
  },
  {
    "id": "c01",
    "module": "CSS",
    "kc": "C01",
    "question": "Tanpa important, selector mana lebih spesifik untuk link navbar?",
    "options": [
      "a",
      "*",
      "header nav a",
      "body"
    ],
    "answer": 2
  },
  {
    "id": "c02",
    "module": "CSS",
    "kc": "C02",
    "question": "width pada border-box mencakup apa?",
    "options": [
      "content saja",
      "content, padding, border",
      "margin luar saja",
      "seluruh viewport"
    ],
    "answer": 1
  },
  {
    "id": "c03",
    "module": "CSS",
    "kc": "C03",
    "question": "Properti agar item navbar flex dapat pindah baris?",
    "options": [
      "flex-wrap:wrap",
      "border-collapse:collapse",
      "overflow:hidden",
      "position:fixed"
    ],
    "answer": 0
  },
  {
    "id": "c04",
    "module": "CSS",
    "kc": "C04",
    "question": "Grid tiga kartu dengan lebar sama?",
    "options": [
      "grid-template-columns:3px",
      "grid-template-columns:repeat(3,1fr)",
      "float:3",
      "display:three"
    ],
    "answer": 1
  },
  {
    "id": "c05",
    "module": "CSS",
    "kc": "C05",
    "question": "Selector zebra stripe baris genap pada body tabel?",
    "options": [
      "thead:nth-child(odd)",
      "tbody tr:nth-child(even)",
      "table::even",
      "tr[even]"
    ],
    "answer": 1
  },
  {
    "id": "c06",
    "module": "CSS",
    "kc": "C06",
    "question": "Agar label form menempati baris sendiri?",
    "options": [
      "display:none",
      "display:block",
      "opacity:0",
      "position:absolute"
    ],
    "answer": 1
  },
  {
    "id": "c07",
    "module": "CSS",
    "kc": "C07",
    "question": "Aturan mobile-first yang aktif mulai lebar 769px?",
    "options": [
      "@media(min-width:769px)",
      "@media(max-width:480px)",
      "@viewport(769)",
      "width:769 saja"
    ],
    "answer": 0
  },
  {
    "id": "c08",
    "module": "CSS",
    "kc": "C08",
    "question": "Agar tabel lebar dapat digulir pada wrapper?",
    "options": [
      "overflow-x:auto pada wrapper",
      "display:none pada table",
      "width:200vw pada body",
      "overflow:hidden pada body"
    ],
    "answer": 0
  },
  {
    "id": "c09",
    "module": "CSS",
    "kc": "C09",
    "question": "Pada .toggle:checked ~ nav, nav harus berada di mana?",
    "options": [
      "sebelum checkbox",
      "sesudah checkbox dengan parent sama",
      "di head",
      "di iframe lain"
    ],
    "answer": 1
  },
  {
    "id": "j01",
    "module": "JavaScript",
    "kc": "J01",
    "question": "Nomor anggota 001 agar nol awal tetap utuh disimpan sebagai?",
    "options": [
      "string",
      "integer",
      "boolean",
      "undefined"
    ],
    "answer": 0
  },
  {
    "id": "j02",
    "module": "JavaScript",
    "kc": "J02",
    "question": "Terlambat lebih dari 14 hari berarti kondisi?",
    "options": [
      "hari>=14",
      "hari>14",
      "hari<14",
      "hari===14"
    ],
    "answer": 1
  },
  {
    "id": "j03",
    "module": "JavaScript",
    "kc": "J03",
    "question": "State counter dua widget agar terpisah diletakkan di mana?",
    "options": [
      "satu variabel global bersama",
      "scope/closure masing-masing instance",
      "atribut href",
      "CSS grid"
    ],
    "answer": 1
  },
  {
    "id": "j04",
    "module": "JavaScript",
    "kc": "J04",
    "question": "Mengubah teks JSON buku menjadi object/array JS?",
    "options": [
      "JSON.parse",
      "JSON.stringify",
      "querySelector",
      "parseInt semua teks"
    ],
    "answer": 0
  },
  {
    "id": "j05",
    "module": "JavaScript",
    "kc": "J05",
    "question": "Menampilkan judul dari input sebagai teks tanpa membuat markup?",
    "options": [
      "innerHTML tanpa escaping",
      "textContent",
      "eval",
      "document.write"
    ],
    "answer": 1
  },
  {
    "id": "j06",
    "module": "JavaScript",
    "kc": "J06",
    "question": "Memasang respons klik tombol menu?",
    "options": [
      "addEventListener",
      "fetchAll",
      "querySelectorAll saja",
      "JSON.parse"
    ],
    "answer": 0
  },
  {
    "id": "j07",
    "module": "JavaScript",
    "kc": "J07",
    "question": "Setelah input invalid diperbaiki, pesan error sebaiknya?",
    "options": [
      "tetap selamanya",
      "dibersihkan jika valid",
      "diubah jadi password",
      "hanya reload server"
    ],
    "answer": 1
  },
  {
    "id": "j08",
    "module": "JavaScript",
    "kc": "J08",
    "question": "Filter client dapat mencari data yang mana?",
    "options": [
      "seluruh DB otomatis",
      "data yang sudah tersedia di client",
      "tabel server tanpa request",
      "semua halaman belum dimuat"
    ],
    "answer": 1
  },
  {
    "id": "j09",
    "module": "JavaScript",
    "kc": "J09",
    "question": "Tombol dibuat sesudah init; pola listener yang tepat?",
    "options": [
      "delegasi event pada parent",
      "listener pada tombol yang belum ada",
      "hapus seluruh parent",
      "setInterval reload"
    ],
    "answer": 0
  },
  {
    "id": "j10",
    "module": "JavaScript",
    "kc": "J10",
    "question": "Setelah await fetch, apa yang masih ditunggu untuk JSON?",
    "options": [
      "response.json()",
      "response.style",
      "response.classList",
      "response.title otomatis"
    ],
    "answer": 0
  },
  {
    "id": "j11",
    "module": "JavaScript",
    "kc": "J11",
    "question": "Loading disembunyikan pada sukses maupun gagal; blok yang sesuai?",
    "options": [
      "finally",
      "hanya try sebelum await",
      "hanya catch",
      "tidak pernah"
    ],
    "answer": 0
  }
];
