# Content

Single source of truth for every fact shown on the portfolio.

Split into two directories in Phase 2B (2026-09-16). The split exists for one
reason: the original `content/` directory had to be gitignored wholesale because
it mixed publishable facts with internal records, and that made the content
layer useless as a source of truth. Separating them fixes that.

```
content/
├── public/          TRACKED — publishable facts only
└── _private/        NEVER TRACKED — audit narrative, security gate, PII
```

## `public/` — tracked

| File | Contents |
|---|---|
| `profile.json` | Identity, positioning, voice rules. Carries `positioningOverride`. |
| `projects.json` | Project inventory and status taxonomy |
| `research.json` | Research entries and status labels |
| `experience.json` | Roles, split into tracks |
| `teaching.json` | Teaching and technical communication |
| `events.json` | Attended events — **1 verified entry** |
| `awards.json` | Scholarships, competitions, credentials |
| `now.json` | Current work, incl. FounderOS status buckets |
| `education.json` | Ashesi |
| `contact.json` | Verified public links only |
| `metrics.json` | Every number, with source and status |
| `cv.json` | CV version comparison |
| `journal.json` | Journal streams |
| `_schema/` | JSON Schema |

## `_private/` — never tracked

Internal records that are not publishable. Nothing in this directory is
referenced from public files or rendered on the site.

**Before adding anything to `public/`, ask whether it would be safe on a
billboard.**

## Rules

1. Nothing appears on the site unless it exists in `public/` with
   `verification` of `VERIFIED` or `SUPPORTED_NEEDS_DATE`.
2. `OWNER_CONFIRMATION_REQUIRED` is never rendered. It is a to-do, not content.
3. `REMOVE` entries are kept deliberately, so a deleted claim is never silently
   reintroduced from an old CV or an archived page.
4. `CONFLICT` blocks are never auto-resolved. Every version is recorded with its
   source. Only Claude resolves them.
5. Every metric carries a `source` and a `date`. A number with neither does not ship.
6. Placeholders use the literal string `[OWNER VERIFICATION REQUIRED]`. Never
   replace one with an estimate, an inference, or a reasonable default.
7. Status is never upgraded. `PLANNED` does not become `IMPLEMENTED` because a
   brief describes it as working.

## Verification statuses

| Status | Meaning | Publishable |
|---|---|---|
| `VERIFIED` | Corroborated by a source that is not the portfolio itself | yes |
| `SUPPORTED_NEEDS_DATE` | Evidence exists but is undated or possibly stale | with a date |
| `PARTIALLY_VERIFIED` | Existence confirmed, details unreadable or missing | no |
| `OWNER_STATED` | Attested by Claude, no independent source. Scope the claim to the attestation. | narrowly |
| `OWNER_CONFIRMATION_REQUIRED` | No evidence available | no |
| `CONFLICT` | Two or more sources disagree | no, until resolved |
| `REMOVE` | Contradicted by evidence, or unverifiable and high-risk | never |

## External sources

Facts discovered through web research carry `sourceUrl`, `sourceType` and
`dateAccessed`, so provenance travels with the claim. A third-party page
asserting something is not the same as it being true — see `awards.json` →
`unverifiedAffiliations` for claims held back on exactly that basis.

### Sources checked in Phase 2B (2026-09-16)

| Source | Result |
|---|---|
| `github.com/claudetomoh` | 22 public repos confirmed. |
| `riseforimpact.org` | Programme metrics verbatim; Next.js confirmed via `/_next/image`. |
| `open-dreams.org` | Open Dreams Scholar '21; National Youth Forum for Peace, 27–28 Sep 2023. |
| `1spsc.org` | Listing and certificate pages exist; contents unreadable. |
| `linkedin.com` | **Unreadable — HTTP 999 to automated access, on both `www` and `gh` hosts.** Cannot be used as a verification source from here. |
| Web search, "Lumavok" | No public trace. |
