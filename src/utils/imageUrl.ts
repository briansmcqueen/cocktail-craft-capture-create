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

const SUPABASE_PUBLIC = '/storage/v1/object/public/';
const SUPABASE_RENDER = '/storage/v1/render/image/public/';

export function optimizedImageUrl(
  src: string | null | undefined,
  opts: SupabaseImageOptions = {}
): string {
  if (!src) return '';
  // Only rewrite Supabase public storage URLs; pass through everything else
  // (Unsplash, base64, relative bundled assets, etc.).
  if (!src.includes(SUPABASE_PUBLIC)) return src;

  const { width, height, quality = 75, resize = 'cover' } = opts;
  const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;

  const params = new URLSearchParams();
  if (width) params.set('width', String(Math.round(width * dpr)));
  if (height) params.set('height', String(Math.round(height * dpr)));
  params.set('quality', String(quality));
  params.set('resize', resize);

  const rewritten = src.replace(SUPABASE_PUBLIC, SUPABASE_RENDER);
  const sep = rewritten.includes('?') ? '&' : '?';
  return `${rewritten}${sep}${params.toString()}`;
}