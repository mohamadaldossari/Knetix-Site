# theme.md — Design Tokens

This is a static multi-page HTML site. There is **no** `tailwind.config`, no global
stylesheet, and no build step — every page carries its own `<style>` block in `<head>`,
and tokens are declared as CSS custom properties on `:root`. Two token sets exist (see
`design-system.md` §2). Both are reproduced verbatim below.

---

## Editorial dialect — `:root` (index.html / loyalty.html)

Source: `index.html:85-98`
```css
:root{
  --bg:#0E0C0B;
  --surface:#161210;
  --card:#1C1815;
  --burgundy:#8B2E2E;
  --red:#B03030;
  --red-h:#c43535;
  --beige:#C9B89A;
  --cream:#EDE5D8;
  --muted:#7A6E62;
  --border:rgba(201,184,154,0.08);
  --border-strong:rgba(201,184,154,0.18);
  --border-f:rgba(176,48,48,0.45);
}
```

Base element styles (`index.html:99-108`):
```css
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--cream);
     line-height:1.6;overflow-x:hidden;-webkit-font-smoothing:antialiased}
::selection{background:var(--red);color:var(--cream)}
a{color:inherit}
:focus-visible{outline:2px solid var(--red);outline-offset:3px}
.wrap{max-width:1180px;margin:0 auto;padding:0 32px}
.label{font-size:11px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--red)}
.label.dim{color:var(--muted)}
```

Loyalty.html adds `--maxw:1180px` and reuses the same palette.

---

## Warm dialect — `:root` (rep.html / blog.html / articles / blog-post-template.html)

Source: `rep.html:82-97`, `blog.html:44-59`
```css
:root{
  --ink:#16110d;          /* warm near-black background */
  --ink-2:#1e1712;        /* raised panel */
  --ink-3:#261d16;        /* card / hover */
  --maroon:#8a2f2f;       /* brand red */
  --maroon-2:#a83b3b;     /* bright red (hover/accent) */
  --tan:#c9b592;          /* khaki accent */
  --tan-dim:#9a8d78;      /* muted label */
  --cream:#f0eadd;        /* primary text */
  --cream-dim:#c8c0b2;    /* secondary text */
  --line:rgba(240,234,221,.14);
  --line-strong:rgba(240,234,221,.28);
  --maxw:1180px;
  --display:'Oswald',system-ui,sans-serif;
  --body:'Inter',system-ui,sans-serif;
}
```

Base element styles (`rep.html:99-117`):
```css
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{background:var(--ink);color:var(--cream);font-family:var(--body);
     line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden}
a{color:inherit;text-decoration:none}
::selection{background:var(--maroon);color:var(--cream)}
.frame{position:fixed;inset:14px;border:1px solid var(--line-strong);pointer-events:none;z-index:200}
.wrap{max-width:var(--maxw);margin:0 auto;padding:0 40px}
```

---

## Fonts

Loaded per page via Google Fonts `<link>`:

Editorial (`index.html:82`):
```html
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap" rel="stylesheet">
```
Warm (`rep.html:79`):
```html
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

| Family | Role | Weights |
| --- | --- | --- |
| Bebas Neue | Editorial display (uppercase) | 400 |
| Instrument Serif | Italic accent (khaki) | 400 italic |
| DM Sans | Editorial body | 300–700 |
| Oswald | Warm display (uppercase) | 300–700 |
| Inter | Warm body + headings | 400–800 |

---

## Scale reference

| Token | Value |
| --- | --- |
| Container max-width | `1180px` |
| Container padding | `32px` (editorial) / `40px`→`22px` (warm) |
| Section padding (Y) | `106–110px` desktop, `78px` mobile |
| Border radius | `2px` buttons/inputs · `3–4px` cards · `6px` bubbles/threads · `20px` loyalty ribbon only |
| Hairline border | `rgba(201,184,154,.08)` / `rgba(240,234,221,.14)` |
| Body line-height | `1.6` base, `1.65–1.85` long-form |
| Red hover glow | `0 10px 40px rgba(176,48,48,.3)` |
| Reveal easing | `cubic-bezier(.16,1,.3,1)`, `.6–.85s` |
| Breakpoints | `900/920px` (layout collapse), `760px`, `640/560px`, `520px` |
