import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const BUCKET = "recipes";

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

function decodeBase64(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Auth: accept either (a) the service-role key as bearer, or (b) a signed-in admin user.
    const authHeader = req.headers.get("Authorization") ?? "";
    const bearer = authHeader.replace(/^Bearer\s+/i, "").trim();
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    let authorized = false;
    if (bearer && bearer === SERVICE_ROLE) {
      authorized = true;
    } else {
      const userClient = createClient(SUPABASE_URL, ANON_KEY, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: userData } = await userClient.auth.getUser();
      if (userData?.user) {
        const { data: roleRow } = await admin
          .from("user_roles")
          .select("role")
          .eq("user_id", userData.user.id)
          .eq("role", "admin")
          .maybeSingle();
        if (roleRow) authorized = true;
      }
    }
    if (!authorized) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const dryRun = url.searchParams.get("dry_run") === "1";
    const limit = Math.min(
      parseInt(url.searchParams.get("limit") ?? "100", 10) || 100,
      500,
    );

    const { data: rows, error: fetchErr } = await admin
      .from("recipes")
      .select("id, user_id, image_url")
      .like("image_url", "data:image/%")
      .limit(limit);
    if (fetchErr) throw fetchErr;

    const results: Array<Record<string, unknown>> = [];
    let migrated = 0;
    let skipped = 0;
    let failed = 0;

    for (const row of rows ?? []) {
      const dataUrl = row.image_url as string;
      const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/);
      if (!match) {
        skipped++;
        results.push({ id: row.id, status: "skipped", reason: "bad data url" });
        continue;
      }
      const mime = match[1].toLowerCase();
      const ext = EXT_BY_MIME[mime];
      if (!ext) {
        skipped++;
        results.push({ id: row.id, status: "skipped", reason: `unsupported mime ${mime}` });
        continue;
      }
      try {
        const bytes = decodeBase64(match[2]);
        const path = `${row.user_id}/migrated/${row.id}.${ext}`;

        if (!dryRun) {
          const { error: upErr } = await admin.storage
            .from(BUCKET)
            .upload(path, bytes, {
              contentType: mime,
              upsert: true,
            });
          if (upErr) throw upErr;

          const { data: pub } = admin.storage.from(BUCKET).getPublicUrl(path);
          const publicUrl = pub.publicUrl;

          const { error: updErr } = await admin
            .from("recipes")
            .update({ image_url: publicUrl })
            .eq("id", row.id);
          if (updErr) throw updErr;

          results.push({ id: row.id, status: "migrated", path, bytes: bytes.length });
        } else {
          results.push({ id: row.id, status: "would_migrate", path, bytes: bytes.length });
        }
        migrated++;
      } catch (e) {
        failed++;
        results.push({ id: row.id, status: "failed", error: String(e) });
      }
    }

    return new Response(
      JSON.stringify({
        dry_run: dryRun,
        scanned: rows?.length ?? 0,
        migrated,
        skipped,
        failed,
        results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});