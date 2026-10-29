/* =====================================================================
   CLOCK — gaya iOS 26: Jam Dunia, Alarm, Stopwatch, Timer.
   Tab bar kaca mengambang, aksen oranye, latar hitam.
   Data & pengaturan: clock.data.js (harus dimuat sebelum file ini)
   ===================================================================== */
(function () {
  "use strict";

  /* ---------- Util ---------- */
  const pad = (n) => String(n).padStart(2, "0");
  const html = (s) => (typeof esc === "function" ? esc(s) : String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])));
  const say = (m) => { if (typeof toast === "function") toast(m); };
  const uid = () => Math.random().toString(36).slice(2, 9);
  const store = {
    get(k, fb) { try { const v = JSON.parse(localStorage.getItem(k) || "null"); return v == null ? fb : v; } catch (_) { return fb; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) {} },
  };
  const K_CITIES = "eros_clock_cities_v1", K_ALARMS = "eros_clock_alarms_v1", K_RECENT = "eros_clock_recents_v1";

  /* Jam HP (ikut CONFIG.live = false kalau jam dibekukan) */
  function deviceNow() {
    const d = new Date();
    if (typeof CONFIG !== "undefined" && CONFIG.live === false && CONFIG.fixed) d.setHours(CONFIG.fixed.hour, CONFIG.fixed.minute, 0, 0);
    return d;
  }
  function fmtHM(h, m) {
    if (CLOCK_24H) return pad(h) + "." + pad(m);
    return (h % 12 || 12) + "." + pad(m) + "<small>" + (h >= 12 ? "PM" : "AM") + "</small>";
  }

  /* Zona waktu */
  const fmtCache = {};
  function partsIn(tz, date) {
    let f = fmtCache[tz];
    if (!f) f = fmtCache[tz] = new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" });
    const o = {};
    f.formatToParts(date).forEach((p) => { if (p.type !== "literal") o[p.type] = +p.value; });
    if (o.hour === 24) o.hour = 0;
    return o;
  }
  const asUTC = (p) => Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  const localParts = (d) => ({ year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate(), hour: d.getHours(), minute: d.getMinutes(), second: d.getSeconds() });
  function cityInfo(c, now) {
    let p;
    try { p = partsIn(c.tz, now); } catch (_) { p = localParts(now); }
    const l = localParts(now);
    const diff = (asUTC(p) - asUTC(l)) / 3600000;
    const dd = Math.round((Date.UTC(p.year, p.month - 1, p.day) - Date.UTC(l.year, l.month - 1, l.day)) / 864e5);
    const abs = Math.abs(diff), num = Number.isInteger(abs) ? abs : String(abs).replace(".", ",");
    const day = dd === 0 ? "Hari ini" : dd > 0 ? "Besok" : "Kemarin";
    return { time: fmtHM(p.hour, p.minute), sub: day + ", " + (diff < 0 ? "-" : "+") + num + " JAM" };
  }
  function utcLabel(tz, now) {
    try {
      const off = Math.round((asUTC(partsIn(tz, now)) - asUTC(partsIn("UTC", now))) / 60000), a = Math.abs(off);
      return "UTC" + (off < 0 ? "-" : "+") + Math.floor(a / 60) + (a % 60 ? ":" + pad(a % 60) : "");
    } catch (_) { return ""; }
  }

  /* ---------- Ikon ---------- */
  const S = (body, extra = "") => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ${extra}>${body}</svg>`;
  const IC = {
    world: S('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.8 3.9 5.8 3.9 9s-1.3 6.2-3.9 9c-2.6-2.8-3.9-5.8-3.9-9S9.4 5.8 12 3z"/>'),
    alarm: S('<circle cx="12" cy="13" r="7.5"/><path d="M12 9v4.3l2.7 1.7M4.3 5.4L7.5 3M19.7 5.4L16.5 3"/>'),
    stopwatch: S('<circle cx="12" cy="13.5" r="7.5"/><path d="M12 13.5L14.9 10M9.5 3h5M12 3v3"/>'),
    timer: S('<path d="M9.5 3h5M12 3v2.5"/><circle cx="12" cy="13.5" r="7.5"/><path d="M12 13.5V9.2M19 6.3l-1.5 1.5"/>'),
    plus: S('<path d="M12 5v14M5 12h14" stroke-width="2.4"/>'),
    search: S('<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/>', 'stroke-width="2.3"'),
    bell: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a1.5 1.5 0 00-1.5 1.5v.7A7 7 0 005 11v4.5L3.5 17v1h17v-1L19 15.5V11a7 7 0 00-5.5-6.8v-.7A1.5 1.5 0 0012 2zm0 20a2.5 2.5 0 002.45-2h-4.9A2.5 2.5 0 0012 22z"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>',
    alarmFill: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="7.5"/><path d="M12 9v4.3l2.7 1.7M4.3 5.4L7.5 3M19.7 5.4L16.5 3"/></svg>',
  };

  /* ---------- Markup ---------- */
  const MARKUP = `
  <div class="ck-root">
    <section class="ck-page on" data-page="world">
      <div class="ck-top">
        <button type="button" class="ck-pill ck-glass" data-act="edit">Edit</button>
        <button type="button" class="ck-circ ck-glass" data-act="add" aria-label="Tambah kota">${IC.plus}</button>
      </div>
      <div class="ck-scroll"><h1 class="ck-title">Jam Dunia</h1><div class="ck-list" data-list="world"></div></div>
    </section>

    <section class="ck-page" data-page="alarm">
      <div class="ck-top">
        <button type="button" class="ck-pill ck-glass" data-act="edit">Edit</button>
        <button type="button" class="ck-circ ck-glass" data-act="add" aria-label="Tambah alarm">${IC.plus}</button>
      </div>
      <div class="ck-scroll"><h1 class="ck-title">Alarm</h1><div class="ck-sec">Lainnya</div><div class="ck-list" data-list="alarm"></div></div>
    </section>

    <section class="ck-page" data-page="stopwatch">
      <div class="ck-face" data-act="sw-flip">
        <svg class="ck-dial" viewBox="0 0 240 240"></svg>
        <div class="ck-sdig">00:00,00</div>
      </div>
      <div class="ck-pgdots"><i class="on"></i><i></i></div>
      <div class="ck-ctrl">
        <button type="button" class="ck-round ck-glass grey" data-act="sw-left" disabled>Lap</button>
        <button type="button" class="ck-round ck-glass green" data-act="sw-right">Mulai</button>
      </div>
      <div class="ck-laps"></div>
    </section>

    <section class="ck-page" data-page="timer">
      <div class="ck-timer-set">
        <div class="ck-wheels">
          <div class="ck-band"></div>
          <div class="ck-wcol" data-wheel="h" data-n="24" data-label="jam"></div>
          <div class="ck-wcol" data-wheel="m" data-n="60" data-label="mnt"></div>
          <div class="ck-wcol" data-wheel="s" data-n="60" data-label="dtk"></div>
        </div>
      </div>
      <div class="ck-timer-run">
        <div class="ck-ring" id="ckRing">
          <svg viewBox="0 0 292 292"><circle class="bg" cx="146" cy="146" r="136"/><circle class="fg" cx="146" cy="146" r="136" stroke-dasharray="854.5" stroke-dashoffset="0"/></svg>
          <div class="ck-ringtxt"><div class="ck-rtime">00:00</div><div class="ck-rend">${IC.bell}<span>--.--</span></div></div>
        </div>
      </div>
      <div class="ck-ctrl">
        <button type="button" class="ck-round ck-glass grey" data-act="tm-left" disabled>Batal</button>
        <button type="button" class="ck-round ck-glass green" data-act="tm-right">Mulai</button>
      </div>
      <div class="ck-recents"></div>
    </section>

    <nav class="ck-tabs ck-glass">
      <button type="button" class="on" data-tab="world">${IC.world}<span>Jam Dunia</span></button>
      <button type="button" data-tab="alarm">${IC.alarm}<span>Alarm</span></button>
      <button type="button" data-tab="stopwatch">${IC.stopwatch}<span>Stopwatch</span></button>
      <button type="button" data-tab="timer">${IC.timer}<span>Timer</span></button>
    </nav>

    <div class="ck-sheet"><div class="ck-scrim" data-close></div><div class="ck-panel"></div></div>
  </div>`;

  const layer = Phone.createLayer("clock", MARKUP);
  const root = layer.querySelector(".ck-root");
  const $$ = (s, r = root) => r.querySelector(s);
  const $$$ = (s, r = root) => [...r.querySelectorAll(s)];
  const pageEl = (n) => $$(`.ck-page[data-page="${n}"]`);

  /* ---------- Suara (WebAudio, tanpa file) ---------- */
  const Beep = {
    ctx: null, timer: null, n: 0,
    ensure() {
      try { if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); if (this.ctx.state === "suspended") this.ctx.resume(); } catch (_) {}
    },
    pulse() {
      const c = this.ctx; if (!c) return;
      const t = c.currentTime;
      for (let i = 0; i < 4; i++) {
        const o = c.createOscillator(), g = c.createGain(), at = t + i * 0.17;
        o.type = "sine"; o.frequency.value = i % 2 ? 1174 : 988;
        g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(0.28, at + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, at + 0.14);
        o.connect(g); g.connect(c.destination); o.start(at); o.stop(at + 0.15);
      }
    },
    start() { this.n++; if (this.timer) return; this.ensure(); this.pulse(); this.timer = setInterval(() => this.pulse(), 1150); },
    stop() { this.n = Math.max(0, this.n - 1); if (!this.n && this.timer) { clearInterval(this.timer); this.timer = null; } },
  };
  document.addEventListener("pointerdown", () => Beep.ensure(), { once: true, capture: true });   // izin audio browser

  /* Pop-up di atas semua layar (alarm tetap tampil walau app lain terbuka) */
  function ring(o) {
    const host = document.getElementById("screen") || document.body;
    let pops = host.querySelector(".ck-pops");
    if (!pops) { pops = document.createElement("div"); pops.className = "ck-pops"; host.appendChild(pops); }
    const el = document.createElement("div");
    el.className = "ck-pop";
    el.innerHTML = `<div class="ck-pop-top"><div class="ck-pop-ic">${IC.alarmFill}</div><div><b>${html(o.title)}</b><span>${html(o.sub)}</span></div></div><div class="ck-pop-btns"></div>`;
    let closed = false, auto;
    const close = () => { if (closed) return; closed = true; clearTimeout(auto); Beep.stop(); el.classList.add("bye"); setTimeout(() => el.remove(), 380); };
    o.buttons.forEach((b) => {
      const x = document.createElement("button");
      x.type = "button"; x.className = b.cls; x.textContent = b.text;
      x.addEventListener("click", () => { close(); if (b.fn) b.fn(); });
      el.querySelector(".ck-pop-btns").appendChild(x);
    });
    pops.appendChild(el);
    Beep.start();
    auto = setTimeout(close, 90000);
  }

  /* ---------- Roda angka (picker) ---------- */
  const IH = 38;
  function mountWheel(col) {
    const n = +col.dataset.n, w = document.createElement("div");
    w.className = "ck-wheel";
    let h = '<div class="ck-wpad"></div>';
    for (let i = 0; i < n; i++) h += `<div class="ck-wi">${pad(i)}</div>`;
    w.innerHTML = h + '<div class="ck-wpad"></div>';
    col.appendChild(w);
    const items = w.querySelectorAll(".ck-wi");
    let cur = -1;
    const idx = () => Math.max(0, Math.min(n - 1, Math.round(w.scrollTop / IH)));
    const emit = (i) => col.dispatchEvent(new CustomEvent("wheelchange", { bubbles: true, detail: i }));
    const mark = (silent) => {
      const i = idx();
      if (i === cur) return;
      if (cur >= 0) items[cur].classList.remove("sel");
      items[i].classList.add("sel"); cur = i;
      if (!col._lock && !silent) emit(i);
    };
    w.addEventListener("scroll", () => requestAnimationFrame(mark), { passive: true });
    w.addEventListener("click", (e) => { const it = e.target.closest(".ck-wi"); if (it && !col._moved) w.scrollTo({ top: [...items].indexOf(it) * IH, behavior: "smooth" }); });
    /* geser dengan mouse (di layar sentuh sudah otomatis) */
    let drag = null;
    w.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse") return;
      drag = { y: e.clientY, top: w.scrollTop }; col._moved = false; w.style.scrollSnapType = "none"; w.style.cursor = "grabbing"; w.setPointerCapture(e.pointerId);
    });
    w.addEventListener("pointermove", (e) => {
      if (!drag) return;
      const k = w.getBoundingClientRect().height / w.offsetHeight || 1;
      if (Math.abs(e.clientY - drag.y) > 4) col._moved = true;
      w.scrollTop = drag.top - (e.clientY - drag.y) / k;
    });
    const end = () => {
      if (!drag) return; drag = null; w.style.scrollSnapType = ""; w.style.cursor = "";
      w.scrollTo({ top: idx() * IH, behavior: "smooth" }); setTimeout(() => { col._moved = false; }, 50);
    };
    w.addEventListener("pointerup", end); w.addEventListener("pointercancel", end);
    col._set = (v) => {                                    // aman dipanggil saat elemen baru tampil
      col._lock = true;
      const go = () => { w.scrollTop = v * IH; mark(); };
      go(); requestAnimationFrame(go);
      setTimeout(() => { go(); col._lock = false; if (idx() === v) emit(v); }, 120);   // catat nilai hanya kalau scroll sudah benar
    };
    mark(true);
  }
  const mountWheels = (r) => $$$("[data-wheel]", r).forEach((c) => { if (!c.firstChild) mountWheel(c); });

  /* ---------- Tab ---------- */
  let tab = "world";
  function go(t) {
    tab = t;
    $$$(".ck-page").forEach((p) => { p.classList.toggle("on", p.dataset.page === t); p.classList.remove("editing"); });
    $$$(".ck-tabs button").forEach((b) => b.classList.toggle("on", b.dataset.tab === t));
    $$$('[data-act="edit"]').forEach((b) => { b.textContent = "Edit"; });
    if (t === "world") tickWorld();
    if (t === "stopwatch") { renderSW(); loopSW(); }
    if (t === "timer") syncTimerUI();
  }

  /* ================= JAM DUNIA ================= */
  let cities = store.get(K_CITIES, null);
  if (!Array.isArray(cities) || cities.some((c) => !c || !c.tz)) cities = CLOCK_DEFAULT_CITIES.map((c) => ({ ...c }));
  const saveCities = () => store.set(K_CITIES, cities);
  const worldList = $$('[data-list="world"]');

  function renderWorld() {
    if (!cities.length) { worldList.innerHTML = '<p class="ck-empty">Belum ada kota.<br>Ketuk + untuk menambah.</p>'; return; }
    worldList.innerHTML = cities.map((c, i) =>
      `<div class="ck-row" data-i="${i}"><button type="button" class="ck-del" data-del aria-label="Hapus ${html(c.name)}"></button>` +
      `<div class="ck-rl"><div class="ck-sub"></div><div class="ck-name">${html(c.name)}</div></div><div class="ck-time"></div></div>`).join("");
    tickWorld();
  }
  function tickWorld() {
    const now = deviceNow();
    $$$(".ck-row", worldList).forEach((r) => {
      const c = cities[+r.dataset.i]; if (!c) return;
      const inf = cityInfo(c, now), t = r.querySelector(".ck-time"), s = r.querySelector(".ck-sub");
      if (t._v !== inf.time) { t.innerHTML = inf.time; t._v = inf.time; }
      if (s._v !== inf.sub) { s.textContent = inf.sub; s._v = inf.sub; }
    });
  }
  worldList.addEventListener("click", (e) => {
    const d = e.target.closest("[data-del]"); if (!d) return;
    cities.splice(+d.closest(".ck-row").dataset.i, 1); saveCities(); renderWorld();
  });

  /* ================= ALARM ================= */
  let alarms = store.get(K_ALARMS, null);
  if (!Array.isArray(alarms)) alarms = CLOCK_DEFAULT_ALARMS.map((a) => ({ ...a, days: [...a.days], snooze: true, id: uid() }));
  alarms.forEach((a) => { if (!a.id) a.id = uid(); if (!Array.isArray(a.days)) a.days = []; if (a.snooze === undefined) a.snooze = true; });
  const saveAlarms = () => store.set(K_ALARMS, alarms);
  const alarmList = $$('[data-list="alarm"]');
  const DAY_SHORT = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"], DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

  function repeatText(d) {
    const s = [...d].sort().join(",");
    if (!d.length) return "Sekali";
    if (d.length === 7) return "Setiap hari";
    if (s === "1,2,3,4,5") return "Hari kerja";
    if (s === "0,6") return "Akhir pekan";
    return DAY_ORDER.filter((x) => d.includes(x)).map((x) => DAY_SHORT[x]).join(", ");
  }
  function renderAlarms() {
    if (!alarms.length) { alarmList.innerHTML = '<p class="ck-empty">Belum ada alarm.<br>Ketuk + untuk menambah.</p>'; return; }
    const sorted = [...alarms].sort((a, b) => a.h * 60 + a.m - (b.h * 60 + b.m));
    alarmList.innerHTML = sorted.map((a) =>
      `<div class="ck-row tap${a.on ? "" : " off"}" data-id="${a.id}"><button type="button" class="ck-del" data-del aria-label="Hapus alarm"></button>` +
      `<div class="ck-rl"><div class="ck-time">${fmtHM(a.h, a.m)}</div><div class="ck-sub">${html(a.label || "Alarm")}, ${repeatText(a.days)}</div></div>` +
      `<button type="button" class="ck-sw${a.on ? " on" : ""}" role="switch" aria-checked="${a.on}" aria-label="Aktifkan alarm" data-sw></button></div>`).join("");
  }
  function untilText(a) {
    const n = deviceNow();
    for (let d = 0; d < 8; d++) {
      const t = new Date(n.getFullYear(), n.getMonth(), n.getDate() + d, a.h, a.m, 0, 0);
      if (t <= n || (a.days.length && !a.days.includes(t.getDay()))) continue;
      const mins = Math.ceil((t - n) / 60000), dd = Math.floor(mins / 1440), hh = Math.floor((mins % 1440) / 60), mm = mins % 60;
      return "Alarm berbunyi dalam " + [dd && dd + " hari", hh && hh + " jam", (mm || (!dd && !hh)) && mm + " menit"].filter(Boolean).join(" ");
    }
    return "";
  }
  alarmList.addEventListener("click", (e) => {
    const row = e.target.closest(".ck-row"); if (!row) return;
    const a = alarms.find((x) => x.id === row.dataset.id); if (!a) return;
    if (e.target.closest("[data-del]")) { alarms = alarms.filter((x) => x !== a); saveAlarms(); return renderAlarms(); }
    if (e.target.closest("[data-sw]")) { a.on = !a.on; saveAlarms(); renderAlarms(); if (a.on) say(untilText(a)); return; }
    openAlarmSheet(a.id);
  });

  /* Pemeriksa alarm (jalan terus walau app Clock tidak dibuka) */
  const firedAt = {};
  function checkAlarms() {
    const d = deviceNow(), key = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes();
    alarms.forEach((a) => {
      if (!a.on || a.h !== d.getHours() || a.m !== d.getMinutes() || firedAt[a.id] === key) return;
      if (a.days.length && !a.days.includes(d.getDay())) return;
      firedAt[a.id] = key;
      fireAlarm(a);
      if (!a.days.length) { a.on = false; saveAlarms(); renderAlarms(); }
    });
  }
  function fireAlarm(a) {
    const btns = [];
    if (a.snooze) btns.push({ text: "Tunda", cls: "alt ck-glass", fn: () => { setTimeout(() => fireAlarm(a), CLOCK_SNOOZE_MIN * 60000); say("Alarm ditunda " + CLOCK_SNOOZE_MIN + " menit"); } });
    btns.push({ text: "Berhenti", cls: "stop" });
    ring({ title: a.label || "Alarm", sub: pad(a.h) + "." + pad(a.m), buttons: btns });
  }

  /* ================= STOPWATCH ================= */
  const sw = { run: false, t0: 0, acc: 0, laps: [], lastLap: 0, raf: 0 };
  const swEl = { dig: $$(".ck-sdig"), face: $$(".ck-face"), laps: $$(".ck-laps"), left: $$('[data-act="sw-left"]'), right: $$('[data-act="sw-right"]'), dial: $$(".ck-dial") };
  const swNow = () => sw.acc + (sw.run ? performance.now() - sw.t0 : 0);
  function fmtSW(ms) {
    const cs = Math.floor(ms / 10) % 100, s = Math.floor(ms / 1000) % 60, m = Math.floor(ms / 60000) % 60, h = Math.floor(ms / 3600000);
    return (h ? h + ":" + pad(m) : pad(m)) + ":" + pad(s) + "," + pad(cs);
  }
  (function buildDial() {
    let g = "";
    for (let i = 0; i < 60; i++) {
      const major = i % 5 === 0, a = i * 6, r1 = 118, r2 = major ? 104 : 111;
      g += `<line x1="120" y1="${120 - r1}" x2="120" y2="${120 - r2}" stroke="${major ? "#fff" : "rgba(255,255,255,.35)"}" stroke-width="${major ? 2.4 : 1.2}" stroke-linecap="round" transform="rotate(${a} 120 120)"/>`;
    }
    for (let i = 1; i <= 12; i++) {
      const a = (i * 30 * Math.PI) / 180;
      g += `<text x="${(120 + 84 * Math.sin(a)).toFixed(1)}" y="${(120 - 84 * Math.cos(a)).toFixed(1)}">${i * 5}</text>`;
    }
    g += '<g class="hand"><line x1="120" y1="136" x2="120" y2="14" stroke="#ff9f0a" stroke-width="2.6" stroke-linecap="round"/></g><circle cx="120" cy="120" r="5.5" fill="#ff9f0a"/><circle cx="120" cy="120" r="2" fill="#000"/>';
    swEl.dial.innerHTML = g;
  })();
  const handEl = swEl.dial.querySelector(".hand");
  function updateSW() {
    const t = swNow();
    swEl.dig.textContent = fmtSW(t);
    handEl.setAttribute("transform", `rotate(${((t / 1000) % 60) * 6} 120 120)`);
    const cur = swEl.laps.querySelector(".cur");
    if (cur) cur.lastElementChild.textContent = fmtSW(t - sw.lastLap);
  }
  function loopSW() {
    cancelAnimationFrame(sw.raf);
    const f = () => { updateSW(); if (sw.run && tab === "stopwatch") sw.raf = requestAnimationFrame(f); };
    f();
  }
  function renderSW() {
    const t = swNow();
    swEl.left.textContent = sw.run ? "Lap" : "Reset";
    swEl.left.disabled = !sw.run && t === 0;
    swEl.right.textContent = sw.run ? "Stop" : "Mulai";
    swEl.right.classList.toggle("red", sw.run); swEl.right.classList.toggle("green", !sw.run);
    let h = "";
    if (t > 0) h += `<div class="ck-lap cur"><span>Lap ${sw.laps.length + 1}</span><span>${fmtSW(t - sw.lastLap)}</span></div>`;
    const sp = sw.laps.map((l) => l.split), mn = Math.min(...sp), mx = Math.max(...sp);
    for (let i = sw.laps.length - 1; i >= 0; i--) {
      const l = sw.laps[i], cls = sw.laps.length >= 2 ? (l.split === mn ? " fast" : l.split === mx ? " slow" : "") : "";
      h += `<div class="ck-lap${cls}"><span>Lap ${i + 1}</span><span>${fmtSW(l.split)}</span></div>`;
    }
    swEl.laps.innerHTML = h;
    updateSW();
  }
  function swRight() {
    if (sw.run) { sw.acc += performance.now() - sw.t0; sw.run = false; }
    else { sw.t0 = performance.now(); sw.run = true; }
    renderSW(); loopSW();
  }
  function swLeft() {
    if (sw.run) { const t = swNow(); sw.laps.push({ split: t - sw.lastLap }); sw.lastLap = t; }
    else { sw.acc = 0; sw.laps = []; sw.lastLap = 0; }
    renderSW(); loopSW();
  }

  /* ================= TIMER ================= */
  const tm = { state: "idle", total: 0, end: 0, left: 0, iv: 0 };
  const TW = { h: 0, m: 5, s: 0 };
  const tmPage = pageEl("timer"), tmL = $$('[data-act="tm-left"]'), tmR = $$('[data-act="tm-right"]');
  const ringEl = $$("#ckRing"), ringFg = $$(".fg", ringEl), ringTime = $$(".ck-rtime"), ringEnd = $$(".ck-rend span");
  const CIRC = 2 * Math.PI * 136;
  let recents = store.get(K_RECENT, []);
  if (!Array.isArray(recents)) recents = [];

  function fmtT(ms) {
    const s = Math.ceil(ms / 1000), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
    return h ? h + ":" + pad(m) + ":" + pad(x) : pad(m) + ":" + pad(x);
  }
  function durText(ms) {
    const s = Math.round(ms / 1000), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
    return [h && h + " jam", m && m + " mnt", x && x + " dtk"].filter(Boolean).join(" ") || "0 dtk";
  }
  function syncTimerUI() {
    tmPage.classList.toggle("running", tm.state !== "idle");
    const idle = tm.state === "idle", total = ((TW.h * 60 + TW.m) * 60 + TW.s) * 1000;
    tmL.disabled = idle;
    tmR.disabled = idle && total === 0;
    tmR.textContent = idle ? "Mulai" : tm.state === "run" ? "Jeda" : "Lanjut";
    tmR.classList.toggle("green", idle || tm.state === "pause"); tmR.classList.toggle("orange", tm.state === "run");
    ringEl.classList.toggle("paused", tm.state === "pause");
    if (idle) { mountWheels(tmPage); $$$("[data-wheel]", tmPage).forEach((c) => c._set(TW[c.dataset.wheel])); renderRecents(); }
    else tickTimer();
  }
  function renderRecents() {
    const box = $$(".ck-recents");
    box.innerHTML = recents.length
      ? '<div class="ck-sec" style="margin-top:0">Terbaru</div>' + recents.map((ms, i) =>
        `<div class="ck-rec" data-rec="${i}"><div><b>${fmtT(ms).length < 6 ? "00:" + fmtT(ms) : fmtT(ms)}</b><span>${durText(ms)}</span></div><button type="button" class="ck-play ck-glass" aria-label="Mulai">${IC.play}</button></div>`).join("")
      : "";
  }
  function startTimer(total) {
    if (total <= 0) return;
    recents = [total, ...recents.filter((x) => x !== total)].slice(0, 5); store.set(K_RECENT, recents);
    tm.total = total; tm.end = Date.now() + total; tm.state = "run";
    clearInterval(tm.iv); tm.iv = setInterval(tickTimer, 100);
    syncTimerUI();
  }
  function tickTimer() {
    if (tm.state === "run") tm.left = tm.end - Date.now();
    if (tm.state === "run" && tm.left <= 0) return finishTimer();
    const left = Math.max(0, tm.left);
    ringTime.textContent = fmtT(left);
    ringFg.setAttribute("stroke-dashoffset", (CIRC * (1 - left / tm.total)).toFixed(1));
    const e = new Date(deviceNow().getTime() + left);
    ringEnd.innerHTML = fmtHM(e.getHours(), e.getMinutes());
  }
  function stopTimer() { clearInterval(tm.iv); tm.state = "idle"; syncTimerUI(); }
  function finishTimer() {
    const total = tm.total;
    stopTimer();
    ring({ title: "Timer", sub: "Waktu habis · " + durText(total), buttons: [{ text: "Ulangi", cls: "alt ck-glass", fn: () => startTimer(total) }, { text: "Berhenti", cls: "stop" }] });
  }
  function tmRight() {
    if (tm.state === "idle") return startTimer(((TW.h * 60 + TW.m) * 60 + TW.s) * 1000);
    if (tm.state === "run") { tm.left = tm.end - Date.now(); tm.state = "pause"; clearInterval(tm.iv); }
    else { tm.end = Date.now() + tm.left; tm.state = "run"; tm.iv = setInterval(tickTimer, 100); }
    syncTimerUI();
  }
  tmPage.addEventListener("wheelchange", (e) => {
    const c = e.target.closest("[data-wheel]"); if (!c || c._lock) return;
    TW[c.dataset.wheel] = e.detail;
    if (tm.state === "idle") tmR.disabled = ((TW.h * 60 + TW.m) * 60 + TW.s) === 0;
  });
  tmPage.addEventListener("click", (e) => {
    const r = e.target.closest("[data-rec]"); if (!r) return;
    const ms = recents[+r.dataset.rec]; if (ms) startTimer(ms);
  });

  /* ================= SHEET ================= */
  const sheet = $$(".ck-sheet"), panel = $$(".ck-panel");
  const sheetOpen = () => sheet.classList.contains("open");
  function openSheet(inner) {
    panel.onclick = null;
    if (panel._wc) { panel.removeEventListener("wheelchange", panel._wc); panel._wc = null; }
    panel.innerHTML = inner; mountWheels(panel); requestAnimationFrame(() => sheet.classList.add("open")); }
  function closeSheet() { sheet.classList.remove("open"); }
  sheet.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeSheet(); });

  /* -- Tambah kota -- */
  function openCitySheet() {
    openSheet(
      `<div class="ck-ph"><span style="width:76px"></span><h2>Pilih Kota</h2><button type="button" class="ck-pill ck-glass" data-close>Batal</button></div>` +
      `<div class="ck-pb"><label class="ck-search">${IC.search}<input type="text" placeholder="Cari kota atau negara" autocomplete="off" spellcheck="false"></label><div class="ck-list-sheet"></div></div>`);
    const input = $$("input", panel), list = $$(".ck-list-sheet", panel), now = deviceNow();
    const draw = () => {
      const q = input.value.trim().toLowerCase();
      const res = CLOCK_CITY_LIBRARY.filter((c) => !q || (c.name + " " + c.country).toLowerCase().includes(q)).slice(0, 80);
      list.innerHTML = res.length
        ? res.map((c) => {
          const has = cities.some((x) => x.name === c.name && x.tz === c.tz), k = CLOCK_CITY_LIBRARY.indexOf(c);
          return `<button type="button" class="ck-cres${has ? " added" : ""}" data-k="${k}"><div><b>${html(c.name)}</b><span>${html(c.country)}</span></div><i>${has ? "Sudah ada" : utcLabel(c.tz, now)}</i></button>`;
        }).join("")
        : '<p class="ck-empty">Kota tidak ditemukan.</p>';
    };
    input.addEventListener("input", draw);
    list.addEventListener("click", (e) => {
      const b = e.target.closest("[data-k]"); if (!b || b.classList.contains("added")) return;
      const c = CLOCK_CITY_LIBRARY[+b.dataset.k];
      cities.push({ name: c.name, country: c.country, tz: c.tz }); saveCities(); renderWorld(); closeSheet();
    });
    draw();
    setTimeout(() => { try { input.focus({ preventScroll: true }); } catch (_) {} }, 380);
  }

  /* -- Tambah / ubah alarm -- */
  const DAY_LET = { 1: "S", 2: "S", 3: "R", 4: "K", 5: "J", 6: "S", 0: "M" }, DAY_FULL = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  function openAlarmSheet(id) {
    const src = id && alarms.find((x) => x.id === id);
    const d = src ? { ...src, days: [...src.days] } : { id: null, h: 7, m: 0, label: "", days: [], snooze: true, on: true };
    openSheet(
      `<div class="ck-ph"><button type="button" class="ck-pill ck-glass" data-close>Batal</button><h2>${src ? "Ubah Alarm" : "Tambah Alarm"}</h2><button type="button" class="ck-pill ck-glass go" data-save>Simpan</button></div>` +
      `<div class="ck-pb"><div class="ck-wheels solo"><div class="ck-band"></div><div class="ck-wcol" data-wheel="h" data-n="24"></div><span class="ck-colon">:</span><div class="ck-wcol" data-wheel="m" data-n="60"></div></div>` +
      `<div class="ck-card"><div class="ck-dlabel">Ulangi</div><div class="ck-days">${DAY_ORDER.map((x) => `<button type="button" class="ck-day${d.days.includes(x) ? " on" : ""}" data-day="${x}" aria-label="${DAY_FULL[x]}">${DAY_LET[x]}</button>`).join("")}</div></div>` +
      `<div class="ck-card"><div class="ck-crow"><span>Label</span><input type="text" data-label placeholder="Alarm" maxlength="24" value="${html(d.label)}" autocomplete="off"></div>` +
      `<div class="ck-crow"><span>Tunda</span><button type="button" class="ck-sw${d.snooze ? " on" : ""}" role="switch" aria-checked="${d.snooze}" data-snooze></button></div></div>` +
      (src ? '<div class="ck-card"><button type="button" class="ck-dangerbtn" data-delalarm>Hapus Alarm</button></div>' : "") + "</div>");
    $$$("[data-wheel]", panel).forEach((c) => c._set(d[c.dataset.wheel]));
    panel.onclick = (e) => {
      const day = e.target.closest("[data-day]");
      if (day) { const v = +day.dataset.day, i = d.days.indexOf(v); i < 0 ? d.days.push(v) : d.days.splice(i, 1); day.classList.toggle("on"); return; }
      const sn = e.target.closest("[data-snooze]");
      if (sn) { d.snooze = !d.snooze; sn.classList.toggle("on", d.snooze); sn.setAttribute("aria-checked", d.snooze); return; }
      if (e.target.closest("[data-delalarm]")) { alarms = alarms.filter((x) => x.id !== d.id); saveAlarms(); renderAlarms(); return closeSheet(); }
      if (e.target.closest("[data-save]")) {
        d.label = $$("[data-label]", panel).value.trim(); d.on = true;
        if (d.id) alarms = alarms.map((x) => (x.id === d.id ? d : x)); else { d.id = uid(); alarms.push(d); }
        delete firedAt[d.id];
        saveAlarms(); renderAlarms(); closeSheet(); say(untilText(d));
      }
    };
    panel._wc = (e) => { const c = e.target.closest("[data-wheel]"); if (c && !c._lock) d[c.dataset.wheel] = e.detail; };
    panel.addEventListener("wheelchange", panel._wc);
  }

  /* ================= Event umum ================= */
  root.addEventListener("click", (e) => {
    const tb = e.target.closest("[data-tab]");
    if (tb) return go(tb.dataset.tab);
    const b = e.target.closest("[data-act]"); if (!b) return;
    const act = b.dataset.act;
    if (act === "edit") { const p = b.closest(".ck-page"), on = p.classList.toggle("editing"); b.textContent = on ? "Selesai" : "Edit"; }
    else if (act === "add") { if (tab === "world") openCitySheet(); else openAlarmSheet(null); }
    else if (act === "sw-right") swRight();
    else if (act === "sw-left") swLeft();
    else if (act === "sw-flip") { const a = swEl.face.classList.toggle("analog"); $$$(".ck-pgdots i").forEach((i, n) => i.classList.toggle("on", n === (a ? 1 : 0))); }
    else if (act === "tm-right") tmRight();
    else if (act === "tm-left") stopTimer();
  });

  /* Detak 1 detik: jam dunia, alarm, dan jarum ikon Clock di home screen */
  function tickIcon() {
    const d = deviceNow(), h = (d.getHours() % 12) * 30 + d.getMinutes() * 0.5, m = d.getMinutes() * 6 + d.getSeconds() * 0.1;
    document.querySelectorAll(".ic-clock .hand-h").forEach((e) => e.setAttribute("transform", `rotate(${h} 50 50)`));
    document.querySelectorAll(".ic-clock .hand-m").forEach((e) => e.setAttribute("transform", `rotate(${m} 50 50)`));
  }
  setInterval(() => { tickWorld(); checkAlarms(); tickIcon(); }, 1000);

  renderWorld(); renderAlarms(); renderSW();
  setTimeout(tickIcon, 0);

  /* ---------- Daftarkan ke HP ---------- */
  Phone.registerApp({
    id: "clock",
    name: "Clock",
    dynamicIcon: "clock",          // ikon jam analog langsung di home screen (lihat home.js)
    icon: "",
    iconBg: "transparent",
    layer,
    barOnLight: () => false,       // latar hitam -> status bar putih
    onOpen() { go(tab); },
    onBack() { if (sheetOpen()) { closeSheet(); return true; } return false; },
  });
})();