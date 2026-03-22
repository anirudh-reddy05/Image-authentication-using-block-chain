import { FileCheck, ShieldAlert, TrendingUp, Clock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AnalysisRow {
  truth_score: number;
  verdict: string;
  created_at: string;
}

export default function StatsCards() {
  const [rows, setRows] = useState<AnalysisRow[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("analyses")
        .select("truth_score, verdict, created_at")
        .order("created_at", { ascending: false })
        .limit(500);
      setRows((data as AnalysisRow[]) || []);
    };

    load();

    const channel = supabase
      .channel("stats-analyses")
      .on("postgres_changes", { event: "*", schema: "public", table: "analyses" }, load)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const stats = useMemo(() => {
    const total = rows.length;
    const flagged = rows.filter((r) => r.verdict !== "authentic").length;
    const avg = total ? (rows.reduce((sum, item) => sum + item.truth_score, 0) / total).toFixed(1) : "0.0";

    let avgSec = 1.6;
    if (total > 0) avgSec = 1.1;

    return [
      { icon: FileCheck, label: "Images Analyzed", value: String(total), hint: "Live", positive: true },
      { icon: ShieldAlert, label: "Flagged", value: String(flagged), hint: "Suspicious + Manipulated", positive: flagged < Math.max(3, total * 0.4) },
      { icon: TrendingUp, label: "Avg Score", value: avg, hint: "Out of 100", positive: Number(avg) >= 70 },
      { icon: Clock, label: "Avg Time", value: `${avgSec.toFixed(1)}s`, hint: "Processing estimate", positive: true },
    ];
  }, [rows]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-card rounded-xl p-5 shadow-card flex flex-col gap-3 animate-fade-in">
          <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
            <s.icon className="h-5 w-5 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-display font-bold text-foreground">{s.value}</span>
            <span className={`text-xs font-semibold ${s.positive ? "text-success" : "text-warning"}`}>{s.hint}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
