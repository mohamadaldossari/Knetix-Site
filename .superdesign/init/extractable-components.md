# extractable-components.md — Reusable Component Catalog

Components worth extracting into reusable DraftComponents, grouped by category. Full
source lives in `components.md`; this file lists props to parameterize and elements to
hardcode. (Dialect E = Editorial / Bebas+DM Sans, W = Warm / Oswald+Inter.)

## Layout Components

| Component | Source | Dialect | Extractable props | Hardcode |
| --- | --- | --- | --- | --- |
| Header / Nav | `index.html:423`, `rep.html:145` | E / W | `activeLink`, nav item `href`s, `ctaLabel`, `ctaHref` | plate SVG, wordmark, blur/border styles |
| Footer | `index.html:647`, `blog.html:133` | E / W | copyright year, footer link list | uppercase styling, hairline top |
| Page frame | `rep.html:113` | W | — | fixed inset hairline |
| Brand plate logo | `index.html:427` | both | `size` | all SVG geometry/colors |

## Basic Components

| Component | Source | Dialect | Extractable props | Hardcode |
| --- | --- | --- | --- | --- |
| Button | `index.html:147`, `rep.html:130` | E / W | `variant` (solid/ghost \| primary/ghost), `label`, `href` | padding, radius 2px, uppercase, transitions |
| Eyebrow label | `index.html:107`, `rep.html:119` | E / W | `text`, `dim` boolean | red/tan color, tracking, leading rule |
| Section title | `index.html:179` | E | `text`, `accentText` (serif italic span) | Bebas + Instrument Serif styling |
| Term / stat card | `index.html:154` | E | `value`, `label`, `caption`, `feature` boolean | card bg, hover slide, Bebas value |
| Ship row | `index.html:226` | E | `id`, `name`, `desc` (html), `href` | grid, hover padding-left, colors |
| Process step | `index.html:238` | E | `num`, `week`, `title`, `subtitle`, `body` | ghost-number style, serif subhead |
| FAQ item | `index.html:251` | E | `question`, `answer` (html) | `<details>` accordion, rotating `+` |
| Post card | `blog.html:124` | W | `category`, `title`, `excerpt`, `meta`, `href`, `isSoon`, `badge` | card bg, hover lift, tan category |
| Pay figure cell | `rep.html:187` | W | `figure`, `caption` | Oswald 700 figure, border-left grid |
| Ticker / marquee | `index.html:167`, `rep.html:160` | E / W | `items` (array of phrases; support `em` accent) | animation, diamond `◆`, hover-pause |
| Value calculator | `loyalty.html:83` | E | `priceLabel`, slider config, output formula | panel, range thumb, paid/free segs |
| SMS thread | `loyalty.html:131` | E | array of `{text, mine, time}` bubbles | bubble radius (12/3px), red "me" bubble |
| Pricing card | `loyalty.html:140` | E | `tag`, `title`, `body` | card bg, red tag |
| Funnel modal | `index.html:293` | E | step config (questions, choices, inputs) | modal overlay, `.kf-*` styling, progress bar |

## Motion utilities (attach, don't extract)
- `.rv` / `.reveal` — scroll-reveal; add class + `--d` stagger delay, JS IntersectionObserver.
- `.seam` / `.seam.rev` — gradient band between tonal sections (Editorial).
- Ghost type — giant low-opacity Bebas word, parallax on scroll.

## Notes
- All props must have a `defaultValue`. For links default to `"#"`.
- Keep radius at 2–4px and uppercase display type when reproducing — these are brand signals.
- Never swap a component's dialect fonts; extract per-dialect variants instead.
