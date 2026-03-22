import PageLayout from "@/components/PageLayout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Loader2, Download, FileCheck } from "lucide-react";
import { format } from "date-fns";
import { generateCertificatePDF } from "@/lib/certificateGenerator";

interface CertificateRow {
  id: string;
  file_name: string;
  hash: string;
  truth_score: number;
  verdict: string;
  certificate_data: any;
  blockchain_tx: string | null;
  created_at: string;
}

const verdictStyles: Record<string, string> = {
  authentic: "bg-success/10 text-success border-success/20",
  suspicious: "bg-warning/10 text-warning border-warning/20",
  manipulated: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function Certificates() {
  const [certs, setCerts] = useState<CertificateRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("certificates")
        .select("*")
        .order("created_at", { ascending: false });
      setCerts((data as CertificateRow[]) || []);
      setLoading(false);
    })();

    const channel = supabase
      .channel("certificates-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "certificates" }, async () => {
        const { data } = await supabase.from("certificates").select("*").order("created_at", { ascending: false });
        setCerts((data as CertificateRow[]) || []);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <PageLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Smart Certificates</h1>
          <p className="text-sm text-muted-foreground mt-1">Blockchain-backed digital birth certificates for your verified images</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 text-primary animate-spin" /></div>
        ) : certs.length === 0 ? (
          <div className="bg-card rounded-xl shadow-card p-12 text-center space-y-3">
            <FileCheck className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">No certificates yet. Upload and verify an image to generate your first smart certificate.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certs.map((cert) => (
              <div key={cert.id} className="bg-card rounded-xl shadow-card p-6 border border-border hover:shadow-elevated transition-shadow animate-fade-in">
                <div className="flex items-start justify-between mb-4">
                  <FileCheck className="h-8 w-8 text-primary" />
                  <Badge variant="outline" className={verdictStyles[cert.verdict] || ""}>{cert.verdict}</Badge>
                </div>
                <h3 className="font-display font-semibold text-foreground text-sm truncate">{cert.file_name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{format(new Date(cert.created_at), "PPpp")}</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Truth Score</span>
                    <span className="font-bold text-foreground">{cert.truth_score}/100</span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Hash</p>
                    <p className="text-xs font-mono text-foreground truncate">{cert.hash}</p>
                  </div>
                  {cert.blockchain_tx && (
                    <div>
                      <p className="text-xs text-muted-foreground">Blockchain TX</p>
                      <p className="text-xs font-mono text-primary truncate">{cert.blockchain_tx}</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => generateCertificatePDF(cert)}
                  className="mt-4 w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-semibold text-xs hover:opacity-90 transition"
                >
                  <Download className="h-4 w-4" /> Download Certificate
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
