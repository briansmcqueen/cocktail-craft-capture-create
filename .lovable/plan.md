# Modernize Public Profile Page Styling

The public profile route (`/profile/:username`) currently uses an older layout with a heavy charcoal card, bordered avatar column, and vertically stacked stat rows. The own-profile view (`/user/:userId`, rendered by `UserProfile.tsx`) uses a cleaner, more current pattern. This plan brings `PublicProfilePage.tsx` in line with that modern pattern while preserving its public-only behavior (privacy gating, public favorites, public recipes).

## What changes

**File:** `src/pages/PublicProfilePage.tsx` (only this file)

### 1. Profile header card
Replace the current `bg-rich-charcoal border-light-charcoal` card with the cleaner `bg-card border-border` Card pattern used in `UserProfile.tsx`:

- Use shadcn `Card` + `CardContent` with `p-6 md:p-8`
- Two-column layout: avatar on the left (single column, no follow button stacked underneath), text/info on the right
- Avatar: `w-20 h-20 md:w-24 md:h-24`, no heavy primary border ring
- Name as `text-2xl font-bold text-foreground`, `@username` as `text-muted-foreground`, optional bio as `text-card-foreground mt-2`
- Replace the vertically stacked stat rows (BookOpen / Heart / Users / Users) with the 4-column stats grid from `UserProfile.tsx`:
  - Recipes / Favorites / Followers / Following
  - Each stat is a button that switches the active tab (Followers/Following stats keep their existing navigation to `/profile/:username/followers`)
- Move the `FollowButton` next to the stats (below the grid, left-aligned, only when not own profile and viewer is logged in) instead of stacking it under the avatar

### 2. Tabs
Expand from 2 tabs to 4 tabs to match the modern profile (still respecting public visibility):

- `Recipes` — existing public recipes list, unchanged
- `Favorites` — existing public favorites list, unchanged
- `Followers` — new tab; reuses `followsService.getFollowers(profile.id)` + `get_public_profiles` RPC + `UserCard` (same approach as `UserProfile.tsx`)
- `Following` — new tab; reuses `followsService.getFollowing(profile.id)` + `get_public_profiles` RPC + `UserCard`

Use the same `TabsList` styling pattern as `UserProfile.tsx` (`grid grid-cols-4` on desktop), keeping the existing minimal underline tab style from the design system.

### 3. Removed/cleaned up
- Drop the custom `bg-rich-charcoal` / `border-light-charcoal` / `text-pure-white` / `text-soft-gray` / `text-light-text` hardcoded color classes in this file in favor of semantic tokens (`bg-card`, `border-border`, `text-foreground`, `text-muted-foreground`)
- Remove the duplicated avatar-with-ring + stacked-stats block

### 4. Preserved behavior
- Privacy gating, navigation, BackButton, TopNavigation/Sidebar wrapper, mobile padding (`pb-24 md:pb-6`), and the existing data fetches (`publicProfileService`, `followsService`, classic-cocktail favorites filter) all stay the same
- `hideCreator` on recipe cards stays per the existing memory rule
- The Followers/Following stat buttons can still deep-link to `/profile/:username/followers` if desired, OR simply switch tabs — recommend switching tabs for consistency with the own-profile view

## Out of scope
- No changes to `UserProfile.tsx`, `UserCard`, services, or routing
- No new endpoints or DB changes
- Avatar upload, settings link, and edit affordances remain own-profile-only and are not added here
