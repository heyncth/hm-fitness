# HM Fitness Center — website

One-page static site: `index.html` + `app.css` + `app.js` + `assets/`. No build step, no dependencies. Open `index.html` in a browser or drop the folder on any static host.

## Edit the class schedule

All data lives at the top of `app.js`:

- `DAYS` — tab order (Monday to Sunday).
- `ROWS` — time slots, minutes since midnight (`310` = 05:10).
- `CLASSES` — one array per day; each class is `{ row, name, who }`. `row` must be a valid index into `ROWS`.

Two classes can share a time slot by using different rows (Monday 18:00 does this).

## Check before you ship

```
node check.js
```

Asserts every `row` exists, every day has an entry, and every tab date falls on the right weekday.

## Deploy

Upload `index.html`, `app.css`, `app.js`, `assets/` to the host. Ignore `.taste-skill/` (design tooling screenshots, not part of the site).

After you know the live URL, set `og:image` in `index.html` to the full URL (e.g. `https://example.com/assets/frontstore.jpg`) — Facebook scrapers ignore relative paths.
