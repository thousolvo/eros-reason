/* =====================================================================
   LOCK — lock screen, passcode, tombol power, keyboard
   ===================================================================== */
const homeEl = $("home"), lockEl = $("lock"), passEl = $("pass");
const LETTERS = { 2: "ABC", 3: "DEF", 4: "GHI", 5: "JKL", 6: "MNO", 7: "PQRS", 8: "TUV", 9: "WXYZ" };
const isOff = () => screenEl.classList.contains("off");

/* ---------- Passcode ---------- */
let entered = "";
const dotsEl = $("dots");
for (let i = 0; i < 4; i++) {
  const d = document.createElement("span");
  d.className = "dot";
  dotsEl.appendChild(d);
}
function renderDots() {
  [...dotsEl.children].forEach((d, i) => d.classList.toggle("on", i < entered.length));
  $("cancel").textContent = entered.length ? "Delete" : "Cancel";
}
function press(n) {
  if (Phone.state !== "pass" || entered.length >= 4) return;
  entered += n;
  renderDots();
  if (entered.length === 4) setTimeout(checkPasscode, 180);
}
function checkPasscode() {
  if (entered === String(CONFIG.passcode)) return unlock();
  dotsEl.classList.add("shake");
  setTimeout(() => {
    dotsEl.classList.remove("shake");
    entered = "";
    renderDots();
  }, 450);
}
const keysEl = $("keys");
[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, ""].forEach((k) => {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "key" + (k === "" ? " blank" : "");
  if (k !== "") {
    b.innerHTML = k + "<small>" + (LETTERS[k] || "") + "</small>";
    b.addEventListener("click", () => press(String(k)));
  }
  keysEl.appendChild(b);
});
$("cancel").addEventListener("click", () => {
  if (entered.length) { entered = entered.slice(0, -1); renderDots(); }
  else showLock();
});

/* ---------- Transisi status ---------- */
function showPass() {
  if (Phone.state !== "lock") return;
  Phone.state = "pass";
  entered = "";
  renderDots();
  $("device").classList.add("passcode-active");
  passEl.classList.add("show");
}
function resetLockVisuals() {
  $("device").classList.remove("passcode-active");
  passEl.classList.remove("show");
  lockEl.classList.remove("gone");
  lockEl.style.transform = "";
  lockEl.style.opacity = "";
  entered = "";
  renderDots();
}
function showLock() {
  Phone.state = "lock";
  resetLockVisuals();
  updateClock();
}
function unlock() {
  Phone.state = "home";
  $("device").classList.remove("passcode-active");
  passEl.classList.remove("show");
  lockEl.classList.add("gone");
  homeEl.classList.add("pre");
  requestAnimationFrame(() => requestAnimationFrame(() => homeEl.classList.remove("pre")));
  updateClock();
}
/* Kunci ulang (dipakai tombol power): tutup app, kembali ke lock screen */
function relock() {
  Phone.hideApps();
  homeEl.classList.remove("recede");
  Phone.state = "lock";
  resetLockVisuals();
  updateClock();
}

/* ---------- Geser ke atas untuk membuka ---------- */
let swipeY = null, swipeDy = 0, swipePointer = null;
lockEl.addEventListener("pointerdown", (e) => {
  if (Phone.state !== "lock" || e.target.closest(".qbtn") || isOff()) return;
  swipeY = e.clientY;
  swipeDy = 0;
  swipePointer = e.pointerId;
  lockEl.classList.add("dragging");
  passEl.classList.add("swipe-preview");
  passEl.style.setProperty("--pass-reveal", "0");
  try { lockEl.setPointerCapture(e.pointerId); } catch (_) {}
});
lockEl.addEventListener("pointermove", (e) => {
  if (swipeY === null || e.pointerId !== swipePointer) return;
  swipeDy = Math.min(0, (e.clientY - swipeY) / Phone.scale);
  lockEl.style.transform = `translateY(${swipeDy * 0.86}px)`;
  const progress = Math.min(1, Math.max(0, -swipeDy / 240));
  lockEl.style.opacity = String(1 - progress * 0.95);
  lockEl.style.setProperty("--lock-blur", `${progress * 7}px`);
  passEl.style.setProperty("--pass-reveal", String(progress * 0.98));
});
function finishSwipe(cancelled = false) {
  if (swipeY === null) return;
  const open = !cancelled && swipeDy < -75;
  swipeY = null; swipeDy = 0; swipePointer = null;
  lockEl.classList.remove("dragging");
  lockEl.style.transform = "";
  lockEl.style.opacity = "";
  lockEl.style.removeProperty("--lock-blur");
  passEl.classList.remove("swipe-preview");
  passEl.style.removeProperty("--pass-reveal");
  if (open) showPass();
}
lockEl.addEventListener("pointerup", (e) => e.pointerId === swipePointer && finishSwipe());
lockEl.addEventListener("pointercancel", () => finishSwipe(true));
$("torch").addEventListener("click", (e) => e.currentTarget.classList.toggle("on"));

/* ---------- Tombol power: layar MATI / HIDUP ---------- */
$("power").addEventListener("click", () => {
  if (isOff()) {
    screenEl.classList.remove("off");        // hidupkan -> tampil lock screen
  } else {
    relock();                                 // matikan -> kunci + layar hitam
    screenEl.classList.add("off");
  }
});

/* ---------- Keyboard ---------- */
document.addEventListener("keydown", (e) => {
  if (isOff()) return;
  if (/^[0-9]$/.test(e.key) && document.activeElement.tagName !== "INPUT") {
    if (Phone.state === "lock") showPass();     // ketik angka di lock screen -> buka passcode
    press(e.key);
  }
  if (e.key === "Backspace" && Phone.state === "pass") { entered = entered.slice(0, -1); renderDots(); }
  if (e.key === "Escape") {
    if (Phone.state === "app") { if (!(Phone.current.onBack && Phone.current.onBack())) Phone.closeApp(); }
    else if (Phone.state === "pass") showLock();
  }
  if ((e.key === "Enter" || e.key === " ") && Phone.state === "lock" && document.activeElement.tagName !== "BUTTON") showPass();
});

/* ---------- Inisialisasi ---------- */
renderDots();
updateClock();
if (CONFIG.live) setInterval(updateClock, 1000);
