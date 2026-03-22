import PageLayout from "@/components/PageLayout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

interface AnalysisRow {
  id: string;
  file_name: string;
  truth_score: number;
  verdict: string;
  hash: string;
  hash_match: boolean;
  metadata_flags: any;
  created_at: string;
}

const verdictStyles: Record<string, string> = {
  authentic: "bg-success/10 text-success border-success/20",
  suspicious: "bg-warning/10 text-warning border-warning/20",
  manipulated: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function Reports() {
  const [data, setData] = useState<AnalysisRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: rows } = await supabase
        .from("analyses")
        .select("*")
        .order("created_at", { ascending: false });
      setData((rows as AnalysisRow[]) || []);
      setLoading(false);
    })();
  }, []);

  return (
    <PageLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Analysis Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Complete history of all image verifications</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 text-primary animate-spin" /></div>
        ) : data.length === 0 ? (
          <div className="bg-card rounded-xl shadow-card p-12 text-center">
            <p className="text-muted-foreground">No reports yet. Upload an image to create your first report.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((item) => (
              <div key={item.id} className="bg-card rounded-xl shadow-card p-6 animate-fade-in">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-display font-semibold text-foreground truncate">{item.file_name}</h3>
                      <Badge variant="outline" className={verdictStyles[item.verdict] || ""}>{item.verdict}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{format(new Date(item.created_at), "PPpp")}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-display font-bold text-foreground">{item.truth_score}</p>
                    <p className="text-xs text-muted-foreground">Truth Score</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">SHA-256 Hash</p>
                    <p className="text-xs font-mono text-foreground break-all mt-1">{item.hash}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Hash Match</p>
                    <p className="text-sm font-semibold text-foreground">
                      {item.hash_match ? "✅ Found in registry" : "⚠️ Not previously registered"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
