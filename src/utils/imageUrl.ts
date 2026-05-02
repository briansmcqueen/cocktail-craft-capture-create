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
 * Supabase's on-the-fly transform endpoint requires a paid plan, so we leave
 * Supabase URLs untouched. Unsplash, however, supports free on-the-fly
 * resizing via query params (`w`, `q`, `auto=format`, `fit=crop`). When the
 * source is an `images.unsplash.com` URL we rewrite it to request an
 * appropriately-sized WebP/AVIF variant — this is the biggest win for the
 * new Unsplash+ hero/card photos without touching any component code.
 */
export function optimizedImageUrl(
  src: string | null | undefined,
  opts: SupabaseImageOptions = {}
): string {
  if (!src) return '';

  // Only rewrite Unsplash URLs — everything else passes through unchanged.
  if (!src.includes('images.unsplash.com')) return src;

  try {
    const url = new URL(src);
    const { width, height, quality = 75, resize = 'cover' } = opts;

    // Account for high-DPI screens up to 2x.
    const dpr = typeof window !== 'undefined'
      ? Math.min(window.devicePixelRatio || 1, 2)
      : 1;

    if (width) url.searchParams.set('w', String(Math.round(width * dpr)));
    if (height) url.searchParams.set('h', String(Math.round(height * dpr)));
    url.searchParams.set('q', String(quality));
    url.searchParams.set('auto', 'format');
    url.searchParams.set('fit', resize === 'contain' ? 'max' : 'crop');

    return url.toString();
  } catch {
    return src;
  }
}