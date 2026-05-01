# Pre-Launch Checklist Implementation

Ship the four blockers before public launch: legal pages, sitemap, correct OG URL, and basic analytics.

## 1. Legal Pages (Terms + Privacy)

Create two new routes under the existing app shell:

- `src/pages/Terms.tsx` → `/terms`
- `src/pages/Privacy.tsx` → `/privacy`

Both pages:
- Use `TopNavigation` + `Sidebar` layout for consistency with `Settings.tsx`
- Standard page header (uppercase, tracking-widest, white Lucide icon — `FileText` and `Shield`)
- Long-form prose styled with semantic tokens (`text-foreground`, `text-muted-foreground`)
- Unified `BackButton` at top
- `max-w-3xl` content column, `px-5` mobile gutters

Content covers (boilerplate, Barbook-specific):
- **Terms**: account rules, user-generated content ownership, acceptable use (no spam/abuse), recipe content licensing back to user, account termination, disclaimers, contact email
- **Privacy**: what we collect (email, profile, recipes, bar inventory, favorites), Supabase as data processor, cookies/localStorage usage, profile visibility model, data deletion request flow, contact email

Add footer links in `Sidebar.tsx` (desktop) and a small footer block on auth modal so users see them at signup.

Register both routes in `src/App.tsx` as lazy imports.

## 2. Sitemap

Create `public/sitemap.xml` with static entries:
- `/` (homepage)
- `/discover`
- `/recipes`, `/mybar`, `/favorites`
- `/terms`, `/privacy`
- All 90+ classic cocktail URLs generated from `src/data/classicCocktails.ts` slugs

Approach: write a small Node script `scripts/generate-sitemap.mjs` that imports the classics data and writes `public/sitemap.xml`. Run it once during this task; commit the generated file. (No build-step integration — keep simple.)

Update `public/robots.txt` to add:
```
Sitemap: https://barbook.io/sitemap.xml
```

## 3. Fix OG URL

Update `index.html`:
- `<meta property="og:url">` → `https://barbook.io`
- `<link rel="canonical">` → `https://barbook.io`

Leave OG image (Americano) as-is per memory.

## 4. Analytics

Add **Plausible** (privacy-friendly, no cookie banner needed, lightweight). Single script tag in `index.html` `<head>`:

```html
<script defer data-domain="barbook.io" src="https://plausible.io/js/script.js"></script>
```

No app-code changes needed — Plausible auto-tracks pageviews including SPA route changes via the default script. User will need to create a free Plausible account and add `barbook.io` as a site after deploy.

(If user prefers PostHog or GA4 instead, swap the snippet — flag this in the implementation.)

## Files Touched

**New:**
- `src/pages/Terms.tsx`
- `src/pages/Privacy.tsx`
- `public/sitemap.xml`
- `scripts/generate-sitemap.mjs`

**Edited:**
- `src/App.tsx` (register `/terms`, `/privacy` routes)
- `src/components/Sidebar.tsx` (footer links)
- `src/components/auth/AuthModal.tsx` (small "By signing up you agree to..." line)
- `public/robots.txt` (add Sitemap line)
- `index.html` (OG URL, canonical, Plausible snippet)

## Out of Scope (Post-Launch)

- Cookie consent banner — Plausible doesn't require one
- Email digest / transactional emails
- Sentry / error monitoring
- PWA manifest / install prompt
- Editorial curation system

## After This Ships

User action items (cannot be done in code):
1. Click **Publish → Update** to push frontend changes live
2. Create free account at plausible.io and add `barbook.io`
3. Submit `https://barbook.io/sitemap.xml` to Google Search Console
4. Replace placeholder contact email in Terms/Privacy with real address
