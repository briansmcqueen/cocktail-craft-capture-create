import { Helmet } from "react-helmet-async";

const SITE_URL = "https://barbook.io";
const DEFAULT_IMAGE =
  "https://qwfoumoaotswlzbzbcdt.supabase.co/storage/v1/object/public/recipe-images/americano.webp";

interface PageSEOProps {
  /** Full <title>. Should already include the " | Barbook" suffix when desired. */
  title: string;
  /** Meta description, ~150-160 chars. */
  description: string;
  /** Path-only canonical (e.g. "/discover") OR a full URL. Defaults to current path is NOT used — pass explicitly for stability. */
  path?: string;
  /** Open Graph image. Defaults to the Barbook Americano hero. */
  image?: string;
  /** og:type. Defaults to "website". */
  type?: "website" | "article" | "profile";
  /** Discourage indexing (used for 404, settings, unsubscribe). */
  noindex?: boolean;
  /** Optional JSON-LD object to inject. */
  jsonLd?: Record<string, unknown>;
}

/**
 * Per-page SEO + social metadata. Use on every top-level route so shared
 * links and search results have unique titles, descriptions, and canonicals.
 */
export default function PageSEO({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
  type = "website",
  noindex = false,
  jsonLd,
}: PageSEOProps) {
  const canonical = path
    ? path.startsWith("http")
      ? path
      : `${SITE_URL}${path}`
    : SITE_URL;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Barbook" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@barbook" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}