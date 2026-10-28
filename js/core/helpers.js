/* =====================================================================
   HELPERS — fungsi kecil yang dipakai banyak aplikasi
   ===================================================================== */
function $(id) {
  return document.getElementById(String(id).replace(/^#/, ""));
}
const esc = (s) =>
  String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const hash = (s) => [...String(s)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
const pad2 = (n) => String(n).padStart(2, "0");
const nowTime = () => {
  const d = new Date();
  return pad2(d.getHours()) + "." + pad2(d.getMinutes());
};
const iconImg = (src) =>
  `<img src="${src}" alt="" draggable="false" style="width:100%;height:100%;display:block;object-fit:cover">`;

const COLORS = ["#25d366", "#34b7f1", "#ff7a59", "#a66cff", "#f5a623", "#e84a8b", "#4bc0c8", "#8d6e63", "#5c7cfa", "#2bb673"];

/* Avatar bulat: foto kalau ada, kalau tidak inisial berwarna.
   p = { name, avatar, color }  */
function avatar(p, size, idx = 0) {
  const col = p.color || COLORS[idx % COLORS.length];
  const ini = String(p.name || "?")
    .replace(/[^\p{L}\p{N} ]/gu, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const img = p.avatar ? '<img src="' + esc(p.avatar) + '" alt="" onerror="this.remove()">' : "";
  return (
    '<div class="av" style="width:' + size + "px;height:" + size + "px;font-size:" + Math.round(size * 0.38) + 'px">' +
    img + '<span class="ini" style="background:' + col + '">' + esc(ini) + "</span></div>"
  );
}

/* Toast kecil di dalam layar HP */
function toast(msg) {
  const t = document.createElement("div");
  t.className = "phone-toast";
  t.textContent = msg;
  $("screen").appendChild(t);
  setTimeout(() => t.classList.add("show"), 10);
  setTimeout(() => { t.classList.remove("show"); setTimeout(() => t.remove(), 300); }, 1900);
}
