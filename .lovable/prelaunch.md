# BARBOOK Prelaunch Checklist

## 1. Security & data
- [ ] Run security scan + Supabase linter; clear all criticals
- [ ] Verify RLS on every table; storage buckets enforce `${user.id}/` paths
- [ ] Confirm only anon/publishable key is in client code

## 2. Auth & account lifecycle
- [ ] End-to-end test GDPR delete-account flow (request → 7-day banner → cron purge)
- [ ] Test all email templates via preview-transactional-email
- [ ] Custom email domain verified

## 3. SEO & sharing
- [ ] Sitemap edge function returns current URLs; robots.txt allows indexing
- [ ] OG/Twitter image renders for /, /recipes, /cocktail/[slug]
- [ ] PageSEO title/meta on every route

## 4. Performance & UX
- [ ] Lighthouse pass (mobile + desktop) on /, /recipes, /discover, /mybar
- [ ] Image upload validation + compression confirmed
- [ ] Mobile bottom-nav clearance (pb-24) on all scrollable pages

## 5. Legal
- [ ] Privacy Policy mentions backup retention + 7-day deletion window
- [ ] Terms gate at 18+
- [ ] Cookie/analytics disclosure if tracking pixels are present

## 6. Publish
- [ ] Publish frontend, attach barbook.io custom domain, verify SPA deep links
