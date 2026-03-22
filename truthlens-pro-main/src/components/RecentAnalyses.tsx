import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface AnalysisRow {
  id: string;
  file_name: string;
  truth_score: number;
  verdict: string;
  created_at: string;
}

const verdictStyles: Record<string, string> = {
  authentic: "bg-success/10 text-success border-success/20",
  suspicious: "bg-warning/10 text-warning border-warning/20",
  manipulated: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function RecentAnalyses() {
  const [data, setData] = useState<AnalysisRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const { data: rows } = await supabase
      .from("analyses")
      .select("id, file_name, truth_score, verdict, created_at")
      .order("created_at", { ascending: false })
      .limit(10);
    setData((rows as AnalysisRow[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel("analyses-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "analyses" }, () => {
        fetchData();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="bg-card rounded-xl shadow-card overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="font-display font-semibold text-foreground">Recent Analyses</h3>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
        </div>
      ) : data.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">
          No analyses yet. Upload an image to get started.
        </p>
      ) : (
        <div className="divide-y divide-border">
          {data.map((item) => (
            <div key={item.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-muted/50 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.file_name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-display font-bold text-foreground">{item.truth_score}</span>
                <Badge variant="outline" className={verdictStyles[item.verdict] || ""}>
                  {item.verdict}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
