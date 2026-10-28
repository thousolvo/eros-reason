/* =====================================================================
   WHATSAPP — layar & logika aplikasi (data chat ada di whatsapp.data.js)
   ===================================================================== */
(function () {
  const WA_THEME = "light"; // tema awal: "light" atau "dark"

  const wa = Phone.createLayer("wa", `
<section class="page" id="chatsPage">
  <div class="fade-top"></div>
  <div class="topbtns">
    <button class="glass circ" type="button" id="moreBtn"></button>
    <div class="glass pill">
      <button class="circ" type="button" id="camTop"></button>
      <button class="circ plus-green" type="button" id="plusTop"></button>
    </div>
  </div>
  <div class="scroller" id="scroller">
    <div class="big-title" id="bigTitle">Chats</div>
    <div id="chatsContent">
      <div class="searchbar"><span id="searchIcon"></span><input id="searchInput" type="text" placeholder="Ask Meta AI or Search"></div>
      <div class="chips" id="chips"></div>
      <div id="rows"></div>
    </div>
    <div class="empty" id="placeholder" style="display:none"></div>
  </div>
  <nav class="tabbar glass" id="tabbar"></nav>
</section>

<section class="page" id="chatPage">
  <div class="chatbg"></div>
  <div class="msgs" id="msgs"></div>
  <div class="chathead">
    <button class="glass pill back" type="button" id="backBtn"><span id="backIcon"></span><span class="bc" id="backCount" style="display:none"></span></button>
    <div class="glass pill titlepill"><span id="headAv"></span><div class="ttl"><span class="nm" id="headName"></span><span class="st" id="headStatus"></span></div></div>
    <div class="glass pill callpill"><button type="button" id="vidBtn"></button><button type="button" id="callBtn"></button></div>
  </div>
  <div class="inputbar" id="inputbar">
    <button class="glass circ" type="button" id="attachBtn"></button>
    <div class="glass field"><input id="msgInput" type="text" placeholder="Message" autocomplete="off"><span id="stickerIcon"></span></div>
    <button class="glass circ cam" type="button" id="camBtn"></button>
    <button class="glass circ mic" type="button" id="micBtn"></button>
    <button class="circ sendbtn" type="button" id="sendBtn"></button>
  </div>
</section>`);
  wa.dataset.theme = WA_THEME;

  const lastMsg = (p) => [...p.messages].reverse().find((m) => !m.day);
  const totalUnread = () => PROFILES.reduce((a, p) => a + (p.unread || 0), 0);

  /* ====
     DAFTAR CHAT
     ========================================================== */
  let filter = "all",
    query = "",
    activeTab = "chats",
    cur = null;
  const FILTERS = [
    ["all", "All"],
    ["unread", "Unread"],
    ["fav", "Favorites"],
    ["groups", "Groups"],
  ];

  function renderChips() {
    $("#chips").innerHTML = FILTERS.map(
      (f) =>
        '<button class="chip ' +
        (filter === f[0] ? "on" : "") +
        '" data-f="' +
        f[0] +
        '" type="button">' +
        f[1] +
        "</button>",
    ).join("");
  }
  function preview(p) {
    const m = lastMsg(p);
    if (!m) return "";
    let t;
    if (m.type === "image") t = ICON.image + "<span>" + esc(m.caption || "Photo") + "</span>";
    else if (m.type === "voice") t = ICON.mic + "<span>" + esc(m.dur) + "</span>";
    else t = "<span>" + esc(m.text) + "</span>";
    if (p.group && m.from === "them" && m.sender) t = "<b>" + esc(m.sender) + ":</b>" + t;
    return (m.from === "me" ? tick(m.status || "read") : "") + t;
  }
  function renderList() {
    const rows = PROFILES.map((p, i) => ({ p, i }))
      .filter(({ p }) => {
        if (filter === "unread" && !p.unread) return false;
        if (filter === "fav" && !p.favorite) return false;
        if (filter === "groups" && !p.group) return false;
        if (query) {
          const m = lastMsg(p);
          if (!(p.name.toLowerCase().includes(query) || (m && m.text && m.text.toLowerCase().includes(query))))
            return false;
        }
        return true;
      })
      .sort((a, b) => (b.p.pinned ? 1 : 0) - (a.p.pinned ? 1 : 0));

    $("#rows").innerHTML = rows.length
      ? rows
          .map(({ p, i }) => {
            const m = lastMsg(p),
              t = p.listTime || (m ? m.time : "");
            return (
              '<div class="crow" data-i="' +
              i +
              '">' +
              avatar(p, 54, i) +
              '<div class="mid"><div class="top"><span class="name">' +
              esc(p.name) +
              '</span><span class="time ' +
              (p.unread ? "u" : "") +
              '">' +
              esc(t) +
              "</span></div>" +
              '<div class="bot"><span class="prev">' +
              preview(p) +
              '</span><span class="badges">' +
              (p.muted ? ICON.mute : "") +
              (p.pinned && !p.unread ? ICON.pin : "") +
              (p.unread ? '<span class="unread ' + (p.muted ? "muted" : "") + '">' + p.unread + "</span>" : "") +
              "</span></div></div></div>"
            );
          })
          .join("")
      : '<div class="empty">Tidak ada chat yang sesuai.</div>';

    const n = totalUnread(),
      badge = wa.querySelector('.tab[data-t="chats"] .count');
    if (badge) {
      badge.textContent = n;
      badge.style.display = n ? "grid" : "none";
    }
  }
  $("#chips").addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (b) {
      filter = b.dataset.f;
      renderChips();
      renderList();
    }
  });
  $("#searchInput").addEventListener("input", (e) => {
    query = e.target.value.trim().toLowerCase();
    renderList();
  });
  $("#rows").addEventListener("click", (e) => {
    const r = e.target.closest(".crow");
    if (r) openChat(+r.dataset.i);
  });

  /* ==========================================================
     TAB BAR
     ========================================================== */
  const TABS = [
    ["updates", "Updates", ICON.updates],
    ["calls", "Calls", ICON.phone],
    ["communities", "Communities", ICON.comm],
    ["chats", "Chats", ICON.chats],
    ["settings", "Settings", ICON.gear],
  ];
  $("#tabbar").innerHTML = TABS.map(
    (t) =>
      '<button class="tab ' +
      (t[0] === "chats" ? "on" : "") +
      '" data-t="' +
      t[0] +
      '" type="button">' +
      t[2] +
      "<span>" +
      t[1] +
      "</span>" +
      (t[0] === "chats" ? '<span class="count"></span>' : "") +
      "</button>",
  ).join("");
  $("#tabbar").addEventListener("click", (e) => {
    const b = e.target.closest(".tab");
    if (!b) return;
    activeTab = b.dataset.t;
    wa.querySelectorAll(".tab").forEach((x) => x.classList.toggle("on", x === b));
    const isChats = activeTab === "chats",
      name = TABS.find((t) => t[0] === activeTab)[1];
    $("#bigTitle").textContent = name;
    $("#chatsContent").style.display = isChats ? "" : "none";
    $("#placeholder").style.display = isChats ? "none" : "";
    $("#placeholder").innerHTML =
      "Halaman <b>" + name + "</b> adalah tampilan contoh.<br>Tambahkan isinya sesuai kebutuhan.";
    $("#scroller").scrollTop = 0;
  });

  /* ==========================================================
     HALAMAN CHAT
     ========================================================== */
  function waveform(seed) {
    let h = "";
    for (let i = 0; i < 30; i++) {
      const v = 4 + Math.abs(Math.sin((i + 1) * ((seed % 7) + 1.3)) * 22 * Math.cos(i * 0.35));
      h += '<i style="height:' + Math.min(26, v).toFixed(0) + 'px"></i>';
    }
    return h;
  }
  function bubble(m, p, first) {
    const out = m.from === "me",
      st = m.status || "read";
    const metaInline = '<span class="meta">' + esc(m.time) + (out ? tick(st) : "") + "</span>";
    const metaBlock = '<span class="meta block">' + esc(m.time) + (out ? tick(st) : "") + "</span>";
    let inner = "",
      cls = "msg " + (out ? "out" : "in") + (first ? " first" : "");

    if (p.group && !out && first && m.sender)
      inner +=
        '<div class="sender" style="color:' + COLORS[hash(m.sender) % COLORS.length] + '">' + esc(m.sender) + "</div>";
    if (m.reply)
      inner += '<div class="reply"><b>' + esc(m.reply.name) + "</b><span>" + esc(m.reply.text) + "</span></div>";

    if (m.type === "image") {
      cls += " hasimg";
      inner +=
        '<div class="imgbox">' +
        (m.src ? '<img src="' + esc(m.src) + '" alt="" onerror="this.remove()">' : ICON.image) +
        "</div>";
      if (m.caption) inner += '<div class="cap">' + esc(m.caption) + "</div>";
      inner += metaBlock;
    } else if (m.type === "voice") {
      inner +=
        '<div class="voice"><span class="play">' +
        ICON.play +
        '</span><div class="wave">' +
        waveform(hash(m.dur + m.time)) +
        '</div></div><div class="dur">' +
        esc(m.dur) +
        "</div>" +
        metaBlock;
    } else {
      inner += esc(m.text).replace(/\n/g, "<br>") + metaInline;
    }
    return '<div class="' + cls + '">' + inner + "</div>";
  }
  function renderMessages() {
    const p = PROFILES[cur];
    let prev = null,
      html = "";
    p.messages.forEach((m) => {
      if (m.day) {
        html += '<div class="day">' + esc(m.day) + "</div>";
        prev = null;
        return;
      }
      html += bubble(m, p, prev !== m.from + (m.sender || ""));
      prev = m.from + (m.sender || "");
    });
    const box = $("#msgs");
    box.innerHTML = html;
    box.scrollTop = box.scrollHeight;
  }
  function openChat(i) {
    cur = i;
    const p = PROFILES[i];
    p.unread = 0;
    $("#headAv").innerHTML = avatar(p, 34, i);
    $("#headName").textContent = p.name;
    $("#headStatus").textContent = p.status || "";
    const others = totalUnread(),
      bc = $("#backCount");
    bc.style.display = others ? "grid" : "none";
    bc.textContent = others;
    renderMessages();
    renderList();
    $("#chatPage").classList.add("open");
  }
  function closeChat() {
    $("#chatPage").classList.remove("open");
    cur = null;
    $("#msgInput").blur();
  }
  $("#backBtn").addEventListener("click", closeChat);

  /* Kirim pesan */
  const input = $("#msgInput");
  function syncTyping() {
    $("#inputbar").classList.toggle("typing", input.value.trim().length > 0);
  }
  function send() {
    const v = input.value.trim();
    if (!v || cur === null) return;
    const p = PROFILES[cur],
      m = { from: "me", type: "text", text: v, time: nowTime(), status: "sent" };
    p.messages.push(m);
    input.value = "";
    syncTyping();
    renderMessages();
    renderList();
    setTimeout(() => {
      m.status = "delivered";
      if (cur !== null && PROFILES[cur] === p) renderMessages();
    }, 700);
    setTimeout(() => {
      m.status = "read";
      if (cur !== null && PROFILES[cur] === p) renderMessages();
      renderList();
    }, 1600);
  }
  input.addEventListener("input", syncTyping);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") send();
  });
  $("#sendBtn").addEventListener("click", send);

  /* ==========================================================
     ISI IKON & INISIALISASI
     ========================================================== */
  $("#moreBtn").innerHTML = ICON.more;
  $("#camTop").innerHTML = ICON.camera;
  $("#plusTop").innerHTML = ICON.plus;
  $("#searchIcon").innerHTML = ICON.search;
  $("#backIcon").innerHTML = ICON.back;
  $("#vidBtn").innerHTML = ICON.video;
  $("#callBtn").innerHTML = ICON.phone;
  $("#attachBtn").innerHTML = ICON.plus;
  $("#stickerIcon").innerHTML = ICON.sticker;
  $("#camBtn").innerHTML = ICON.camera;
  $("#micBtn").innerHTML = ICON.mic;
  $("#sendBtn").innerHTML = ICON.send;

  renderChips();
  renderList();

  /* ---------- Daftarkan ke HP ---------- */
  Phone.registerApp({
    id: "whatsapp",
    name: "WhatsApp",
    icon: '<svg viewBox="0 0 48 48" width="49" height="49" aria-hidden="true"><circle cx="24" cy="23" r="19" fill="#fff"/><path d="M11 35l-2 8 9-4" fill="#fff"/><path d="M17 14c-2 2-2 5 1 9 3 5 8 9 13 10 3 0 5-2 6-5l-7-4-3 3c-4-2-6-5-8-8l2-3z" fill="#24c45a"/></svg>',
    iconBg: "linear-gradient(155deg,#63f58b,#04a842)",
    layer: wa,
    barOnLight: () => wa.dataset.theme === "light",
    onClose: closeChat,
    onBack() {
      if (cur !== null) { closeChat(); return true; }
      return false;
    },
    toggleTheme() { wa.dataset.theme = wa.dataset.theme === "light" ? "dark" : "light"; },
    themeLabel: () => "Tema: " + (wa.dataset.theme === "light" ? "terang" : "gelap"),
  });
})();
