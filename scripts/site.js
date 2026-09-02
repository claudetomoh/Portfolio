/* ==========================================================================
   Claude Tomoh — site behaviour
   No dependencies. Everything here progressively enhances markup that
   already works without JS.
   ========================================================================== */
(function () {
    'use strict';

    var root = document.documentElement;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    /* ── Theme ─────────────────────────────────────────────────────────────
       The initial theme is applied by a tiny inline script in <head> so there
       is no flash. This only wires up the toggle and keeps it in sync. */
    function initTheme() {
        var btn = document.querySelector('[data-theme-toggle]');
        if (!btn) return;

        function current() {
            return root.getAttribute('data-theme') ||
                (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        }

        function label() {
            var next = current() === 'dark' ? 'light' : 'dark';
            btn.setAttribute('aria-label', 'Switch to ' + next + ' theme');
            btn.setAttribute('title', 'Switch to ' + next + ' theme');
        }

        label();

        btn.addEventListener('click', function () {
            var next = current() === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', next);
            try { localStorage.setItem('theme', next); } catch (e) {}
            label();
        });

        // Follow the OS while the visitor has not made an explicit choice
        var mq = window.matchMedia('(prefers-color-scheme: dark)');
        var onChange = function () {
            var stored = null;
            try { stored = localStorage.getItem('theme'); } catch (e) {}
            if (!stored) { root.removeAttribute('data-theme'); label(); }
        };
        if (mq.addEventListener) mq.addEventListener('change', onChange);
        else if (mq.addListener) mq.addListener(onChange);
    }

    /* ── Nav ───────────────────────────────────────────────────────────── */
    function initNav() {
        var nav = document.querySelector('[data-nav]');
        if (!nav) return;

        var burger = nav.querySelector('[data-burger]');
        var sheet = nav.querySelector('[data-sheet]');

        // Compact state on scroll — a class flip, not per-frame style writes
        var sentinel = document.createElement('div');
        sentinel.setAttribute('aria-hidden', 'true');
        sentinel.style.cssText = 'position:absolute;top:0;height:1px;width:1px;';
        document.body.prepend(sentinel);
        new IntersectionObserver(function (entries) {
            nav.classList.toggle('is-stuck', !entries[0].isIntersecting);
        }).observe(sentinel);

        if (!burger || !sheet) return;

        var open = false;
        var lastFocus = null;

        function setOpen(next) {
            open = next;
            nav.classList.toggle('is-open', open);
            burger.setAttribute('aria-expanded', String(open));
            document.body.style.overflow = open ? 'hidden' : '';
            if (open) {
                lastFocus = document.activeElement;
                var first = sheet.querySelector('a');
                if (first) first.focus();
            } else if (lastFocus) {
                lastFocus.focus();
                lastFocus = null;
            }
        }

        setOpen(false);
        burger.addEventListener('click', function () { setOpen(!open); });
        sheet.addEventListener('click', function (e) {
            if (e.target.closest('a')) setOpen(false);
        });

        document.addEventListener('keydown', function (e) {
            if (!open) return;
            if (e.key === 'Escape') { setOpen(false); burger.focus(); return; }
            if (e.key !== 'Tab') return;
            // Keep focus inside the sheet while it is open
            var items = sheet.querySelectorAll('a, button');
            if (!items.length) return;
            var first = items[0], last = items[items.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); burger.focus(); }
        });

        // Close if the viewport grows past the mobile breakpoint
        var wide = window.matchMedia('(min-width: 56rem)');
        var onWide = function (e) { if (e.matches && open) setOpen(false); };
        if (wide.addEventListener) wide.addEventListener('change', onWide);
        else if (wide.addListener) wide.addListener(onWide);
    }

    /* ── Scroll reveal ─────────────────────────────────────────────────── */
    function initReveal() {
        var items = document.querySelectorAll('[data-reveal]');
        if (!items.length) return;

        if (reduced.matches || !('IntersectionObserver' in window)) {
            items.forEach(function (el) { el.classList.add('is-in'); });
            return;
        }

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-in');
                io.unobserve(entry.target);
            });
        }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });

        items.forEach(function (el) { io.observe(el); });
    }

    /* ── Hero signature reveal ─────────────────────────────────────────── */
    function initHero() {
        var hero = document.querySelector('[data-hero]');
        if (!hero) return;
        // Next frame, so the initial masked state is painted first
        requestAnimationFrame(function () {
            requestAnimationFrame(function () { hero.classList.add('is-ready'); });
        });
    }

    /* ── Scrollspy for in-page nav ─────────────────────────────────────── */
    function initSpy() {
        var links = Array.prototype.slice.call(
            document.querySelectorAll('[data-spy] a[href^="#"]')
        );
        if (!links.length || !('IntersectionObserver' in window)) return;

        var map = {};
        var targets = [];
        links.forEach(function (a) {
            var id = a.getAttribute('href').slice(1);
            var el = id && document.getElementById(id);
            if (el) { map[id] = a; targets.push(el); }
        });
        if (!targets.length) return;

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                var a = map[entry.target.id];
                if (!a) return;
                if (entry.isIntersecting) {
                    links.forEach(function (l) { l.classList.remove('is-active'); });
                    a.classList.add('is-active');
                }
            });
        }, { rootMargin: '-45% 0px -50% 0px' });

        targets.forEach(function (t) { io.observe(t); });
    }

    /* ── Skills ticker ─────────────────────────────────────────────────────
       The track is duplicated so a -50% translate loops seamlessly. The clone
       is hidden from assistive tech so skills are announced once. */
    function initTicker() {
        document.querySelectorAll('[data-ticker]').forEach(function (track) {
            if (reduced.matches) return;
            var clone = track.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            Array.prototype.forEach.call(clone.children, function (c) { c.tabIndex = -1; });
            while (clone.firstChild) track.appendChild(clone.firstChild);

            // Constant speed regardless of row length
            var perItem = parseFloat(track.dataset.speed || '2.6');
            var count = track.children.length / 2;
            track.style.setProperty('--speed', (count * perItem) + 's');
        });
    }

    /* ── Interactive technical field ───────────────────────────────────────
       A dot lattice behind the hero. Almost invisible at rest; dots near the
       pointer brighten and grow. Drawn on a canvas because 1,200 DOM nodes
       would not be. Frames are only requested while the hero is on screen and
       something has actually changed, so it costs nothing at rest. */
    function initField() {
        var canvas = document.querySelector('[data-field]');
        if (!canvas) return;

        var fine = window.matchMedia('(pointer: fine)');
        if (reduced.matches || !fine.matches) return;   // CSS lattice stands in

        var hero = canvas.closest('[data-hero]');
        var ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        var GAP = 34, RADIUS = 150;
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var w = 0, h = 0, cols = 0, rows = 0;
        var mx = -9999, my = -9999;      // pointer
        var cx = -9999, cy = -9999;      // eased pointer
        var visible = false, running = false;

        function resize() {
            var r = canvas.getBoundingClientRect();
            w = r.width; h = r.height;
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            cols = Math.ceil(w / GAP) + 1;
            rows = Math.ceil(h / GAP) + 1;
            draw();
        }

        function ink() {
            return getComputedStyle(document.documentElement)
                .getPropertyValue('--field-ink').trim() || '128,128,128';
        }
        var rgb = ink();

        function draw() {
            if (!w || !h) return;
            ctx.clearRect(0, 0, w, h);
            var r2 = RADIUS * RADIUS;
            for (var i = 0; i < cols; i++) {
                var x = i * GAP;
                var dx = x - cx;
                if (dx * dx > r2 + 4000) {
                    // Far column: draw the resting lattice cheaply
                    for (var j0 = 0; j0 < rows; j0++) {
                        ctx.fillStyle = 'rgba(' + rgb + ',0.10)';
                        ctx.fillRect(x, j0 * GAP, 1.1, 1.1);
                    }
                    continue;
                }
                for (var j = 0; j < rows; j++) {
                    var y = j * GAP;
                    var dy = y - cy;
                    var d2 = dx * dx + dy * dy;
                    var t = d2 < r2 ? 1 - Math.sqrt(d2) / RADIUS : 0;
                    var a = 0.10 + t * 0.42;
                    var s = 1.1 + t * 2.0;
                    ctx.fillStyle = 'rgba(' + rgb + ',' + a.toFixed(3) + ')';
                    ctx.fillRect(x - s / 2, y - s / 2, s, s);
                }
            }
        }

        function frame() {
            var dx = mx - cx, dy = my - cy;
            cx += dx * 0.12;
            cy += dy * 0.12;
            draw();
            // Keep going only while the eased position is still catching up
            if (visible && (Math.abs(dx) > 0.4 || Math.abs(dy) > 0.4)) {
                requestAnimationFrame(frame);
            } else {
                running = false;
            }
        }

        function kick() {
            if (running || !visible) return;
            running = true;
            requestAnimationFrame(frame);
        }

        hero.addEventListener('pointermove', function (e) {
            var r = canvas.getBoundingClientRect();
            mx = e.clientX - r.left;
            my = e.clientY - r.top;
            kick();
        });
        hero.addEventListener('pointerleave', function () {
            mx = -9999; my = -9999;
            kick();
        });

        new IntersectionObserver(function (entries) {
            visible = entries[0].isIntersecting;
            if (visible) kick();
        }, { threshold: 0 }).observe(hero);

        var rt;
        window.addEventListener('resize', function () {
            clearTimeout(rt);
            rt = setTimeout(function () { dpr = Math.min(window.devicePixelRatio || 1, 2); resize(); }, 150);
        });

        // Re-read the ink colour when the theme flips
        new MutationObserver(function () { rgb = ink(); draw(); })
            .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

        hero.classList.add('has-field');
        resize();
        canvas.classList.add('is-lit');
    }

    /* ── Hero portrait drift ───────────────────────────────────────────────
       Pointer position is written as two custom properties and the transform
       is left to the compositor. Nothing here reads layout. */
    function initPortraitDrift() {
        var el = document.querySelector('[data-drift]');
        if (!el || reduced.matches) return;
        if (!window.matchMedia('(pointer: fine)').matches) return;

        var target = el.closest('[data-hero]') || el;
        var queued = false, px = 0, py = 0;

        target.addEventListener('pointermove', function (e) {
            var r = target.getBoundingClientRect();
            px = ((e.clientX - r.left) / r.width - 0.5) * 2;
            py = ((e.clientY - r.top) / r.height - 0.5) * 2;
            if (queued) return;
            queued = true;
            requestAnimationFrame(function () {
                el.style.setProperty('--px', px.toFixed(3));
                el.style.setProperty('--py', py.toFixed(3));
                queued = false;
            });
        });

        target.addEventListener('pointerleave', function () {
            el.style.setProperty('--px', '0');
            el.style.setProperty('--py', '0');
        });
    }

    /* ── Init ──────────────────────────────────────────────────────────── */
    function init() {
        // site.js is alive — cancel the head script's un-hide safety net
        if (window.__jsFallback) { clearTimeout(window.__jsFallback); window.__jsFallback = null; }
        root.classList.add('js');
        initTheme();
        initNav();
        initHero();
        initReveal();
        initSpy();
        initTicker();
        initField();
        initPortraitDrift();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
