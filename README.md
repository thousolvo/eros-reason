# Eros' iPhone (iOS 26 simulator)

Buka `index.html` di browser. Passcode default: `0000` (ubah di `js/config.js`).
Folder `assets/` (ikon, avatar, font) taruh di sebelah `index.html` seperti sebelumnya — tidak termasuk di zip ini.

## Struktur
- `js/config.js` — passcode, operator, susunan ikon home (HOME_LAYOUT)
- `js/core/` — inti HP: `phone.js` (buka/tutup app, status bar, jam), `lock.js` (lock screen, passcode, tombol power), `home.js`
- `css/` — `base.css`, `home.css`, `lock.css`, `shell.css` (animasi app, home bar, tema)
- `apps/<nama>/` — satu folder per aplikasi (JS + CSS + file data yang mudah diedit)

## Mengedit isi
| Mau ubah | File |
|---|---|
| Chat WhatsApp | `apps/whatsapp/whatsapp.data.js` |
| Profil & post Instagram | `apps/instagram/instagram.data.js` |
| Profil & tweet X | `apps/x/x.data.js` |
| Artis / lagu Music | `apps/music/music.data.js` |
| Chat Messages (iMessage/SMS) | `apps/messages/messages.data.js` |
| Jumlah foto contoh Photos | `SAMPLE_COUNT` di `apps/photos/photos.js` |
| Settings, Notes, Weather, dll. | `apps/misc/<nama>.js` |

## Aplikasi baru
Lihat komentar di atas `js/core/phone.js` dan contoh terpendek `apps/misc/notes.js`.
Tambah `<script>` di `index.html` (sebelum `home.js`) dan id-nya di `HOME_LAYOUT`.

## Music
Lagu diambil dari iTunes Search API (preview 30 detik resmi + cover asli), jadi butuh internet.
Lagu penuh dari file sendiri: taruh mp3 di `assets/music/` dan isi `MUSIC_LOCAL`.
