# BARBOOK Prelaunch Checklist

## 1. Security & data
- [x] Run security scan + Supabase linter; clear all criticals (97 low-risk warns remain — acceptable)
- [x] Verify RLS on every table; storage buckets enforce `${user.id}/` paths
- [x] Confirm only anon/publishable key is in client code

## 2. Auth & account lifecycle
- [x] Code paths verified: edge fn, RPCs, banner, cron job all present
- [ ] Live end-to-end test of delete-account flow (manual QA)
- [ ] Test all email templates via preview-transactional-email (manual QA)
- [ ] Custom email domain verified (manual — Cloud → Emails)

## 3. SEO & sharing
- [x] Sitemap edge function returns current URLs; robots.txt allows indexing
- [x] OG/Twitter image renders for /, /recipes, /cocktail/[slug] (PageSEO + RecipeMeta)
- [x] PageSEO title/meta on every route (added Terms, Unsubscribe, FollowersPage)

## 4. Performance & UX
- [ ] Lighthouse pass (mobile + desktop) on /, /recipes, /discover, /mybar — manual against barbook.io
- [x] Image upload validation + compression confirmed (JPEG/PNG/WEBP, 10MB cap, webp output)
- [x] Mobile bottom-nav clearance (pb-24) on all scrollable pages
- [x] Image priority hints (eager hero, lazy grid, fetchPriority on recipe page)

## 5. Legal
- [x] Privacy Policy mentions backup retention (30d) + 7-day deletion window
- [x] Terms gate at legal drinking age (Section 2 of Terms)
- [x] Cookie/analytics disclosure (PrivacyNotice banner + Privacy Policy "Cookies & tracking" section; Plausible is cookieless)

## 6. Publish
- [ ] Publish frontend, attach barbook.io custom domain, verify SPA deep links
