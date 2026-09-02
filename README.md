# claudetomoh.vercel.app

Personal site for Claude Tomoh — software engineer, Computer Science at Ashesi University.

Live: <https://claudetomoh.vercel.app>

## Stack

Static HTML, one stylesheet, one script. No framework, no build step, no runtime
dependencies. Deployed on Vercel from `main`.

```
index.html            Home — hero, about, stack, work, experience, journal, contact
work.html             /work — project case studies
experience.html       /experience — roles grouped by type
styles/site.css       Design system: tokens, themes, components, sections
scripts/site.js       Theme, navigation, reveals, ticker, hero field
assets/               Public CV
images/               Photography and project screenshots
vercel.json           Clean URLs, redirects, cache and security headers
```

## Design system

Instrument Serif for display, Inter for UI, JetBrains Mono for technical
metadata. A single accent, retuned per theme. Two radii. Light and dark are
designed separately rather than inverted, and follow `prefers-color-scheme`
until the visitor picks one.

Motion runs in three tiers — micro (160ms), standard (420ms), signature (900ms)
— on one easing pair, and is fully disabled under `prefers-reduced-motion`.

## Running locally

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>. There is nothing to install or build.

Note that `vercel.json` handles clean URLs and redirects in production, so
`/work` and `/experience` resolve there but need the `.html` extension when
served by a plain static server.

## Contact

<claudetomo20@gmail.com>

## License

© 2026 Claude Tomoh. All rights reserved.
