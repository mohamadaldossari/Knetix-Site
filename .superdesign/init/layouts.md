# layouts.md — Shared Layout Structures

Each page is self-contained (no includes/partials), but the header, footer, and page
frame recur near-identically across pages within a dialect. Reproduce these when building
any new page so navigation and framing stay consistent.

---

## Brand plate logo (both dialects)
The KNETIX "K" mark — reused in every header and the funnel modal. `index.html:427-433`:
```html
<svg width="32" height="32" viewBox="0 0 100 100" fill="none" role="img" aria-label="KNETIX logo">
  <rect x="3" y="3" width="94" height="94" rx="2" stroke="#C9B89A" stroke-width="1" fill="none" opacity=".2"/>
  <rect x="12" y="12" width="22" height="76" fill="#8B2E2E"/>
  <polygon points="38,12 88,12 38,46" fill="#C9B89A"/>
  <polygon points="38,56 88,88 38,88" fill="#8B2E2E"/>
  <rect x="37" y="47" width="7" height="7" transform="rotate(45 40.5 50.5)" fill="#C9B89A" opacity=".8"/>
</svg>
```
Favicon is the same mark as an inline `data:image/svg+xml` (`index.html:12`), with `#0E0C0B` rounded backing.

---

## Editorial header (index.html / loyalty.html)
`index.html:118-127, 423-445`
```css
header{position:sticky;top:0;z-index:200;background:rgba(14,12,11,.85);backdrop-filter:blur(16px);border-bottom:1px solid var(--border)}
.nav{display:flex;align-items:center;justify-content:space-between;height:66px}
.brand{display:flex;align-items:center;gap:13px;text-decoration:none}
.brand-name{font-family:'Bebas Neue',sans-serif;font-size:25px;letter-spacing:.18em;color:var(--cream)}
.nav-links{display:flex;align-items:center;gap:4px}
.nav-links a{padding:10px 16px;font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);transition:color .2s}
.nav-links a:hover{color:var(--cream)}
.nav-links a.cta{background:var(--red);color:var(--cream);border-radius:2px;padding:11px 22px;margin-left:10px}
.nav-links a.cta:hover{background:var(--red-h)}
@media(max-width:820px){.nav-links a:not(.cta){display:none}}
```
```html
<header><div class="wrap"><nav class="nav" aria-label="Main">
  <a class="brand" href="#"> <!-- SVG plate --> <span class="brand-name">KNETIX</span></a>
  <div class="nav-links">
    <a href="#model">The Model</a><a href="#audit">The Audit</a>
    <a href="#work">What We Ship</a><a href="#faq">FAQ</a>
    <a class="cta open-funnel" href="#">Free Audit</a>
  </div>
</nav></div></header>
```

## Warm header (rep.html / blog.html)
`rep.html:145-157`
```css
header{position:sticky;top:0;z-index:100;background:rgba(22,17,13,.82);backdrop-filter:blur(12px);border-bottom:1px solid var(--line)}
nav{max-width:var(--maxw);margin:0 auto;padding:16px 40px;display:flex;align-items:center;justify-content:space-between}
.brand .btxt b{font-family:var(--display);font-weight:700;font-size:1.15rem;letter-spacing:.16em}
.brand .btxt span{font-family:var(--display);font-weight:400;font-size:.56rem;letter-spacing:.42em;color:var(--tan-dim);margin-top:3px}
.nav-links{display:flex;align-items:center;gap:34px}
.nav-links a{font-family:var(--display);font-weight:500;font-size:.82rem;letter-spacing:.14em;text-transform:uppercase;color:var(--cream-dim);transition:color .2s}
.nav-links a:hover{color:var(--tan)}
.nav-cta{padding:11px 22px !important;font-size:.78rem !important}
@media(max-width:900px){.nav-links a:not(.nav-cta){display:none}}
```

---

## Footers

Editorial (`index.html:276-279, 647-654`):
```css
footer{background:var(--card);border-top:1px solid var(--border)}
.foot-bar{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;padding:26px 0;font-size:11px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.foot-bar a:hover{color:var(--red);border-bottom-color:var(--red)}
```
```html
<footer><div class="wrap"><div class="foot-bar">
  <span>© 2026 KNETIX — Performance Ad Agency</span>
  <span><a href="loyalty.html">See our loyalty platform →</a> · <a href="rep.html">Become a rep →</a> · <a href="blog.html">Blog →</a></span>
</div></div></footer>
```

Warm (`blog.html:133-140`):
```css
footer{border-top:1px solid var(--line);padding:46px 0 40px;background:var(--ink-2)}
.foot{display:flex;justify-content:space-between;align-items:center;gap:24px;flex-wrap:wrap}
.foot .fl{font-family:var(--display);font-weight:500;letter-spacing:.12em;text-transform:uppercase;font-size:.78rem;color:var(--tan-dim)}
.foot .fr a{font-family:var(--display);font-weight:500;letter-spacing:.12em;text-transform:uppercase;font-size:.78rem;color:var(--cream-dim)}
.foot .fr a:hover{color:var(--tan)}
```

---

## Page frame (warm dialect only)
A fixed cream hairline inset around the viewport — echoes the brand plate. `rep.html:113`:
```css
.frame{position:fixed;inset:14px;border:1px solid var(--line-strong);pointer-events:none;z-index:200}
@media(max-width:640px){.frame{inset:8px}}
```
```html
<div class="frame"></div>  <!-- first child of body -->
```

## Global fixtures (editorial)
- `<canvas id="k3d">` — fixed full-viewport Three.js 3D logo backdrop (`z-index:0`, opacity .85).
- `<div id="progress">` — 2px red scroll-progress bar pinned to top (`z-index:300`).
- `#floatCta` — fixed bottom-right "Free Audit" pill that fades in after 85vh scroll.
- Funnel modal (`#funnelModal`) appended at end of `<body>`.
