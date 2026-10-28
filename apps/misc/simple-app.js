/* =====================================================================
   SIMPLE APP — pembuat aplikasi sederhana (judul besar + isi), dipakai
   Settings, Notes, Weather, Clock, Maps, Mail, Messages, Camera.
   Tiap aplikasi punya FILE sendiri di folder ini — edit file-nya langsung.
   ===================================================================== */
function simpleApp({ id, name, icon, iconBg = "transparent", dynamicIcon, body, onLight = false }) {
  const layer = Phone.createLayer(id, `<div class="app-head"><h1>${esc(name)}</h1></div><div class="app-body"></div>`);
  const bodyEl = layer.querySelector(".app-body");
  const render = () => (bodyEl.innerHTML = typeof body === "function" ? body() : body);
  if (onLight) layer.style.background = "#f2f2f7";
  return Phone.registerApp({
    id, name, icon, iconBg, dynamicIcon, layer,
    barOnLight: () => onLight,
    onOpen: render,
  });
}
