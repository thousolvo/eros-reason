/* =====================================================================
   X (Twitter) — tampilan mirip aplikasi aslinya + tab bar kaca iOS 26
   Data akun & tweet ada di x.data.js
   Ketuk avatar/nama siapa pun -> halaman profil. Profil sendiri bisa diedit.
   ===================================================================== */
(function () {
  const XI = {
    logo: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1.7l9.5 6.3v13.2a1 1 0 01-1 1h-6v-7.5h-5v7.5h-6a1 1 0 01-1-1V8L12 1.7z"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>',
    grok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M8 16L16 8"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 22a2.4 2.4 0 002.4-2.4H9.6A2.4 2.4 0 0012 22zm7-5.5v-5.3a7 7 0 00-5.2-6.8V4a1.8 1.8 0 10-3.6 0v.4A7 7 0 005 11.2v5.3l-2 2v1h18v-1z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7l8.5 6 8.500-6"/></svg>',
    reply: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M20.5 11.5a8 8 0 01-11.600 7.100L4 20l1.300-4.200A8 8 0 1120.500 11.500z"/></svg>',
    repost: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11V9a3 3 0 013-3h11M15 3l3 3-3 3M20 13v2a3 3 0 01-3 3H6M9 21l-3-3 3-3"/></svg>',
    like: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M12 20.5s-8-4.9-8-11A4.5 4.5 0 0112 7a4.5 4.5 0 018 2.500c0 6.100-8 11-8 11z"/></svg>',
    views: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 20V11M12 20V4M19 20v-6"/></svg>',
    save: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M6 3.500h12v17l-6-4.500-6 4.500v-17z"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3M8 7l4-4 4 4M5 12v7a1 1 0 001 1h12a1 1 0 001-1v-7"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4l-8 8 8 8"/></svg>',
    badge: '<svg class="xv" viewBox="0 0 22 22"><path fill="#1d9bf0" d="M20.4 11l1.400-1.900-.600-2.300-2.300-.700-.900-2.200-2.400.200L13.900 2.300 11.700 3.300 9.500 2.300 8.200 4.200 5.800 4l-.900 2.200-2.300.700-.600 2.300L3.400 11l-1.400 1.900.600 2.300 2.300.700.900 2.200 2.400-.200 1.300 1.900 2.200-1 2.200 1 1.300-1.900 2.400.200.900-2.200 2.300-.700.600-2.300z"/><path d="M7.500 11.200l2.500 2.500 4.500-5" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    compose: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  };

  const layer = Phone.createLayer("x", `
    <div class="x-scroll" id="xScroll"></div>
    <div class="x-head x-glass" id="xHead"></div>
    <button class="x-fab" type="button" id="xFab"></button>
    <div class="x-bar x-glass" id="xBar"></div>
    <div class="x-profile" id="xProfile"></div>
    <div class="x-sheet" id="xSheet"></div>`);
  layer.dataset.theme = "dark";

  /* ---------- Data & state ---------- */
  const STORE = "eros_x_profile_v1";
  try { Object.assign(X_ME, JSON.parse(localStorage.getItem(STORE) || "null") || {}); } catch (_) {}
  let tab = "home", feed = "foryou", profileHandle = null;
  const liked = new Set(), reposted = new Set();

  const people = () => [X_ME, ...X_PEOPLE];
  const userOf = (h) => people().find((p) => p.handle === h) || { name: h, handle: h };
  const compact = (n) => (n >= 1e6 ? (n / 1e6).toFixed(1).replace(".0", "") + "M" : n >= 1e4 ? Math.round(n / 1000) + "K" : n >= 1000 ? (n / 1000).toFixed(1).replace(".0", "") + "K" : String(n));
  const pic = (u, s) => avatar({ name: u.name, avatar: u.avatar, color: u.bannerColor || "#1d9bf0" }, s);

  /* ---------- Tweet ---------- */
  function tweetHTML(t, i) {
    const u = userOf(t.handle), lk = liked.has(i), rp = reposted.has(i);
    return `<article class="x-tweet">
      <button type="button" class="x-av" data-user="${esc(u.handle)}">${pic(u, 40)}</button>
      <div class="x-body">
        <div class="x-line"><button type="button" data-user="${esc(u.handle)}" class="x-nm"><b>${esc(u.name)}</b>${u.verified ? XI.badge : ""}</button><span class="x-hd">@${esc(u.handle)} · ${esc(t.time)}</span></div>
        <div class="x-text">${esc(t.text)}</div>
        ${t.image ? `<div class="x-media" style="background:linear-gradient(135deg, ${t.image}, #3b3b52)"></div>` : ""}
        <div class="x-acts">
          <span>${XI.reply}${compact(t.replies)}</span>
          <button type="button" class="${rp ? "rp" : ""}" data-rt="${i}">${XI.repost}${compact(t.reposts + (rp ? 1 : 0))}</button>
          <button type="button" class="${lk ? "lk" : ""}" data-lk="${i}">${XI.like}${compact(t.likes + (lk ? 1 : 0))}</button>
          <span>${XI.views}${compact(t.views)}</span>
          <span class="end">${XI.save}${XI.share}</span>
        </div>
      </div></article>`;
  }

  /* ---------- Halaman tab ---------- */
  function homeHTML() {
    const list = X_TWEETS.map((t, i) => ({ t, i })).filter(({ t }) => feed === "foryou" || !t.foryou);
    return `<div class="x-feedtabs"><button type="button" data-feed="foryou" class="${feed === "foryou" ? "on" : ""}"><span>For you</span></button><button type="button" data-feed="following" class="${feed === "following" ? "on" : ""}"><span>Following</span></button></div>${list.map(({ t, i }) => tweetHTML(t, i)).join("")}`;
  }
  const searchHTML = () => `<div class="x-search">${XI.search}<input placeholder="Search" autocomplete="off"></div>
    <h2 class="x-h2">Trends for you</h2>${X_TRENDS.map((t) => `<div class="x-trend"><span>${esc(t[0])}</span><b>${esc(t[1])}</b><span>${esc(t[2])}</span></div>`).join("")}`;
  const notifHTML = () => `<h2 class="x-h2">Notifications</h2>${X_PEOPLE.slice(0, 3).map((p) => `<div class="x-notif"><i>${XI.like}</i><div><button type="button" data-user="${esc(p.handle)}">${pic(p, 32)}</button><p><b>${esc(p.name)}</b> liked your post</p></div></div>`).join("")}`;
  const dmHTML = () => `<h2 class="x-h2">Messages</h2>${X_PEOPLE.slice(0, 3).map((p) => `<div class="x-dm" ><button type="button" data-user="${esc(p.handle)}">${pic(p, 46)}</button><div><b>${esc(p.name)} <span>@${esc(p.handle)}</span></b><p>Tap untuk membuka chat</p></div></div>`).join("")}`;
  const grokHTML = () => `<div class="x-grok">${XI.grok}<h2>Grok</h2><p>Tanya apa saja.</p></div>`;

  /* ---------- Profil ---------- */
  function profileHTML(u) {
    const mine = u.handle === X_ME.handle;
    const tweets = X_TWEETS.map((t, i) => ({ t, i })).filter(({ t }) => t.handle === u.handle);
    return `<div class="x-pbanner" style="background:${u.banner ? `center/cover url('${esc(u.banner)}')` : `linear-gradient(135deg, ${u.bannerColor || "#1d9bf0"}, #0c1b2a)`}">
        <button type="button" class="x-pback x-glass" data-back>${XI.back}</button></div>
      <div class="x-pinfo">
        <div class="x-prow"><span class="x-pav">${pic(u, 84)}</span>${mine ? '<button type="button" class="x-outline" id="xEdit">Edit profile</button>' : '<button type="button" class="x-follow" id="xFollow">Follow</button>'}</div>
        <h2>${esc(u.name)}${u.verified ? XI.badge : ""}</h2>
        <span class="x-handle">@${esc(u.handle)}</span>
        <p class="x-pbio">${esc(u.bio || "")}</p>
        <div class="x-meta">${u.location ? `<span>📍 ${esc(u.location)}</span>` : ""}${u.link ? `<span class="lnk">🔗 ${esc(u.link)}</span>` : ""}<span>📅 ${esc(u.joined || "")}</span></div>
        <div class="x-counts"><span><b>${compact(u.following || 0)}</b> Following</span><span><b>${compact(u.followers || 0)}</b> Followers</span></div>
      </div>
      <div class="x-feedtabs small"><button type="button" class="on"><span>Posts</span></button><button type="button"><span>Replies</span></button><button type="button"><span>Media</span></button><button type="button"><span>Likes</span></button></div>
      ${tweets.length ? tweets.map(({ t, i }) => tweetHTML(t, i)).join("") : '<p class="x-empty">Belum ada postingan.</p>'}`;
  }
  function openProfile(handle) {
    profileHandle = handle;
    const p = $("xProfile");
    p.innerHTML = profileHTML(userOf(handle));
    p.scrollTop = 0;
    p.classList.add("open");
    layer.classList.add("profile-on");
    Phone.refreshBar();
    const ed = $("xEdit"), fl = $("xFollow");
    if (ed) ed.onclick = openEdit;
    if (fl) fl.onclick = () => { const on = fl.classList.toggle("on"); fl.textContent = on ? "Following" : "Follow"; };
  }
  function closeProfile() {
    profileHandle = null;
    $("xProfile").classList.remove("open");
    layer.classList.remove("profile-on");
    Phone.refreshBar();
  }

  /* ---------- Edit profile ---------- */
  function openEdit() {
    const sh = $("xSheet");
    sh.innerHTML = `<div class="x-sheet-in"><header><button type="button" id="xCancel">Cancel</button><b>Edit profile</b><button type="button" id="xSave" class="save">Save</button></header>
      <label>Name<input id="xName" value="${esc(X_ME.name)}"></label>
      <label>Bio<textarea id="xBio" rows="3">${esc(X_ME.bio)}</textarea></label>
      <label>Location<input id="xLoc" value="${esc(X_ME.location)}"></label>
      <label>Website<input id="xLink" value="${esc(X_ME.link)}"></label>
      <p class="hint">Isi permanen ada di <code>X_ME</code> pada <code>apps/x/x.data.js</code>.</p></div>`;
    sh.classList.add("open");
    $("xCancel").onclick = () => sh.classList.remove("open");
    $("xSave").onclick = () => {
      X_ME.name = $("xName").value.trim() || X_ME.name;
      X_ME.bio = $("xBio").value;
      X_ME.location = $("xLoc").value.trim();
      X_ME.link = $("xLink").value.trim();
      try { localStorage.setItem(STORE, JSON.stringify({ name: X_ME.name, bio: X_ME.bio, location: X_ME.location, link: X_ME.link })); } catch (_) {}
      sh.classList.remove("open");
      render();
      openProfile(X_ME.handle);
    };
  }

  /* ---------- Render ---------- */
  const TABS = [["home", XI.home], ["search", XI.search], ["grok", XI.grok], ["notif", XI.bell], ["dm", XI.mail]];
  function render() {
    const html = { home: homeHTML, search: searchHTML, grok: grokHTML, notif: notifHTML, dm: dmHTML }[tab]();
    $("xScroll").innerHTML = html;
    $("xHead").innerHTML = `<button type="button" data-user="${esc(X_ME.handle)}" class="x-me">${pic(X_ME, 32)}</button><div class="x-logo">${XI.logo}</div><span class="x-gap"></span>`;
    $("xBar").innerHTML = TABS.map(([id, ic]) => `<button type="button" data-tab="${id}" class="${tab === id ? "on" : ""}">${ic}</button>`).join("");
    $("xFab").innerHTML = XI.compose;
    $("xFab").style.display = tab === "home" ? "" : "none";
  }

  layer.addEventListener("click", (e) => {
    const t = e.target.closest("[data-tab]");
    if (t) { tab = t.dataset.tab; $("xScroll").scrollTop = 0; closeProfile(); return render(); }
    const f = e.target.closest("[data-feed]");
    if (f) { feed = f.dataset.feed; return render(); }
    const u = e.target.closest("[data-user]");
    if (u) return openProfile(u.dataset.user);
    if (e.target.closest("[data-back]")) return closeProfile();
    const lk = e.target.closest("[data-lk]");
    const rt = e.target.closest("[data-rt]");
    if (lk || rt) {
      const set = lk ? liked : reposted, i = +(lk || rt).dataset[lk ? "lk" : "rt"];
      set.has(i) ? set.delete(i) : set.add(i);
      const y = $("xScroll").scrollTop, py = $("xProfile").scrollTop;
      render();
      if (profileHandle) { $("xProfile").innerHTML = profileHTML(userOf(profileHandle)); $("xProfile").scrollTop = py; const ed = $("xEdit"); if (ed) ed.onclick = openEdit; }
      $("xScroll").scrollTop = y;
    }
  });
  $("xFab").addEventListener("click", () => toast("Compose belum tersedia di simulator"));

  /* ---------- Daftarkan ke HP ---------- */
  Phone.registerApp({
    id: "x",
    name: "X",
    icon: XI.logo.replace("<svg ", '<svg width="30" height="30" style="color:#fff" '),
    iconBg: "#000",
    layer,
    barOnLight: () => layer.dataset.theme === "light",
    onOpen() { tab = "home"; closeProfile(); $("xSheet").classList.remove("open"); render(); },
    onBack() {
      if ($("xSheet").classList.contains("open")) { $("xSheet").classList.remove("open"); return true; }
      if (profileHandle) { closeProfile(); return true; }
      if (tab !== "home") { tab = "home"; render(); return true; }
      return false;
    },
    toggleTheme() { layer.dataset.theme = layer.dataset.theme === "light" ? "dark" : "light"; },
    themeLabel: () => "Tema: " + (layer.dataset.theme === "light" ? "terang" : "gelap"),
  });
})();
