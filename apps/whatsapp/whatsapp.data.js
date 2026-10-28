/* =====================================================================
   WHATSAPP — DATA CHAT (EDIT DI SINI)
   Ganti nama, foto, status, dan isi percakapan.
   avatar: ""                -> otomatis tampil inisial berwarna
   avatar: "assets/xxx.jpg"  -> foto profil
   ===================================================================== */
const day = (label) => ({ day: label });
const them = (text, time, o = {}) => ({ from: "them", type: "text", text, time, ...o });
const me = (text, time, o = {}) => ({ from: "me", type: "text", text, time, status: "read", ...o });
const themImg = (src, caption, time, o = {}) => ({ from: "them", type: "image", src, caption, time, ...o });
const meImg = (src, caption, time, o = {}) => ({ from: "me", type: "image", src, caption, time, status: "read", ...o });
const themVoice = (dur, time, o = {}) => ({ from: "them", type: "voice", dur, time, ...o });
const meVoice = (dur, time, o = {}) => ({ from: "me", type: "voice", dur, time, status: "read", ...o });

/* ==========================================================
   EDIT DI SINI  -  10 PROFIL (ganti foto dan isi chat)
   avatar: ""  -> otomatis tampil inisial berwarna
   avatar: "foto/mama.jpg"  -> foto profil Anda
   ========================================================== */
