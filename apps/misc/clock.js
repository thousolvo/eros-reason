/* CLOCK — ikon jam analog bergerak (dynamicIcon: "clock", digambar di js/core/home.js) */
simpleApp({
  id: "clock", name: "Clock", dynamicIcon: "clock",
  body: () => `<div class="card"><div class="big">${$("ltime").textContent}</div><div>Waktu setempat</div></div>`,
});
