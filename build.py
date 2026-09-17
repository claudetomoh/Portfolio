#!/usr/bin/env python3
"""Render the flagship case-study routes from the content layer.

Reads  content/public/case-studies.json
Writes work/<slug>.html   (served as /work/<slug> by Vercel cleanUrls)

Standard library only, no dependencies, no install step. Run it after editing
the JSON; never hand-edit the generated files.

    python build.py
"""

import json
import os
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, "content", "public", "case-studies.json")
OUT_DIR = os.path.join(ROOT, "work")
SITE = "https://claudetomoh.vercel.app"

GITHUB_PATH = (
    "M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7"
    "-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.4-2.3"
    " 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8"
    " 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5Z"
)


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def head(case):
    url = f"{SITE}/work/{case['slug']}"
    return f"""<!DOCTYPE html>
<html lang="en">

<!-- GENERATED FILE — do not edit.
     Source: content/public/case-studies.json
     Rebuild: python build.py -->

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="{esc(case['metaDescription'])}">
    <meta name="author" content="Claude Tomoh Ikfingeh">

    <meta property="og:type" content="article">
    <meta property="og:url" content="{url}">
    <meta property="og:title" content="{esc(case['name'])} — Claude Tomoh Ikfingeh">
    <meta property="og:description" content="{esc(case['ogDescription'])}">
    <meta property="og:image" content="{SITE}/images/claude.jpg">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{esc(case['name'])} — Claude Tomoh Ikfingeh">
    <meta name="twitter:description" content="{esc(case['ogDescription'])}">
    <meta name="twitter:image" content="{SITE}/images/claude.jpg">

    <meta name="theme-color" content="#FAF9F7" media="(prefers-color-scheme: light)">
    <meta name="theme-color" content="#0E0E0D" media="(prefers-color-scheme: dark)">
    <link rel="canonical" href="{url}">

    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">

    <title>{esc(case['title'])}</title>

    <script>
        (function () {{
            var r = document.documentElement;
            try {{
                var t = localStorage.getItem('theme');
                if (t === 'light' || t === 'dark') r.setAttribute('data-theme', t);
            }} catch (e) {{}}
            r.classList.add('js');
            window.__jsFallback = setTimeout(function () {{ r.classList.remove('js'); }}, 2500);
        }})();
    </script>

    <link rel="stylesheet" href="/styles/fonts.css">
    <link rel="stylesheet" href="/styles/site.css">

    <script type="application/ld+json">
    {{
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "name": {json.dumps(case['name'])},
        "description": {json.dumps(case['ogDescription'])},
        "url": {json.dumps(url)},
        "author": {{ "@type": "Person", "name": "Claude Tomoh Ikfingeh" }}
    }}
    </script>

    <script defer src="https://cdn.vercel-insights.com/v1/script.js"></script>
    <script defer src="/scripts/site.js"></script>
</head>
"""


def nav():
    return f"""
<body>
    <a href="#main" class="skip-link">Skip to main content</a>

    <header class="nav" data-nav>
        <div class="wrap nav__inner">
            <a href="/" class="nav__brand">Claude Tomoh</a>

            <nav class="nav__links" aria-label="Sections">
                <a href="/#about">About</a>
                <a href="/work" aria-current="page">Work</a>
                <a href="/research">Research</a>
                <a href="/experience">Experience</a>
                <a href="/#contact">Contact</a>
            </nav>

            <div class="nav__end">
                <a class="icon-btn" href="https://github.com/claudetomoh" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="{GITHUB_PATH}"/></svg>
                </a>
                <button class="icon-btn" data-theme-toggle aria-label="Switch theme">
                    <span class="theme-t__icon" aria-hidden="true">
                        <svg class="theme-t__moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>
                        <svg class="theme-t__sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
                    </span>
                </button>
                <button class="icon-btn nav__burger" data-burger aria-label="Open menu" aria-expanded="false" aria-controls="nav-sheet">
                    <span></span><span></span><span></span>
                </button>
            </div>
        </div>

        <div class="nav__sheet" id="nav-sheet" data-sheet>
            <a href="/#about">About</a>
            <a href="/work">Work</a>
            <a href="/research">Research</a>
            <a href="/experience">Experience</a>
            <a href="/#contact">Contact</a>
            <div class="nav__sheet-foot mono">
                <a href="https://github.com/claudetomoh" target="_blank" rel="noopener noreferrer">GitHub</a>
                <a href="https://www.linkedin.com/in/claude-tomoh" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="/assets/Claude_Tomoh_Software_Engineer_CV.pdf" download>CV</a>
            </div>
        </div>
    </header>
"""


def hero(case):
    crumb = (
        '<p class="mono hero__label">'
        '<a class="link" href="/work">Work</a> '
        '<span aria-hidden="true">/</span> '
        f"{esc(case['name'])}</p>"
    )
    mod = f" status--{case['status']['modifier']}" if case["status"]["modifier"] else ""
    return f"""
    <main id="main">

        <section class="hero" data-hero>
            <div class="wrap">
                {crumb}
                <h1 class="display hero__title" style="font-size: var(--t-3xl)">
                    <span class="line-mask"><span>{esc(case['name'])}</span></span>
                </h1>
                <div class="rule-draw"></div>
                <p class="lede" style="margin-top: var(--s-6)">{case['lede']}</p>
                <p class="mono" style="margin-top: var(--s-5)"><span class="status{mod}">{esc(case['status']['label'])}</span></p>
            </div>
        </section>
"""


