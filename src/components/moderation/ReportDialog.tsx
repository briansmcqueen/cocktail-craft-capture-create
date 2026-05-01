import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  createReport,
  REPORT_REASONS,
  type ReportTargetType,
} from "@/services/contentReportsService";

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetType: ReportTargetType;
  targetId: string;
  targetOwnerId?: string | null;
  targetLabel?: string;
}

export default function ReportDialog({
  open,
  onOpenChange,
  targetType,
  targetId,
  targetOwnerId,
  targetLabel,
}: ReportDialogProps) {
  const { user } = useAuth();
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
      window.__openAuthModal?.("signin", "Sign in to report content.");
      return;
    }
    if (!reason) {
      toast({ title: "Please choose a reason", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      await createReport({
        targetType,
        targetId,
        targetOwnerId: targetOwnerId ?? null,
        reason,
        details,
      });
      toast({
        title: "Report submitted",
        description: "Thanks — our team will review it shortly.",
      });
      setReason("");
      setDetails("");
      onOpenChange(false);
    } catch (err) {
      toast({
        title: "Could not submit report",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const typeLabel =
    targetType === "recipe"
      ? "recipe"
      : targetType === "comment"
      ? "comment"
      : "profile";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-pure-white">Report {typeLabel}</DialogTitle>
          <DialogDescription>
            {targetLabel
              ? `Tell us what's wrong with "${targetLabel}".`
              : `Tell us what's wrong with this ${typeLabel}.`}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="report-reason">Reason</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger id="report-reason">
                <SelectValue placeholder="Choose a reason" />
              </SelectTrigger>
              <SelectContent>
                {REPORT_REASONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="report-details">Additional details (optional)</Label>
            <Textarea
              id="report-details"
              value={details}
              onChange={(e) => setDetails(e.target.value.slice(0, 1000))}
              placeholder="Add context to help our review (max 1000 characters)"
              rows={4}
              maxLength={1000}
            />
            <p className="text-xs text-soft-gray text-right">{details.length}/1000</p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting || !reason}>
            {submitting ? "Submitting…" : "Submit report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}