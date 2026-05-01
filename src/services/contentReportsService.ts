import { supabase } from "@/integrations/supabase/client";

export type ReportTargetType = "recipe" | "comment" | "profile";
export type ReportStatus = "pending" | "reviewed" | "dismissed" | "actioned";

export interface ContentReport {
  id: string;
  reporter_id: string;
  target_type: ReportTargetType;
  target_id: string;
  target_owner_id: string | null;
  reason: string;
  details: string | null;
  status: ReportStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateReportInput {
  targetType: ReportTargetType;
  targetId: string;
  targetOwnerId?: string | null;
  reason: string;
  details?: string;
}

export const REPORT_REASONS: { value: string; label: string }[] = [
  { value: "spam", label: "Spam or misleading" },
  { value: "harassment", label: "Harassment or hate speech" },
  { value: "sexual", label: "Sexual or explicit content" },
  { value: "violence", label: "Violence or dangerous content" },
  { value: "ip", label: "Intellectual property violation" },
  { value: "underage", label: "Underage drinking promotion" },
  { value: "other", label: "Other" },
];

export async function createReport(input: CreateReportInput) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in to submit a report.");

  const reason = (input.reason ?? "").trim();
  if (!reason) throw new Error("Please choose a reason.");
  const details = (input.details ?? "").trim().slice(0, 1000) || null;

  const { error } = await supabase.from("content_reports").insert({
    reporter_id: user.id,
    target_type: input.targetType,
    target_id: String(input.targetId),
    target_owner_id: input.targetOwnerId ?? null,
    reason,
    details,
  });

  if (error) {
    if ((error as { code?: string }).code === "23505") {
      throw new Error("You already reported this. Our team will review it.");
    }
    throw error;
  }
  return true;
}

export async function listAllReports(status?: ReportStatus): Promise<ContentReport[]> {
  let query = supabase
    .from("content_reports")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as ContentReport[];
}

export async function updateReportStatus(
  id: string,
  status: ReportStatus,
  reviewNotes?: string,
) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("content_reports")
    .update({
      status,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
      review_notes: reviewNotes?.trim() || null,
    })
    .eq("id", id);
  if (error) throw error;
  return true;
}