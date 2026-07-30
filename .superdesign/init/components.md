# components.md — UI Primitives

No shared component directory exists; every component lives inline in a page's `<style>`
and `<body>`. Below are the reusable primitives with full source, grouped by dialect.

---

## EDITORIAL DIALECT (index.html / loyalty.html)

### Button — `.btn`
`index.html:147-151`
```css
.btn{display:inline-flex;align-items:center;gap:10px;padding:17px 34px;font-size:13px;
  font-weight:600;letter-spacing:.1em;text-transform:uppercase;text-decoration:none;
  border-radius:2px;transition:background .2s,transform .2s,box-shadow .3s,border-color .2s,color .2s;
  cursor:pointer;font-family:inherit;border:none}
.btn.solid{background:var(--red);color:var(--cream);border:1px solid var(--red)}
.btn.solid:hover{background:var(--red-h);border-color:var(--red-h);transform:translateY(-2px);
  box-shadow:0 10px 40px rgba(176,48,48,.3)}
.btn.ghost{border:1px solid rgba(201,184,154,.2);color:var(--cream);background:transparent}
.btn.ghost:hover{border-color:var(--beige);color:var(--beige)}
```
```html
<a class="btn solid open-funnel" href="#">Claim Your Free Audit</a>
<a class="btn ghost" href="#model">How the Deal Works</a>
```

### Eyebrow label — `.label`
```css
.label{font-size:11px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--red)}
```
```html
<div class="hero-eyebrow"><span class="tick"></span><span class="label">Zero Risk. Performance Only.</span></div>
/* .hero-eyebrow .tick{width:40px;height:1px;background:var(--red);opacity:.5} */
```

### Section heading — `.sec-title`
```css
.sec-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(36px,4.6vw,60px);letter-spacing:.05em;color:var(--cream);line-height:1}
.sec-title .serif-it{font-family:'Instrument Serif',serif;font-style:italic;color:var(--beige);letter-spacing:.01em}
```
```html
<h2 class="sec-title">What we <span class="serif-it">ship</span></h2>
```

### Term / stat card — `.term`
`index.html:154-163`
```css
.terms{display:flex;flex-direction:column;gap:14px}
.term{background:rgba(28,24,21,.72);backdrop-filter:blur(6px);border:1px solid var(--border-strong);
  border-radius:3px;padding:24px 26px;display:flex;align-items:baseline;justify-content:space-between;
  gap:18px;transition:transform .3s,border-color .3s}
.term:hover{transform:translateX(6px);border-color:rgba(176,48,48,.4)}
.term .v{font-family:'Bebas Neue',sans-serif;font-size:40px;line-height:1;letter-spacing:.05em;color:var(--cream);flex-shrink:0}
.term .k{font-size:10px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--red);display:block;margin-bottom:4px}
.term small{font-size:12.5px;color:var(--muted);font-weight:300;line-height:1.55;display:block}
.term.feature{background:rgba(139,46,46,.55);border-color:rgba(176,48,48,.5)}
.term.feature .k{color:var(--cream)}
```
```html
<div class="term feature"><span class="v">10%</span>
  <span class="meta"><span class="k">Our Only Fee</span><small>A share of new attributed revenue.</small></span></div>
```

### Ship row — `.row`
`index.html:226-233`
```css
.row{display:grid;grid-template-columns:80px 1fr 1fr;gap:0;text-decoration:none;padding:34px 0;
  border-bottom:1px solid var(--border);transition:padding-left .3s,background .3s;cursor:pointer}
.row:hover{padding-left:18px}
.row:hover .row-name{color:var(--red-h)}
.row-id{font-family:'Bebas Neue',sans-serif;font-size:20px;color:rgba(176,48,48,.55);letter-spacing:.08em;padding-top:6px}
.row-name{font-family:'Bebas Neue',sans-serif;font-size:clamp(26px,3vw,40px);letter-spacing:.05em;line-height:1.02;color:var(--cream)}
.row-desc{font-size:14px;color:var(--muted);font-weight:300;line-height:1.78;align-self:center}
```

### Process step — `.step`
`index.html:238-245`
```css
.step .num{font-family:'Bebas Neue',sans-serif;font-size:80px;color:rgba(139,46,46,.18);line-height:1;display:block;transition:color .3s}
.step:hover .num{color:rgba(176,48,48,.34)}
.step h3{font-family:'Bebas Neue',sans-serif;font-size:27px;letter-spacing:.06em;margin:18px 0 2px;color:var(--cream)}
.step h3 span{display:block;font-family:'Instrument Serif',serif;font-style:italic;font-size:17px;color:var(--beige);margin:4px 0 12px}
.step p{font-size:14px;color:var(--muted);font-weight:300;line-height:1.78}
```

