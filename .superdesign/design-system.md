# KNETIX — Design System

> Single source of truth for visual constraints. Every design draft must use ONLY the
> fonts, colors, spacing, and component styles defined here. Do not introduce fonts,
> colors, radii, or visual styles that are not in this document.

---

## 1. Product context

**KNETIX** is a performance-driven brand operating three surfaces from one visual identity:

| Surface | Pages | Job-to-be-done |
| --- | --- | --- |
| **Ads agency** | `index.html` | Convince $3K+/mo ecommerce brands to claim a free audit. Fee = 10% of new revenue, no retainer. |
| **Loyalty platform** | `loyalty.html` | Sell a punch-card / SMS loyalty product to local service businesses. |
| **Rep recruiting** | `rep.html` | Recruit commission sales reps. |
| **Blog / SEO** | `blog.html`, `blog-post-template.html`, article pages | Rank editorial content, funnel readers to the products above. |

The mood is **editorial, high-contrast, kinetic, premium-but-hungry** — a warm near-black
canvas, oxblood red, and khaki/cream ink. It reads like a print magazine spread that
happens to move: condensed uppercase display type, italic serif accents, hairline rules,
sliding tickers, and scroll-triggered reveals.

---

## 2. Two dialects, one brand

The codebase contains **two typographic treatments** of the same palette and motifs.
Keep them distinct — do not mix fonts across a page — but treat the palette, radius,
motifs, and motion as shared.

| | **Editorial dialect** | **Warm dialect** |
| --- | --- | --- |
| Used on | `index.html`, `loyalty.html` | `rep.html`, `blog.html`, articles, `blog-post-template.html` |
| Display font | **Bebas Neue** (condensed, uppercase) | **Oswald** (condensed, uppercase) |
| Accent font | **Instrument Serif** *italic* | *(none — uses Inter 800)* |
| Body font | **DM Sans** | **Inter** |
| Background | `#0E0C0B` | `#16110d` |
| Red | `#B03030` / burgundy `#8B2E2E` | `#8a2f2f` / bright `#a83b3b` |
| Khaki accent | `#C9B89A` (beige) | `#c9b592` (tan) |
| Text | `#EDE5D8` (cream) | `#f0eadd` (cream) |
| Token prefix | `--bg / --surface / --card / --red / --beige / --cream / --muted` | `--ink / --ink-2 / --ink-3 / --maroon / --tan / --cream / --line` |

**When starting a new page, pick the dialect of the surface it belongs to.** New ads /
loyalty work → Editorial. New rep / blog / article work → Warm.

---

## 3. Color

### Editorial dialect tokens (canonical for ads + loyalty)
```css
--bg:#0E0C0B;              /* page background — warm near-black */
--surface:#161210;         /* raised sections / strips */
--card:#1C1815;            /* cards, footer, modals */
--burgundy:#8B2E2E;        /* deep brand red — large fills */
--red:#B03030;             /* primary action red */
--red-h:#c43535;           /* red hover */
--beige:#C9B89A;           /* khaki accent — serif italics, ornaments */
--cream:#EDE5D8;           /* primary text */
--muted:#7A6E62;           /* secondary text, labels */
--border:rgba(201,184,154,0.08);        /* hairline */
--border-strong:rgba(201,184,154,0.18); /* visible hairline */
--border-f:rgba(176,48,48,0.45);        /* focused input border */
```

### Warm dialect tokens (canonical for rep + blog)
```css
--ink:#16110d;      --ink-2:#1e1712;    --ink-3:#261d16;
--maroon:#8a2f2f;   --maroon-2:#a83b3b;
--tan:#c9b592;      --tan-dim:#9a8d78;
--cream:#f0eadd;    --cream-dim:#c8c0b2;
--line:rgba(240,234,221,.14);   --line-strong:rgba(240,234,221,.28);
```

### Usage rules
- **Background stays dark and warm.** Never pure black (`#000`) or cool gray.
- **Red is for action and emphasis only** — CTAs, active states, accent rules, marks,
  small ornaments (diamonds, ticks). Never large body text.
- **Burgundy/maroon** is the only acceptable large red fill (audit section, plates).
- **Khaki (beige/tan)** carries the "premium" note: serif italics, eyebrow rules,
  section tags, ornament diamonds. Use sparingly — it is a highlight, not a fill.
- **Cream** is body text on dark. **Muted** is labels and secondary copy.
- `::selection` is always `red` background + `cream` text.

---

## 4. Typography

### Fonts (Google Fonts — already linked per page)
- **Bebas Neue** — Editorial display. Uppercase, `letter-spacing` .04–.18em, `line-height` ~.95.
- **Oswald** — Warm display (300–700). Uppercase, `letter-spacing` .12–.42em.
- **Instrument Serif** — italic accent only, in `--beige`. Pairs with Bebas.
- **DM Sans** (300–700) — Editorial body.
- **Inter** (400–800) — Warm body; also its headings (weight 800, `letter-spacing:-.02em`).

