/* =====================================================================
   INSTAGRAM — DATA PROFIL & POSTINGAN (EDIT DI SINI)
   ---------------------------------------------------------------------
   Profil di tab "Profile" mengambil semua isinya dari IG_PROFILE.
   Foto: isi path gambar ("assets/xxx.jpg"). Kosong = otomatis gradient.
   ===================================================================== */
const IG_PROFILE = {
  username: "eros",
  name: "Eros",
  avatar: "",                       // contoh: APP_AVATAR.cillian
  verified: false,
  bio: "Mahasiswa farmasi 💊\nPenyuka bola ⚽ & musik 🎧\nJodoh-jodohin orang (seikhlasnya)",
  link: "linktr.ee/eros",
  posts: 12,
  followers: 842,
  following: 391,
  highlights: [
    { title: "Kampus", color: "#ff7a59" },
    { title: "Bola",   color: "#34b7f1" },
    { title: "Musik",  color: "#a66cff" },
    { title: "Random", color: "#25d366" },
  ],
  /* Grid foto profil: image = path gambar (boleh kosong), color = warna cadangan */
  grid: [
    { image: "", color: "#ff9a9e" }, { image: "", color: "#7f8cff" }, { image: "", color: "#ffb642" },
    { image: "", color: "#56c7e9" }, { image: "", color: "#f28bbf" }, { image: "", color: "#68ce79" },
    { image: "", color: "#bb78d7" }, { image: "", color: "#f35a65" }, { image: "", color: "#667df0" },
    { image: "", color: "#4bc0c8" }, { image: "", color: "#f5a623" }, { image: "", color: "#e84a8b" },
  ],
};

/* Story di bagian atas beranda (nama, avatar, warna cadangan) */
const IG_STORIES = [
  { name: "Cillian", avatar: APP_AVATAR.cillian },
  { name: "Rina FP", avatar: APP_AVATAR.rina },
  { name: "Aldo", avatar: "" },
  { name: "Nadia", avatar: "" },
  { name: "Tegar", avatar: "" },
];

/* Postingan di beranda */
const IG_POSTS = [
  { user: "cillian", avatar: APP_AVATAR.cillian, image: "", color: "#7f8cff", likes: 128, caption: "Mba asih jam 12 gas 🍛", time: "2 JAM YANG LALU" },
  { user: "rina.fp",  avatar: APP_AVATAR.rina,    image: "", color: "#ff9a9e", likes: 342, caption: "Laprak kelar, tidur dulu 😮‍💨", time: "5 JAM YANG LALU" },
  { user: "aldo",     avatar: "",                 image: "", color: "#56c7e9", likes: 87,  caption: "Catatan kuliah udah dikirim ya bro", time: "KEMARIN" },
];

/* Reels (tab Reels) */
const IG_REELS = [
  { user: "cillian", caption: "pov: kelas jam 7 pagi", color: "#3a2a6b" },
  { user: "rina.fp", caption: "tutorial bikin laprak cepat", color: "#8a2b4d" },
  { user: "tegar",   caption: "weekend nongkrong", color: "#1d5b6b" },
];

/* Chat di tab DM */
const IG_DMS = [
  { name: "Cillian", avatar: APP_AVATAR.cillian, last: "Woy vape gw lu bawa?", time: "2j", unread: true },
  { name: "Rina FP", avatar: APP_AVATAR.rina, last: "THANKS EROSS", time: "1h", unread: false },
  { name: "Nadia", avatar: "", last: "Besok jadi ngopi kan?", time: "3h", unread: true },
];
