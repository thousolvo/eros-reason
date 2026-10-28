/* =====================================================================
   MESSAGES — DATA PERCAKAPAN (EDIT DI SINI)
   ---------------------------------------------------------------------
   sms: true  -> gelembung hijau (SMS)      sms: false -> biru (iMessage)
   unread: jumlah pesan belum dibaca        pinned: true -> tampil di atas
   Pesan: msgIn("teks","10.02")  = pesan masuk
          msgOut("teks","10.03") = pesan keluar
          msgDay("Today")        = pemisah hari
   ===================================================================== */
const msgIn  = (text, time) => ({ from: "them", text, time });
const msgOut = (text, time) => ({ from: "me", text, time });
const msgDay = (label) => ({ day: label });

const MESSAGES_CONTACTS = [
  {
    name: "Cillian", avatar: APP_AVATAR.cillian, sms: false, unread: 1, pinned: true,
    messages: [
      msgDay("Yesterday"),
      msgIn("Woy vape gw lu bawa apa gmn nyet", "18.02"),
      msgOut("Awokwok kemasukan di tas gw", "18.05"),
      msgIn("Bawa su besok itu napas gw", "18.06"),
      msgDay("Today"),
      msgIn("Mba asih jam 12 gas?", "10.40"),
    ],
  },
  {
    name: "Rina FP", avatar: APP_AVATAR.rina, sms: false, unread: 0,
    messages: [
      msgDay("Yesterday"),
      msgIn("Laprak lusa kan dikumpulnya?", "19.30"),
      msgOut("Yo rin, besok kasih ke gw aja", "19.40"),
      msgIn("THANKS EROSS", "20.00"),
    ],
  },
  {
    name: "Mama", avatar: "", sms: false, unread: 0,
    messages: [
      msgDay("Monday"),
      msgIn("Nak, jangan lupa makan ya", "12.10"),
      msgOut("Iya ma, ini baru mau makan", "12.15"),
      msgIn("Pulang kapan?", "12.16"),
    ],
  },
  {
    name: "Telkomsel", avatar: "", sms: true, unread: 2,
    messages: [
      msgDay("Today"),
      msgIn("Kuota internet Anda tinggal 1 GB. Beli paket tambahan di MyTelkomsel.", "08.00"),
      msgIn("Promo hari ini: bonus kuota 5GB untuk pembelian paket apa saja.", "09.30"),
    ],
  },
];