### Type roles
| Role | Editorial | Warm |
| --- | --- | --- |
| Hero H1 | Bebas `clamp(56px,8vw,110px)`, `line-height:.95` | Inter 800 `clamp(2.9rem,8vw,6.2rem)` |
| Serif accent (inside H1/H2) | Instrument Serif italic, `--beige` | *(use `em` in `--maroon-2`)* |
| Section title | Bebas `clamp(36px,4.6vw,60px)` | Inter 800 `clamp(2rem,4.4vw,3.3rem)` |
| Eyebrow / label | DM Sans 600, 11–12px, `letter-spacing:.22em`, uppercase, `--red` | Oswald 500, .72–.74rem, `letter-spacing:.34–.42em`, `--tan` |
| Body | DM Sans 300–400, 14–17px, `line-height:1.6–1.85` | Inter 400, 1–1.3rem, `line-height:1.6` |
| Big number / figure | Bebas 40–80px | Oswald 700 `clamp(3.2rem,9vw,5.6rem)`, tabular-nums |

**Rules:** display type is always uppercase; italic serif is always khaki and never uppercase.
Body line-height is generous (1.6+). Labels are wide-tracked uppercase.

---

## 5. Spacing, radius, borders

- **Container:** `max-width:1180px`, side padding `32px` (Editorial) / `40px` (Warm, `22px` mobile).
- **Section rhythm:** `~106–110px` vertical padding (`78px` on mobile). Blog/rep blocks `~94px`.
- **Radius is sharp:** `2px` on buttons/inputs/nav CTA; `3–4px` on cards; `6px` max on
  message bubbles/threads. **Never rounded/pill** except the tiny loyalty status `ribbon`
  (`20px`). Corners are a brand signal — keep them crisp.
- **Borders are hairlines:** 1px in `--border`/`--line`. Dividers between rows and list
  items instead of boxes. Sections separate with **gradient "seams"** or 1px `--line`,
  not heavy frames.
- **Warm dialect adds a fixed 1px `.frame`** inset 14px around the whole viewport.

---

## 6. Shadows & elevation

Elevation is by **surface tone + hairline**, not drop shadows. The only shadows used are
**red glows on hover** for primary actions:
```css
box-shadow:0 10px 40px rgba(176,48,48,.3);   /* .btn.solid:hover */
box-shadow:0 14px 44px rgba(176,48,48,.4);   /* floating CTA */
```
Backdrop blur (`blur(12–16px)`) is used on sticky headers and modal overlays. Radial
glows (`radial-gradient(circle, rgba(138,47,47,.20), transparent 65%)`) sit behind heroes.

---

## 7. Signature motifs (use these to stay on-brand)

- **◆ Diamond** — a small rotated square (`transform:rotate(45deg)`) in `--red`/`--tan`.
  Appears in tickers, trust rows, list bullets, the logo, and the 4-Angle audit centerpiece.
- **Ghost type** — giant low-opacity Bebas words (`AUDIT`, `MOMENTUM`) parallaxing behind
  sections at `20–25vw`, opacity `.05–.08`.
- **Kinetic ticker / marquee** — infinite horizontal scroll of uppercase phrases, paused on hover.
- **Gradient seams** — `linear-gradient(var(--bg),var(--surface))` bands (`120px`) between
  tonal sections instead of hard borders.
- **Eyebrow rule** — a short 34–40px 1px red line before wide-tracked label text.
- **Hairline plate logo** — the KNETIX "K" mark: burgundy bar + khaki/burgundy wedges +
  khaki diamond, inside a faint cream square.

---

## 8. Motion

- **Scroll reveal** (`.rv` / `.reveal`): elements start `opacity:0; translateY(22–34px)`,
  animate to rest on intersection. Staggered via `--d` delay (`.05s`–`.3s`).
  Easing `cubic-bezier(.16,1,.3,1)`, duration `.6–.85s`.
- **Hero line rise:** `overflow:hidden` mask, inner span `translateY(112%)` → `0`.
- **Hover lifts:** buttons/cards `translateY(-2px)`; rows slide `padding-left:18px`; terms `translateX(6px)`.
- **Ticker/marquee:** `26–34s` linear infinite, `translateX(-50%)`.
- **3D logo** (index only): Three.js extruded K reacting to scroll + pointer.
- **Reduced motion:** always honor `prefers-reduced-motion` — kill animations, freeze
  ticker, drop reveals to visible, disable smooth scroll.

---

## 9. Core components (see `.superdesign/init/components.md` for full source)

- **Buttons** — `.btn.solid` (red fill), `.btn.ghost` (khaki outline); Warm: `.btn-primary` / `.btn-ghost`.
- **Sticky header** — blurred translucent bar, plate logo + wordmark, wide-tracked nav links, red CTA.
- **Ticker / marquee** — kinetic phrase strip.
- **Terms / stat cards** — floating value cards (`$0 / 10% / None`), one `.feature` in burgundy.
- **Ship rows** — bordered A/B/C/D list rows with hover slide.
- **Process steps** — big ghost-number + heading + serif subhead.
- **FAQ** — `<details>` accordion, Bebas summary + rotating `+`.
- **Multi-step funnel modal** (`.kf-*`) — progress bar, binary/choice/input steps, soft-reject, success.
- **Loyalty**: value calculator panel, phone render, SMS thread bubbles, pricing cards.
- **Footer** — hairline top, muted uppercase links.

---

## 10. Do / Don't

**Do:** keep backgrounds warm-dark; lead with condensed uppercase display type; use khaki
italic serif for the one "premium" accent per heading; keep corners at 2px; separate with
hairlines and gradient seams; add one diamond/ghost/ticker motif per page; stagger reveals.

**Don't:** introduce new fonts or a blue/cool palette; use pure black or white; use large
red text or red backgrounds outside burgundy plates; add heavy drop shadows or rounded
pills; mix Bebas and Oswald on the same page; box everything in visible borders.
