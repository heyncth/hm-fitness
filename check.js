var assert = require("assert");

global.window = {};
global.document = {
  querySelector: function () { return null; },
  querySelectorAll: function () { return []; },
  body: { classList: { add: function () {} } },
  documentElement: { classList: { add: function () {} } }
};
global.requestAnimationFrame = function () {};

var s = require("./app.js");

Object.keys(s.CLASSES).forEach(function (key) {
  assert(s.DAYS.some(function (d) { return d.key === key; }), "unknown day key: " + key);
  s.CLASSES[key].forEach(function (c) {
    assert(Number.isInteger(c.row) && c.row >= 0 && c.row < s.ROWS.length,
      key + " row " + c.row + " outside ROWS 0.." + (s.ROWS.length - 1));
    assert(s.ROWS[c.row].start < s.ROWS[c.row].end, "row " + c.row + " start >= end");
    assert(c.name, key + " class missing name");
  });
});
s.DAYS.forEach(function (d) {
  assert(s.CLASSES[d.key], "no CLASSES entry for " + d.key);
});

function weekdayIndex(dateStr) {
  var p = dateStr.split("/");
  var day = +p[0], month = +p[1];
  var now = new Date();
  var year = now.getFullYear();
  var c = new Date(year, month - 1, day, 12);
  if (c - now > 7 * 864e5) year -= 1;
  if (now - c > 7 * 864e5) year += 1;
  var g = new Date(year, month - 1, day, 12).getDay();
  return g === 0 ? 6 : g - 1;
}
s.DAYS.forEach(function (d, i) {
  var shown = s.dateForIndex(i);
  assert.strictEqual(weekdayIndex(shown), i,
    "tab " + d.key + " shows " + shown + " which is not " + d.label);
});
console.log("ok: " + s.DAYS.length + " days, " + Object.keys(s.CLASSES).length + " day entries, ROWS " + s.ROWS.length);