def summary(case):
    tags = "".join(f'<span class="tag">{esc(t)}</span>' for t in case["tags"])

    media = ""
    if "schematic" in case:
        s = case["schematic"]
        parts = []
        for i, layer in enumerate(s["layers"]):
            items = "".join(f"<span>{it}</span>" for it in layer["items"])
            parts.append(f'<div class="schematic__layer"><b>{layer["label"]}</b>{items}</div>')
            if i < len(s["layers"]) - 1:
                parts.append('<p class="schematic__arrow" aria-hidden="true">↓</p>')
        media = (
            f'<div class="schematic" role="img" aria-label="{esc(s["alt"])}">\n'
            + "\n".join("                            " + p for p in parts)
            + "\n                        </div>"
        )
    elif "image" in case:
        im = case["image"]
        media = (
            f'<div class="media">\n'
            f'                            <img src="{im["src"]}" alt="{esc(im["alt"])}" '
            f'width="{im["w"]}" height="{im["h"]}" loading="lazy" decoding="async">\n'
            f"                        </div>"
        )

    links = ""
    if case.get("links"):
        anchors = "".join(
            f'<a class="link link--always mono" href="{l["url"]}" target="_blank" rel="noopener noreferrer">{esc(l["label"])} ↗</a>'
            for l in case["links"]
        )
        links = f'\n                        <div class="proj__actions">{anchors}</div>'

    return f"""
        <section class="section">
            <div class="wrap">
                <div class="proj" data-reveal>
                    <div class="proj__info">
                        <div class="proj__meta">
                            <div class="tag-row">{tags}</div>
                        </div>{links}
                    </div>
                    <div class="proj__media">
                        {media}
                    </div>
                </div>
"""


def blocks(case):
    out = ['                <div class="cs">']
    for b in case["blocks"]:
        body = "\n".join("                            " + line for line in b["body"])
        out.append(
            '                    <div class="cs__block" data-reveal>\n'
            f'                        <p class="mono cs__h">{esc(b["h"])}</p>\n'
            '                        <div class="cs__body">\n'
            f"{body}\n"
            "                        </div>\n"
            "                    </div>"
        )
    out.append("                </div>")
    out.append("            </div>")
    out.append("        </section>")
    return "\n".join(out)


def pager(case, cases):
    idx = next(i for i, c in enumerate(cases) if c["slug"] == case["slug"])
    prev_c = cases[idx - 1] if idx > 0 else None
    next_c = cases[idx + 1] if idx < len(cases) - 1 else None
    items = []
    if prev_c:
        items.append(
            f'                    <a class="tl__item" href="/work/{prev_c["slug"]}">\n'
            f'                        <p class="mono tl__when">Previous</p>\n'
            f'                        <div><p class="tl__role">{esc(prev_c["name"])}</p></div>\n'
            f"                    </a>"
        )
    if next_c:
        items.append(
            f'                    <a class="tl__item" href="/work/{next_c["slug"]}">\n'
            f'                        <p class="mono tl__when">Next</p>\n'
            f'                        <div><p class="tl__role">{esc(next_c["name"])}</p></div>\n'
            f"                    </a>"
        )
    body = "\n".join(items) if items else ""
    return f"""
        <section class="section section--sunken">
            <div class="wrap">
                <div class="s-head">
                    <p class="mono s-head__eyebrow">More work</p>
                </div>
                <div class="tl">
{body}
                </div>
                <div class="hero__actions" style="margin-top: var(--s-6)">
                    <a href="/work" class="btn btn--ghost">All work <span class="btn__arrow" aria-hidden="true">→</span></a>
                </div>
            </div>
        </section>
"""


def foot():
    return f"""
        <section class="section section--lead">
            <div class="wrap contact">
                <h2 class="contact__q">Have something worth building?</h2>
                <div class="hero__actions">
                    <a href="mailto:claudetomo20@gmail.com" class="btn btn--primary">Let's talk <span class="btn__arrow" aria-hidden="true">→</span></a>
                    <a href="/assets/Claude_Tomoh_Software_Engineer_CV.pdf" class="btn btn--ghost" download>Download CV</a>
                </div>
            </div>
        </section>
    </main>

    <footer class="foot">
        <div class="wrap foot__row">
            <div>
                <p>Claude Tomoh Ikfingeh — AI &amp; Software Builder</p>
                <p class="mono" style="color: var(--text-faint); margin-top: var(--s-2)">BSc Computer Science, Ashesi University · June 2027</p>
            </div>
            <nav class="foot__links" aria-label="Elsewhere">
                <a class="link" href="https://github.com/claudetomoh" target="_blank" rel="noopener noreferrer">GitHub</a>
                <a class="link" href="https://www.linkedin.com/in/claude-tomoh" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a class="link" href="mailto:claudetomo20@gmail.com">Email</a>
                <a class="link" href="/assets/Claude_Tomoh_Software_Engineer_CV.pdf" download>CV</a>
            </nav>
            <p class="mono" style="color: var(--text-faint)">© 2026</p>
        </div>
    </footer>
</body>

</html>
"""


def main():
    with open(SRC, encoding="utf-8") as f:
        data = json.load(f)
    cases = sorted(data["cases"], key=lambda c: c["order"])

    os.makedirs(OUT_DIR, exist_ok=True)
    written = []
    for case in cases:
        html = head(case) + nav() + hero(case) + summary(case) + blocks(case) + pager(case, cases) + foot()
        path = os.path.join(OUT_DIR, case["slug"] + ".html")
        with open(path, "w", encoding="utf-8", newline="\n") as f:
            f.write(html)
        written.append(f"work/{case['slug']}.html")

    print("Built %d case studies:" % len(written))
    for w in written:
        print("  " + w)
    print("\nRoutes: " + ", ".join("/work/" + c["slug"] for c in cases))
    return 0


if __name__ == "__main__":
    sys.exit(main())
