const Notif = {
  show({ app, title, body, icon, bg, ms = 4000, onTap }) {
    const a = app && Phone.apps[app];
    const el = document.createElement("div");
    el.className = "notif";
    el.innerHTML =
      '<div class="ic" style="background:' + (bg || (a && a.iconBg) || "#555") + '">' + (icon || (a && a.icon) || "") + "</div>" +
      "<div><b>" + esc(title) + "</b><span>" + esc(body || "") + "</span></div>";
    const close = () => { el.classList.remove("on"); setTimeout(() => el.remove(), 500); };
    el.addEventListener("click", () => { close(); onTap ? onTap() : a && Phone.openApp(app); });
    $("notifLayer").appendChild(el);
    requestAnimationFrame(() => el.classList.add("on"));
    setTimeout(close, ms);
  },
};