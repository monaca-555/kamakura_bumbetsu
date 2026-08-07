(function () {
  "use strict";

  var themeToggleBtn = document.getElementById("theme-toggle");
  var searchInput = document.getElementById("search");
  var clearBtn = document.getElementById("clear-btn");
  var searchBtn = document.getElementById("search-btn");
  var filterRow = document.getElementById("filter-row");
  var resultsEl = document.getElementById("results");
  var resultCountEl = document.getElementById("result-count");
  var emptyStateEl = document.getElementById("empty-state");

  var appTitle = document.getElementById("app-title");
  var appSubtitle = document.getElementById("app-subtitle");
  var changeAreaBtn = document.getElementById("change-area-btn");
  var areaPicker = document.getElementById("area-picker");
  var areaSelect = document.getElementById("area-select");
  var areaConfirmBtn = document.getElementById("area-confirm-btn");
  var areaSkipBtn = document.getElementById("area-skip-btn");
  var forecastCard = document.getElementById("forecast-card");
  var forecastScrollEl = document.getElementById("forecast-scroll");

  var sheet = document.getElementById("detail-sheet");
  var sheetBackdrop = document.getElementById("sheet-backdrop");
  var sheetClose = document.getElementById("sheet-close");
  var sheetTitle = document.getElementById("sheet-title");
  var sheetCatChip = document.getElementById("sheet-cat-chip");
  var sheetCatSub = document.getElementById("sheet-cat-sub");
  var sheetNote = document.getElementById("sheet-note");
  var sheetPage = document.getElementById("sheet-page");

  var activeFilters = new Set();
  var MAX_RESULTS = 120;

  // --- normalize helpers: full-width alnum -> half-width, katakana kept as-is ---
  function normalize(str) {
    return str
      .replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (c) {
        return String.fromCharCode(c.charCodeAt(0) - 0xFEE0);
      })
      .toLowerCase();
  }

  // build normalized search index once
  var searchIndex = ITEMS.map(function (row) {
    return normalize(row[0]);
  });

  function buildFilterChips() {
    Object.keys(CATEGORY).forEach(function (code) {
      var cat = CATEGORY[code];
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "filter-chip";
      btn.dataset.code = code;
      btn.innerHTML =
        '<span class="dot" style="background:' + cat.color + '"></span>' +
        cat.label;
      btn.addEventListener("click", function () {
        if (activeFilters.has(code)) {
          activeFilters.delete(code);
          btn.classList.remove("active");
        } else {
          activeFilters.add(code);
          btn.classList.add("active");
        }
        render();
      });
      filterRow.appendChild(btn);
    });
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function highlight(name, query) {
    if (!query) return escapeHtml(name);
    var normName = normalize(name);
    var idx = normName.indexOf(query);
    if (idx === -1) return escapeHtml(name);
    return (
      escapeHtml(name.slice(0, idx)) +
      "<mark>" + escapeHtml(name.slice(idx, idx + query.length)) + "</mark>" +
      escapeHtml(name.slice(idx + query.length))
    );
  }

  function render() {
    var rawQuery = searchInput.value.trim();
    var query = normalize(rawQuery);
    clearBtn.hidden = rawQuery.length === 0;

    var hasQuery = query.length > 0;
    var hasFilter = activeFilters.size > 0;

    resultsEl.innerHTML = "";
    emptyStateEl.hidden = true;

    if (!hasQuery && !hasFilter) {
      resultCountEl.textContent = "品名を入力するか、区分を選んで絞り込んでください";
      return;
    }

    var matches = [];
    for (var i = 0; i < ITEMS.length; i++) {
      var row = ITEMS[i];
      var cat = row[1];
      if (hasFilter && !activeFilters.has(cat)) continue;
      if (hasQuery && searchIndex[i].indexOf(query) === -1) continue;
      matches.push(row);
    }

    if (matches.length === 0) {
      resultCountEl.textContent = "0 件";
      emptyStateEl.hidden = false;
      return;
    }

    var shown = matches.slice(0, MAX_RESULTS);
    resultCountEl.textContent =
      matches.length + " 件" +
      (matches.length > shown.length ? "（上位 " + shown.length + " 件を表示）" : "");

    var frag = document.createDocumentFragment();
    shown.forEach(function (row) {
      var li = buildResultItem(row, query);
      frag.appendChild(li);
    });
    resultsEl.appendChild(frag);
  }

  function buildResultItem(row, query) {
    var name = row[0], catCode = row[1], note = row[2], page = row[3];
    var cat = CATEGORY[catCode];

    var li = document.createElement("li");
    li.className = "result-item";

    var main = document.createElement("div");
    main.className = "result-main";

    var nameEl = document.createElement("p");
    nameEl.className = "result-name";
    nameEl.innerHTML = highlight(name, query);
    main.appendChild(nameEl);

    if (note) {
      var noteEl = document.createElement("p");
      noteEl.className = "result-note";
      noteEl.textContent = note;
      main.appendChild(noteEl);
    }

    var chip = document.createElement("span");
    chip.className = "chip";
    chip.style.background = cat.color;
    chip.textContent = cat.label;

    li.appendChild(main);
    li.appendChild(chip);

    li.addEventListener("click", function () {
      openSheet(row);
    });

    return li;
  }

  function openSheet(row) {
    var name = row[0], catCode = row[1], note = row[2], page = row[3];
    var cat = CATEGORY[catCode];

    sheetTitle.textContent = name;
    sheetCatChip.textContent = cat.label;
    sheetCatChip.style.background = cat.color;
    sheetCatSub.textContent = cat.sub || "";
    sheetNote.textContent = note || "特記事項なし";
    sheetPage.textContent = "冊子 " + page + " ページに関連情報あり";

    sheet.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeSheet() {
    sheet.hidden = true;
    document.body.style.overflow = "";
  }

  sheetBackdrop.addEventListener("click", closeSheet);
  sheetClose.addEventListener("click", closeSheet);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !sheet.hidden) closeSheet();
  });

  clearBtn.addEventListener("click", function () {
    searchInput.value = "";
    searchInput.focus();
    render();
  });

  var searchTrackTimer = null;
  var lastTrackedTerm = "";

  function trackSearchNow() {
    var term = searchInput.value.trim();
    if (!term || term === lastTrackedTerm) return;
    lastTrackedTerm = term;
    if (typeof gtag === "function") {
      gtag("event", "search", { search_term: term });
    }
  }

  function scheduleSearchTracking() {
    clearTimeout(searchTrackTimer);
    searchTrackTimer = setTimeout(trackSearchNow, 800);
  }

  searchInput.addEventListener("input", function () {
    render();
    scheduleSearchTracking();
  });

  searchBtn.addEventListener("click", function () {
    render();
    clearTimeout(searchTrackTimer);
    trackSearchNow();
    searchInput.blur();
  });

  searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      render();
      clearTimeout(searchTrackTimer);
      trackSearchNow();
      searchInput.blur();
    }
  });

  // --- 地区選択・今日の収集案内 ---
  var AREA_STORAGE_KEY = "kamakura-bumbetsu-area";
  var WEEKDAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  var WEEKDAY_KANJI = { sun: "日", mon: "月", tue: "火", wed: "水", thu: "木", fri: "金", sat: "土" };

  function buildAreaOptions() {
    var frag = document.createDocumentFragment();
    AREA_INDEX.forEach(function (entry) {
      var opt = document.createElement("option");
      opt.value = entry.area;
      opt.textContent = entry.area;
      frag.appendChild(opt);
    });
    areaSelect.appendChild(frag);
  }

  function findAreaEntry(areaName) {
    return AREA_INDEX.find(function (e) { return e.area === areaName; });
  }

  function saveArea(areaName) {
    try {
      localStorage.setItem(AREA_STORAGE_KEY, areaName);
    } catch (e) { /* localStorageが使えない環境は無視 */ }
  }

  function loadSavedArea() {
    try {
      return localStorage.getItem(AREA_STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  var FORECAST_RANGE_DAYS = 30; // 今日から数えるカレンダー日数（土日は表示から除く）

  function computeScheduleForDate(district, date) {
    var dayKey = WEEKDAY_KEYS[date.getDay()];

    if (dayKey === "sat" || dayKey === "sun") {
      return { dayKey: dayKey, entries: [], nth: null, noCollectionDay: true };
    }

    var nth = Math.ceil(date.getDate() / 7);
    var dayEntries = district.schedule[dayKey] || [];
    var entries = dayEntries.filter(function (e) {
      return e.nth === null || e.nth === nth;
    });

    return { dayKey: dayKey, entries: entries, nth: nth, noCollectionDay: false };
  }

  function buildForecastDay(district, date, daysFromToday) {
    var info = computeScheduleForDate(district, date);

    var card = document.createElement("div");
    card.className = "forecast-day" + (daysFromToday === 0 ? " is-today" : "");

    var label = document.createElement("p");
    label.className = "forecast-day-label";
    label.textContent = daysFromToday === 0 ? "きょう" : daysFromToday === 1 ? "あした" : WEEKDAY_KANJI[info.dayKey] + "曜日";
    card.appendChild(label);

    var dateEl = document.createElement("p");
    dateEl.className = "forecast-day-date";
    dateEl.textContent = (date.getMonth() + 1) + "/" + date.getDate() + "（" + WEEKDAY_KANJI[info.dayKey] + "）";
    card.appendChild(dateEl);

    var itemsWrap = document.createElement("div");
    itemsWrap.className = "forecast-day-items";

    if (info.noCollectionDay) {
      itemsWrap.innerHTML = '<p class="forecast-day-empty">収集なし</p>';
    } else if (info.entries.length === 0) {
      itemsWrap.innerHTML = '<p class="forecast-day-empty">対象品目なし</p>';
    } else {
      info.entries.forEach(function (e) {
        var cat = CATEGORY[e.cat];
        if (!cat) return;
        var chip = document.createElement("span");
        chip.className = "chip";
        chip.style.background = cat.color;
        chip.textContent = cat.label;
        itemsWrap.appendChild(chip);
      });
    }
    card.appendChild(itemsWrap);

    return card;
  }

  function renderForecast(district) {
    forecastCard.hidden = false;
    forecastScrollEl.innerHTML = "";

    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var frag = document.createDocumentFragment();

    for (var daysFromToday = 0; daysFromToday < FORECAST_RANGE_DAYS; daysFromToday++) {
      var date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + daysFromToday);
      var dayKey = WEEKDAY_KEYS[date.getDay()];
      if (dayKey !== "sat" && dayKey !== "sun") {
        frag.appendChild(buildForecastDay(district, date, daysFromToday));
      }
    }
    forecastScrollEl.appendChild(frag);
  }

  function applyArea(areaName) {
    var entry = findAreaEntry(areaName);
    if (!entry) return false;
    var district = DISTRICTS[entry.districtIndex];

    appTitle.textContent = "鎌倉市ごみ分別しらべ";
    appSubtitle.innerHTML = '<span class="area-name">' + escapeHtml(district.label) + '</span> 地区の収集情報';
    changeAreaBtn.hidden = false;
    renderForecast(district);
    areaPicker.hidden = true;
    return true;
  }

  function openAreaPicker() {
    var saved = loadSavedArea();
    if (saved) areaSelect.value = saved;
    areaConfirmBtn.disabled = !areaSelect.value;
    areaPicker.hidden = false;
  }

  areaSelect.addEventListener("change", function () {
    areaConfirmBtn.disabled = !areaSelect.value;
  });

  areaConfirmBtn.addEventListener("click", function () {
    var areaName = areaSelect.value;
    if (!areaName) return;
    saveArea(areaName);
    applyArea(areaName);
  });

  areaSkipBtn.addEventListener("click", function () {
    areaPicker.hidden = true;
  });

  changeAreaBtn.addEventListener("click", openAreaPicker);

  // --- ライト/ダーク手動切り替え ---
  var THEME_STORAGE_KEY = "kamakura-bumbetsu-theme";

  function getSystemTheme() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function loadStoredTheme() {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function applyTheme(theme) {
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }

  applyTheme(loadStoredTheme());

  themeToggleBtn.addEventListener("click", function () {
    var current = loadStoredTheme() || getSystemTheme();
    var next = current === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch (e) { /* localStorageが使えない環境は無視 */ }
    applyTheme(next);
  });

  buildAreaOptions();
  var savedArea = loadSavedArea();
  if (savedArea && applyArea(savedArea)) {
    // 保存済みの地区を復元できた
  } else {
    openAreaPicker();
  }

  buildFilterChips();
  render();
})();
