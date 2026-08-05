(function () {
  "use strict";

  var searchInput = document.getElementById("search");
  var clearBtn = document.getElementById("clear-btn");
  var filterRow = document.getElementById("filter-row");
  var resultsEl = document.getElementById("results");
  var resultCountEl = document.getElementById("result-count");
  var emptyStateEl = document.getElementById("empty-state");

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

  searchInput.addEventListener("input", render);

  buildFilterChips();
  render();
})();
