/* =====================================================================
   SAFARI — halaman Start Page, riwayat, berita (Reading List)
   Edit daftar berita di SAFARI_NEWS, favorit di renderSafari().
   ===================================================================== */
(function () {
  const layer = Phone.createLayer("safari", `<div class="app-head"><h1>Safari</h1></div><div class="app-body" id="safariBody"></div>`);

  const SAFARI_NEWS = [
    {
      title: "Indonesia's Fire Hotspots Decline, but Wildfire Threat Persists",
      date: "22 October 2026",
      source: "Reuters",
      url: "https://www.reuters.com/business/environment/indonesias-fire-hotspots-ease-rain-still-not-enough-official-says-2026-10-22/",
      summary:
        "Authorities remain on alert despite fewer detected hotspots. Limited rainfall and dry peatlands continue to complicate firefighting efforts.",
    },
    {
      title: "Burned Land in Indonesia Doubled in September, Monitoring Data Shows",
      date: "20 October 2026",
      source: "Reuters",
      url: "https://www.reuters.com/business/environment/indonesias-burned-land-doubles-september-fires-rage-data-shows-2026-10-20/",
      summary:
        "New monitoring data points to a sharp monthly increase in burned land, raising concerns about smoke pollution, public health and ecosystems.",
    },
  ];
  const SAFARI_HISTORY_KEY = "eros_safari_history_v1";
  let safariHistory = [];
  try {
    safariHistory = JSON.parse(localStorage.getItem(SAFARI_HISTORY_KEY) || "null") || [];
  } catch (e) {}
  if (!Array.isArray(safariHistory)) safariHistory = [];
  if (!safariHistory.some((h) => h.title === "SIAKAD UNIHA"))
    safariHistory.unshift({ title: "SIAKAD UNIHA", url: "", date: "Previously visited", demo: true });
  function safariRemember(title, url) {
    safariHistory = [
      { title, url, date: new Date().toLocaleDateString("en-GB") },
      ...safariHistory.filter((h) => h.url !== url || h.title !== title),
    ].slice(0, 30);
    try {
      localStorage.setItem(SAFARI_HISTORY_KEY, JSON.stringify(safariHistory));
    } catch (e) {}
  }
  function safariOpen(title, url) {
    if (!url) {
      alert("SIAKAD UNIHA is saved as a sample history entry. Add its official URL to open the real portal.");
      return;
    }
    safariRemember(title, url);
    window.open(url, "_blank", "noopener,noreferrer");
  }
  function sfIcon(name) {
    const paths = {
      back: '<path d="m15 18-6-6 6-6"/>',
      forward: '<path d="m9 18 6-6-6-6"/>',
      share: '<rect x="5" y="9" width="14" height="12" rx="2"/><path d="M12 15V3m-4 4 4-4 4 4"/>',
      book: '<path d="M4 5a2 2 0 0 1 2-2h6v18H6a2 2 0 0 0-2 0zm16 0a2 2 0 0 0-2-2h-6v18h6a2 2 0 0 1 2 0z"/>',
      tabs: '<rect x="7" y="7" width="14" height="14" rx="2"/><path d="M3 17V5a2 2 0 0 1 2-2h12"/>',
      reload: '<path d="M20 11a8 8 0 1 0-2 6M20 4v7h-7"/>',
    };
    return (
      '<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
      paths[name] +
      "</svg>"
    );
  }
  function renderSafari() {
    const body = $("safariBody");
    body.innerHTML = "";
    const root = document.createElement("div");
    root.className = "ios-safari";
    body.appendChild(root);
    const page = document.createElement("div");
    page.className = "ios-safari-page";
    root.appendChild(page);
    page.innerHTML =
      '<header class="ios-safari-head"><span>Start Page</span><button class="ios-safari-edit" type="button">Edit</button></header><section class="ios-safari-group"><h2>Favorites</h2><div class="ios-safari-favs"></div></section><section class="ios-safari-group ios-safari-privacy"><h2>Privacy Report</h2><div class="ios-safari-privacyline"><span class="ios-safari-shield">♢</span><span>Safari helps prevent trackers from following you across websites.</span></div></section><section class="ios-safari-group"><h2>Recently Visited</h2><div class="ios-safari-recent"></div></section><section class="ios-safari-group"><h2>Reading List</h2><div class="ios-safari-articles"></div></section>';
    const favs = page.querySelector(".ios-safari-favs");
    [
      ["U", "SIAKAD UNIHA", ""],
      ["R", "Reuters", "https://www.reuters.com/"],
    ].forEach(([letter, title, url]) => {
      const b = document.createElement("button");
      b.className = "ios-safari-fav";
      b.innerHTML = '<span class="ios-safari-fav-icon">' + letter + "</span><span>" + title + "</span>";
      b.onclick = () => safariOpen(title, url);
      favs.appendChild(b);
    });
    const recent = page.querySelector(".ios-safari-recent");
    safariHistory.slice(0, 3).forEach((h) => {
      const b = document.createElement("button");
      b.className = "ios-safari-visited";
      b.innerHTML = '<span class="ios-safari-visit-icon">◷</span><span></span><span class="ios-safari-chevron">›</span>';
      b.children[1].textContent = h.title;
      b.onclick = () => safariOpen(h.title, h.url);
      recent.appendChild(b);
    });
    const articles = page.querySelector(".ios-safari-articles");
    SAFARI_NEWS.forEach((n) => {
      const b = document.createElement("button");
      b.className = "ios-safari-article";
      const source = document.createElement("span");
      source.className = "ios-safari-article-source";
      source.textContent = "REUTERS · " + n.date;
      const title = document.createElement("strong");
      title.textContent = n.title;
      const summary = document.createElement("span");
      summary.textContent = n.summary;
      b.append(source, title, summary);
      b.onclick = () => safariOpen(n.title, n.url);
      articles.appendChild(b);
    });
    const dock = document.createElement("div");
    dock.className = "ios-safari-dock";
    root.appendChild(dock);
    dock.innerHTML =
      '<button class="ios-safari-back" aria-label="Back" disabled>' +
      sfIcon("back") +
      '</button><form class="ios-safari-url"><span class="ios-safari-aa">ᴀA</span><input aria-label="Search or enter website" placeholder="Search or enter website" autocomplete="off"><button type="submit" aria-label="Go">' +
      sfIcon("reload") +
      '</button></form><button class="ios-safari-more" aria-label="More options">···</button>';
    const form = dock.querySelector("form");
    form.onsubmit = (e) => {
      e.preventDefault();
      const v = form.querySelector("input").value.trim();
      if (!v) return;
      const url = /^https?:\/\//i.test(v)
        ? v
        : /^[\w-]+(\.[\w-]+)+/.test(v)
          ? "https://" + v
          : "https://www.google.com/search?q=" + encodeURIComponent(v);
      safariOpen(v, url);
    };
    dock.querySelector(".ios-safari-more").onclick = () => showSafariPanel(root, "More");
    page.querySelector(".ios-safari-edit").onclick = () => showSafariPanel(root, "Customize Start Page");
    let lastY = 0;
    page.addEventListener(
      "scroll",
      () => {
        const y = page.scrollTop;
        dock.classList.toggle("minimized", y > 90 && y > lastY);
        if (y < 30) dock.classList.remove("minimized");
        lastY = y;
      },
      { passive: true },
    );
  }
  function showSafariPanel(root, kind) {
    root.querySelector(".ios-safari-sheet")?.remove();
    const overlay = document.createElement("div");
    overlay.className = "ios-safari-sheet";
    root.appendChild(overlay);
    const sheet = document.createElement("div");
    sheet.className = "ios-safari-sheet-body";
    overlay.appendChild(sheet);
    const header = document.createElement("div");
    header.className = "ios-safari-sheet-header";
    header.innerHTML = '<button type="button">Done</button><strong></strong>';
    header.querySelector("strong").textContent = kind;
    header.querySelector("button").onclick = () => overlay.remove();
    sheet.appendChild(header);
    const add = (label, cb) => {
      const b = document.createElement("button");
      b.className = "ios-safari-sheet-row";
      b.textContent = label;
      b.onclick = cb;
      sheet.appendChild(b);
    };
    if (kind === "More") {
      add("New Tab", () => {
        overlay.remove();
        renderSafari();
      });
      add("Bookmarks & History", () => showSafariPanel(root, "History"));
      add("All Tabs", () => showSafariPanel(root, "Tabs"));
      add("Share", () => {
        if (navigator.share) navigator.share({ title: "Safari Start Page" }).catch(() => {});
        else alert("Safari Start Page");
      });
      add("Reload", () => {
        overlay.remove();
        renderSafari();
      });
    } else if (kind === "History") {
      safariHistory.forEach((h) =>
        add(h.title + "  ·  " + (h.date || "Previously visited"), () => safariOpen(h.title, h.url)),
      );
    } else if (kind === "Tabs") {
      add("Start Page", () => overlay.remove());
    } else {
      add("Favorites", () => overlay.remove());
      add("Recently Visited", () => overlay.remove());
      add("Privacy Report", () => overlay.remove());
    }
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.remove();
    });
  }

  Phone.registerApp({
    id: "safari",
    name: "Safari",
    icon: iconImg(APP_ICON.safari),
    iconBg: "transparent",
    layer,
    barOnLight: () => true,
    onOpen: renderSafari,
  });
})();
