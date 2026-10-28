/* =====================================================================
   HOME — membangun ikon di home screen dari HOME_LAYOUT (js/config.js)
   Harus dimuat SETELAH semua file aplikasi.
   ===================================================================== */
function clockSVG() {
  return (
    '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="#fff"/>' +
    [...Array(12)]
      .map((_, i) =>
        '<line x1="50" y1="6" x2="50" y2="' + (i % 3 ? 11 : 15) + '" stroke="#111" stroke-width="' + (i % 3 ? 1.6 : 2.6) +
        '" transform="rotate(' + i * 30 + ' 50 50)"/>')
      .join("") +
    '<line class="hand-h" x1="50" y1="50" x2="50" y2="28" stroke="#111" stroke-width="4.2" stroke-linecap="round"/>' +
    '<line class="hand-m" x1="50" y1="50" x2="50" y2="14" stroke="#111" stroke-width="2.8" stroke-linecap="round"/>' +
    '<circle cx="50" cy="50" r="3" fill="#ff9500"/></svg>'
  );
}
function tile(app, showLabel) {
  const b = document.createElement("button");
  b.className = "app";
  b.type = "button";
  const icon =
    app.dynamicIcon === "clock"
      ? '<div class="icon ic-clock">' + clockSVG() + "</div>"
      : '<div class="icon" style="background:' + (app.iconBg || "transparent") + '">' + app.icon + "</div>";
  b.innerHTML = icon + (showLabel ? "<span>" + esc(app.name) + "</span>" : "");
  b.addEventListener("click", () => Phone.openApp(app.id, b.querySelector(".icon")));
  return b;
}
HOME_LAYOUT.grid.forEach((id) => Phone.apps[id] && $("grid").appendChild(tile(Phone.apps[id], true)));
HOME_LAYOUT.dock.forEach((id) => Phone.apps[id] && $("dock").appendChild(tile(Phone.apps[id], false)));
