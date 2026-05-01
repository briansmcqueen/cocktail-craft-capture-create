// Dynamic sitemap.xml — includes static routes, all classic cocktails, and
// every public user-created recipe. Served as XML to crawlers.
//
// Public endpoint:
//   https://qwfoumoaotswlzbzbcdt.supabase.co/functions/v1/sitemap
//
// barbook.io/sitemap.xml continues to point at the static fallback in /public,
// and robots.txt also references this dynamic endpoint so Google can discover
// it.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SITE = "https://barbook.io";

// Slugify exactly the same way the front-end does (src/utils/slugUtils.ts).
const slug = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const STATIC_ROUTES: Array<{ path: string; priority: number; changefreq: string }> = [
  { path: "/", priority: 1.0, changefreq: "weekly" },
  { path: "/discover", priority: 0.8, changefreq: "weekly" },
  { path: "/recipes", priority: 0.8, changefreq: "weekly" },
  { path: "/mybar", priority: 0.6, changefreq: "weekly" },
  { path: "/favorites", priority: 0.6, changefreq: "weekly" },
  { path: "/terms", priority: 0.3, changefreq: "yearly" },
  { path: "/privacy", priority: 0.3, changefreq: "yearly" },
];

// Hard-coded classic slugs are unnecessary here — the static /public/sitemap.xml
// fallback already covers them. This dynamic sitemap focuses on public USER
// recipes which change over time. Google merges entries from both sitemaps.

interface PublicRecipe {
  id: string;
  name: string;
  updated_at: string | null;
  user_id: string;
}

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Fetch public recipes (RLS allows is_public=true to anyone, but service role
  // is used for reliability + to fetch in batches >1000).
  const { data: recipes, error } = await supabase
    .from("recipes")
    .select("id, name, updated_at, user_id")
    .eq("is_public", true)
    .order("updated_at", { ascending: false })
    .limit(5000);

  if (error) {
    console.error("sitemap recipes query failed", error);
  }

  // Resolve usernames for nice creator-scoped URLs.
  const userIds = Array.from(new Set((recipes ?? []).map((r) => r.user_id)));
  let usernameById = new Map<string, string>();
  if (userIds.length) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username")
      .in("id", userIds);
    usernameById = new Map(
      (profiles ?? [])
        .filter((p) => !!p.username)
        .map((p) => [p.id, p.username as string]),
    );
  }

  const today = new Date().toISOString().slice(0, 10);

  const urls: string[] = [];

  for (const r of STATIC_ROUTES) {
    urls.push(
      `<url><loc>${SITE}${r.path}</loc><lastmod>${today}</lastmod><changefreq>${r.changefreq}</changefreq><priority>${r.priority}</priority></url>`,
    );
  }

  for (const r of (recipes ?? []) as PublicRecipe[]) {
    const username = usernameById.get(r.user_id);
    const path = username
      ? `/cocktail/${username}/${slug(r.name)}`
      : `/cocktail/id/${r.id}`;
    const lastmod = (r.updated_at ?? today).slice(0, 10);
    urls.push(
      `<url><loc>${SITE}${path}</loc><lastmod>${lastmod}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`,
    );
  }

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.join("\n") +
    `\n</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
});
