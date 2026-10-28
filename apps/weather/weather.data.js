/* =====================================================================
   WEATHER — DATA & PENGATURAN (EDIT DI SINI)
   ---------------------------------------------------------------------
   Data cuaca real-time dari Open-Meteo (gratis, tanpa API key, butuh internet).
   Kalau offline, otomatis tampil data contoh.
   Kota bisa ditambah lewat kolom Search di aplikasinya (hasilnya tersimpan
   di browser), atau tambahkan permanen di WEATHER_CITIES.
   ===================================================================== */
const WEATHER_UNIT = "C";          // "C" = Celsius, "F" = Fahrenheit
const WEATHER_CITIES = [
  { name: "Jakarta",  lat: -6.2088, lon: 106.8456 },
  { name: "Blitar",   lat: -8.0954, lon: 112.1609 },
  { name: "Surabaya", lat: -7.2575, lon: 112.7521 },
];
