/* =====================================================================
   MESSAGES — gaya iOS 26: daftar percakapan, chat dengan gelembung
   biru/hijau, header & input kaca. Data ada di messages.data.js
   ===================================================================== */
(function () {
  const M = {
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4l-8 8 8 8"/></svg>',
    compose: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5H6.5A2.5 2.5 0 004 7.5v10A2.5 2.5 0 006.5 20h10a2.500 2.500 0 002.500-2.500V12M19 3.800a1.800 1.800 0 012.500 2.500L12.500 15 9 15.800l.8-3.500z"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    mic: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 15a3.5 3.5 0 003.5-3.500v-6a3.500 3.500 0 00-7 0v6A3.500 3.500 0 0012 15zm6-3.500a6 6 0 01-5 5.900V20h-2v-2.600a6 6 0 01-5-5.900h2a4 4 0 008 0h2z"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5.500 11.500L12 5l6.500 6.500"/></svg>',
    video: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 7.500A2.500 2.500 0 015.500 5h8A2.500 2.500 0 0116 7.500v2.200l4.200-2.700a.8.8 0 011.300.7v9.600a.8.8 0 01-1.300.7L16 14.300v2.200a2.500 2.500 0 01-2.500 2.500h-8A2.500 2.500 0 013 16.500v-9z"/></svg>',
    chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
  };

  const layer = Phone.createLayer("messages", `
    <section class="ms-page" id="msList">
      <div class="ms-top"><button type="button" class="ms-glass ms-edit" id="msEdit">Edit</button><button type="button" class="ms-glass ms-circ" id="msNew"></button></div>
      <div class="ms-scroll" id="msScroll"><h1>Messages</h1><div id="msRows"></div></div>
      <div class="ms-bottom"><div class="ms-glass ms-search"><span id="msSearchIc"></span><input id="msSearch" placeholder="Search" autocomplete="off"></div><button type="button" class="ms-glass ms-circ big" id="msNew2"></button></div>
    </section>
    <section class="ms-page chat" id="msChat">
      <div class="ms-msgs" id="msMsgs"></div>
      <div class="ms-chead">
        <button type="button" class="ms-glass ms-circ" id="msBack"></button>
        <div class="ms-who" id="msWho"></div>
        <button type="button" class="ms-glass ms-circ" id="msVid"></button>
      </div>
      <div class="ms-input">
        <button type="button" class="ms-glass ms-circ big" id="msPlus"></button>
        <div class="ms-glass ms-field"><input id="msInput" placeholder="iMessage" autocomplete="off"><span id="msMic"></span><button type="button" id="msSend"></button></div>
      </div>
    </section>`);

  const C = MESSAGES_CONTACTS;
  let cur = null, query = "";
  const last = (c) => [...c.messages].reverse().find((m) => !m.day);
  const dayOf = (c) => { const d = [...c.messages].reverse().find((m) => m.day); return d ? d.day : ""; };

  /* ---------- Daftar ---------- */
  function renderList() {
    const q = query.trim().toLowerCase();
    const rows = C.map((c, i) => ({ c, i })).filter(({ c }) => !q || c.name.toLowerCase().includes(q) || (last(c)?.text || "").toLowerCase().includes(q))
      .sort((a, b) => (b.c.pinned ? 1 : 0) - (a.c.pinned ? 1 : 0));
    $("msRows").innerHTML = rows.map(({ c, i }) => {
      const m = last(c);
      return `<button type="button" class="ms-row" data-i="${i}">
        <span class="dot ${c.unread ? "on" : ""}"></span>${avatar({ name: c.name, avatar: c.avatar, color: "#9a9aa1" }, 48, i)}
        <div class="mid"><div class="l1"><b>${esc(c.name)}</b><em>${esc(c.stamp || dayOf(c) || (m ? m.time : ""))}${M.chev}</em></div><p>${m ? esc(m.text) : ""}</p></div></button>`;
    }).join("") || '<p class="ms-empty">Tidak ada percakapan.</p>';
  }

  /* ---------- Chat ---------- */
  function renderChat() {
    const c = C[cur];
    $("msWho").innerHTML = `<span class="ms-avwrap">${avatar({ name: c.name, avatar: c.avatar, color: "#9a9aa1" }, 52, cur)}</span><span class="ms-glass ms-name">${esc(c.name)}${M.chev}</span>`;
    let html = "", prev = null;
    c.messages.forEach((m, k) => {
      if (m.day) { html += `<div class="ms-day">${esc(m.day)}</div>`; prev = null; return; }
      const next = c.messages[k + 1];
      const tail = !next || next.day || next.from !== m.from;
      html += `<div class="ms-b ${m.from === "me" ? "out" : "in"} ${c.sms && m.from === "me" ? "sms" : ""} ${tail ? "tail" : ""}">${esc(m.text)}</div>`;
      if (m.from === "me" && tail && k === c.messages.length - 1) html += `<div class="ms-status">${m.status || "Delivered"}</div>`;
      prev = m.from;
    });
    const box = $("msMsgs");
    box.innerHTML = html;
    box.scrollTop = box.scrollHeight;
  }
  function openChat(i) {
    cur = i;
    C[i].unread = 0;
    renderList();
    renderChat();
    $("msChat").classList.add("open");
  }
  function closeChat() {
    $("msChat").classList.remove("open");
    cur = null;
    $("msInput").blur();
    renderList();
  }
  function send() {
    const v = $("msInput").value.trim();
    if (!v || cur === null) return;
    const c = C[cur];
    const m = { from: "me", text: v, time: nowTime(), status: "Delivered" };
    if (!c.messages.some((x) => x.day === "Today")) c.messages.push(msgDay("Today"));
    c.messages.push(m);
    c.stamp = nowTime();
    $("msInput").value = "";
    sync();
    renderChat();
    setTimeout(() => { m.status = "Read " + nowTime(); if (cur !== null && C[cur] === c) renderChat(); }, 1800);
  }
  const sync = () => $("msChat").classList.toggle("typing", $("msInput").value.trim().length > 0);

  /* ---------- Event ---------- */
  $("msRows").addEventListener("click", (e) => { const r = e.target.closest(".ms-row"); if (r) openChat(+r.dataset.i); });
  $("msSearch").addEventListener("input", (e) => { query = e.target.value; renderList(); });
  $("msBack").addEventListener("click", closeChat);
  $("msSend").addEventListener("click", send);
  $("msInput").addEventListener("input", sync);
  $("msInput").addEventListener("keydown", (e) => e.key === "Enter" && send());
  $("msVid").addEventListener("click", () => toast("FaceTime belum tersedia di simulator"));
  $("msPlus").addEventListener("click", () => toast("Lampiran belum tersedia di simulator"));
  $("msEdit").addEventListener("click", () => toast("Edit belum tersedia di simulator"));
  const newChat = () => {
    const name = (prompt("Nama kontak baru:") || "").trim();
    if (!name) return;
    C.unshift({ name, avatar: "", sms: false, unread: 0, messages: [] });
    openChat(0);
  };
  $("msNew").addEventListener("click", newChat);
  $("msNew2").addEventListener("click", newChat);
  $("msNew").innerHTML = M.compose;
  $("msNew2").innerHTML = M.compose;
  $("msSearchIc").innerHTML = M.search;
  $("msBack").innerHTML = M.back;
  $("msVid").innerHTML = M.video;
  $("msPlus").innerHTML = M.plus;
  $("msMic").innerHTML = M.mic;
  $("msSend").innerHTML = M.send;

  Phone.registerApp({
    id: "messages",
    name: "Messages",
    icon: '<svg viewBox="0 0 48 48" width="49" height="49" aria-hidden="true"><path d="M24 9C14.600 9 7 15.200 7 22.800c0 4.200 2.300 8 6 10.500-.4 2.700-1.800 5-3.500 6.700 3.700-.2 6.800-1.700 8.900-3.500 1.700.4 3.500.6 5.600.6 9.400 0 17-6.200 17-13.800S33.400 9 24 9z" fill="#fff"/></svg>',
    iconBg: "linear-gradient(150deg,#6af58b,#0aaa3f)",
    layer,
    barOnLight: () => true,
    onOpen() { renderList(); },
    onClose: closeChat,
    onBack() { if (cur !== null) { closeChat(); return true; } return false; },
  });
})();
