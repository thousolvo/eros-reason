/* =====================================================================
   INSTAGRAM — tampilan iOS 26: tab bar kaca mengambang + tombol search
   terpisah. Data ada di instagram.data.js
   Tab: Home · Reels · DM · Profile  (+ Search)
   ===================================================================== */
(function () {
  const I = {
    home: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.6l9 6.7V21a1 1 0 01-1 1h-5.5v-7h-5v7H4a1 1 0 01-1-1V9.3l9-6.7z"/></svg>',
    reels: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="5"/><path d="M3 8.5h18M8.5 3l3 5.5M14 3l3 5.5"/><path d="M10.5 12.5v5l4.5-2.5z" fill="currentColor"/></svg>',
    dm: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="M21 3L10 14M21 3l-7 18-4-7-7-4 18-7z"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 20.5s-8-4.9-8-11A4.5 4.5 0 0112 7a4.5 4.5 0 018 2.5c0 6.1-8 11-8 11z"/></svg>',
    comment: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M20.5 12a8.5 8.5 0 01-12.2 7.6L3.5 20.5l1-4.5A8.5 8.5 0 1120.5 12z"/></svg>',
    save: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M6 3h12v18l-6-4.5L6 21V3z"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4l-8 8 8 8"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3.5" y="3.5" width="7" height="7"/><rect x="13.5" y="3.5" width="7" height="7"/><rect x="3.5" y="13.5" width="7" height="7"/><rect x="13.5" y="13.5" width="7" height="7"/></svg>',
    tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="3"/><circle cx="12" cy="10" r="3"/><path d="M6.5 19c1-3 3-4.5 5.5-4.5s4.5 1.5 5.5 4.5"/></svg>',
    dots: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>',
  };

  const layer = Phone.createLayer("ig", `
    <div class="ig-scroll" id="igScroll"></div>
    <div class="ig-bar" id="igBar">
      <nav class="ig-tabs ig-glass" id="igTabs"></nav>
      <button class="ig-searchbtn ig-glass" type="button" data-tab="search" id="igSearchBtn"></button>
    </div>
    <div class="ig-sheet" id="igSheet"></div>`);
  layer.dataset.theme = "light";

  let tab = "home";
  const P = IG_PROFILE;
  const STORE = "eros_ig_profile_v1";
  try {                       // profil yang diedit lewat "Edit profile" tersimpan di browser
    const saved = JSON.parse(localStorage.getItem(STORE) || "null");
    if (saved) Object.assign(P, saved);
  } catch (_) {}
  const liked = new Set();

  const pic = (o, size) => avatar({ name: o.name || o.user || "?", avatar: o.avatar, color: o.color }, size);
  const thumb = (g) => `<div class="ig-img" style="background:${g.image ? `center/cover url('${esc(g.image)}')` : `linear-gradient(135deg, ${g.color}, #222)`}"></div>`;

  /* ---------- Beranda ---------- */
  function homeHTML() {
    const me = { name: P.name, avatar: P.avatar, color: "#8e8e93" };
    const stories = [`<button class="ig-story" type="button" data-open="profile"><span class="ig-ring me">${pic(me, 62)}<i>${I.plus}</i></span><em>Your story</em></button>`]
      .concat(IG_STORIES.map((s) => `<button class="ig-story" type="button"><span class="ig-ring">${pic(s, 62)}</span><em>${esc(s.name)}</em></button>`)).join("");
    const posts = IG_POSTS.map((p, i) => `
      <article class="ig-post">
        <header><button type="button" data-open="profile" class="ig-av">${pic({ name: p.user, avatar: p.avatar }, 34)}</button><b>${esc(p.user)}</b><span class="ig-more">${I.dots}</span></header>
        <div class="ig-photo" data-like="${i}" style="background:${p.image ? `center/cover url('${esc(p.image)}')` : `linear-gradient(135deg, ${p.color}, #1d1342)`}"><svg class="burst" viewBox="0 0 24 24" fill="#fff"><path d="M12 20.5s-8-4.9-8-11A4.5 4.5 0 0112 7a4.5 4.5 0 018 2.5c0 6.1-8 11-8 11z"/></svg></div>
        <div class="ig-actions"><button type="button" data-like="${i}" class="lk ${liked.has(i) ? "on" : ""}">${I.heart}</button><button type="button">${I.comment}</button><button type="button">${I.dm}</button><button type="button" class="sv">${I.save}</button></div>
        <div class="ig-likes">${(p.likes + (liked.has(i) ? 1 : 0)).toLocaleString("id-ID")} suka</div>
        <div class="ig-cap"><b>${esc(p.user)}</b> ${esc(p.caption)}</div>
        <div class="ig-time">${esc(p.time)}</div>
      </article>`).join("");
    return `<div class="ig-top"><button type="button" class="ig-plus ig-glass">${I.plus}</button><div class="ig-logo">Instagram</div><button type="button" class="ig-plus ig-glass">${I.heart}</button></div>
      <div class="ig-stories">${stories}</div>${posts}`;
  }

  /* ---------- Reels ---------- */
  const reelsHTML = () => `<div class="ig-reels">${IG_REELS.map((r) => `
    <section class="ig-reel" style="background:linear-gradient(180deg, ${r.color}, #000)">
      <div class="ig-reel-side"><button type="button">${I.heart}<span>12K</span></button><button type="button">${I.comment}<span>340</span></button><button type="button">${I.dm}</button></div>
      <div class="ig-reel-info"><b>@${esc(r.user)}</b><span>${esc(r.caption)}</span></div>
    </section>`).join("")}</div>`;

  /* ---------- DM ---------- */
  const dmHTML = () => `<div class="ig-top"><div class="ig-title">${esc(P.username)}</div></div>
    <div class="ig-dmsearch">${I.search}<span>Search</span></div>
    ${IG_DMS.map((d) => `<div class="ig-dm">${pic(d, 54)}<div><b>${esc(d.name)}</b><span class="${d.unread ? "u" : ""}">${esc(d.last)} · ${esc(d.time)}</span></div>${d.unread ? "<i></i>" : ""}</div>`).join("")}`;

  /* ---------- Search / Explore ---------- */
  const searchHTML = () => `<div class="ig-top"><div class="ig-searchfield ig-glass">${I.search}<input placeholder="Search" autocomplete="off"></div></div>
    <div class="ig-explore">${[...P.grid, ...P.grid].map((g) => thumb(g)).join("")}</div>`;

  /* ---------- Profil ---------- */
  function profileHTML() {
    const num = (n) => (n >= 10000 ? (n / 1000).toFixed(1).replace(".0", "") + "K" : n.toLocaleString("id-ID"));
    return `<div class="ig-top ig-ptop"><button type="button" class="ig-back ig-glass" data-open="home">${I.back}</button><div class="ig-title">${esc(P.username)}${P.verified ? '<svg class="vf" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#0095f6"/><path d="M7 12.5l3.2 3L17 9" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ""}</div><button type="button" class="ig-back ig-glass">${I.menu}</button></div>
      <div class="ig-phead">
        <span class="ig-ring me big">${pic({ name: P.name, avatar: P.avatar, color: "#8e8e93" }, 86)}</span>
        <div class="ig-stats"><div><b>${num(P.posts)}</b><span>posts</span></div><div><b>${num(P.followers)}</b><span>followers</span></div><div><b>${num(P.following)}</b><span>following</span></div></div>
      </div>
      <div class="ig-bio"><b>${esc(P.name)}</b><p>${esc(P.bio).replace(/\n/g, "<br>")}</p>${P.link ? `<a>${esc(P.link)}</a>` : ""}</div>
      <div class="ig-pbtns"><button type="button" id="igEdit">Edit profile</button><button type="button" id="igShare">Share profile</button></div>
      <div class="ig-hl">${P.highlights.map((h) => `<div><span style="background:linear-gradient(135deg, ${h.color}, #333)"></span><em>${esc(h.title)}</em></div>`).join("")}</div>
      <div class="ig-ptabs"><span class="on">${I.grid}</span><span>${I.reels}</span><span>${I.tag}</span></div>
      <div class="ig-pgrid">${P.grid.map((g) => thumb(g)).join("")}</div>`;
  }

  /* ---------- Edit profile (sheet) ---------- */
  function openEdit() {
    const sh = $("igSheet");
    sh.innerHTML = `<div class="ig-sheet-in"><header><button type="button" id="igCancel">Cancel</button><b>Edit profile</b><button type="button" id="igDone" class="blue">Done</button></header>
      <label>Name<input id="igName" value="${esc(P.name)}"></label>
      <label>Username<input id="igUser" value="${esc(P.username)}"></label>
      <label>Bio<textarea id="igBio" rows="3">${esc(P.bio)}</textarea></label>
      <label>Link<input id="igLink" value="${esc(P.link)}"></label>
      <label>Posts / Followers / Following<span class="trio"><input id="igPosts" value="${P.posts}"><input id="igFol" value="${P.followers}"><input id="igFing" value="${P.following}"></span></label>
      <p class="hint">Untuk mengubah isi profil secara permanen, edit <code>IG_PROFILE</code> di <code>apps/instagram/instagram.data.js</code>.</p></div>`;
    sh.classList.add("open");
    $("igCancel").onclick = () => sh.classList.remove("open");
    $("igDone").onclick = () => {
      P.name = $("igName").value.trim() || P.name;
      P.username = $("igUser").value.trim() || P.username;
      P.bio = $("igBio").value;
      P.link = $("igLink").value.trim();
      P.posts = +$("igPosts").value || 0;
      P.followers = +$("igFol").value || 0;
      P.following = +$("igFing").value || 0;
      try { localStorage.setItem(STORE, JSON.stringify({ name: P.name, username: P.username, bio: P.bio, link: P.link, posts: P.posts, followers: P.followers, following: P.following })); } catch (_) {}
      sh.classList.remove("open");
      render();
    };
  }

  /* ---------- Render & navigasi ---------- */
  const TABS = [["home", I.home], ["reels", I.reels], ["dm", I.dm], ["profile", null]];
  function renderTabs() {
    $("igTabs").innerHTML = TABS.map(([id, icon]) =>
      `<button type="button" data-tab="${id}" class="${tab === id ? "on" : ""}">${id === "profile" ? `<span class="ig-tabav">${pic({ name: P.name, avatar: P.avatar, color: "#8e8e93" }, 26)}</span>` : icon}</button>`).join("");
    $("igSearchBtn").innerHTML = I.search;
    $("igSearchBtn").classList.toggle("on", tab === "search");
  }
  function render() {
    const html = { home: homeHTML, reels: reelsHTML, dm: dmHTML, search: searchHTML, profile: profileHTML }[tab]();
    const sc = $("igScroll");
    sc.innerHTML = html;
    sc.classList.toggle("dark", tab === "reels");
    layer.classList.toggle("reels-on", tab === "reels");
    renderTabs();
    Phone.refreshBar();
    if ($("igEdit")) {
      $("igEdit").onclick = openEdit;
      $("igShare").onclick = () => toast("Link profil disalin: instagram.com/" + P.username);
    }
  }
  function go(t) { tab = t; $("igScroll").scrollTop = 0; render(); }

  layer.addEventListener("click", (e) => {
    const t = e.target.closest("[data-tab]");
    if (t) return go(t.dataset.tab);
    const o = e.target.closest("[data-open]");
    if (o) return go(o.dataset.open);
    const l = e.target.closest("[data-like]");
    if (l) {
      const i = +l.dataset.like;
      if (l.classList.contains("ig-photo")) { liked.add(i); l.classList.add("pop"); setTimeout(() => render(), 350); }
      else { liked.has(i) ? liked.delete(i) : liked.add(i); const y = $("igScroll").scrollTop; render(); $("igScroll").scrollTop = y; }
    }
  });

  /* ---------- Daftarkan ke HP ---------- */
  Phone.registerApp({
    id: "instagram",
    name: "Instagram",
    icon: iconImg(APP_ICON.instagram),
    iconBg: "transparent",
    layer,
    barOnLight: () => layer.dataset.theme === "light" && tab !== "reels",
    onOpen() { tab = "home"; render(); },
    onBack() {
      if ($("igSheet").classList.contains("open")) { $("igSheet").classList.remove("open"); return true; }
      if (tab !== "home") { go("home"); return true; }
      return false;
    },
    toggleTheme() { layer.dataset.theme = layer.dataset.theme === "light" ? "dark" : "light"; },
    themeLabel: () => "Tema: " + (layer.dataset.theme === "light" ? "terang" : "gelap"),
  });
})();
