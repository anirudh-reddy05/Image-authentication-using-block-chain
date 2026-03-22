import type { ImageAnalysis } from "@/lib/truthScore";
import { Binary, Flame, BarChart3, TrendingUp } from "lucide-react";

export default function ForensicHeatmap({ analysis }: { analysis: ImageAnalysis }) {
  if (!analysis.heatmapDataUrl) return null;

  const metrics = analysis.forensicMetrics;

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">ELA Heatmap & Forensic Context</h4>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-lg border border-border bg-muted/30 p-2">
          <img
            src={analysis.heatmapDataUrl}
            alt="Error Level Analysis heatmap"
            className="w-full rounded-md border border-border"
            loading="lazy"
          />
          <p className="text-[10px] text-muted-foreground mt-2 text-center">
            Bright regions = higher ELA difference. Localized bright spots suggest editing.
          </p>
        </div>
        <div className="rounded-lg border border-border p-4 space-y-3">
          <div className="flex items-start gap-2">
            <Flame className="h-4 w-4 text-primary mt-0.5" />
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Global ELA Ratio:</span> {metrics.globalElaRatio}
              {" "}— {metrics.globalElaRatio < 0.05 ? "Very low (clean image)" : metrics.globalElaRatio < 0.15 ? "Moderate (normal)" : "High (recompression or edits detected)"}
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Binary className="h-4 w-4 text-primary mt-0.5" />
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Localized Tamper Score:</span> {metrics.localizedTamperScore}
              {" "}— {metrics.localizedTamperScore < 0.15 ? "No localized anomalies (uniform)" : metrics.localizedTamperScore < 0.30 ? "Minor spatial anomaly" : metrics.localizedTamperScore < 0.50 ? "Moderate — possible localized editing" : "Strong — splicing or selective edits likely"}
            </p>
          </div>
          <div className="flex items-start gap-2">
            <TrendingUp className="h-4 w-4 text-primary mt-0.5" />
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Peak-to-Mean Ratio:</span> {metrics.peakToMeanRatio}
              {" "}— {metrics.peakToMeanRatio < 2.0 ? "Uniform (no hotspots)" : metrics.peakToMeanRatio < 3.0 ? "Moderate concentration" : "Strong hotspot detected"}
            </p>
          </div>
          <div className="flex items-start gap-2">
            <BarChart3 className="h-4 w-4 text-primary mt-0.5" />
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Block Variance:</span> {metrics.blockVariance}
              {" "}— {metrics.blockVariance < 0.005 ? "Consistent across image" : "Inconsistent regions present"}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Source Class:</span> {analysis.sourceLabel}
          </p>
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">EXIF Camera Block:</span> {metrics.exifPresent ? "Present ✓" : "Missing ✗"}
          </p>
        </div>
      </div>
    </div>
  );
}
