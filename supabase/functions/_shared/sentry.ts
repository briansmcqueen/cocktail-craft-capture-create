// Lightweight Sentry helper for Supabase Edge Functions (Deno runtime).
//
// Usage:
//   import { initSentry, captureEdgeError } from "../_shared/sentry.ts";
//   const Sentry = initSentry("function-name");
//   try { ... } catch (e) { await captureEdgeError(Sentry, e); throw e; }
//
// The DSN is read from the SENTRY_DSN_EDGE secret. If unset, all helpers
// no-op so local development and preview deployments stay quiet.

import * as Sentry from "https://deno.land/x/sentry@8.40.0/index.mjs";

let initialized = false;

export function initSentry(serverName: string) {
  const dsn = Deno.env.get("SENTRY_DSN_EDGE");
  if (!dsn) return Sentry;
  if (initialized) return Sentry;

  Sentry.init({
    dsn,
    environment: Deno.env.get("SUPABASE_ENV") ?? "production",
    serverName,
    tracesSampleRate: 0.1,
    defaultIntegrations: false,
  });
  initialized = true;
  return Sentry;
}

export async function captureEdgeError(s: typeof Sentry, err: unknown) {
  if (!initialized) return;
  s.captureException(err);
  await s.flush(2000);
}