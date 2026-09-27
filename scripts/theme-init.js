/* Runs synchronously in <head>, before first paint. Kept external (not
   inline) so the Content-Security-Policy needs no script hash.

   - Applies a stored theme choice, so there is no flash of the wrong theme.
   - Adds the `js` class that lets CSS hide elements it is about to animate.
     The timeout is a safety net: if site.js never runs, the class is removed
     so nothing stays hidden behind a reveal.
   - Marks an arrival from outside the site, so the nav entrance plays once
     on arrival and not on every page change within the site. */
(function () {
    var r = document.documentElement;
    try {
        var t = localStorage.getItem('theme');
        if (t === 'light' || t === 'dark') r.setAttribute('data-theme', t);
    } catch (e) {}
    r.classList.add('js');
    try {
        if (!document.referrer || new URL(document.referrer).origin !== location.origin) {
            r.classList.add('is-arriving');
        }
    } catch (e) {}
    window.__jsFallback = setTimeout(function () { r.classList.remove('js'); }, 2500);
})();
