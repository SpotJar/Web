/* Language auto-detect. First visit to an English page with a German browser
   language goes to the German twin. Picking a language in the switcher is
   remembered and wins over detection from then on. */
(function () {
  var KEY = 'spotjar-lang';
  var DE = { '/': '/de/', '/policy/': '/de/datenschutz/', '/imprint/': '/de/impressum/' };
  var stored = null;
  try { stored = localStorage.getItem(KEY); } catch (e) {}

  var path = location.pathname.replace(/index\.html$/, '');
  if (!stored && DE[path]) {
    var langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language];
    var first = String(langs[0] || '').toLowerCase();
    if (first.indexOf('de') === 0) location.replace(DE[path] + location.search + location.hash);
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('.language-switch a[hreflang]');
    if (!a) return;
    try { localStorage.setItem(KEY, a.getAttribute('hreflang')); } catch (err) {}
  });
})();
