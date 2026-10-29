/* =====================================================================
   CLOCK — data & pengaturan. Edit di sini.
   Harus dimuat SEBELUM clock.js (sama seperti whatsapp.data.js, dst).
   ===================================================================== */

/* true  = 21.25   |   false = 9.25 PM */
const CLOCK_24H = true;

/* Lama tunda alarm (menit) saat tombol "Tunda" ditekan */
const CLOCK_SNOOZE_MIN = 9;

/* Kota yang tampil pertama kali di tab Jam Dunia.
   tz = nama zona waktu IANA (daftar lengkap: en.wikipedia.org/wiki/List_of_tz_database_time_zones) */
const CLOCK_DEFAULT_CITIES = [
  { name: "Jakarta", country: "Indonesia", tz: "Asia/Jakarta" },
  { name: "Tokyo", country: "Jepang", tz: "Asia/Tokyo" },
  { name: "London", country: "Inggris", tz: "Europe/London" },
  { name: "New York", country: "Amerika Serikat", tz: "America/New_York" },
  { name: "Sydney", country: "Australia", tz: "Australia/Sydney" },
];

/* Alarm bawaan. days: 0 = Minggu, 1 = Senin ... 6 = Sabtu. days kosong [] = sekali saja */
const CLOCK_DEFAULT_ALARMS = [
  { h: 5, m: 30, label: "Subuh", days: [0, 1, 2, 3, 4, 5, 6], on: true },
  { h: 7, m: 0, label: "Kuliah", days: [1, 2, 3, 4, 5], on: false },
];

