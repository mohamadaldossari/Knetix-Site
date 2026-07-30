# routes.md — Page / Route Map

Static site served as flat `.html` files (no router, no framework). Links are relative
filenames. `robots.txt` + `sitemap.xml` define the public surface; canonical domain is
`https://www.knetixmarketing.com/`.

## Live / published pages

| URL | File | Dialect | Purpose |
| --- | --- | --- | --- |
| `/` | `index.html` | Editorial | Ads agency landing (hero, model, 4-Angle audit, ship list, process, FAQ, closer, funnel modal). Includes Three.js 3D logo. |
| `/loyalty.html` | `loyalty.html` | Editorial | Loyalty platform: hero + phone render, value strip, ROI calculator, steps, features, SMS thread, pricing, FAQ, funnel modal. |
| `/rep.html` | `rep.html` | Warm | Rep recruiting: hero, pay figures, product, niches, process, FAQ, apply. |
| `/blog.html` | `blog.html` | Warm | Blog index — category sections of `.post-card` links. |
| `/get-repeat-detailing-customers.html` | article | Warm | SEO article (detailing). Has author byline. |
| `/keep-nail-clients-coming-back.html` | article | Warm | SEO article (nail salons). |
| `/make-money-in-sales-no-experience.html` | article | Warm | SEO article (sales careers → rep funnel). |

## Templates & drafts (not linked publicly)

| File | Status | Notes |
| --- | --- | --- |
| `blog-post-template.html` | Template | Boilerplate for new Warm-dialect articles. Copy → fill in. |

The `knetix-momentum.html` and `knetix-loyalty-v3/v4/v6.html` drafts were removed from the
repo on 2026-07-30. They were untracked, never deployed, and superseded by `index.html` /
`loyalty.html`. Verbatim copies live outside the repo in
`knetixmarketing-com-audit/salvaged-drafts/`, along with `team-section.html` — the `.person`
team block from the momentum draft, which exists in no tracked page and is wanted for a
future `/about`.

## Cross-links
- All footers link `index.html` ↔ `loyalty.html` ↔ `rep.html` ↔ `blog.html`.
- Articles link back to `blog.html` and into product pages.

## Assets
- `knetixwhopbanner.png`, `phone-hero.webp` (loyalty phone render; `phone-hero.png` is the
  retained lossless master, unreferenced by any page), inline SVG plate logo.
