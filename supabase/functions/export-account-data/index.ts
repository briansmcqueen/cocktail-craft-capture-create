import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import JSZip from 'https://esm.sh/jszip@3.10.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;

// Tables we own and the column linking rows to a user
const USER_TABLES: { table: string; col: string }[] = [
  { table: 'profiles', col: 'id' },
  { table: 'recipes', col: 'user_id' },
  { table: 'recipe_comments', col: 'user_id' },
  { table: 'recipe_ratings', col: 'user_id' },
  { table: 'recipe_shares', col: 'user_id' },
  { table: 'favorites', col: 'user_id' },
  { table: 'likes', col: 'user_id' },
  { table: 'follows', col: 'follower_id' },
  { table: 'follows', col: 'following_id' },
  { table: 'blocked_users', col: 'blocker_id' },
  { table: 'user_ingredients', col: 'user_id' },
  { table: 'custom_ingredients', col: 'user_id' },
  { table: 'user_bar_presets', col: 'user_id' },
  { table: 'user_preferences', col: 'user_id' },
  { table: 'shopping_list_items', col: 'user_id' },
  { table: 'shopping_sessions', col: 'user_id' },
  { table: 'social_notifications', col: 'user_id' },
  { table: 'recipe_notifications', col: 'user_id' },
  { table: 'content_reports', col: 'reporter_id' },
  { table: 'article_comments', col: 'user_id' },
  { table: 'article_favorites', col: 'user_id' },
];

function toCsv(rows: Record<string, unknown>[]): string {
  if (!rows || rows.length === 0) return '';
  const cols = Array.from(
    rows.reduce((acc, r) => {
      Object.keys(r).forEach((k) => acc.add(k));
      return acc;
    }, new Set<string>()),
  );
  const escape = (v: unknown) => {
    if (v === null || v === undefined) return '';
    const s = typeof v === 'object' ? JSON.stringify(v) : String(v);
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  return [cols.join(','), ...rows.map((r) => cols.map((c) => escape(r[c])).join(','))].join('\n');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization') ?? '';
    if (!authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Resolve the caller from their JWT
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: 'Invalid session' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const userId = userData.user.id;

    // Rate limit: 3 exports per 24h
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { data: rateOk } = await admin.rpc('check_rate_limit', {
      p_user_id: userId,
      p_action: 'data_export_requested',
      p_limit: 3,
      p_window_minutes: 60 * 24,
    });
    if (rateOk === false) {
      return new Response(
        JSON.stringify({ error: 'Export limit reached. Try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const zip = new JSZip();
    const manifest: Record<string, { rows: number; column: string }> = {};
    const data: Record<string, unknown[]> = {};

    // Gather rows per table/column. follows is split across two columns -> merge.
    const aggregated: Record<string, unknown[]> = {};
    for (const { table, col } of USER_TABLES) {
      const { data: rows, error } = await admin
        .from(table)
        .select('*')
        .eq(col, userId);
      if (error) {
        console.error(`export ${table}.${col} failed`, error.message);
        continue;
      }
      const key = table;
      aggregated[key] = (aggregated[key] ?? []).concat(rows ?? []);
      manifest[`${table}.${col}`] = { rows: rows?.length ?? 0, column: col };
    }

    // De-dupe follows merged across both columns by id
    for (const k of Object.keys(aggregated)) {
      const seen = new Set<string>();
      const deduped: unknown[] = [];
      for (const r of aggregated[k] as Record<string, unknown>[]) {
        const id = (r.id as string) ?? JSON.stringify(r);
        if (seen.has(id)) continue;
        seen.add(id);
        deduped.push(r);
      }
      data[k] = deduped;
      const json = JSON.stringify(deduped, null, 2);
      zip.file(`data/${k}.json`, json);
      const csv = toCsv(deduped as Record<string, unknown>[]);
      if (csv) zip.file(`data/${k}.csv`, csv);
    }

    // Auth user metadata (subset – never include tokens)
    const authInfo = {
      id: userData.user.id,
      email: userData.user.email,
      created_at: userData.user.created_at,
      last_sign_in_at: userData.user.last_sign_in_at,
      app_metadata: userData.user.app_metadata,
      user_metadata: userData.user.user_metadata,
    };
    zip.file('account.json', JSON.stringify(authInfo, null, 2));

    // Storage file inventory (avatars/, recipes/, recipe-images/) under user folder
    const storageInventory: Record<string, { name: string; size?: number; updated_at?: string }[]> = {};
    for (const bucket of ['avatars', 'recipes', 'recipe-images']) {
      try {
        const { data: files } = await admin.storage.from(bucket).list(userId, {
          limit: 1000,
          sortBy: { column: 'name', order: 'asc' },
        });
        storageInventory[bucket] = (files ?? []).map((f) => ({
          name: `${userId}/${f.name}`,
          size: (f as any).metadata?.size,
          updated_at: f.updated_at ?? undefined,
        }));
      } catch (e) {
        console.error(`storage list ${bucket} failed`, (e as Error).message);
        storageInventory[bucket] = [];
      }
    }
    zip.file('storage-inventory.json', JSON.stringify(storageInventory, null, 2));

    const readme = `BARBOOK Account Data Export
Generated: ${new Date().toISOString()}
User: ${userData.user.email} (${userId})

This archive contains a copy of the personal data BARBOOK holds about your
account, exported under your right to data portability (GDPR Art. 20).

Contents:
- account.json            Your auth account info (no passwords or tokens).
- data/<table>.json|csv   Rows from each table linked to your user id.
- storage-inventory.json  List of files you uploaded (avatars, recipe images).
- manifest.json           Summary of which tables/columns were exported.

Files themselves (images, etc.) are not embedded — use the URLs already
stored in your recipes/profile to download them, or contact support.
`;
    zip.file('README.txt', readme);
    zip.file('manifest.json', JSON.stringify(manifest, null, 2));

    const zipped = await zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE' });

    // Audit (best effort)
    try {
      await admin.from('security_audit_log').insert({
        user_id: userId,
        action: 'data_export_completed',
        resource_type: 'account',
        metadata: { tables: Object.keys(data).length, bytes: zipped.byteLength },
      } as any);
    } catch (_) { /* audit table is admin-insert-only via service role; ignore */ }

    const filename = `barbook-export-${userId}-${new Date().toISOString().slice(0, 10)}.zip`;
    return new Response(zipped, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (e) {
    console.error('export-account-data error', e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});