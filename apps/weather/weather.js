/* =====================================================================
   WEATHER — gaya iOS 26: latar berubah sesuai cuaca/waktu, kartu kaca
   (per jam, 10 hari, UV, angin, dll.), bar bawah mengambang, daftar kota
   dengan pencarian. Data & pengaturan: weather.data.js
   ===================================================================== */
(function () {
  /* ---------- Markup (HTML aplikasi) ---------- */
  const WX_MARKUP = `
    <div class="wx-bg" id="wxBg"></div>
    <div class="wx-mini wx-glass" id="wxMini"></div>
    <div class="wx-scroll" id="wxScroll"></div>
    <div class="wx-bar wx-glass" id="wxBar">
      <button type="button" id="wxMap" aria-label="Peta"></button>
      <div class="wx-dots" id="wxDots"></div>
      <button type="button" id="wxListBtn" aria-label="Daftar kota"></button>
    </div>
    <section class="wx-cities" id="wxCities">
      <div class="wx-chead"><h1>Weather</h1><button type="button" class="wx-glass" id="wxEdit">Edit</button></div>
      <div class="wx-search wx-glass"><span id="wxSearchIc"></span><input id="wxQuery" placeholder="Cari kota atau bandara" autocomplete="off"></div>
      <div class="wx-clist" id="wxCList"></div>
      <button type="button" class="wx-close wx-glass" id="wxClose"></button>
    </section>`;
  const layer = Phone.createLayer("weather", WX_MARKUP);

  /* ---------- Ikon ---------- */
  const I = {
    list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/></svg>',
    map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M3 6.5l6-2.5 6 2.5 6-2.500v13.500l-6 2.500-6-2.500-6 2.500zM9 4v13.500M15 6.500V20"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    loc: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.500l8.500 18-8.500-4-8.500 4z" transform="rotate(0)"/></svg>',
  };
  /* Ikon cuaca (SVG 64x64). kind: clear | partly | cloud | fog | rain | storm | snow */
  const CLOUD = '<path d="M19 46h27a11 11 0 000-22 15 15 0 00-28.500-3A10.500 10.500 0 0019 46z" fill="#fff" fill-opacity=".96"/>';
  const SUN = (cx, cy, r) => `<g stroke="#ffd23f" stroke-width="3.2" stroke-linecap="round">${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<line x1="${cx}" y1="${cy - r - 4}" x2="${cx}" y2="${cy - r - 8}" transform="rotate(${a} ${cx} ${cy})"/>`).join("")}</g><circle cx="${cx}" cy="${cy}" r="${r}" fill="#ffd23f"/>`;
  const MOON = (cx, cy, r) => `<path d="M${cx + r * 0.6} ${cy - r}a${r} ${r} 0 100 ${r * 1.9} ${r * 1.1} ${r * 1.1} 0 01-${r * 0.4}-${r * 1.9}z" fill="#f4efc6"/>`;
  function wxIcon(kind, day, size = 40) {
    const body = {
      clear: day ? SUN(32, 32, 12) : MOON(30, 30, 13),
      partly: (day ? SUN(24, 24, 9) : MOON(22, 22, 9)) + '<g transform="translate(6 6) scale(.85)">' + CLOUD + "</g>",
      cloud: '<g transform="translate(-3 -4) scale(.9)"><path d="M19 46h27a11 11 0 000-22 15 15 0 00-28.500-3A10.500 10.500 0 0019 46z" fill="#c9d3dc"/></g><g transform="translate(6 4) scale(.85)">' + CLOUD + "</g>",
      fog: '<g transform="translate(0 -6)">' + CLOUD + '</g><g stroke="#fff" stroke-opacity=".85" stroke-width="3" stroke-linecap="round"><path d="M16 48h30M22 55h26"/></g>',
      rain: '<g transform="translate(0 -6)"><path d="M19 46h27a11 11 0 000-22 15 15 0 00-28.500-3A10.500 10.500 0 0019 46z" fill="#dfe6ee"/></g><g stroke="#6cc4ff" stroke-width="3.2" stroke-linecap="round"><path d="M24 44l-3 8M34 44l-3 8M44 44l-3 8"/></g>',
      storm: '<g transform="translate(0 -6)"><path d="M19 46h27a11 11 0 000-22 15 15 0 00-28.500-3A10.500 10.500 0 0019 46z" fill="#aeb8c4"/></g><path d="M34 38l-8 11h6l-3 9 10-13h-6z" fill="#ffd23f"/>',
      snow: '<g transform="translate(0 -6)"><path d="M19 46h27a11 11 0 000-22 15 15 0 00-28.500-3A10.500 10.500 0 0019 46z" fill="#e8eef4"/></g><g fill="#fff"><circle cx="24" cy="50" r="2.600"/><circle cx="34" cy="55" r="2.600"/><circle cx="44" cy="50" r="2.600"/></g>',
    }[kind];
    return `<svg class="wx-ic" width="${size}" height="${size}" viewBox="0 0 64 64">${body}</svg>`;
  }

  /* ---------- Kode cuaca WMO -> jenis & label ---------- */
  function describe(code) {
    if (code === 0) return ["clear", "Cerah"];
    if (code === 1) return ["clear", "Sebagian cerah"];
    if (code === 2) return ["partly", "Berawan sebagian"];
    if (code === 3) return ["cloud", "Berawan"];
    if (code === 45 || code === 48) return ["fog", "Berkabut"];
    if (code >= 51 && code <= 57) return ["rain", "Gerimis"];
    if (code === 65 || code === 67 || code === 82) return ["rain", "Hujan lebat"];
    if ((code >= 61 && code <= 66) || code === 80 || code === 81) return ["rain", "Hujan"];
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return ["snow", "Salju"];
    if (code >= 95) return ["storm", "Badai petir"];
    return ["cloud", "Berawan"];
  }
  function background(kind, day) {
    if (!day) return kind === "storm" ? "linear-gradient(180deg,#1b1d33,#363a5c)" : "linear-gradient(180deg,#0b1633,#26407a)";
    return {
      clear: "linear-gradient(180deg,#2f86d6,#78c0f2)",
      partly: "linear-gradient(180deg,#3f8ccc,#8bbfe3)",
      cloud: "linear-gradient(180deg,#5d7890,#9db0c0)",
      fog: "linear-gradient(180deg,#6f8190,#aab7c2)",
      rain: "linear-gradient(180deg,#3b4c5e,#66798b)",
      storm: "linear-gradient(180deg,#2c2f4a,#555a7c)",
      snow: "linear-gradient(180deg,#6f8bb0,#c4d4e6)",
    }[kind];
  }

  /* ---------- Util ---------- */
  const deg = (v) => (WEATHER_UNIT === "F" ? Math.round((v * 9) / 5 + 32) : Math.round(v)) + "°";
  const COMPASS = ["U", "TL", "T", "TG", "S", "BD", "B", "BL"];
  const compass = (d) => COMPASS[Math.round(d / 45) % 8];
  const uvLabel = (u) => (u < 3 ? "Rendah" : u < 6 ? "Sedang" : u < 8 ? "Tinggi" : u < 11 ? "Sangat tinggi" : "Ekstrem");
  const hhmm = (iso) => (iso || "").slice(11, 16).replace(":", ".");
  const dayName = (iso, i) => (i === 0 ? "Hari ini" : new Date(iso + "T12:00:00").toLocaleDateString("id-ID", { weekday: "short" }));

  /* ---------- Data: Open-Meteo ---------- */
  const STORE = "eros_weather_cities_v1";
  let cities = WEATHER_CITIES.map((c) => ({ ...c }));
  try { const s = JSON.parse(localStorage.getItem(STORE) || "null"); if (Array.isArray(s) && s.length) cities = s; } catch (_) {}
  const saveCities = () => { try { localStorage.setItem(STORE, JSON.stringify(cities)); } catch (_) {} };
  let idx = 0, editMode = false;
  const cache = {};

  async function fetchWeather(c) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}` +
      `&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,is_day,wind_speed_10m,wind_direction_10m,pressure_msl` +
      `&hourly=temperature_2m,weather_code,is_day,precipitation_probability,uv_index,visibility` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,uv_index_max` +
      `&timezone=auto&forecast_days=10`;
    const j = await (await fetch(url)).json();
    const cu = j.current, h = j.hourly, d = j.daily;
    let start = h.time.indexOf(cu.time.slice(0, 13) + ":00");
    if (start < 0) start = 0;
    return {
      temp: cu.temperature_2m, feels: cu.apparent_temperature, humidity: cu.relative_humidity_2m, code: cu.weather_code, day: !!cu.is_day,
      wind: cu.wind_speed_10m, windDir: cu.wind_direction_10m, pressure: cu.pressure_msl,
      uv: h.uv_index[start] ?? 0, vis: (h.visibility[start] ?? 10000) / 1000, pop: d.precipitation_probability_max[0] ?? 0,
      hi: d.temperature_2m_max[0], lo: d.temperature_2m_min[0], sunrise: d.sunrise[0], sunset: d.sunset[0],
      hours: h.time.slice(start, start + 24).map((t, k) => ({ label: k === 0 ? "Now" : t.slice(11, 13), temp: h.temperature_2m[start + k], code: h.weather_code[start + k], day: !!h.is_day[start + k], pop: h.precipitation_probability[start + k] })),
      days: d.time.map((t, k) => ({ name: dayName(t, k), code: d.weather_code[k], min: d.temperature_2m_min[k], max: d.temperature_2m_max[k], pop: d.precipitation_probability_max[k] })),
      offline: false,
    };
  }
  /* Data contoh kalau offline */
  function sampleWeather(c) {
    const s = hash(c.name), base = 27 + (s % 5), now = new Date(), hr = now.getHours();
    const codes = [0, 2, 3, 61, 2, 1, 80, 95, 3, 0];
    return {
      temp: base, feels: base + 3, humidity: 70 + (s % 15), code: 2, day: hr >= 6 && hr < 18, wind: 8 + (s % 8), windDir: (s % 8) * 45, pressure: 1009, uv: 7, vis: 10, pop: 40,
      hi: base + 3, lo: base - 5, sunrise: "2026-01-01T05:42", sunset: "2026-01-01T17:58",
      hours: Array.from({ length: 24 }, (_, k) => { const H = (hr + k) % 24; return { label: k === 0 ? "Now" : String(H).padStart(2, "0"), temp: base - 4 + 6 * Math.sin(((H - 8) / 24) * Math.PI * 2), code: codes[(s + k) % 5], day: H >= 6 && H < 18, pop: 10 * ((s + k) % 6) }; }),
      days: Array.from({ length: 10 }, (_, k) => ({ name: k === 0 ? "Hari ini" : new Date(Date.now() + k * 864e5).toLocaleDateString("id-ID", { weekday: "short" }), code: codes[k], min: base - 5 + (k % 3), max: base + 2 + (k % 4), pop: 10 * ((s + k) % 8) })),
      offline: true,
    };
  }
  async function load(c) {
    const key = c.lat + "," + c.lon, hit = cache[key];
    if (hit && Date.now() - hit.t < 10 * 60000) return hit.d;
    let d;
    try { d = await fetchWeather(c); } catch (_) { d = sampleWeather(c); }
    cache[key] = { t: d.offline ? Date.now() - 9 * 60000 : Date.now(), d };   // data contoh dicoba ulang setelah ±1 menit
    return d;
  }

  /* ---------- Render halaman utama ---------- */
  const card = (title, body, cls = "") => `<div class="wx-card wx-glass ${cls}"><h3>${title}</h3>${body}</div>`;
  async function render() {
    const c = cities[idx];
    $("wxScroll").innerHTML = `<div class="wx-hero"><h2>${esc(c.name)}</h2><div class="wx-temp">…</div><p>Memuat…</p></div>`;
    renderDots();
    const w = await load(c);
    if (cities[idx] !== c) return;                         // kota sudah diganti saat loading
    const [kind, label] = describe(w.code);
    $("wxBg").style.background = background(kind, w.day);
    $("wxMini").innerHTML = `<b>${esc(c.name)}</b><span>${deg(w.temp)} | ${label}</span>`;
    const gmin = Math.min(...w.days.map((d) => d.min)), gmax = Math.max(...w.days.map((d) => d.max));
    const hourly = w.hours.map((h) => `<div><span>${h.label}</span>${wxIcon(describe(h.code)[0], h.day, 30)}${h.pop >= 20 ? `<em>${h.pop}%</em>` : "<em></em>"}<b>${deg(h.temp)}</b></div>`).join("");
    const daily = w.days.map((d) => {
      const l = ((d.min - gmin) / (gmax - gmin || 1)) * 100, wd = Math.max(8, ((d.max - d.min) / (gmax - gmin || 1)) * 100);
      return `<div class="wx-day"><span>${d.name}</span>${wxIcon(describe(d.code)[0], true, 28)}<em>${d.pop >= 20 ? d.pop + "%" : ""}</em><i>${deg(d.min)}</i><div class="wx-track"><u style="left:${l}%;width:${wd}%"></u></div><b>${deg(d.max)}</b></div>`;
    }).join("");
    const big = (v, s) => `<div class="wx-big">${v}</div><p class="wx-sub">${s}</p>`;
    $("wxScroll").innerHTML = `
      <div class="wx-hero"><h2>${esc(c.name)}</h2><div class="wx-temp">${deg(w.temp)}</div><p>${label}</p><p class="hl">T:${deg(w.hi)} &nbsp; R:${deg(w.lo)}</p>${w.offline ? '<p class="off">Data contoh (offline)</p>' : ""}</div>
      ${card("PRAKIRAAN PER JAM", `<div class="wx-hours">${hourly}</div>`)}
      ${card("PRAKIRAAN 10 HARI", `<div class="wx-days">${daily}</div>`)}
      <div class="wx-grid">
        ${card("INDEKS UV", big(Math.round(w.uv), uvLabel(w.uv)))}
        ${card("MATAHARI", big(w.day ? hhmm(w.sunset) : hhmm(w.sunrise), w.day ? "Terbenam" : "Terbit") )}
        ${card("ANGIN", big(Math.round(w.wind) + '<small> km/j</small>', "Arah " + compass(w.windDir)))}
        ${card("KELEMBAPAN", big(Math.round(w.humidity) + "%", "Titik embun terasa " + (w.humidity > 75 ? "lembap" : "nyaman")))}
        ${card("TERASA SEPERTI", big(deg(w.feels), w.feels > w.temp ? "Terasa lebih hangat" : "Mirip suhu sebenarnya"))}
        ${card("PELUANG HUJAN", big(Math.round(w.pop) + "%", "Hari ini"))}
        ${card("JARAK PANDANG", big(Math.round(w.vis) + '<small> km</small>', w.vis >= 10 ? "Sangat jelas" : "Terbatas"))}
        ${card("TEKANAN", big(Math.round(w.pressure) + '<small> hPa</small>', "Udara"))}
      </div>`;
    $("wxScroll").scrollTop = 0;
    onScroll();
  }
  function renderDots() {
    $("wxDots").innerHTML = cities.map((_, i) => `<i class="${i === idx ? "on" : ""}" data-i="${i}">${i === 0 ? I.loc : ""}</i>`).join("");
  }
  function onScroll() {                                      // header kecil muncul saat scroll
    const y = $("wxScroll").scrollTop, p = Math.min(1, Math.max(0, (y - 120) / 70));
    $("wxMini").style.opacity = p;
    $("wxMini").style.transform = `translate(-50%, ${(1 - p) * -10}px)`;
    const hero = $("wxScroll").querySelector(".wx-hero");
    if (hero) hero.style.opacity = Math.max(0, 1 - y / 220);
  }
  $("wxScroll").addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Daftar kota ---------- */
  async function renderCities() {
    const list = $("wxCList");
    list.innerHTML = cities.map((c, i) => `<div class="wx-ccard" data-i="${i}" style="background:#3a5a7a"><div><b>${esc(c.name)}</b><span>…</span></div><strong>…</strong>${editMode ? `<button type="button" class="wx-del" data-del="${i}">${I.close}</button>` : ""}</div>`).join("");
    cities.forEach(async (c, i) => {
      const w = await load(c), [kind, label] = describe(w.code), el = list.children[i];
      if (!el) return;
      el.style.background = background(kind, w.day);
      el.querySelector("span").textContent = label;
      el.querySelector("strong").innerHTML = `${deg(w.temp)}<small>T:${deg(w.hi)} R:${deg(w.lo)}</small>`;
    });
    $("wxEdit").textContent = editMode ? "Selesai" : "Edit";
  }
  $("wxCList").addEventListener("click", (e) => {
    const del = e.target.closest("[data-del]");
    if (del) {
      if (cities.length <= 1) return toast("Minimal satu kota");
      cities.splice(+del.dataset.del, 1); idx = Math.min(idx, cities.length - 1); saveCities(); return renderCities();
    }
    const r = e.target.closest(".wx-ccard");
    if (r && !editMode) { idx = +r.dataset.i; closeCities(); render(); }
  });
  $("wxEdit").addEventListener("click", () => { editMode = !editMode; renderCities(); });
  function openCities() { editMode = false; $("wxQuery").value = ""; renderCities(); $("wxCities").classList.add("open"); }
  function closeCities() { $("wxCities").classList.remove("open"); }
  $("wxListBtn").addEventListener("click", openCities);
  $("wxClose").addEventListener("click", closeCities);

  /* Pencarian kota (geocoding Open-Meteo) */
  let timer;
  $("wxQuery").addEventListener("input", (e) => {
    clearTimeout(timer);
    const q = e.target.value.trim();
    if (q.length < 2) return renderCities();
    timer = setTimeout(async () => {
      try {
        const j = await (await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=6&language=id`)).json();
        $("wxCList").innerHTML = (j.results || []).map((r, i) => `<button type="button" class="wx-res" data-r="${i}"><b>${esc(r.name)}</b><span>${esc([r.admin1, r.country].filter(Boolean).join(", "))}</span></button>`).join("") || '<p class="wx-none">Kota tidak ditemukan.</p>';
        $("wxCList")._res = j.results || [];
      } catch (_) { $("wxCList").innerHTML = '<p class="wx-none">Pencarian butuh internet.</p>'; }
    }, 350);
  });
  $("wxCList").addEventListener("click", (e) => {
    const b = e.target.closest("[data-r]");
    if (!b) return;
    const r = $("wxCList")._res[+b.dataset.r];
    cities.push({ name: r.name, lat: r.latitude, lon: r.longitude });
    idx = cities.length - 1; saveCities(); closeCities(); render();
  });

  /* ---------- Bar bawah ---------- */
  $("wxMap").addEventListener("click", () => toast("Peta cuaca belum tersedia di simulator"));
  $("wxDots").addEventListener("click", (e) => { const d = e.target.closest("[data-i]"); if (d) { idx = +d.dataset.i; render(); } });
  $("wxMap").innerHTML = I.map;
  $("wxListBtn").innerHTML = I.list;
  $("wxSearchIc").innerHTML = I.search;
  $("wxClose").innerHTML = I.close;

  /* ---------- Daftarkan ke HP ---------- */
  Phone.registerApp({
    id: "weather",
    name: "Weather",
    icon: iconImg(APP_ICON.weather),
    iconBg: "transparent",
    layer,
    barOnLight: () => false,                                // latar selalu gelap/berwarna -> status bar putih
    onOpen() { closeCities(); render(); },
    onBack() { if ($("wxCities").classList.contains("open")) { closeCities(); return true; } return false; },
  });
})();
