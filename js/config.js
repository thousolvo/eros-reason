/* =====================================================================
   CONFIG — pengaturan umum HP. Edit di sini.
   ===================================================================== */
const CONFIG = {
  passcode: "0000",
  carrier: "TSEL",
  frame: true,   // false = tampilan layar penuh tanpa bezel
  live: true,    // true = jam & tanggal real-time
  fixed: { hour: 21, minute: 25, dateShort: "Tue 20 Oct", dayLong: "Tuesday", dayNum: 20, dayAbbr: "TUE" },
};

/* Susunan ikon di home screen (pakai "id" aplikasi).
   Ubah urutan / hapus / tambah id di sini. Grid = 4 kolom. */
const HOME_LAYOUT = {
  grid: ["camera", "clock", "whatsapp", "notes", "weather", "maps", "settings", "photos", "instagram", "x"],
  dock: ["mail", "safari", "messages", "music"],
};

/* Lokasi gambar (folder assets/ dibiarkan seperti semula) */
const APP_ICON = {
  camera: "assets/icons/camera.png",
  notes: "assets/icons/notes.png",
  weather: "assets/icons/weather.png",
  maps: "assets/icons/maps.png",
  settings: "assets/icons/settings.png",
  mail: "assets/icons/mail.png",
  safari: "assets/icons/safari.png",
  music: "assets/icons/music.png",
  reminders: "assets/icons/reminders.png",
  instagram: "assets/icons/instagram.svg",
};
const APP_AVATAR = {
  sarjana: "assets/avatars/sarjana.jpg",
  cillian: "assets/avatars/cillian.jpg",
  rina: "assets/avatars/rina.jpg",
};
