
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Remove any prior schedule with the same name
DO $$
BEGIN
  PERFORM cron.unschedule('daily-account-purge');
EXCEPTION WHEN others THEN
  NULL;
END $$;

SELECT cron.schedule(
  'daily-account-purge',
  '0 3 * * *',
  $$
  SELECT net.http_post(
    url := 'https://qwfoumoaotswlzbzbcdt.supabase.co/functions/v1/delete-account/purge',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := '{}'::jsonb
  );
  $$
);
