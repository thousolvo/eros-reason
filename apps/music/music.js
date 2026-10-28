/* =====================================================================
   MUSIC — tampilan ala Apple Music (iOS 26): tab bar mengambang, mini
   player, dan layar Now Playing. Data lagu ada di music.data.js
   ===================================================================== */
(function () {
  const MP_ICON = {
    home: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l9 8h-2.5v9h-5v-6h-3v6h-5v-9H3l9-8z"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3.5" y="3.5" width="7" height="7" rx="1.8"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.8"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.8"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.8"/></svg>',
    radio: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="2.2" fill="currentColor"/><path d="M7.8 7.8a6 6 0 000 8.4M16.2 7.8a6 6 0 010 8.4M4.9 4.9a10 10 0 000 14.2M19.1 4.9a10 10 0 010 14.2"/></svg>',
    library: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h3v16H4zM9 4h3v16H9zM14.2 5.2l2.9-.8 3.4 14.4-2.9.8z"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15a1 1 0 001.5.9l12-7.5a1 1 0 000-1.8l-12-7.5A1 1 0 007 4.5z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="5.5" y="4" width="4.5" height="16" rx="1.4"/><rect x="14" y="4" width="4.5" height="16" rx="1.4"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 5.5v13a1 1 0 001.5.8l9-6.5a1 1 0 000-1.6l-9-6.5A1 1 0 005 5.5zM17 5h2.5v14H17z"/></svg>',
    prev: '<svg viewBox="0 0 24 24" fill="currentColor" style="transform:scaleX(-1)"><path d="M5 5.5v13a1 1 0 001.5.8l9-6.5a1 1 0 000-1.6l-9-6.5A1 1 0 005 5.5zM17 5h2.5v14H17z"/></svg>',
    down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 9l7 7 7-7"/></svg>',
    note: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 17.5V6.2l10-2v11.3a3 3 0 11-2-2.8V8.2l-6 1.2v8.1a3 3 0 11-2-2.8z"/></svg>',
    vol0: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/></svg>',
    vol1: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4zM15 8.5a5 5 0 010 7M17.5 5.5a9 9 0 010 13" stroke="currentColor" stroke-width="2" fill-rule="evenodd" stroke-linecap="round"/></svg>',
    dots: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>',
  };

  const layer = Phone.createLayer("music", `
    <div class="mp-scroll" id="mpScroll">
      <div class="mp-top"><h1 id="mpTitle">Home</h1><div class="mp-user" id="mpUser"></div></div>
      <div id="mpContent"></div>
    </div>
    <div class="mp-mini glass" id="mpMini" style="display:none">
      <div class="mp-mini-art" id="mpMiniArt"></div>
      <div class="mp-mini-txt"><b id="mpMiniTitle"></b><span id="mpMiniArtist"></span></div>
      <button type="button" id="mpMiniPlay"></button>
      <button type="button" id="mpMiniNext"></button>
    </div>
    <div class="mp-bar" id="mpBar">
      <nav class="mp-tabs glass" id="mpTabs"></nav>
      <button class="mp-searchbtn glass" type="button" data-tab="search" id="mpSearchBtn"></button>
    </div>
    <div class="mp-full" id="mpFull">
      <div class="mp-full-bg" id="mpFullBg"></div>
      <button class="mp-full-close" type="button" id="mpFullClose"></button>
      <div class="mp-full-art" id="mpFullArt"></div>
      <div class="mp-full-info"><div><b id="mpFullTitle"></b><span id="mpFullArtist"></span></div></div>
      <div class="mp-seek"><input type="range" id="mpSeek" min="0" max="1000" value="0"><div class="mp-times"><span id="mpCur">0:00</span><span id="mpLeft">-0:00</span></div></div>
      <div class="mp-ctrl"><button type="button" id="mpPrev"></button><button type="button" class="big" id="mpPlay"></button><button type="button" id="mpNext"></button></div>
      <div class="mp-vol"><span id="mpVolLo"></span><input type="range" id="mpVol" min="0" max="100" value="80"><span id="mpVolHi"></span></div>
    </div>`);
  layer.dataset.theme = "light";

  /* ---------- State ---------- */
  const audio = new Audio();
  audio.preload = "none";
  let library = [];          // [{artist, color, songs:[...]}]
  let local = [];            // lagu lokal
  let queue = [], qi = -1;
  let recent = [];
  let tab = "home";
  let fullOpen = false;
  let loaded = false;

  const fmt = (s) => (isFinite(s) ? Math.floor(s / 60) + ":" + pad2(Math.floor(s % 60)) : "0:00");
  const cur = () => queue[qi];

  function cover(song, size) {
    const col = song.color || "#888";
    const inner = song.cover ? `<img src="${esc(song.cover)}" alt="" draggable="false" onerror="this.remove()">` : "";
    return `<div class="mp-cover" style="--c:${col};${size ? `width:${size}px;height:${size}px;` : ""}">${inner}<i>${MP_ICON.note}</i></div>`;
  }

  /* ---------- Ambil lagu dari iTunes ---------- */
  async function fetchArtist(a) {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(a.term)}&media=music&entity=song&attribute=artistTerm&country=${a.country || "US"}&limit=${(a.limit || 8) * 2}`;
    const res = await fetch(url);
    const json = await res.json();
    const seen = new Set();
    const songs = [];
    for (const r of json.results || []) {
      if (!r.previewUrl) continue;
      const key = r.trackName.toLowerCase().replace(/\(.*?\)/g, "").trim();
      if (seen.has(key)) continue;
      seen.add(key);
      songs.push({
        title: r.trackName,
        artist: r.artistName,
        album: r.collectionName,
        src: r.previewUrl,
        cover: (r.artworkUrl100 || "").replace("100x100", "400x400"),
        color: a.color,
        dur: (r.trackTimeMillis || 0) / 1000,
      });
      if (songs.length >= (a.limit || 8)) break;
    }
    return songs;
  }
  async function loadAll() {
    local = MUSIC_LOCAL.map((t) => ({ ...t, color: "#ff375f" }));
    library = MUSIC_ARTISTS.map((a) => ({ artist: a.name, color: a.color, songs: [], state: "loading" }));
    render();
    await Promise.all(
      MUSIC_ARTISTS.map(async (a, i) => {
        try {
          library[i].songs = await fetchArtist(a);
          library[i].state = library[i].songs.length ? "ok" : "empty";
        } catch (e) {
          library[i].state = "error";
        }
        if (Phone.current && Phone.current.id === "music") render();
      }),
    );
    loaded = true;
  }

  /* ---------- Pemutar ---------- */
  function playQueue(list, index) {
    queue = list;
    qi = index;
    const s = cur();
    if (!s || !s.src) return toast("Lagu ini belum punya audio");
    audio.src = s.src;
    audio.play().catch(() => toast("Tidak bisa memutar (cek koneksi internet)"));
    recent = [s, ...recent.filter((x) => x.src !== s.src)].slice(0, 20);
    syncPlayer();
  }
  function step(d) {
    if (!queue.length) return;
    playQueue(queue, (qi + d + queue.length) % queue.length);
  }
  function toggle() {
    if (!cur()) return;
    audio.paused ? audio.play().catch(() => {}) : audio.pause();
  }
  audio.addEventListener("ended", () => step(1));
  audio.addEventListener("error", () => cur() && toast("Gagal memuat audio"));
  audio.addEventListener("play", syncPlayState);
  audio.addEventListener("pause", syncPlayState);
  const fillRange = (el) => el.style.setProperty("--p", (el.value / el.max) * 100 + "%");
  audio.addEventListener("timeupdate", () => {
    const d = audio.duration || cur()?.dur || 0;
    if (!seeking) { $("mpSeek").value = d ? (audio.currentTime / d) * 1000 : 0; fillRange($("mpSeek")); }
    $("mpCur").textContent = fmt(audio.currentTime);
    $("mpLeft").textContent = "-" + fmt(Math.max(0, d - audio.currentTime));
  });
  let seeking = false;
  $("mpSeek").addEventListener("input", (e) => {
    seeking = true;
    const d = audio.duration || cur()?.dur || 0;
    audio.currentTime = (e.target.value / 1000) * d;
    fillRange(e.target);
  });
  $("mpSeek").addEventListener("change", () => (seeking = false));
  $("mpVol").addEventListener("input", (e) => { audio.volume = e.target.value / 100; fillRange(e.target); });
  audio.volume = 0.8;
  fillRange($("mpVol"));

  function syncPlayState() {
    const icon = audio.paused ? MP_ICON.play : MP_ICON.pause;
    $("mpMiniPlay").innerHTML = icon;
    $("mpPlay").innerHTML = icon;
    $("mpFullArt").classList.toggle("playing", !audio.paused);
    layer.querySelectorAll(".mp-song.now").forEach((el) => el.classList.toggle("paused", audio.paused));
  }
  function syncPlayer() {
    const s = cur();
    $("mpMini").style.display = s ? "" : "none";
    if (!s) return;
    $("mpMiniArt").innerHTML = cover(s, 40);
    $("mpMiniTitle").textContent = s.title;
    $("mpMiniArtist").textContent = s.artist;
    $("mpFullArt").innerHTML = cover(s);
    $("mpFullTitle").textContent = s.title;
    $("mpFullArtist").textContent = s.artist;
    $("mpFullBg").style.background = s.cover ? `center/cover url("${s.cover}")` : s.color;
    layer.style.setProperty("--mp-accent", s.color || "#fa2d48");
    syncPlayState();
    layer.querySelectorAll("[data-play]").forEach((el) => el.classList.toggle("now", el.dataset.play === s.src));
  }
  function setFull(open) {
    fullOpen = open;
    $("mpFull").classList.toggle("open", open);
    Phone.refreshBar();
  }

  /* ---------- Halaman ---------- */
  const allSongs = () => [...local, ...library.flatMap((g) => g.songs)];
  const skeleton = () =>
    `<div class="mp-row">${[0, 1, 2].map(() => `<div class="mp-card sk"><div class="mp-cover"></div><b></b><span></span></div>`).join("")}</div>`;

  function sectionHTML(g, gi) {
    let body;
    if (g.state === "loading") body = skeleton();
    else if (g.state === "error") body = `<p class="mp-note">Gagal memuat lagu (butuh internet).</p>`;
    else if (!g.songs.length) body = `<p class="mp-note">Lagu tidak ditemukan.</p>`;
    else
      body = `<div class="mp-row">${g.songs
        .map((s, i) => `<button class="mp-card" type="button" data-q="${gi}:${i}" data-play="${esc(s.src)}">${cover(s)}<b>${esc(s.title)}</b><span>${esc(s.artist)}</span></button>`)
        .join("")}</div>`;
    return `<section class="mp-sec"><h2>${esc(g.artist)}<i>›</i></h2>${body}</section>`;
  }
  function songRow(s, idx, listKey) {
    return `<button class="mp-song" type="button" data-l="${listKey}:${idx}" data-play="${esc(s.src)}">${cover(s, 48)}<div><b>${esc(s.title)}</b><span>${esc(s.artist)}${s.album ? " · " + esc(s.album) : ""}</span></div><em>${MP_ICON.dots}</em></button>`;
  }

  let lists = {};   // dipakai klik: key -> array lagu
  function render() {
    const c = $("mpContent");
    lists = {};
    $("mpTitle").textContent = { home: "Home", new: "New", radio: "Radio", library: "Library", search: "Search" }[tab];
    if (tab === "home") {
      const first = library.find((g) => g.songs.length);
      let html = "";
      if (first) {
        const s = first.songs[0];
        html += `<section class="mp-sec"><h3 class="mp-eyebrow">TOP PICKS FOR YOU</h3><button class="mp-hero" type="button" data-q="${library.indexOf(first)}:0" data-play="${esc(s.src)}" style="--c:${s.color}">${cover(s)}<div><span>Made for you</span><b>${esc(s.artist)}</b><em>${esc(s.title)}</em></div></button></section>`;
      }
      if (local.length) {
        lists.local = local;
        html += `<section class="mp-sec"><h2>Koleksi Saya<i>›</i></h2><div class="mp-row">${local.map((s, i) => `<button class="mp-card" type="button" data-l="local:${i}" data-play="${esc(s.src)}">${cover(s)}<b>${esc(s.title)}</b><span>${esc(s.artist)}</span></button>`).join("")}</div></section>`;
      }
      library.forEach((g, gi) => { lists["q" + gi] = g.songs; html += sectionHTML(g, gi); });
      c.innerHTML = html;
    } else if (tab === "new") {
      const songs = allSongs();
      lists.all = songs;
      c.innerHTML = `<section class="mp-sec"><h2>Latest Songs</h2><div class="mp-gridcards">${songs.map((s, i) => `<button class="mp-card" type="button" data-l="all:${i}" data-play="${esc(s.src)}">${cover(s)}<b>${esc(s.title)}</b><span>${esc(s.artist)}</span></button>`).join("") || '<p class="mp-note">Memuat…</p>'}</div></section>`;
    } else if (tab === "radio") {
      c.innerHTML = library.map((g, i) => `<button class="mp-radio" type="button" data-station="${i}" style="--c:${g.color}"><span>Apple Music Radio</span><b>${esc(g.artist)} Station</b></button>`).join("");
    } else if (tab === "library") {
      lists.recent = recent;
      c.innerHTML = `<section class="mp-sec"><h2>Recently Played</h2>${recent.length ? recent.map((s, i) => songRow(s, i, "recent")).join("") : '<p class="mp-note">Belum ada lagu yang diputar.</p>'}</section>`;
    } else if (tab === "search") {
      c.innerHTML = `<div class="mp-searchbar glass"><span>${MP_ICON.search}</span><input id="mpQuery" placeholder="Artists, Songs, Lyrics, and More" autocomplete="off"></div><div id="mpResults"></div>`;
      $("mpQuery").addEventListener("input", renderResults);
      renderResults();
    }
    syncPlayer();
  }
  function renderResults() {
    const q = ($("mpQuery").value || "").trim().toLowerCase();
    const res = allSongs().filter((s) => !q || (s.title + " " + s.artist + " " + (s.album || "")).toLowerCase().includes(q));
    lists.res = res;
    $("mpResults").innerHTML = res.map((s, i) => songRow(s, i, "res")).join("") || '<p class="mp-note">Tidak ada hasil.</p>';
    syncPlayer();
  }

  /* ---------- Event ---------- */
  $("mpContent").addEventListener("click", (e) => {
    const st = e.target.closest("[data-station]");
    if (st) { const g = library[+st.dataset.station]; if (g.songs.length) playQueue(g.songs, 0); return; }
    const q = e.target.closest("[data-q]");
    if (q) { const [g, i] = q.dataset.q.split(":").map(Number); return playQueue(library[g].songs, i); }
    const l = e.target.closest("[data-l]");
    if (l) { const [k, i] = l.dataset.l.split(":"); return playQueue(lists[k], +i); }
  });
  const TABS = [["home", "Home", MP_ICON.home], ["new", "New", MP_ICON.grid], ["radio", "Radio", MP_ICON.radio], ["library", "Library", MP_ICON.library]];
  $("mpTabs").innerHTML = TABS.map((t) => `<button type="button" data-tab="${t[0]}">${t[2]}<span>${t[1]}</span></button>`).join("");
  $("mpSearchBtn").innerHTML = MP_ICON.search;
  function setTab(t) {
    tab = t;
    layer.querySelectorAll("[data-tab]").forEach((b) => b.classList.toggle("on", b.dataset.tab === t));
    $("mpScroll").scrollTop = 0;
    render();
  }
  $("mpBar").addEventListener("click", (e) => { const b = e.target.closest("[data-tab]"); if (b) setTab(b.dataset.tab); });

  $("mpMiniPlay").addEventListener("click", (e) => { e.stopPropagation(); toggle(); });
  $("mpMiniNext").addEventListener("click", (e) => { e.stopPropagation(); step(1); });
  $("mpMiniNext").innerHTML = MP_ICON.next;
  $("mpMini").addEventListener("click", () => cur() && setFull(true));
  $("mpFullClose").innerHTML = MP_ICON.down;
  $("mpFullClose").addEventListener("click", () => setFull(false));
  $("mpPlay").addEventListener("click", toggle);
  $("mpPrev").innerHTML = MP_ICON.prev;
  $("mpNext").innerHTML = MP_ICON.next;
  $("mpPrev").addEventListener("click", () => (audio.currentTime > 3 ? (audio.currentTime = 0) : step(-1)));
  $("mpNext").addEventListener("click", () => step(1));
  $("mpVolLo").innerHTML = MP_ICON.vol0;
  $("mpVolHi").innerHTML = MP_ICON.vol1;
  $("mpUser").innerHTML = avatar({ name: MUSIC_USER.name, avatar: MUSIC_USER.avatar, color: "#8e8e93" }, 34);

  /* ---------- Daftarkan ke HP ---------- */
  Phone.registerApp({
    id: "music",
    name: "Music",
    icon: iconImg(APP_ICON.music),
    iconBg: "transparent",
    layer,
    barOnLight: () => layer.dataset.theme === "light" && !fullOpen,
    onOpen() {
      setTab(tab);
      if (!loaded && !library.length) loadAll();
    },
    onClose() { fullOpen = false; $("mpFull").classList.remove("open"); },
    onBack() { if (fullOpen) { setFull(false); return true; } return false; },
    toggleTheme() { layer.dataset.theme = layer.dataset.theme === "light" ? "dark" : "light"; },
    themeLabel: () => "Tema: " + (layer.dataset.theme === "light" ? "terang" : "gelap"),
  });
  syncPlayState();
})();
