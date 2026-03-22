import { useEffect, useMemo, useState } from "react";
import PageLayout from "@/components/PageLayout";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ShieldCheck, Search } from "lucide-react";
import { format } from "date-fns";

interface AnalysisRow {
  id: string;
  file_name: string;
  hash: string;
  truth_score: number;
  verdict: string;
  created_at: string;
}

const verdictClass: Record<string, string> = {
  authentic: "text-success",
  suspicious: "text-warning",
  manipulated: "text-destructive",
};

export default function Admin() {
  const [loading, setLoading] = useState(true);
  const [analyses, setAnalyses] = useState<AnalysisRow[]>([]);
  const [certCount, setCertCount] = useState(0);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [{ data: rows }, { count }] = await Promise.all([
        supabase.from("analyses").select("id, file_name, hash, truth_score, verdict, created_at").order("created_at", { ascending: false }),
        supabase.from("certificates").select("id", { count: "exact", head: true }),
      ]);

      setAnalyses((rows as AnalysisRow[]) || []);
      setCertCount(count || 0);
      setLoading(false);
    };

    load();

    const channel = supabase
      .channel("admin-analyses")
      .on("postgres_changes", { event: "*", schema: "public", table: "analyses" }, load)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return analyses;
    const q = query.toLowerCase();
    return analyses.filter((row) => row.file_name.toLowerCase().includes(q) || row.hash.toLowerCase().includes(q) || row.verdict.toLowerCase().includes(q));
  }, [analyses, query]);

  return (
    <PageLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-sm text-muted-foreground mt-1">Operational history of analyses and certificate issuance</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground">Total Analyses</p>
            <p className="text-2xl font-display font-bold text-foreground mt-1">{analyses.length}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground">Certificates Issued</p>
            <p className="text-2xl font-display font-bold text-foreground mt-1">{certCount}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground">Avg Truth Score</p>
            <p className="text-2xl font-display font-bold text-foreground mt-1">
              {analyses.length ? Math.round(analyses.reduce((sum, item) => sum + item.truth_score, 0) / analyses.length) : 0}
            </p>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search filename/hash/verdict"
              className="w-full pl-9 pr-3 py-2 rounded-md border border-input bg-background text-sm"
            />
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {loading ? (
            <div className="py-16 flex justify-center"><Loader2 className="h-6 w-6 text-primary animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-16">No analysis records found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold">Time</th>
                    <th className="text-left px-4 py-3 font-semibold">File</th>
                    <th className="text-left px-4 py-3 font-semibold">Score</th>
                    <th className="text-left px-4 py-3 font-semibold">Verdict</th>
                    <th className="text-left px-4 py-3 font-semibold">SHA-256</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => (
                    <tr key={row.id} className="border-t border-border">
                      <td className="px-4 py-3 whitespace-nowrap">{format(new Date(row.created_at), "PPpp")}</td>
                      <td className="px-4 py-3 max-w-[220px] truncate">{row.file_name}</td>
                      <td className="px-4 py-3 font-semibold">{row.truth_score}</td>
                      <td className={`px-4 py-3 font-semibold capitalize ${verdictClass[row.verdict] || "text-foreground"}`}>
                        {row.verdict}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs max-w-[340px] truncate">{row.hash}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-secondary/40 rounded-xl border border-border p-4 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
          <p className="text-xs text-muted-foreground">
            This panel is currently open for demonstration; for production admin access, add authentication + role-based backend policies.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
