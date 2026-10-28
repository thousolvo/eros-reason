/* =====================================================================
   PHONE — inti HP: layar, status, jam, registrasi & buka/tutup aplikasi
   ---------------------------------------------------------------------
   Cara membuat aplikasi baru (lihat apps/misc/notes.js sebagai contoh paling pendek):

     Phone.registerApp({
       id: "notes", name: "Notes",
       icon: iconImg(APP_ICON.notes), iconBg: "transparent",
       layer: Phone.createLayer("notes", "<div>isi layar</div>"),
       barOnLight: () => true,      // true = status bar & home bar GELAP (untuk app berlatar terang)
       onOpen()  {},                // dipanggil saat app dibuka
       onClose() {},                // dipanggil saat app ditutup
       onBack()  { return false },  // opsional: true = sudah ditangani (mis. tutup halaman chat)
       toggleTheme() {}, themeLabel() {}  // opsional: memunculkan tombol tema
     });
   ===================================================================== */
const screenEl = $("screen");
const Phone = {
  state: "lock",      // "lock" | "pass" | "home" | "app"
  scale: 1,
  apps: {},           // id -> definisi aplikasi
  current: null,      // aplikasi yang sedang terbuka
};

/* ---------- Registrasi ---------- */
Phone.createLayer = function (id, html) {
  const el = document.createElement("section");
  el.className = "layer applayer";
  el.id = id;
  el.innerHTML = html;
  $("appLayers").appendChild(el);
  return el;
};
Phone.registerApp = function (app) {
  Phone.apps[app.id] = app;
  return app;
};

/* ---------- Status bar / home bar ----------
   onLight = true  -> ikon status bar & garis home jadi gelap (app berlatar terang) */
Phone.setBar = function (onLight) {
  screenEl.classList.toggle("bar-dark", !!onLight);
};
Phone.refreshBar = function () {
  const a = Phone.current;
  Phone.setBar(a && a.barOnLight ? a.barOnLight() : false);
  const hasTheme = !!(a && a.toggleTheme);
  document.body.classList.toggle("has-theme", hasTheme);
  if (hasTheme) $("themeBtn").textContent = a.themeLabel();
};
$("themeBtn").addEventListener("click", () => {
  if (Phone.current && Phone.current.toggleTheme) {
    Phone.current.toggleTheme();
    Phone.refreshBar();
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "t" && Phone.current && Phone.current.toggleTheme && document.activeElement.tagName !== "INPUT")
    $("themeBtn").click();
});

/* ---------- Buka / tutup aplikasi ---------- */
Phone.openApp = function (id, iconEl) {
  const app = Phone.apps[id];
  if (!app || Phone.state !== "home") return;
  const view = app.layer;
  if (iconEl) {
    const r = iconEl.getBoundingClientRect(),
      s = screenEl.getBoundingClientRect();
    view.style.transformOrigin =
      (r.left + r.width / 2 - s.left) / Phone.scale + "px " + (r.top + r.height / 2 - s.top) / Phone.scale + "px";
  }
  Phone.current = app;
  Phone.state = "app";
  if (app.onOpen) app.onOpen();
  Phone.refreshBar();
  requestAnimationFrame(() => {
    view.classList.add("open");
    $("home").classList.add("recede");
  });
};
Phone.hideApps = function () {
  Object.values(Phone.apps).forEach((a) => {
    a.layer.classList.remove("open");
    if (a.onClose && Phone.current === a) a.onClose();
  });
  Phone.current = null;
  Phone.setBar(false);
  document.body.classList.remove("has-theme");
};
Phone.closeApp = function () {
  if (Phone.state !== "app") return;
  Phone.hideApps();
  $("home").classList.remove("recede");
  Phone.state = "home";
};
/* Tombol home (garis di bawah layar) */
$("homeind").addEventListener("click", () => Phone.closeApp());

/* ---------- Skala perangkat ---------- */
function fit() {
  const dev = $("device");
  const w = dev.offsetWidth, h = dev.offsetHeight;
  Phone.scale = Math.min((innerWidth - 24) / w, (innerHeight - 24) / h, 1.25);
  dev.style.transform = "scale(" + Phone.scale + ")";
}
if (!CONFIG.frame) document.body.classList.add("noframe");
addEventListener("resize", fit);
fit();

/* ---------- Jam & tanggal ---------- */
function timeParts() {
  if (!CONFIG.live)
    return { h: CONFIG.fixed.hour, m: CONFIG.fixed.minute, date: CONFIG.fixed.dateShort, day: CONFIG.fixed.dayLong, num: CONFIG.fixed.dayNum, abbr: CONFIG.fixed.dayAbbr };
  const d = new Date();
  return {
    h: d.getHours(),
    m: d.getMinutes(),
    date: d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }).replace(",", ""),
    day: d.toLocaleDateString("en-US", { weekday: "long" }),
    num: d.getDate(),
    abbr: d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
  };
}
function updateClock() {
  const t = timeParts();
  $("ltime").textContent = pad2(t.h) + "." + pad2(t.m);
  $("ldate").textContent = t.date;
  $("wdow").textContent = t.day;
  $("wnum").textContent = t.num;
  $("sbleft").textContent = Phone.state === "lock" || Phone.state === "pass" ? CONFIG.carrier : pad2(t.h) + "." + pad2(t.m);
  document.querySelectorAll(".ic-cal .d").forEach((e) => (e.textContent = t.abbr));
  document.querySelectorAll(".ic-cal .n").forEach((e) => (e.textContent = t.num));
  const hDeg = (t.h % 12) * 30 + t.m * 0.5, mDeg = t.m * 6;
  document.querySelectorAll(".hand-h").forEach((e) => e.setAttribute("transform", "rotate(" + hDeg + " 50 50)"));
  document.querySelectorAll(".hand-m").forEach((e) => e.setAttribute("transform", "rotate(" + mDeg + " 50 50)"));
}
