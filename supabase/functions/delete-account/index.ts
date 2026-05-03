import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const USER_BUCKETS = ["avatars", "recipes", "recipe-images"];

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function purgeStorageForUser(admin: ReturnType<typeof createClient>, userId: string) {
  for (const bucket of USER_BUCKETS) {
    try {
      const { data: list, error } = await admin.storage
        .from(bucket)
        .list(userId, { limit: 1000 });
      if (error || !list?.length) continue;

      // Recursively collect file paths under ${userId}/...
      const queue: string[] = [userId];
      const files: string[] = [];
      while (queue.length) {
        const prefix = queue.shift()!;
        const { data: entries } = await admin.storage
          .from(bucket)
          .list(prefix, { limit: 1000 });
        for (const e of entries ?? []) {
          const path = `${prefix}/${e.name}`;
          if (e.id === null) {
            // it's a folder
            queue.push(path);
          } else {
            files.push(path);
          }
        }
      }
      if (files.length) {
        await admin.storage.from(bucket).remove(files);
      }
    } catch (e) {
      console.error(`Failed clearing bucket ${bucket} for ${userId}:`, e);
    }
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const url = new URL(req.url);
  // Last path segment determines action: request | cancel | purge
  const action = url.pathname.split("/").filter(Boolean).pop() ?? "request";

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

  try {
    if (action === "purge") {
      // Service-role only
      const bearer = (req.headers.get("Authorization") ?? "")
        .replace(/^Bearer\s+/i, "")
        .trim();
      if (bearer !== SERVICE_ROLE) {
        return json({ error: "Unauthorized" }, 401);
      }

      const { data: due, error } = await admin
        .from("profiles")
        .select("id")
        .lte("deletion_scheduled_for", new Date().toISOString())
        .not("deletion_scheduled_for", "is", null)
        .limit(50);
      if (error) throw error;

      const results: Array<Record<string, unknown>> = [];
      for (const row of due ?? []) {
        const userId = row.id as string;
        try {
          await purgeStorageForUser(admin, userId);
          const { error: rpcErr } = await admin.rpc("purge_user_account", {
            p_user_id: userId,
          });
          if (rpcErr) throw rpcErr;
          const { error: authErr } = await admin.auth.admin.deleteUser(userId);
          if (authErr) throw authErr;
          results.push({ user_id: userId, status: "purged" });
        } catch (e) {
          results.push({ user_id: userId, status: "failed", error: String(e) });
        }
      }
      return json({ processed: results.length, results });
    }

    // request | cancel — require authenticated user
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader) return json({ error: "Missing Authorization" }, 401);

    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return json({ error: "Unauthorized" }, 401);
    }

    if (action === "cancel") {
      const { error } = await userClient.rpc("cancel_account_deletion");
      if (error) throw error;
      // Best-effort confirmation email
      try {
        if (userData.user.email) {
          await admin.functions.invoke("send-transactional-email", {
            body: {
              templateName: "account-deletion-cancelled",
              recipientEmail: userData.user.email,
              idempotencyKey: `deletion-cancelled-${userData.user.id}-${Date.now()}`,
            },
          });
        }
      } catch (e) {
        console.error("deletion cancel email failed", e);
      }
      return json({ ok: true });
    }

    // default: request
    const { data, error } = await userClient.rpc("request_account_deletion");
    if (error) throw error;
    const row = Array.isArray(data) ? data[0] : data;
    // Best-effort confirmation email
    try {
      if (userData.user.email) {
        await admin.functions.invoke("send-transactional-email", {
          body: {
            templateName: "account-deletion-scheduled",
            recipientEmail: userData.user.email,
            idempotencyKey: `deletion-scheduled-${userData.user.id}-${row?.deletion_requested_at ?? Date.now()}`,
            templateData: {
              scheduledFor: row?.deletion_scheduled_for,
              cancelUrl: "https://barbook.io/settings",
            },
          },
        });
      }
    } catch (e) {
      console.error("deletion request email failed", e);
    }
    return json({
      ok: true,
      deletion_requested_at: row?.deletion_requested_at,
      deletion_scheduled_for: row?.deletion_scheduled_for,
    });
  } catch (e) {
    console.error("delete-account error:", e);
    return json({ error: String(e) }, 500);
  }
});