const PROFILES = [
  {
    name: "Sarjana cukimai",
    avatar: APP_AVATAR.sarjana,
    status: "Bagas FP, Cillian, Furqon FP, Rizki FP, Kamu",
    group: true,
    muted: true,
    unread: 12,
    messages: [
      day("October 24"),
      them("ada ya yg namanya psyche di indo", "10.01", { sender: "Huda FP" }),
      me("Siapa tuh", "10.02"),
      them("Psyche itu dewi yunani kocak", "10.02", { sender: "Rizki FP" }),
      them("Masa lu gak tau", "10.02", { sender: "Rizki FP" }),
      me("Maksud gw siapa yg namanya psyche di indo jing", "10.03"),
      them(".", "10.03", { reply: { name: "Rizki FP", text: "Masa lu gak tau" }, sender: "Rizki FP" }),
      me("Yang bener nyet", "10.03"),
      them("psyche anak farmasi", "10.04", { sender: "Huda FP" }),
      them("masa gak lewat tl twt lu ros", "10.04", { sender: "Huda FP" }),
      them("dia sempet rame karna promosi farmafest di akun twt dia", "10.04", { sender: "Huda FP" }),
      me("Kaga", "10.04"),
      me("Tl gw lagi sibuk doa bersama buat el clasico", "10.05"),
      them("Semoga madrid menang amin", "10.05", { sender: "Bagas FP" }),
      them("Lah lu kan bukan demit", "10.05", { sender: "Furqon FP" }),
      them("Gw cuma mau liat ian ngamuk di tl", "10.05", { sender: "Bagas FP" }),
      me("@Cillian", "10.06"),
      them("Si kontol gw lg kelas", "10.07", { sender: "Cillian" }),
    ],
  },
  {
    name: "Cillian",
    avatar: APP_AVATAR.cillian,
    status: "online",
    pinned: true,
    favorite: true,
    unread: 1,
    messages: [
      day("October 25"),
      them("Woy vape gw lu bawa apa gmn nyet", "18.02"),
      me("Awokwok kemasukan di tas gw", "18.05"),
      them("Bawa su besok itu napas gw", "18.06"),
      me("Najis", "18.06"),
      day("Yesterday"),
      me("Mba asih gas", "11.49"),
      them("Blm keluar nnti gw nyusul", "11.50"),
      me("Nitip gak takut lu mupeng", "11.52"),
      them("Kontol", "11.53"),
      them("Penyet sambel ijo", "11.53"),
      me("Admin 5k", "11.54"),
      them("SYOPI LU PAKE ADA ADMIN", "11.54"),
    ],
  },
  {
    name: "Rina FP",
    avatar: APP_AVATAR.rina,
    status: "last seen today at 20.14",
    pinned: true,
    favorite: true,
    unread: 2,
    messages: [
      day("Yesterday"),
      them("Laprak lusa kan dikumpulnya kata mas agung kemaren", "19.30"),
      me("Yo rin", "19.32"),
      themVoice("0:24", "19.35"),
      themImg("", "Gak boong gw", "19.36"),
      me("Iya besok kasih ke gw aja laprak lu", "19.40"),
      them("THANKS EROSS", "20.00"),
      me("Aman", "20.14"),
    ],
  },
  {
    name: "+62 800-0000-0001",
    avatar: "",
    status: "online",
    unread: 0,
    messages: [
      day("October 5"),
      them("haloo eros ini mirna temen bagass", "16.05"),
      them("bener kah katanya kamu kalo jodoh-jodohin orang, mereka akhirnya malah jadian bnrn?", "16.05"),
      me("Halo mirna", "16.08"),
      me("Kalo lu percaya musyrik iya mir", "16.08", {
        reply: {
          name: "+62 800-0000-0001",
          text: "bener kah katanya kamu kalo jodoh-jodohin orang, mereka akhirnya malah jadian bnrn?",
        },
      }),
      them("feenya berapa ya ros hehe", "16.09"),
      me("Seikhlasnya mir", "16.12"),
      them("Mantap 👍", "16.13"),
    ],
  },
  {
    name: "Kak Sari",
    avatar: "",
    status: "last seen today at 18.40",
    favorite: true,
    unread: 0,
    listTime: "Kemarin",
    messages: [
      day("Kemarin"),
      them("Dek, buku referensinya sudah Kakak pinjamkan ke perpustakaan ya.", "14.20"),
      me("Terima kasih banyak, Kak!", "14.31"),
      them("Sama-sama. Semangat ya skripsinya 💪", "14.33"),
      me("Siap, Kak 🙏", "14.35"),
    ],
  },
  {
    name: "Grup Kelas 3B",
    avatar: "",
    status: "Aldo, Nadia, Rina, Tegar, Kamu",
    group: true,
    muted: true,
    unread: 12,
    messages: [
      day("Hari ini"),
      them("Ada yang bawa charger?", "10.01", { sender: "Aldo" }),
      them("Aku bawa, nanti di kantin ya", "10.02", { sender: "Nadia" }),
      me("Aku juga bawa, tenang aja", "10.03"),
      them("Info: kuliah jam 1 dipindah ke ruang 204", "10.15", { sender: "Tegar" }),
      them("Noted, makasih infonya!", "10.16", { sender: "Rina" }),
      them("Jangan lupa kumpulkan tugas sebelum jam 3 ya", "10.20", { sender: "Tegar" }),
    ],
  },
  {
    name: "Bapak",
    avatar: "",
    status: "last seen yesterday at 21.05",
    unread: 0,
    listTime: "Kemarin",
    messages: [
      day("Kemarin"),
      them("Uang saku sudah Bapak transfer.", "20.50"),
      me("Sudah masuk, Pak. Terima kasih banyak.", "21.02"),
      them("Gunakan seperlunya, ya.", "21.05"),
    ],
  },
  {
    name: "Aldo",
    avatar: "",
    status: "online",
    unread: 0,
    listTime: "Senin",
    messages: [
      day("Senin"),
      them("Bro, catatan kuliah tadi ada?", "13.10"),
      me("Ada, nanti aku kirim fotonya.", "13.12"),
      meImg("", "", "13.14"),
      them("Sip, makasih bro 🔥", "13.15"),
    ],
  },
  {
    name: "Nadia",
    avatar: "",
    status: "last seen today at 12.30",
    unread: 3,
    messages: [
      day("Hari ini"),
      them("Hai! Besok ada waktu?", "12.20"),
      them("Aku mau ngajak ngopi sambil diskusi tugas", "12.21"),
      them("Kalau bisa jam 10 pagi ☕", "12.22"),
    ],
  },
  {
    name: "Pak Budi (Dosen)",
    avatar: "",
    status: "last seen today at 09.15",
    unread: 0,
    listTime: "Selasa",
    messages: [
      day("Selasa"),
      me("Selamat siang, Pak. Mohon izin menanyakan jadwal bimbingan minggu ini.", "10.30"),
      them("Selamat siang. Silakan datang hari Kamis pukul 10.00 di ruang dosen.", "11.05"),
      me("Baik, Pak. Terima kasih atas informasinya.", "11.07"),
    ],
  },
  {
    name: "Tegar",
    avatar: "",
    status: "online",
    unread: 0,
    listTime: "Minggu",
    messages: [
      day("Minggu"),
      them("Weekend ini nongkrong gak?", "15.00"),
      me("Boleh, di mana?", "15.04"),
      themVoice("0:12", "15.06"),
      me("Oke, aku ikut 👌", "15.08"),
    ],
  },
];
