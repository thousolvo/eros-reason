/* SETTINGS — edit isi baris di bawah */
simpleApp({
  id: "settings", name: "Settings",
  icon: iconImg(APP_ICON.settings),
  body: () => `<div>
    <div class="row"><span>Wi-Fi</span><span>Terhubung</span></div>
    <div class="row"><span>Bluetooth</span><span>Aktif</span></div>
    <div class="row"><span>Seluler</span><span>${CONFIG.carrier}</span></div>
    <div class="row"><span>Baterai</span><span>82%</span></div>
  </div>`,
});
