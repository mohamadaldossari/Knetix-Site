# pages.md — Page Dependency Trees

**Every page is fully self-contained.** There is no framework, no import graph, no shared
CSS/JS files. Each `.html` file inlines its own `<style>` (design tokens + all component
CSS) and `<script>` in `<head>`/`<body>`. The only external dependencies are Google Fonts
and (index only) the Three.js CDN.

Therefore, for any design task, the **single `--context-file` is the page's own `.html`**,
plus `.superdesign/design-system.md`. There are no sub-component files to trace.

---

### `index.html` (Editorial) — Ads agency
```
index.html
├─ Google Fonts: Bebas Neue, Instrument Serif, DM Sans
├─ CDN: three.js r128 (3D logo)
├─ inline <style>  → editorial tokens + all components (lines 84-414)
├─ sections: header · hero+terms · ticker · manifesto · 4-angle audit · ship rows · process · faq · closer · footer
├─ #k3d canvas · #progress · #floatCta
└─ #funnelModal (.kf-* multi-step funnel)
```
Context files: `index.html`, `.superdesign/design-system.md`

### `loyalty.html` (Editorial) — Loyalty platform
```
loyalty.html
├─ Google Fonts: Bebas Neue, Instrument Serif, DM Sans
├─ asset: phone-hero.webp (.render)
├─ inline <style> → editorial tokens + calculator/phone/SMS/pricing components
├─ sections: header · hero+phone · value strip · calculator · steps · features · sms · pricing · faq · final · footer
├─ .ribbon (fixed status pill)
└─ #funnelModal
```
Context files: `loyalty.html`, `.superdesign/design-system.md`, `phone-hero.webp` (placeholder ok)

### `rep.html` (Warm) — Rep recruiting
```
rep.html
├─ Google Fonts: Oswald, Inter
├─ inline <style> → warm tokens + btn/eyebrow/marquee/pay/prod/niche components
├─ .frame (fixed hairline)
└─ sections: header · marquee · hero · pay grid · product · process · faq · apply · footer
```
Context files: `rep.html`, `.superdesign/design-system.md`

### `blog.html` (Warm) — Blog index
```
blog.html
├─ Google Fonts: Oswald, Inter
├─ inline <style> → warm tokens + post-card/category components
├─ .frame
└─ sections: header · blog-intro · blog-cat × N (.blog-grid of .post-card) · footer
```
Context files: `blog.html`, `.superdesign/design-system.md`

### Article pages (Warm) — `get-repeat-detailing-customers.html`, `keep-nail-clients-coming-back.html`, `make-money-in-sales-no-experience.html`
```
<article>.html
├─ Google Fonts: Oswald, Inter
├─ inline <style> → warm tokens + long-form article typography
├─ .frame
└─ sections: header · article hero · prose body · (byline) · CTA · footer
```
Context files: the article `.html` + `blog-post-template.html` (structure), `.superdesign/design-system.md`

### `blog-post-template.html` (Warm) — Article boilerplate
Starting point for new articles. Context files: `blog-post-template.html`, `.superdesign/design-system.md`
