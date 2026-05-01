import { useState } from "react";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReportDialog from "./ReportDialog";
import type { ReportTargetType } from "@/services/contentReportsService";
import { useAuth } from "@/hooks/useAuth";

interface ReportButtonProps {
  targetType: ReportTargetType;
  targetId: string;
  targetOwnerId?: string | null;
  targetLabel?: string;
  variant?: "icon" | "text";
  className?: string;
}

export default function ReportButton({
  targetType,
  targetId,
  targetOwnerId,
  targetLabel,
  variant = "icon",
  className,
}: ReportButtonProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  // Don't let users report their own content
  if (user && targetOwnerId && user.id === targetOwnerId) return null;

  return (
    <>
      {variant === "icon" ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setOpen(true)}
          aria-label={`Report this ${targetType}`}
          className={className}
        >
          <Flag className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setOpen(true)}
          className={className}
        >
          <Flag className="h-4 w-4 mr-2" />
          Report
        </Button>
      )}
      <ReportDialog
        open={open}
        onOpenChange={setOpen}
        targetType={targetType}
        targetId={targetId}
        targetOwnerId={targetOwnerId}
        targetLabel={targetLabel}
      />
    </>
  );
}