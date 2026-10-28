/* =====================================================================
   X (Twitter) — DATA PROFIL & TWEET (EDIT DI SINI)
   ---------------------------------------------------------------------
   X_ME     = akun kamu (tampil di profil sendiri & avatar pojok kiri atas)
   X_PEOPLE = akun lain. Ketuk nama/foto siapa pun untuk membuka profilnya.
   X_TWEETS = isi timeline. "handle" harus sama dengan salah satu akun.
   avatar / banner: isi path gambar; kosong = otomatis warna/inisial.
   ===================================================================== */
const X_ME = {
  name: "Eros",
  handle: "eros",
  avatar: "",
  banner: "",
  bannerColor: "#1d9bf0",
  verified: false,
  bio: "farmasi • madridista • tl gw isinya doa bersama el clasico",
  location: "Indonesia",
  link: "linktr.ee/eros",
  joined: "Joined March 2019",
  following: 391,
  followers: 842,
};

const X_PEOPLE = [
  { name: "Cillian", handle: "cillian", avatar: APP_AVATAR.cillian, bio: "vape gw mana nyet", location: "Kelas", joined: "Joined August 2020", following: 210, followers: 530, bannerColor: "#7856ff" },
  { name: "Rina FP",  handle: "rina_fp", avatar: APP_AVATAR.rina, bio: "anak farmasi • laprak is life", location: "Lab Farmasi", joined: "Joined January 2021", following: 480, followers: 1204, bannerColor: "#f91880" },
  { name: "Psyche",   handle: "psyche_fp", avatar: "", bio: "promosi farmafest 💊", location: "Farmasi", joined: "Joined May 2022", following: 90, followers: 15300, verified: true, bannerColor: "#00ba7c" },
  { name: "Real Madrid C.F.", handle: "realmadrid", avatar: "", bio: "Official profile of Real Madrid C.F.", location: "Madrid", joined: "Joined January 2009", following: 61, followers: 4100000, verified: true, bannerColor: "#1a1a2e" },
];

const X_TWEETS = [
  { handle: "eros", text: "Tl gw lagi sibuk doa bersama buat el clasico 🙏", time: "2h", replies: 14, reposts: 3, likes: 89, views: 2400 },
  { handle: "psyche_fp", text: "Farmafest tinggal 2 minggu lagi! Tiket early bird masih ada, jangan sampai ketinggalan 🎉", time: "3h", replies: 41, reposts: 120, likes: 980, views: 54000, foryou: true },
  { handle: "cillian", text: "kelas jam 7 pagi tuh bukan jadwal, itu hukuman", time: "5h", replies: 9, reposts: 2, likes: 61, views: 1800 },
  { handle: "realmadrid", text: "Full-time. Hala Madrid! ⚪", time: "7h", replies: 3200, reposts: 18000, likes: 210000, views: 4800000, foryou: true, image: "#1a1a2e" },
  { handle: "rina_fp", text: "laprak lusa dikumpulin ya gaes, jangan ada yang telat lagi 😭", time: "9h", replies: 22, reposts: 5, likes: 143, views: 5200 },
  { handle: "eros", text: "nitip gak takut lu mupeng", time: "1d", replies: 2, reposts: 0, likes: 31, views: 900 },
];

const X_TRENDS = [
  ["Trending in Indonesia", "El Clasico", "92.4K posts"],
  ["Music · Trending", "Hozier", "41.2K posts"],
  ["Trending", "Farmafest", "12.8K posts"],
  ["K-pop · Trending", "BABYMONSTER", "58.1K posts"],
];
