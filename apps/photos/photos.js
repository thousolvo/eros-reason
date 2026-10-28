/* =====================================================================
   PHOTOS — gaya iOS 26: grid rapat, Years / Months / All, tab bar kaca
   mengambang (Library · Collections · Search), viewer dengan geser kiri/kanan.
   • Foto contoh: gradient berwarna (+ avatar WhatsApp kalau filenya ada).
   • "+" menambah foto dari perangkat (tersimpan di browser).
   • Ganti jumlah foto contoh di SAMPLE_COUNT.
   ===================================================================== */
(function () {
  const SAMPLE_COUNT = 30;
  const KEY = "eros_photos_v2", FAV_KEY = "eros_photos_fav_v1";

  const P = {
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    photo: '<svg viewBox="0 0 24 24" fill="currentColor"><ellipse cx="12" cy="6.6" rx="2.9" ry="5" transform="rotate(0 12 12)" opacity=".92"/><ellipse cx="12" cy="6.6" rx="2.9" ry="5" transform="rotate(45 12 12)" opacity=".92"/><ellipse cx="12" cy="6.6" rx="2.9" ry="5" transform="rotate(90 12 12)" opacity=".92"/><ellipse cx="12" cy="6.6" rx="2.9" ry="5" transform="rotate(135 12 12)" opacity=".92"/><ellipse cx="12" cy="6.6" rx="2.9" ry="5" transform="rotate(180 12 12)" opacity=".92"/><ellipse cx="12" cy="6.6" rx="2.9" ry="5" transform="rotate(225 12 12)" opacity=".92"/><ellipse cx="12" cy="6.6" rx="2.9" ry="5" transform="rotate(270 12 12)" opacity=".92"/><ellipse cx="12" cy="6.6" rx="2.9" ry="5" transform="rotate(315 12 12)" opacity=".92"/></svg>',
    albums: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="5" width="18" height="15" rx="3.2"/><rect x="5.5" y="2.6" width="13" height="2" rx="1" opacity=".55"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4l-8 8 8 8"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 20.5s-8-4.9-8-11A4.5 4.5 0 0112 7a4.5 4.5 0 018 2.5c0 6.1-8 11-8 11z"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V4h6v3M6.5 7l1 13h9l1-13M10 11v6M14 11v6"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3M8 7l4-4 4 4M5 12v7a1 1 0 001 1h12a1 1 0 001-1v-7"/></svg>',
  };

  const layer = Phone.createLayer("photos", `
    <div class="ph-scroll" id="phScroll"></div>
    <div class="ph-fade"></div>
    <div class="ph-top" id="phTop"></div>
    <div class="ph-seg ph-glass" id="phSeg"></div>
    <div class="ph-bar" id="phBar">
      <nav class="ph-tabs ph-glass" id="phTabs"></nav>
      <button class="ph-searchbtn ph-glass" type="button" data-tab="search" id="phSearchBtn"></button>
    </div>
    <input type="file" id="phInput" accept="image/*" multiple hidden>`);

  /* ---------- Data ---------- */
  let mine = [], favs = new Set();
  try { mine = JSON.parse(localStorage.getItem(KEY) || "[]").filter((p) => p && p.src); } catch (_) {}
  try { favs = new Set(JSON.parse(localStorage.getItem(FAV_KEY) || "[]")); } catch (_) {}
  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify(mine)); localStorage.setItem(FAV_KEY, JSON.stringify([...favs])); return true; }
    catch (_) { alert("Penyimpanan browser penuh. Foto baru tidak tersimpan."); return false; }
  };
  function samples() {
    const avatars = (typeof PROFILES !== "undefined" ? PROFILES : []).map((p) => p.avatar).filter(Boolean);
    return Array.from({ length: SAMPLE_COUNT }, (_, i) => ({
      id: "s" + i,
      src: i < avatars.length ? avatars[i] : "",
      hue: (i * 47 + 12) % 360,
      date: Date.now() - (i * 5.3 + (i % 4)) * 86400000,
      sample: true,
    }));
  }
  const all = () => [...mine.map((p) => ({ ...p, hue: 210 })), ...samples()].sort((a, b) => a.date - b.date);   // lama -> baru

  /* ---------- State ---------- */
  let tab = "library", mode = "all", album = null, query = "", viewer = null;
  const D = (p) => new Date(p.date);
  const monthName = (d) => d.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  const bg = (p) => `linear-gradient(145deg, hsl(${p.hue},70%,68%), hsl(${(p.hue + 40) % 360},60%,38%))`;
  const tile = (p, cls = "") =>
    `<button type="button" class="ph-tile ${cls}" data-id="${p.id}" style="background:${bg(p)}">${p.src ? `<img src="${esc(p.src)}" alt="" draggable="false" loading="lazy" onerror="this.remove()">` : ""}${favs.has(p.id) ? `<i>${P.heart}</i>` : ""}</button>`;
  const list = () => (album === "fav" ? all().filter((p) => favs.has(p.id)) : all());

  /* ---------- Render ---------- */
  function topHTML(title, extra = "") {
    return `<h1>${esc(title)}</h1><div class="ph-pill ph-glass">${extra}<button type="button" data-act="add">${P.plus}</button></div>`;
  }
  function render() {
    const sc = $("phScroll");
    let html = "", title = "Library";
    const items = list();
    $("phSeg").style.display = tab === "library" && !album ? "" : "none";
    if (tab === "library" || album) {
      if (album) title = album === "fav" ? "Favorites" : "Recents";
      if (mode === "all" || album) {
        html = `<div class="ph-grid">${items.map((p) => tile(p)).join("")}</div><p class="ph-count">${items.length} Photos</p>`;
      } else if (mode === "months") {
        const groups = {};
        [...items].reverse().forEach((p) => (groups[monthName(D(p))] ||= []).push(p));
        html = Object.entries(groups).map(([m, ps]) => `<section class="ph-month"><h2>${esc(m)}</h2><div class="ph-grid wide">${ps.slice(0, 6).map((p) => tile(p)).join("")}</div></section>`).join("");
      } else {
        const years = {};
        [...items].reverse().forEach((p) => (years[D(p).getFullYear()] ||= []).push(p));
        html = Object.entries(years).sort((a, b) => b[0] - a[0]).map(([y, ps]) => `<section class="ph-year"><div class="ph-yearcard" style="background:${bg(ps[0])}">${ps[0].src ? `<img src="${esc(ps[0].src)}" alt="" onerror="this.remove()">` : ""}<h2>${y}</h2></div></section>`).join("");
      }
    } else if (tab === "collections") {
      title = "Collections";
      const fav = all().filter((p) => favs.has(p.id)), recent = all().slice(-1)[0];
      html = `<h3 class="ph-h3">Albums</h3><div class="ph-albums">
        <button type="button" data-album="recents"><span class="ph-cov" style="background:${bg(recent)}"></span><b>Recents</b><em>${all().length}</em></button>
        <button type="button" data-album="fav"><span class="ph-cov fav">${P.heart}</span><b>Favorites</b><em>${fav.length}</em></button></div>`;
    } else {
      title = "Search";
      const q = query.trim().toLowerCase();
      const res = q ? all().filter((p) => monthName(D(p)).toLowerCase().includes(q)) : [];
      html = `<div class="ph-search ph-glass">${P.search}<input id="phQuery" value="${esc(query)}" placeholder="Photos, People, Places…" autocomplete="off"></div>
        ${q ? (res.length ? `<div class="ph-grid">${res.map((p) => tile(p)).join("")}</div>` : '<p class="ph-count">Tidak ada hasil</p>') : '<p class="ph-count">Cari berdasarkan bulan, mis. “oktober”</p>'}`;
    }
    sc.innerHTML = html;
    $("phTop").innerHTML = (album ? `<button type="button" class="ph-back ph-glass" data-act="back">${P.back}</button>` : "") + topHTML(title);
    $("phSeg").innerHTML = ["years", "months", "all"].map((m) => `<button type="button" data-mode="${m}" class="${mode === m ? "on" : ""}">${m[0].toUpperCase() + m.slice(1)}</button>`).join("");
    $("phTabs").innerHTML = `<button type="button" data-tab="library" class="${tab === "library" ? "on" : ""}">${P.photo}<span>Library</span></button><button type="button" data-tab="collections" class="${tab === "collections" ? "on" : ""}">${P.albums}<span>Collections</span></button>`;
    $("phSearchBtn").innerHTML = P.search;
    $("phSearchBtn").classList.toggle("on", tab === "search");
    if (tab === "search") $("phQuery").addEventListener("input", (e) => { query = e.target.value; const pos = e.target.selectionStart; render(); const q = $("phQuery"); q.focus(); q.setSelectionRange(pos, pos); });
    if ((tab === "library" && mode === "all") || album) sc.scrollTop = sc.scrollHeight;   // foto terbaru di bawah, seperti iOS
  }

  /* ---------- Viewer ---------- */
  function openViewer(id) {
    const items = list();
    let i = items.findIndex((p) => p.id === id);
    if (i < 0) return;
    viewer = document.createElement("div");
    viewer.className = "ph-viewer";
    viewer.innerHTML = `<div class="ph-vtop"><button type="button" class="ph-back ph-glass" data-v="close">${P.back}</button><div class="ph-vtitle ph-glass"><b></b><span></span></div><i class="sp"></i></div>
      <div class="ph-stage"><div class="ph-img"></div></div>
      <div class="ph-vbar ph-glass"><button type="button" data-v="share">${P.share}</button><button type="button" data-v="fav">${P.heart}</button><button type="button" data-v="del">${P.trash}</button></div>`;
    layer.appendChild(viewer);
    requestAnimationFrame(() => viewer.classList.add("open"));
    Phone.refreshBar();
    const img = viewer.querySelector(".ph-img");
    const show = (dir = 0) => {
      const p = items[i], d = D(p);
      viewer.querySelector("b").textContent = d.toLocaleDateString("id-ID", { day: "numeric", month: "long" });
      viewer.querySelector(".ph-vtitle span").textContent = d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).replace(":", ".");
      img.style.transition = "none"; img.style.transform = `translateX(${dir * 60}px)`; img.style.opacity = "0.3";
      img.style.background = bg(p);
      img.innerHTML = p.src ? `<img src="${esc(p.src)}" alt="" draggable="false" onerror="this.remove()">` : "";
      viewer.querySelector('[data-v="fav"]').classList.toggle("on", favs.has(p.id));
      viewer.querySelector('[data-v="del"]').style.display = p.sample ? "none" : "";
      requestAnimationFrame(() => requestAnimationFrame(() => { img.style.transition = "transform .25s ease, opacity .25s ease"; img.style.transform = ""; img.style.opacity = "1"; }));
    };
    const go = (d) => { const n = i + d; if (n >= 0 && n < items.length) { i = n; show(d); } };
    viewer._go = go;
    let sx = null;
    const stage = viewer.querySelector(".ph-stage");
    stage.addEventListener("pointerdown", (e) => { sx = e.clientX; });
    stage.addEventListener("pointerup", (e) => { if (sx === null) return; const dx = (e.clientX - sx) / Phone.scale; sx = null; if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1); });
    viewer.addEventListener("click", (e) => {
      const b = e.target.closest("[data-v]"); if (!b) return;
      const p = items[i];
      if (b.dataset.v === "close") closeViewer();
      if (b.dataset.v === "share") toast("Dibagikan");
      if (b.dataset.v === "fav") { favs.has(p.id) ? favs.delete(p.id) : favs.add(p.id); save(); b.classList.toggle("on", favs.has(p.id)); }
      if (b.dataset.v === "del" && confirm("Hapus foto ini?")) { mine = mine.filter((x) => x.id !== p.id); favs.delete(p.id); save(); closeViewer(); }
    });
    show();
  }
  function closeViewer() {
    if (!viewer) return;
    const v = viewer; viewer = null;
    v.classList.remove("open");
    setTimeout(() => v.remove(), 300);
    render();
    Phone.refreshBar();
  }
  document.addEventListener("keydown", (e) => {
    if (!viewer) return;
    if (e.key === "ArrowLeft") viewer._go(-1);
    if (e.key === "ArrowRight") viewer._go(1);
  });

  /* ---------- Tambah foto ---------- */
  function compress(file) {
    return new Promise((res, rej) => {
      const img = new Image(), url = URL.createObjectURL(file);
      img.onload = () => {
        const r = Math.min(1, 1100 / Math.max(img.naturalWidth, img.naturalHeight)), c = document.createElement("canvas");
        c.width = Math.round(img.naturalWidth * r); c.height = Math.round(img.naturalHeight * r);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url); res(c.toDataURL("image/jpeg", 0.78));
      };
      img.onerror = () => { URL.revokeObjectURL(url); rej(); };
      img.src = url;
    });
  }
  $("phInput").addEventListener("change", async (e) => {
    for (const f of [...e.target.files].filter((f) => f.type.startsWith("image/"))) {
      try {
        const src = await compress(f);
        mine.push({ id: "u" + Date.now() + Math.random().toString(36).slice(2, 6), src, date: f.lastModified || Date.now() });
        if (!save()) mine.pop();
      } catch (_) { toast("Gagal membaca " + f.name); }
    }
    e.target.value = "";
    render();
  });

  /* ---------- Event ---------- */
  layer.addEventListener("click", (e) => {
    if (viewer && viewer.contains(e.target)) return;
    const t = e.target.closest("[data-tab]");
    if (t) { tab = t.dataset.tab; album = null; return render(); }
    const m = e.target.closest("[data-mode]");
    if (m) { mode = m.dataset.mode; return render(); }
    const a = e.target.closest("[data-album]");
    if (a) { album = a.dataset.album; tab = "library"; return render(); }
    const act = e.target.closest("[data-act]");
    if (act) { if (act.dataset.act === "add") $("phInput").click(); if (act.dataset.act === "back") { album = null; tab = "collections"; render(); } return; }
    const ti = e.target.closest(".ph-tile");
    if (ti) openViewer(ti.dataset.id);
  });

  Phone.registerApp({
    id: "photos",
    name: "Photos",
    icon: '<svg viewBox="0 0 48 48" width="49" height="49" aria-hidden="true"><rect x="5" y="5" width="38" height="38" rx="9" fill="#fff"/><g transform="translate(24 24)"><ellipse cy="-9" rx="5.2" ry="10" fill="#f35a65"/><ellipse cy="-9" rx="5.2" ry="10" fill="#ffb642" transform="rotate(45)"/><ellipse cy="-9" rx="5.2" ry="10" fill="#f5dc45" transform="rotate(90)"/><ellipse cy="-9" rx="5.2" ry="10" fill="#68ce79" transform="rotate(135)"/><ellipse cy="-9" rx="5.2" ry="10" fill="#56c7e9" transform="rotate(180)"/><ellipse cy="-9" rx="5.2" ry="10" fill="#667df0" transform="rotate(225)"/><ellipse cy="-9" rx="5.2" ry="10" fill="#bb78d7" transform="rotate(270)"/><ellipse cy="-9" rx="5.2" ry="10" fill="#f28bbf" transform="rotate(315)"/><circle r="4" fill="#fff"/></g></svg>',
    iconBg: "linear-gradient(145deg,#ffffff,#e7e7ef)",
    layer,
    barOnLight: () => true,
    onOpen() { tab = "library"; album = null; render(); },
    onClose() { if (viewer) { viewer.remove(); viewer = null; } },
    onBack() {
      if (viewer) { closeViewer(); return true; }
      if (album) { album = null; tab = "collections"; render(); return true; }
      return false;
    },
  });
})();
