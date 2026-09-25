/*
 * SpotJar: scroll-driven hero scene and the floating jar.
 *
 * The whole visible state is a pure function of the current scroll position:
 * progress `p` through the pinned scene, which step is active, and whether the
 * steps are scrolled past. Nothing depends on how the page got there, so fast
 * scrolling in either direction can never leave a half-finished state.
 *
 * JS only toggles classes and sets custom properties; every movement is a CSS
 * transition (see css/landing.css).
 */
(function () {
  'use strict';

  var scene = document.getElementById('how');
  if (!scene) return;

  var typed = scene.querySelector('.typed');
  var captions = scene.querySelectorAll('.cap');
  var dots = scene.querySelectorAll('.dots li');
  var steps = document.querySelector('.sj-steps');
  var stepEls = document.querySelectorAll('.sj-step');
  var jar = document.querySelector('.jar');
  var jarLabel = jar && jar.querySelector('.jar__label');

  var TEXT_LENGTH = typed ? typed.children.length : 0;
  var QUANT = 200;
  var LEVELS = jar && jar.dataset.levels
    ? jar.dataset.levels.split('|')
    : ['Shared', 'Collected', 'Detailed', 'On the map', 'In a trip', 'On the road'];
  var INCOMING = jar && jar.dataset.incoming ? jar.dataset.incoming : 'Incoming...';

  // Phase boundaries in p.
  var FOUND = 0.2;
  var PRESS = 0.4;
  var SHEET = 0.5;
  var PICK = 0.64;
  var SAVED = 0.84;

  var last = {};
  var queued = false;

  function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
  }

  function captionFor(p) {
    if (p < FOUND) return 0;
    if (p < PRESS) return 1;
    if (p < PICK) return 2;
    if (p < SAVED) return 3;
    return 4;
  }

  /** Everything the page shows, derived from the scroll position alone. */
  function read() {
    var vh = window.innerHeight;
    var r = scene.getBoundingClientRect();
    var span = r.height - vh;
    var p = span > 0 ? clamp(-r.top / span, 0, 1) : 0;
    p = Math.round(p * QUANT) / QUANT;

    var active = -1;
    for (var i = 0; i < stepEls.length; i++) {
      if (stepEls[i].getBoundingClientRect().top < vh * 0.55) active = i;
    }
    // The steps are done once the section has scrolled past 45% of the viewport.
    // With the footer below it that point may never come, so the last step
    // scrolled mostly out of view, or the end of the page, counts as well.
    var lastStep = stepEls[stepEls.length - 1];
    var atEnd = window.scrollY + vh >= document.documentElement.scrollHeight - 4;
    var stepsDone = atEnd ||
      (steps && steps.getBoundingClientRect().bottom < vh * 0.45) ||
      (lastStep && lastStep.getBoundingClientRect().bottom < vh * 0.6);

    // Typing runs from p = 0.02 to 0.17, so the name is complete before the pin drops.
    var chars = Math.round(clamp((p - 0.02) / 0.15, 0, 1) * TEXT_LENGTH);
    var level = p < SAVED ? 0 : 1 + (active + 1);

    return {
      chars: chars,
      caption: captionFor(p),
      empty: chars === 0,
      found: p >= FOUND,
      press: p >= PRESS && p < SHEET,
      sheet: p >= SHEET && p < SAVED,
      pick: p >= PICK && p < SAVED,
      saved: p >= SAVED,
      jarVisible: p >= PRESS && !stepsDone,
      level: Math.min(level, LEVELS.length)
    };
  }

  function changed(key, value) {
    if (last[key] === value) return false;
    last[key] = value;
    return true;
  }

  function render(s) {
    if (changed('chars', s.chars) && typed) typed.style.setProperty('--chars', s.chars);

    ['empty', 'found', 'press', 'sheet', 'pick', 'saved'].forEach(function (k) {
      if (changed(k, s[k])) scene.classList.toggle('s-' + k, s[k]);
    });

    if (changed('caption', s.caption)) {
      for (var i = 0; i < captions.length; i++) {
        captions[i].classList.toggle('is-active', i === s.caption);
        if (dots[i]) dots[i].classList.toggle('is-active', i === s.caption);
      }
    }

    if (!jar) return;
    if (changed('jarVisible', s.jarVisible)) jar.classList.toggle('is-visible', s.jarVisible);
    if (changed('level', s.level)) {
      jar.style.setProperty('--level', s.level);
      jar.classList.toggle('is-in', s.level > 0);
      jarLabel.textContent = s.level > 0
        ? s.level + ' / ' + LEVELS.length + ': ' + LEVELS[s.level - 1]
        : INCOMING;
    }
  }

  function update() {
    queued = false;
    render(read());
  }

  function queue() {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(update);
  }

  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue, { passive: true });
  update();
})();
