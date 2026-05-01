/**
 * Supabase image transform helper.
 *
 * Rewrites public storage URLs (`/storage/v1/object/public/...`) to the
 * on-the-fly resizer endpoint (`/storage/v1/render/image/public/...`) so we
 * can serve appropriately-sized images instead of shipping 1440px originals
 * for ~480px card slots. Non-Supabase URLs are returned unchanged.
 */

export interface SupabaseImageOptions {
  /** Target rendered width in CSS pixels. We auto-account for DPR up to 2x. */
  width?: number;
  /** Target rendered height in CSS pixels. */
  height?: number;
  /** JPEG/WebP quality 20-100. Defaults to 75. */
  quality?: number;
  /** Resize mode. Defaults to 'cover'. */
  resize?: 'cover' | 'contain' | 'fill';
}

/**
 * NOTE: The Supabase on-the-fly image transform endpoint
 * (`/storage/v1/render/image/public/...`) requires a paid Supabase plan.
 * On the Free tier it returns 400/404, which broke the classic cocktail
 * carousel thumbnails and Featured grid. Until the project is upgraded,
 * we pass URLs through unchanged and rely on the original WebP assets +
 * native lazy-loading for image performance.
 */
export function optimizedImageUrl(
  src: string | null | undefined,
  _opts: SupabaseImageOptions = {}
): string {
  return src ?? '';
}