### FAQ accordion — `.faq-item`
`index.html:251-258`
```css
.faq-item{border-bottom:1px solid var(--border)}
.faq-item summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:24px;
  padding:26px 0;font-family:'Bebas Neue',sans-serif;font-size:clamp(19px,2.2vw,26px);letter-spacing:.05em;color:var(--cream)}
.faq-item summary::-webkit-details-marker{display:none}
.faq-item summary .pm{flex-shrink:0;width:30px;height:30px;border:1px solid rgba(201,184,154,.3);border-radius:2px;
  display:flex;align-items:center;justify-content:center;font-size:16px;color:var(--red);transition:transform .3s,background .2s}
.faq-item[open] summary .pm{transform:rotate(45deg);background:rgba(176,48,48,.12)}
.faq-item .faq-a{padding:0 60px 28px 0;font-size:15px;color:var(--beige);opacity:.8;font-weight:300;line-height:1.85;max-width:62ch}
```

### Ticker — `.ticker`
`index.html:167-173`
```css
.ticker{overflow:hidden;border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:20px 0;background:rgba(22,18,16,.6);backdrop-filter:blur(4px)}
.ticker-track{display:flex;gap:0;width:max-content;animation:tick 26s linear infinite}
.ticker:hover .ticker-track{animation-play-state:paused}
@keyframes tick{to{transform:translateX(-50%)}}
.ticker-item{display:flex;align-items:center;gap:28px;padding:0 28px;font-family:'Bebas Neue',sans-serif;font-size:26px;letter-spacing:.12em;color:var(--cream);white-space:nowrap}
.ticker-item em{font-family:'Instrument Serif',serif;font-style:italic;color:var(--beige)}
.ticker-item .dia{width:8px;height:8px;background:var(--red);transform:rotate(45deg);flex-shrink:0}
```
*JS duplicates the track for a seamless loop: `track.innerHTML += track.innerHTML`.*

### Funnel modal — `.kf-*` (index.html / loyalty.html)
A multi-step lead-capture modal. Full source at `index.html:293-413`. Key parts:
```css
.modal-overlay{position:fixed;inset:0;z-index:500;background:rgba(8,6,5,0.88);backdrop-filter:blur(8px);
  display:flex;align-items:center;justify-content:center;padding:24px 16px;opacity:0;visibility:hidden;transition:opacity .3s,visibility .3s;overflow-y:auto}
.modal-overlay.open{opacity:1;visibility:visible}
.kf-card{background:var(--card);border:1px solid var(--border);padding:48px 44px 44px;position:relative;overflow:hidden}
.kf-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--red),transparent)}
.kf-question{font-family:'Bebas Neue',sans-serif;font-size:clamp(24px,4vw,34px);letter-spacing:.05em;color:var(--cream);line-height:1.05}
.kf-binary-btn,.kf-choice-btn{background:transparent;border:1px solid var(--border);color:var(--beige);border-radius:2px;cursor:pointer;transition:border-color .2s,background .2s,color .2s}
.kf-choice-btn.selected{border-color:var(--red);background:rgba(176,48,48,.1);color:var(--cream)}
.kf-input,.kf-textarea{width:100%;background:var(--surface);border:1px solid var(--border);color:var(--cream);font-family:'DM Sans',sans-serif;padding:16px 18px;border-radius:2px;outline:none;transition:border-color .2s}
.kf-input:focus{border-color:var(--border-f)}
.kf-next-btn{flex:1;background:var(--red);color:var(--cream);border:none;font-weight:700;letter-spacing:.12em;text-transform:uppercase;padding:16px 32px;border-radius:2px}
.kf-progress-fill{height:100%;background:var(--red);transition:width .5s cubic-bezier(.16,1,.3,1)}
```