/* Daftar kota yang bisa dicari di tombol "+" (Jam Dunia). Tambah sendiri kalau mau. */
const CLOCK_CITY_LIBRARY = [
  /* Indonesia */
  { name: "Jakarta", country: "Indonesia", tz: "Asia/Jakarta" },
  { name: "Surabaya", country: "Indonesia", tz: "Asia/Jakarta" },
  { name: "Bandung", country: "Indonesia", tz: "Asia/Jakarta" },
  { name: "Medan", country: "Indonesia", tz: "Asia/Jakarta" },
  { name: "Denpasar", country: "Indonesia", tz: "Asia/Makassar" },
  { name: "Makassar", country: "Indonesia", tz: "Asia/Makassar" },
  { name: "Jayapura", country: "Indonesia", tz: "Asia/Jayapura" },
  /* Asia */
  { name: "Singapura", country: "Singapura", tz: "Asia/Singapore" },
  { name: "Kuala Lumpur", country: "Malaysia", tz: "Asia/Kuala_Lumpur" },
  { name: "Bangkok", country: "Thailand", tz: "Asia/Bangkok" },
  { name: "Hanoi", country: "Vietnam", tz: "Asia/Bangkok" },
  { name: "Manila", country: "Filipina", tz: "Asia/Manila" },
  { name: "Hong Kong", country: "Hong Kong", tz: "Asia/Hong_Kong" },
  { name: "Taipei", country: "Taiwan", tz: "Asia/Taipei" },
  { name: "Shanghai", country: "Tiongkok", tz: "Asia/Shanghai" },
  { name: "Beijing", country: "Tiongkok", tz: "Asia/Shanghai" },
  { name: "Seoul", country: "Korea Selatan", tz: "Asia/Seoul" },
  { name: "Tokyo", country: "Jepang", tz: "Asia/Tokyo" },
  { name: "Osaka", country: "Jepang", tz: "Asia/Tokyo" },
  { name: "Dhaka", country: "Bangladesh", tz: "Asia/Dhaka" },
  { name: "New Delhi", country: "India", tz: "Asia/Kolkata" },
  { name: "Karachi", country: "Pakistan", tz: "Asia/Karachi" },
  { name: "Dubai", country: "Uni Emirat Arab", tz: "Asia/Dubai" },
  { name: "Doha", country: "Qatar", tz: "Asia/Qatar" },
  { name: "Riyadh", country: "Arab Saudi", tz: "Asia/Riyadh" },
  { name: "Mekkah", country: "Arab Saudi", tz: "Asia/Riyadh" },
  { name: "Teheran", country: "Iran", tz: "Asia/Tehran" },
  { name: "Istanbul", country: "Turki", tz: "Europe/Istanbul" },
  /* Eropa & Afrika */
  { name: "London", country: "Inggris", tz: "Europe/London" },
  { name: "Dublin", country: "Irlandia", tz: "Europe/Dublin" },
  { name: "Lisboa", country: "Portugal", tz: "Europe/Lisbon" },
  { name: "Madrid", country: "Spanyol", tz: "Europe/Madrid" },
  { name: "Paris", country: "Prancis", tz: "Europe/Paris" },
  { name: "Amsterdam", country: "Belanda", tz: "Europe/Amsterdam" },
  { name: "Berlin", country: "Jerman", tz: "Europe/Berlin" },
  { name: "Roma", country: "Italia", tz: "Europe/Rome" },
  { name: "Zurich", country: "Swiss", tz: "Europe/Zurich" },
  { name: "Stockholm", country: "Swedia", tz: "Europe/Stockholm" },
  { name: "Athena", country: "Yunani", tz: "Europe/Athens" },
  { name: "Moskow", country: "Rusia", tz: "Europe/Moscow" },
  { name: "Reykjavik", country: "Islandia", tz: "Atlantic/Reykjavik" },
  { name: "Kairo", country: "Mesir", tz: "Africa/Cairo" },
  { name: "Nairobi", country: "Kenya", tz: "Africa/Nairobi" },
  { name: "Lagos", country: "Nigeria", tz: "Africa/Lagos" },
  { name: "Johannesburg", country: "Afrika Selatan", tz: "Africa/Johannesburg" },
  /* Amerika */
  { name: "New York", country: "Amerika Serikat", tz: "America/New_York" },
  { name: "Washington", country: "Amerika Serikat", tz: "America/New_York" },
  { name: "Chicago", country: "Amerika Serikat", tz: "America/Chicago" },
  { name: "Denver", country: "Amerika Serikat", tz: "America/Denver" },
  { name: "Los Angeles", country: "Amerika Serikat", tz: "America/Los_Angeles" },
  { name: "San Francisco", country: "Amerika Serikat", tz: "America/Los_Angeles" },
  { name: "Cupertino", country: "Amerika Serikat", tz: "America/Los_Angeles" },
  { name: "Anchorage", country: "Amerika Serikat", tz: "America/Anchorage" },
  { name: "Honolulu", country: "Amerika Serikat", tz: "Pacific/Honolulu" },
  { name: "Toronto", country: "Kanada", tz: "America/Toronto" },
  { name: "Vancouver", country: "Kanada", tz: "America/Vancouver" },
  { name: "Mexico City", country: "Meksiko", tz: "America/Mexico_City" },
  { name: "Bogota", country: "Kolombia", tz: "America/Bogota" },
  { name: "Lima", country: "Peru", tz: "America/Lima" },
  { name: "Santiago", country: "Cile", tz: "America/Santiago" },
  { name: "Buenos Aires", country: "Argentina", tz: "America/Argentina/Buenos_Aires" },
  { name: "Sao Paulo", country: "Brasil", tz: "America/Sao_Paulo" },
  /* Oseania */
  { name: "Perth", country: "Australia", tz: "Australia/Perth" },
  { name: "Darwin", country: "Australia", tz: "Australia/Darwin" },
  { name: "Brisbane", country: "Australia", tz: "Australia/Brisbane" },
  { name: "Sydney", country: "Australia", tz: "Australia/Sydney" },
  { name: "Melbourne", country: "Australia", tz: "Australia/Melbourne" },
  { name: "Auckland", country: "Selandia Baru", tz: "Pacific/Auckland" },
];