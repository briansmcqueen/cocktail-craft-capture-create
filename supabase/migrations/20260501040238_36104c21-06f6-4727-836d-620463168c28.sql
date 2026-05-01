-- Content reports table for user-flagged content moderation
CREATE TYPE public.report_target_type AS ENUM ('recipe', 'comment', 'profile');
CREATE TYPE public.report_status AS ENUM ('pending', 'reviewed', 'dismissed', 'actioned');

CREATE TABLE public.content_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL,
  target_type public.report_target_type NOT NULL,
  target_id TEXT NOT NULL,
  target_owner_id UUID,
  reason TEXT NOT NULL,
  details TEXT,
  status public.report_status NOT NULL DEFAULT 'pending',
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_content_reports_status ON public.content_reports(status, created_at DESC);
CREATE INDEX idx_content_reports_target ON public.content_reports(target_type, target_id);
CREATE INDEX idx_content_reports_reporter ON public.content_reports(reporter_id);

-- Prevent duplicate pending reports from the same user on the same target
CREATE UNIQUE INDEX idx_content_reports_unique_pending
  ON public.content_reports(reporter_id, target_type, target_id)
  WHERE status = 'pending';

ALTER TABLE public.content_reports ENABLE ROW LEVEL SECURITY;

-- Reporters can create their own reports
CREATE POLICY "Users can create their own reports"
ON public.content_reports
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = reporter_id);

-- Reporters can view their own reports
CREATE POLICY "Users can view their own reports"
ON public.content_reports
FOR SELECT
TO authenticated
USING (auth.uid() = reporter_id);

-- Admins can view all reports
CREATE POLICY "Admins can view all reports"
ON public.content_reports
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Admins can update reports (status, review notes)
CREATE POLICY "Admins can update reports"
ON public.content_reports
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete reports
CREATE POLICY "Admins can delete reports"
ON public.content_reports
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Updated_at trigger
CREATE TRIGGER update_content_reports_updated_at
BEFORE UPDATE ON public.content_reports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add terms acceptance tracking to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMP WITH TIME ZONE;