### Loyalty-only: calculator panel, phone render, SMS thread
`loyalty.html:83-134`
```css
.calc-panel{background:var(--surface);border:1px solid var(--border-strong);border-radius:3px;padding:40px 40px 34px}
.calc-big{font-family:'Bebas Neue';font-size:52px;color:var(--red);letter-spacing:0.02em;line-height:.9}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:24px;border-radius:1px;background:var(--red);cursor:pointer}
.seg{flex:1;background:transparent;border:1px solid var(--border-strong);border-radius:1px}
.seg.paid{background:var(--red);border-color:var(--red)}
.seg.free{border:1px dashed var(--red);background:rgba(176,48,48,0.16)}
.fcard{background:var(--surface);border:1px solid var(--border);border-radius:4px;padding:28px;transition:border-color .2s,transform .2s}
.bub{background:var(--card);border-radius:12px 12px 12px 3px;padding:13px 16px;font-size:13px;max-width:86%;color:var(--cream)}
.bub.me{background:var(--red);color:var(--cream);border-radius:12px 12px 3px 12px;margin-left:auto}
```

---

## WARM DIALECT (rep.html / blog.html)

### Button — `.btn`
`rep.html:130-142`
```css
.btn{display:inline-flex;align-items:center;gap:10px;font-family:var(--display);font-weight:600;font-size:.9rem;
  letter-spacing:.12em;text-transform:uppercase;padding:15px 30px;border:1px solid transparent;cursor:pointer;
  transition:transform .15s,background .2s,color .2s,border-color .2s}
.btn:focus-visible{outline:2px solid var(--tan);outline-offset:3px}
.btn-primary{background:var(--maroon);color:var(--cream)}
.btn-primary:hover{background:var(--maroon-2);transform:translateY(-2px)}
.btn-ghost{background:transparent;color:var(--cream);border-color:var(--line-strong)}
.btn-ghost:hover{border-color:var(--tan);color:var(--tan);transform:translateY(-2px)}
```

### Eyebrow — `.eyebrow` / section tag — `.sec-tag`
`rep.html:119-124, 180-181`
```css
.eyebrow{font-family:var(--display);font-weight:500;font-size:.74rem;letter-spacing:.42em;text-transform:uppercase;color:var(--tan);display:flex;align-items:center;gap:14px}
.eyebrow::before{content:"";width:34px;height:1px;background:var(--maroon-2)}
.sec-tag{font-family:var(--display);font-weight:500;font-size:.72rem;letter-spacing:.34em;text-transform:uppercase;color:var(--tan-dim);margin-bottom:20px}
.sec-tag b{color:var(--maroon-2);font-weight:700;margin-right:6px}
```

### Post card — `.post-card` (blog)
`blog.html:124-131`
```css
.post-card{display:flex;flex-direction:column;gap:12px;background:var(--ink-2);border:1px solid var(--line);padding:28px 26px;transition:transform .2s,background .2s,border-color .2s}
a.post-card:hover{border-color:var(--line-strong);background:var(--ink-3);transform:translateY(-3px)}
.post-card.is-soon{opacity:.6}
.pc-cat{font-family:var(--display);font-weight:500;font-size:.68rem;letter-spacing:.24em;text-transform:uppercase;color:var(--tan)}
.pc-title{font-size:1.22rem;line-height:1.16}
.pc-excerpt{color:var(--cream-dim);font-size:.95rem;flex:1 0 auto}
.pc-badge{border:1px solid var(--line-strong);color:var(--tan-dim);padding:4px 10px;font-size:.62rem;letter-spacing:.16em}
```

### Marquee — `.marquee`
`rep.html:160-164`
```css
.marquee{border-bottom:1px solid var(--line);background:var(--ink-2);overflow:hidden;padding:11px 0}
.marquee-track{display:flex;white-space:nowrap;width:max-content;animation:scroll 34s linear infinite}
.marquee-track span{font-family:var(--display);font-weight:500;font-size:.8rem;letter-spacing:.28em;text-transform:uppercase;color:var(--tan-dim);padding:0 26px}
.marquee-track span::after{content:"◆";color:var(--maroon-2);margin-left:52px;font-size:.55rem;vertical-align:middle}
@keyframes scroll{to{transform:translateX(-50%)}}
```

### Pay figure grid — `.pay-cell`
`rep.html:187-195`
```css
.pay-grid{display:grid;grid-template-columns:repeat(3,1fr);margin-top:64px;border-top:1px solid var(--line)}
.pay-cell{padding:42px 26px;text-align:center;border-left:1px solid var(--line)}
.pay-cell .fig{font-family:var(--display);font-weight:700;font-size:clamp(3.2rem,9vw,5.6rem);line-height:.9;color:var(--cream)}
.pay-cell .cap{font-family:var(--display);font-weight:500;font-size:.82rem;letter-spacing:.24em;text-transform:uppercase;color:var(--tan);margin-top:16px}
```
