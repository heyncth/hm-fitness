(function () {
  "use strict";
  var DAYS = [
    { key: "mon", label: "Thứ Hai" },
    { key: "tue", label: "Thứ Ba" },
    { key: "wed", label: "Thứ Tư" },
    { key: "thu", label: "Thứ Năm" },
    { key: "fri", label: "Thứ Sáu" },
    { key: "sat", label: "Thứ Bảy" },
    { key: "sun", label: "Chủ Nhật" }
  ];
  var ROWS = [
    { start: 310, end: 370, label: "5:10 – 6:10" },
    { start: 375, end: 435, label: "6:15 – 7:15" },
    { start: 1080, end: 1140, label: "18:00 – 19:00" },
    { start: 1080, end: 1140, label: "18:00 – 19:00" },
    { start: 1150, end: 1210, label: "19:10 – 20:10" }
  ];
  var CLASSES = {
    mon: [
      { row: 0, name: "Mix yoga", who: "Ms. Long" },
      { row: 1, name: "Chiều sinh", who: "" },
      { row: 2, name: "Stretching yoga", who: "Ms. Nguyễn" },
      { row: 3, name: "Múa", who: "Ms. Selly" },
      { row: 4, name: "Chiều sinh", who: "" }
    ],
    tue: [
      { row: 0, name: "Stretching yoga", who: "Ms. Nguyễn" },
      { row: 1, name: "Hip and glute yoga", who: "Ms. Tiên" },
      { row: 2, name: "Múa", who: "Ms. Selly" },
      { row: 4, name: "Chiều sinh", who: "" }
    ],
    wed: [
      { row: 0, name: "Balance yoga", who: "Ms. Đông" },
      { row: 1, name: "Chiều sinh", who: "" },
      { row: 2, name: "Mix yoga", who: "Ms. Long" },
      { row: 4, name: "Zumba", who: "Helen" }
    ],
    thu: [
      { row: 0, name: "Twisting yoga", who: "Ms. Nguyễn" },
      { row: 1, name: "Hip open yoga", who: "Mr. Roshan" },
      { row: 2, name: "Vinyasa flow yoga", who: "Ms. Lovely" },
      { row: 4, name: "Chiều sinh", who: "" }
    ],
    fri: [
      { row: 0, name: "Block yoga", who: "Ms. Đông" },
      { row: 1, name: "Chiều sinh", who: "" },
      { row: 2, name: "Total body yoga", who: "Ms. Nguyễn" },
      { row: 4, name: "Zumba", who: "Helen" }
    ],
    sat: [
      { row: 0, name: "Total body yoga", who: "Ms. Nguyễn" },
      { row: 1, name: "Core yoga", who: "Ms. Long" },
      { row: 2, name: "Flow yoga", who: "Ms. Thúy" },
      { row: 4, name: "Chiều sinh", who: "" }
    ],
    sun: []
  };
  function pad(n) { return n < 10 ? "0" + n : String(n); }
  function dateForIndex(i) {
    var d = new Date();
    var g = d.getDay();
    var diff = i - (g === 0 ? 6 : g - 1);
    d.setDate(d.getDate() + diff);
    return pad(d.getDate()) + "/" + pad(d.getMonth() + 1);
  }
  function todayIndex() {
    var g = new Date().getDay();
    return g === 0 ? 6 : g - 1;
  }
  function buildAgenda() {
    var root = document.querySelector("[data-agenda]");
    if (!root) return;
    var tabs = root.querySelector(".agenda__tabs");
    var panels = root.querySelector(".agenda__panels");
    var todayIdx = todayIndex();
    var selectedIdx = todayIdx;
    DAYS.forEach(function (day, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "agenda__tab";
      btn.setAttribute("role", "tab");
      btn.id = "tab-" + day.key;
      btn.setAttribute("aria-controls", "panel-" + day.key);
      var selected = i === todayIdx;
      btn.setAttribute("aria-selected", selected ? "true" : "false");
      btn.tabIndex = selected ? 0 : -1;
      btn.innerHTML = '<span class="agenda__day">' + day.label + '</span><span class="agenda__date">' + dateForIndex(i) + "</span>";
      btn.addEventListener("click", function () { selectDay(i); });
      tabs.appendChild(btn);
      var panel = document.createElement("div");
      panel.className = "agenda__panel" + (selected ? " is-active" : "");
      panel.id = "panel-" + day.key;
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", "tab-" + day.key);
      if (selected) panel.removeAttribute("hidden");
      else panel.setAttribute("hidden", "");
      var list = CLASSES[day.key] || [];
      if (!list.length) {
        panel.innerHTML = '<p class="agenda__empty">Không có lớp nhóm. Hội viên tập gym tự do trong khung giờ mở cửa.</p>';
      } else {
        var rows = document.createElement("div");
        rows.className = "agenda__rows";
        list.forEach(function (c) {
          var band = document.createElement("div");
          band.className = "band";
          band.dataset.start = String(ROWS[c.row].start);
          band.dataset.end = String(ROWS[c.row].end);
          var note = c.who ? "" : '<p class="band__note">Tập tự do</p>';
          band.innerHTML =
            '<div class="band__time">' + ROWS[c.row].label + "</div>" +
            '<div class="band__body"><p class="band__class">' + c.name + "</p>" + note + "</div>" +
            '<div class="band__who">' + (c.who || "—") + "</div>";
          rows.appendChild(band);
        });
        panel.appendChild(rows);
      }
      panels.appendChild(panel);
    });
    tabs.addEventListener("keydown", function (e) {
      var keys = ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End"];
      if (keys.indexOf(e.key) === -1) return;
      e.preventDefault();
      var all = Array.prototype.slice.call(tabs.querySelectorAll(".agenda__tab"));
      var idx = all.indexOf(document.activeElement);
      if (idx < 0) idx = 0;
      var next = idx;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (idx + 1) % all.length;
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (idx - 1 + all.length) % all.length;
      if (e.key === "Home") next = 0;
      if (e.key === "End") next = all.length - 1;
      all[next].focus();
      selectDay(next);
    });
    function selectDay(i) {
      selectedIdx = i;
      var btns = tabs.querySelectorAll(".agenda__tab");
      var pans = panels.querySelectorAll(".agenda__panel");
      btns.forEach(function (b, j) {
        var on = j === i;
        b.setAttribute("aria-selected", on ? "true" : "false");
        b.tabIndex = on ? 0 : -1;
      });
      pans.forEach(function (p, j) {
        var on = j === i;
        p.classList.toggle("is-active", on);
        if (on) p.removeAttribute("hidden");
        else p.setAttribute("hidden", "");
      });
      markNow();
    }
    function markNow() {
      var now = new Date();
      var mins = now.getHours() * 60 + now.getMinutes();
      var onToday = selectedIdx === todayIndex();
      var active = panels.querySelector(".agenda__panel.is-active");
      if (!active) return;
      active.querySelectorAll(".band").forEach(function (b) {
        var s = Number(b.dataset.start);
        var e = Number(b.dataset.end);
        b.classList.toggle("is-now", onToday && mins >= s && mins < e);
      });
    }
    function refreshDates() {
      tabs.querySelectorAll(".agenda__tab").forEach(function (b, i) {
        var d = b.querySelector(".agenda__date");
        if (d) d.textContent = dateForIndex(i);
      });
    }
    markNow();
    setInterval(function () {
      refreshDates();
      markNow();
    }, 60000);
  }
  function initMotion() {
    requestAnimationFrame(function () {
      document.body.classList.add("is-loaded");
    });
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll("[data-reveal], [data-chapter], [data-fan]").forEach(function (el) {
        el.classList.add("is-in");
      });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          if (en.target.matches("[data-fan]")) {
            en.target.querySelectorAll("[data-card]").forEach(function (c) { c.classList.add("is-in"); });
          }
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    document.querySelectorAll("[data-reveal], [data-chapter], [data-fan], .notes").forEach(function (el) {
      io.observe(el);
    });
  }
  function initCountUp() {
    var prices = Array.prototype.slice.call(document.querySelectorAll(".tile__price"));
    prices.forEach(function (el) {
      var final = el.textContent;
      var m = final.match(/([\d.]+)/);
      if (!m) return;
      var target = parseInt(m[1].replace(/\./g, ""), 10);
      if (!target) return;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          io.disconnect();
          var t0 = performance.now();
          function step(t) {
            var p = Math.min(1, (t - t0) / 700);
            var v = Math.round(target * (1 - Math.pow(1 - p, 3)));
            var shown = v >= 1000 ? String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ".") : String(v);
            el.textContent = final.replace(m[1], shown);
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = final;
          }
          requestAnimationFrame(step);
        });
      }, { threshold: 0.4 });
      io.observe(el);
    });
  }
  buildAgenda();
  initMotion();
  initCountUp();
  if (typeof module === "object" && module.exports) {
    module.exports = { DAYS: DAYS, ROWS: ROWS, CLASSES: CLASSES, dateForIndex: dateForIndex, todayIndex: todayIndex };
  }
})();
