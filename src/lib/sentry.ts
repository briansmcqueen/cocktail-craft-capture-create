import * as Sentry from "@sentry/react";

/**
 * Initialize Sentry only when:
 *   - a DSN is provided via VITE_SENTRY_DSN, AND
 *   - the app is running in production (not dev / Lovable preview).
 *
 * The DSN is a publishable identifier — safe to ship to the browser.
 */
export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;
  if (!dsn) return;

  if (import.meta.env.DEV) return;

  // Avoid initializing inside Lovable's editor preview iframe.
  const host = window.location.hostname;
  if (host.includes("lovableproject.com") || host.includes("id-preview--")) return;

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({ maskAllText: false, blockAllMedia: false }),
    ],
    // Filter out noisy errors from browser extensions and third-party scripts.
    ignoreErrors: [
      "ResizeObserver loop limit exceeded",
      "ResizeObserver loop completed with undelivered notifications",
      "Non-Error promise rejection captured",
    ],
  });
}
