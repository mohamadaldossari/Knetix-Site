/* KNETIX motion layer.
   Enhancement only. Every reveal starts from the visible state in the markup;
   the hiding rules below are injected by this script, so with JS off or with
   reduced motion requested the page renders fully visible and static. */
(function () {
  'use strict';

  var mq = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  var REDUCED = !!(mq && mq.matches);
  var targets = document.querySelectorAll('[data-reveal]');
  var dials = document.querySelectorAll('[data-dial]');
  var counters = document.querySelectorAll('[data-count]');

  /* Reduced motion, or no IntersectionObserver: leave everything as authored. */
  if (REDUCED || !('IntersectionObserver' in window)) return;
  if (!targets.length && !dials.length && !counters.length) return;

  var css = document.createElement('style');
  css.textContent =
    '[data-reveal]{opacity:0;transform:translateY(14px);' +
      'transition:opacity var(--dur-slow) var(--ease-out),transform var(--dur-slow) var(--ease-out);' +
      'transition-delay:var(--rd,0ms);will-change:opacity,transform}' +
    '[data-reveal].is-in{opacity:1;transform:none}';
  document.head.appendChild(css);

  /* Stagger direct children of a marked group at 60ms each. */
  Array.prototype.forEach.call(document.querySelectorAll('[data-reveal-stagger]'), function (group) {
    var kids = group.querySelectorAll(':scope > [data-reveal]');
    Array.prototype.forEach.call(kids, function (kid, i) {
      kid.style.setProperty('--rd', (i * 60) + 'ms');
    });
  });

  /* Park each dial arc at zero length so it can draw in on first reveal. */
  Array.prototype.forEach.call(dials, function (arc) {
    arc.setAttribute('data-dial-to', arc.getAttribute('stroke-dasharray') || '');
    arc.setAttribute('stroke-dasharray', '0 9999');
  });

  function drawDial(arc) {
    var to = arc.getAttribute('data-dial-to');
    if (to) arc.setAttribute('stroke-dasharray', to);
  }

  /* Count a figure up to the value already printed in the markup. */
  function countUp(el) {
    var raw = el.textContent.trim();
    var target = parseFloat(raw.replace(/[^0-9.]/g, ''));
    if (!isFinite(target) || target <= 0) return;
    var prefix = raw.slice(0, raw.search(/[0-9]/));
    var suffix = raw.slice(raw.search(/[0-9]/)).replace(/[0-9.,]/g, '');
    var dur = 420, t0 = 0;
    function frame(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      var v = Math.round(target * eased);
      el.textContent = prefix + v.toLocaleString('en-US') + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    el.textContent = prefix + '0' + suffix;
    requestAnimationFrame(frame);
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      /* A fast jump (End key, scrollbar drag) can carry an element from below the
         viewport to above it without an intersecting frame. Treat anything already
         scrolled past as revealed so it can never be stranded hidden. */
      var passed = e.boundingClientRect && e.boundingClientRect.bottom < 0;
      if (!e.isIntersecting && !passed) return;
      var el = e.target;
      io.unobserve(el);
      if (el.hasAttribute('data-reveal')) el.classList.add('is-in');
      if (el.hasAttribute('data-dial')) drawDial(el);
      if (el.hasAttribute('data-count')) countUp(el);
      Array.prototype.forEach.call(el.querySelectorAll('[data-dial]'), drawDial);
      Array.prototype.forEach.call(el.querySelectorAll('[data-count]'), countUp);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  function observe(list) { Array.prototype.forEach.call(list, function (el) { io.observe(el); }); }
  observe(targets);
  observe(dials);
  observe(counters);

  /* A single-frame jump past an element fires no observer callback at all, because
     its intersection state never changed. This sweep guarantees nothing is stranded. */
  var queued = false;
  function sweep() {
    queued = false;
    var rest = document.querySelectorAll('[data-reveal]:not(.is-in)');
    if (!rest.length) { window.removeEventListener('scroll', onScroll); return; }
    Array.prototype.forEach.call(rest, function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
        el.classList.add('is-in');
        io.unobserve(el);
        Array.prototype.forEach.call(el.querySelectorAll('[data-dial]'), drawDial);
      }
    });
  }
  function onScroll() { if (queued) return; queued = true; requestAnimationFrame(sweep); }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* If the user switches to reduced motion mid-session, stop hiding anything. */
  if (mq && mq.addEventListener) {
    mq.addEventListener('change', function (ev) {
      if (!ev.matches) return;
      io.disconnect();
      Array.prototype.forEach.call(document.querySelectorAll('[data-reveal]'), function (el) {
        el.classList.add('is-in');
      });
      Array.prototype.forEach.call(document.querySelectorAll('[data-dial]'), drawDial);
    });
  }
})();
