/* =====================================================================
   MUSIC — DATA (EDIT DI SINI)
   ---------------------------------------------------------------------
   Lagu diambil otomatis dari iTunes Search API (preview resmi 30 detik +
   cover album asli) — butuh internet. Tidak ada file audio yang dibundel.

   • MUSIC_ARTISTS : daftar artis di halaman Home. Tambah / hapus bebas.
       term    = kata pencarian artis di iTunes
       country = kode toko iTunes (ID, US, KR, JP, ...)
       limit   = jumlah lagu yang ditampilkan
   • MUSIC_LOCAL   : (opsional) lagu dari file sendiri. Taruh mp3 di
       assets/music/ lalu isi di sini; akan muncul di baris "Koleksi Saya"
       dan diputar penuh (bukan preview).
   ===================================================================== */
const MUSIC_ARTISTS = [
  { name: "Adela",       term: "Adela",       country: "ID", color: "#ff5f7e", limit: 8 },
  { name: "CORTIS",      term: "CORTIS",      country: "US", color: "#3d8bff", limit: 8 },
  { name: "BABYMONSTER", term: "BABYMONSTER", country: "US", color: "#e0245e", limit: 8 },
  { name: "Hozier",      term: "Hozier",      country: "US", color: "#6b8f71", limit: 8 },
];

const MUSIC_LOCAL = [
  // { title: "Judul Lagu", artist: "Hozier", src: "assets/music/judul.mp3", cover: "assets/music/judul.jpg" },
];

const MUSIC_USER = { name: "Eros", avatar: "" };   // avatar bulat di pojok kanan atas
