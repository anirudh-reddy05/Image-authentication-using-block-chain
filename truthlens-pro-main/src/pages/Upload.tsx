import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import ImageUploader from "@/components/ImageUploader";
import TruthScoreGauge from "@/components/TruthScoreGauge";
import MetadataFlags from "@/components/MetadataFlags";
import CertificateGenerator from "@/components/CertificateGenerator";
import ForensicHeatmap from "@/components/ForensicHeatmap";
import type { ImageAnalysis } from "@/lib/truthScore";

export default function Upload() {
  const [analysis, setAnalysis] = useState<ImageAnalysis | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <PageLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Upload & Verify</h1>
          <p className="text-sm text-muted-foreground mt-1">Upload or capture an image to run context-aware forensics and generate a smart certificate</p>
        </div>

        <div className="bg-card rounded-xl shadow-card p-6">
          <ImageUploader onResult={(a, p) => { setAnalysis(a); setPreview(p); }} />
        </div>

        {analysis && (
          <>
            <div className="bg-card rounded-xl shadow-card p-6 animate-fade-in">
              <h3 className="font-display font-semibold text-foreground mb-4">Integrity Report</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex flex-col items-center gap-4">
                  {preview && <img src={preview} alt="Analyzed" className="w-full max-w-[240px] rounded-lg border border-border" loading="lazy" />}
                  <TruthScoreGauge score={analysis.truthScore} />
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">SHA-256 Hash</p>
                    <p className="text-xs font-mono text-foreground break-all mt-1">{analysis.hash}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Hash Match</p>
                    <p className="text-sm font-semibold text-foreground">
                      {analysis.hashMatch ? "✅ Found in database" : "⚠️ Not previously registered"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Source Classification</p>
                    <p className="text-sm font-semibold text-foreground">{analysis.sourceLabel}</p>
                  </div>
                  <MetadataFlags flags={analysis.metadataFlags} />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <ForensicHeatmap analysis={analysis} />
              </div>
            </div>
            <CertificateGenerator analysis={analysis} />
          </>
        )}
      </div>
    </PageLayout>
  );
}
