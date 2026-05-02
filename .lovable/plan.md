## Goal

Give users a self-serve "Delete my account" flow that meets GDPR Article 17 (right to erasure): permanent removal of personal data within a defined window, an audit trail of the request, and a short cancellation grace period.

## UX flow

In `Settings → Account` add a red "Danger Zone" card at the bottom:

1. **Delete account** button → opens a confirmation dialog.
2. Dialog explains exactly what gets deleted (profile, recipes, comments, ratings, follows, favorites, bar, uploaded images), warns it's irreversible after 7 days, and requires the user to type their username to enable the button.
3. On confirm → calls edge function `delete-account` with the user's JWT.
4. Edge function schedules deletion (sets `profiles.deletion_requested_at = now()`), signs the user out, redirects to a `/account-deleted` confirmation page explaining the 7-day window and how to cancel (just sign back in within 7 days).
5. If the user signs back in within 7 days, a banner offers "Cancel deletion". After 7 days, a scheduled job permanently purges the account.

## What gets deleted

Hard delete (immediate at purge time):
- `auth.users` row (cascades the JWT)
- `profiles`, `user_preferences`, `user_roles`, `user_ingredients`, `user_bar_presets`, `custom_ingredients`, `shopping_list_items`, `shopping_sessions`, `favorites`, `likes`, `recipe_ratings`, `recipe_comments`, `recipe_notifications`, `social_notifications` (as user_id and as actor_id), `follows` (both sides), `blocked_users` (both sides), `recipe_shares`, `content_reports` filed by the user, `article_comments` and `article_favorites` (legacy tables, still need cleaning)
- All objects in storage buckets `avatars/`, `recipes/`, `recipe-images/` under the `${user.id}/` prefix
- The user's `recipes` rows (their authored cocktails)

Anonymize instead of delete (preserves community integrity):
- `recipe_ratings` and `recipe_comments` left on OTHER users' recipes are deleted (not anonymized) — the user owns this UGC.
- `affiliate_conversions` and `security_audit_log` rows referencing the user have `user_id` set to NULL (we keep aggregate logs but strip the link). These are admin-only tables anyway.

Audit:
- Insert one `security_audit_log` row with `action = 'account_deletion_requested'` at request time and `action = 'account_deletion_completed'` at purge time, with `user_id = NULL` and metadata containing only a hashed user ID — so we can prove compliance without retaining personal data.

## Database changes

Migration adds:

- `profiles.deletion_requested_at timestamptz NULL` — soft-deletion marker
- `profiles.deletion_scheduled_for timestamptz NULL` — when the purge runs
- A SECURITY DEFINER function `public.purge_user_account(p_user_id uuid)` that runs all the table deletes/anonymizations in a single transaction. Callable only by service_role (no anon/authenticated EXECUTE). The edge function calls this, then `auth.admin.deleteUser`.
- A SECURITY DEFINER function `public.request_account_deletion()` that the edge function calls to mark the profile and write the audit row.
- A SECURITY DEFINER function `public.cancel_account_deletion()` that clears the timestamps and writes an audit row.
- A scheduled task (pg_cron if available, otherwise a daily cron-triggered edge function) that finds profiles where `deletion_scheduled_for <= now()` and runs `purge_user_account` + `auth.admin.deleteUser` for each.

## Edge functions

New function `supabase/functions/delete-account/index.ts`:
- POST `/` (authenticated) → calls `request_account_deletion`, returns `{ scheduled_for }`.
- POST `/cancel` (authenticated) → calls `cancel_account_deletion`.
- POST `/purge` (service-role only, called by cron) → finds due accounts, deletes storage objects, calls `purge_user_account`, calls `auth.admin.deleteUser`.

CORS, JWT validation, input validation with zod, and explicit service-role gate on the purge endpoint (same pattern as `migrate-recipe-base64-images`).

## Frontend changes

- `src/pages/Settings.tsx`: new Danger Zone card with delete button + dialog (uses existing `AlertDialog` from shadcn).
- `src/pages/AccountDeleted.tsx`: confirmation page explaining the 7-day grace period.
- `src/components/DeletionPendingBanner.tsx`: shown app-wide when `profiles.deletion_requested_at` is set, with "Cancel deletion" button.
- Route added to `App.tsx`: `/account-deleted` (public).
- After successful request, sign the user out and redirect.

## GDPR compliance checklist

- Right to erasure (Art. 17): yes — full purge within 7 days, user-initiated, no admin approval required.
- Right to withdraw consent (Art. 7.3): yes — cancellation window before permanent deletion.
- Data minimization in audit log (Art. 5.1.c): we keep only hashed user ID + timestamp post-deletion.
- Notification of deletion (Art. 19): not applicable — we don't share personal data with third parties.
- Backup retention: documented separately in Privacy Policy ("backups are retained up to 30 days and overwritten on rotation"). No code change needed.
- Children's data: existing terms gate signups at 18+ (cocktails app), no further action.

## Out of scope

- Data export ("right to data portability", Art. 20). Recommend handling as a follow-up — same pattern, edge function returns a JSON bundle.
- Email confirmation of deletion request (would require an email template). Optional — can add later.
- Admin UI to view pending deletions. Database is queryable directly for now.

## Files to be added or changed

```text
Add:
  supabase/functions/delete-account/index.ts
  src/pages/AccountDeleted.tsx
  src/components/DeletionPendingBanner.tsx
  src/components/settings/DangerZone.tsx
  supabase/migrations/<ts>_account_deletion.sql

Edit:
  src/pages/Settings.tsx          # mount DangerZone
  src/App.tsx                     # add /account-deleted route, mount DeletionPendingBanner
  src/pages/Privacy.tsx           # add deletion + backup retention paragraph
```
