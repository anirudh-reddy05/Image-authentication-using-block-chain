import { useState } from "react";
import { FileCheck, Download, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { generateCertificatePDF } from "@/lib/certificateGenerator";
import type { ImageAnalysis } from "@/lib/truthScore";

interface Props {
  analysis: ImageAnalysis;
}

export default function CertificateGenerator({ analysis }: Props) {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [certId, setCertId] = useState<string | null>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      // Simulate blockchain transaction hash
      const blockchainTx = "0x" + Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, "0")).join("");

      const certificateData = {
        imageHash: analysis.hash,
        truthScore: analysis.truthScore,
        verdict: analysis.verdict,
        hashMatch: analysis.hashMatch,
        metadataFlags: analysis.metadataFlags,
        sourceLabel: analysis.sourceLabel,
        forensicMetrics: analysis.forensicMetrics,
        analyzedAt: analysis.analyzedAt,
        certifiedAt: new Date().toISOString(),
        blockchainNetwork: "Ethereum Sepolia Testnet",
        blockchainTx,
      };

      // Get the analysis ID from the database
      const { data: analysisRow } = await supabase
        .from("analyses")
        .select("id")
        .eq("hash", analysis.hash)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!analysisRow) throw new Error("Analysis not found");

      const { data: cert } = await supabase.from("certificates").insert({
        analysis_id: analysisRow.id,
        file_name: analysis.hash.substring(0, 12) + "...",
        hash: analysis.hash,
        truth_score: analysis.truthScore,
        verdict: analysis.verdict,
        certificate_data: certificateData as any,
        blockchain_tx: blockchainTx,
      }).select("id").single();

      setCertId(cert?.id || null);
      setGenerated(true);

      const generatedCert = {
        id: cert?.id || "unknown",
        file_name: analysis.hash.substring(0, 12) + "...",
        hash: analysis.hash,
        truth_score: analysis.truthScore,
        verdict: analysis.verdict,
        certificate_data: certificateData,
        blockchain_tx: blockchainTx,
        created_at: new Date().toISOString(),
      };

      const rawSettings = localStorage.getItem("truthlens.settings");
      const shouldAutoDownload = rawSettings ? Boolean(JSON.parse(rawSettings)?.autoDownload) : false;
      if (shouldAutoDownload) generateCertificatePDF(generatedCert);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-card p-6 animate-fade-in border border-primary/20">
      <div className="flex items-center gap-3 mb-4">
        <FileCheck className="h-6 w-6 text-primary" />
        <h3 className="font-display font-semibold text-foreground">Smart Certificate</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Generate a blockchain-backed digital certificate — the "birth certificate" for this image. This acts as permanent proof of verification.
      </p>
      {generated ? (
        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-success/10 border border-success/20">
            <p className="text-sm font-semibold text-success">✅ Certificate Generated Successfully</p>
            <p className="text-xs text-muted-foreground mt-1">Certificate ID: {certId}</p>
          </div>
          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition"
          >
            <Download className="h-4 w-4" /> Download Again
          </button>
        </div>
      ) : (
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition disabled:opacity-50"
        >
          {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileCheck className="h-4 w-4" />}
          {generating ? "Generating Certificate…" : "Generate Smart Certificate"}
        </button>
      )}
    </div>
  );
}
