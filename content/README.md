# `content/` — stage-1 fixtures

The static content the site builds from while `CONTENT_SOURCE=fixtures`.

```
content/
├── pages/<slug>.json   the page's block list, validated by zod at build time
├── globals/site.json   site-wide content: navigation and the header CTA
└── media/              content images, processed by astro:assets
```

Rules (AGENT-RULES §2.4):

- `pages/<slug>.json` MUST satisfy the `Page` schema from `@repo/shared`, and
  `globals/site.json` the `SiteSettings` schema. A mismatch fails the build —
  that is deliberate, and the message names the file and the field path.
- Copy is **real copy from the design**, never lorem ipsum and never a placeholder.
- Images live in `media/` and are imported through `astro:assets`, so the
  dimensions recorded here have to match the actual file.
- A newline inside `heading` is a **designed line break**, not formatting: the
  hero renders each line as its own reveal-masked block.
- Video does NOT live here. Encoded files go to `apps/web/public/video/` (see
  `scripts/encode-video.sh`) and are committed; the masters stay in `_inbox/`,
  which is gitignored. Only the poster — frame 0 of the encode — is content.

Once Payload is connected (`CONTENT_SOURCE=payload`) this directory stops being
the production source but stays as data for the visual tests and for local
development without a CMS.
