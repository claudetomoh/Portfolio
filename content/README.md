# Content

```
content/
├── public/          TRACKED — content the build renders
└── _private/        NEVER TRACKED — internal records
```

## `public/` — tracked

| File | Contents |
|---|---|
| `case-studies.json` | Long-form case studies. `python build.py` renders each one to `work/<slug>.html`. |

Other page copy lives directly in the HTML files.

**Before adding anything to `public/`, ask whether it would be safe on a
billboard.** This repository is public.

## `_private/` — never tracked

Internal records, including the evidence records used to decide what the site
may claim. Nothing in this directory is referenced from public files or
rendered on the site.

## Rules

1. Every claim on the site is backed by evidence held in the internal records.
2. Unconfirmed items are never rendered, and a placeholder is never replaced
   with an estimate, an inference, or a reasonable default.
3. A claim removed for lack of evidence is not reintroduced from an old CV or
   an archived page.
4. Status is never upgraded. Planned work is not described as built.
