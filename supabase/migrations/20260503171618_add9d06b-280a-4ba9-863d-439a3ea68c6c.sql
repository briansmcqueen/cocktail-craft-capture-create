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
      'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'service_role_key' LIMIT 1)
    ),
    body := '{}'::jsonb
  );
  $$
);