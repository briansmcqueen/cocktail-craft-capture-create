import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, Shield, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { userRolesService } from "@/services/userRolesService";
import {
  listAllReports,
  updateReportStatus,
  type ContentReport,
  type ReportStatus,
} from "@/services/contentReportsService";
import PageSEO from "@/components/PageSEO";

const STATUSES: { value: ReportStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "reviewed", label: "Reviewed" },
  { value: "dismissed", label: "Dismissed" },
  { value: "actioned", label: "Actioned" },
];

export default function AdminModeration() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeStatus, setActiveStatus] = useState<ReportStatus>("pending");
  const [reports, setReports] = useState<ContentReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [notesById, setNotesById] = useState<Record<string, string>>({});

  useEffect(() => {
    if (authLoading) return;
    (async () => {
      if (!user) {
        navigate("/", { replace: true });
        return;
      }
      const admin = await userRolesService.isAdmin();
      setIsAdmin(admin);
      setChecking(false);
      if (!admin) navigate("/", { replace: true });
    })();
  }, [user, authLoading, navigate]);

  const loadReports = async (status: ReportStatus) => {
    setLoading(true);
    try {
      const data = await listAllReports(status);
      setReports(data);
    } catch (err) {
      toast({
        title: "Failed to load reports",
        description: err instanceof Error ? err.message : "Try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) loadReports(activeStatus);
  }, [isAdmin, activeStatus]);

  const handleAction = async (id: string, status: ReportStatus) => {
    try {
      await updateReportStatus(id, status, notesById[id]);
      toast({ title: `Marked as ${status}` });
      setReports((r) => r.filter((x) => x.id !== id));
    } catch (err) {
      toast({
        title: "Update failed",
        description: err instanceof Error ? err.message : "Try again.",
        variant: "destructive",
      });
    }
  };

  const targetLink = (r: ContentReport): string | null => {
    if (r.target_type === "recipe") return `/cocktail/id/${r.target_id}`;
    if (r.target_type === "profile") return `/user/${r.target_id}`;
    return null;
  };

  if (checking || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-soft-gray" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <>
      <PageSEO
        title="Moderation queue"
        description="Admin moderation queue for reported content."
        noindex
      />
      <div className="container max-w-4xl mx-auto px-5 py-8 pb-24 md:pb-8">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-5 w-5 text-pure-white" />
          <h1 className="text-xs font-bold uppercase tracking-widest text-pure-white">
            Moderation queue
          </h1>
        </div>

        <Tabs
          value={activeStatus}
          onValueChange={(v) => setActiveStatus(v as ReportStatus)}
        >
          <TabsList className="mb-4">
            {STATUSES.map((s) => (
              <TabsTrigger key={s.value} value={s.value}>
                {s.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {STATUSES.map((s) => (
            <TabsContent key={s.value} value={s.value} className="space-y-3">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-5 w-5 animate-spin text-soft-gray" />
                </div>
              ) : reports.length === 0 ? (
                <p className="text-sm text-soft-gray text-center py-12">
                  No {s.label.toLowerCase()} reports.
                </p>
              ) : (
                reports.map((r) => {
                  const link = targetLink(r);
                  return (
                    <div
                      key={r.id}
                      className="border border-light-charcoal rounded-organic-md p-4 bg-medium-charcoal space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="capitalize">
                              {r.target_type}
                            </Badge>
                            <Badge variant="secondary">{r.reason}</Badge>
                            <span className="text-xs text-soft-gray">
                              {new Date(r.created_at).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-xs text-soft-gray break-all">
                            Target: {r.target_id}
                            {r.target_owner_id && (
                              <> · Owner: {r.target_owner_id.slice(0, 8)}…</>
                            )}
                          </p>
                        </div>
                        {link && (
                          <Link
                            to={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-emerald-400 hover:underline inline-flex items-center gap-1"
                          >
                            View <ExternalLink className="h-3 w-3" />
                          </Link>
                        )}
                      </div>

                      {r.details && (
                        <p className="text-sm text-light-text whitespace-pre-wrap">
                          {r.details}
                        </p>
                      )}

                      {s.value === "pending" && (
                        <>
                          <Textarea
                            placeholder="Review notes (optional)"
                            value={notesById[r.id] ?? ""}
                            onChange={(e) =>
                              setNotesById((m) => ({ ...m, [r.id]: e.target.value }))
                            }
                            rows={2}
                          />
                          <div className="flex gap-2 flex-wrap">
                            <Button
                              size="sm"
                              onClick={() => handleAction(r.id, "actioned")}
                            >
                              Action taken
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAction(r.id, "reviewed")}
                            >
                              Mark reviewed
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleAction(r.id, "dismissed")}
                            >
                              Dismiss
                            </Button>
                          </div>
                        </>
                      )}

                      {r.review_notes && s.value !== "pending" && (
                        <p className="text-xs text-soft-gray italic">
                          Notes: {r.review_notes}
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </>
  );
}