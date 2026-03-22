import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Upload, Loader2, Camera, Aperture, RotateCcw } from "lucide-react";
import { analyzeImage, type ImageAnalysis } from "@/lib/truthScore";
import { supabase } from "@/integrations/supabase/client";

interface ImageUploaderProps {
  onResult: (analysis: ImageAnalysis, preview: string) => void;
}

export default function ImageUploader({ onResult }: ImageUploaderProps) {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cameraMode, setCameraMode] = useState(false);
  const webcamRef = useRef<Webcam | null>(null);

  const handleFile = useCallback(async (file: File, source: "upload" | "camera", previewOverride?: string) => {
    if (!file.type.startsWith("image/")) return;
    setLoading(true);
    try {
      const preview = previewOverride ?? URL.createObjectURL(file);
      const analysis = await analyzeImage(file, { source });
      onResult(analysis, preview);

      await supabase.from("analyses").insert({
        file_name: file.name,
        hash: analysis.hash,
        truth_score: analysis.truthScore,
        verdict: analysis.verdict,
        hash_match: analysis.hashMatch,
        metadata_flags: analysis.metadataFlags as any,
      });
    } finally {
      setLoading(false);
    }
  }, [onResult]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file, "upload");
  }, [handleFile]);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file, "upload");
  }, [handleFile]);

  const onCapture = useCallback(async () => {
    const shot = webcamRef.current?.getScreenshot();
    if (!shot) return;

    const blob = await (await fetch(shot)).blob();
    const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: "image/jpeg" });
    await handleFile(file, "camera", shot);
  }, [handleFile]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCameraMode(false)}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold border transition-colors ${
            !cameraMode ? "bg-primary text-primary-foreground border-primary" : "bg-background text-foreground border-border hover:bg-secondary"
          }`}
        >
          <Upload className="h-4 w-4" /> Upload File
        </button>
        <button
          type="button"
          onClick={() => setCameraMode(true)}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold border transition-colors ${
            cameraMode ? "bg-primary text-primary-foreground border-primary" : "bg-background text-foreground border-border hover:bg-secondary"
          }`}
        >
          <Camera className="h-4 w-4" /> Verify via Live Camera
        </button>
      </div>

      {cameraMode ? (
        <div className="space-y-3 rounded-xl border border-border p-4 bg-card">
          <div className="overflow-hidden rounded-lg border border-border bg-muted/30">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              screenshotQuality={0.95}
              videoConstraints={{ facingMode: "environment" }}
              className="w-full h-auto"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onCapture}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Aperture className="h-4 w-4" />}
              {loading ? "Analyzing…" : "Capture & Analyze"}
            </button>
            <button
              type="button"
              onClick={() => setCameraMode(false)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-secondary transition"
            >
              <RotateCcw className="h-4 w-4" /> Back to Upload
            </button>
          </div>
          <p className="text-xs text-muted-foreground">Tip: camera capture gives better provenance than re-shared screenshots.</p>
        </div>
      ) : (
        <label
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`
            relative flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all
            ${dragging ? "border-primary bg-secondary" : "border-border hover:border-primary/50 hover:bg-secondary/50"}
          `}
        >
          <input type="file" accept="image/*" onChange={onChange} className="sr-only" />
          {loading ? (
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
          ) : (
            <Upload className="h-10 w-10 text-primary" />
          )}
          <div className="text-center">
            <p className="font-semibold text-sm text-foreground">
              {loading ? "Analyzing image…" : "Drop an image or click to upload"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WebP up to 20MB</p>
          </div>
        </label>
      )}
    </div>
  );
}
