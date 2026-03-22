/**
 * TruthLens Context-Aware Scoring Engine v3
 * Format-aware ELA with adaptive thresholds.
 * Distinguishes PNG recompression noise from genuine tampering.
 */

export interface ImageAnalysis {
  hash: string;
  truthScore: number;
  hashMatch: boolean;
  metadataFlags: MetadataFlag[];
  verdict: "authentic" | "suspicious" | "manipulated";
  analyzedAt: string;
  heatmapDataUrl: string | null;
  sourceLabel: string;
  forensicMetrics: {
    globalElaRatio: number;
    localizedTamperScore: number;
    exifPresent: boolean;
    dimensions: { width: number; height: number };
    blockVariance: number;
    peakToMeanRatio: number;
  };
}

export interface MetadataFlag {
  label: string;
  severity: "low" | "medium" | "high";
  detail: string;
}

interface AnalysisOptions {
  source?: "upload" | "camera";
}

interface ElaResult {
  heatmapDataUrl: string | null;
  globalElaRatio: number;
  localizedTamperScore: number;
  width: number;
  height: number;
  blockVariance: number;
  peakToMeanRatio: number;
  blockAverages: number[];
  formatPenalty: boolean;
}

/* ── Hashing ── */

async function computeSHA256(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/* ── EXIF detection ── */

function hasExifSignature(buffer: ArrayBuffer): boolean {
  const bytes = new Uint8Array(buffer);
  const exif = [0x45, 0x78, 0x69, 0x66, 0x00, 0x00];
  for (let i = 0; i <= bytes.length - exif.length; i++) {
    let match = true;
    for (let j = 0; j < exif.length; j++) {
      if (bytes[i + j] !== exif[j]) { match = false; break; }
    }
    if (match) return true;
  }
  return false;
}

/* ── Heatmap colour ramp ── */

function mapHeatColor(value: number): [number, number, number] {
  const v = Math.max(0, Math.min(1, value));
  if (v < 0.2) return [10, 20, 60 + Math.floor(v * 500)];
  if (v < 0.4) return [20, 80 + Math.floor((v - 0.2) * 700), 220];
  if (v < 0.6) return [50 + Math.floor((v - 0.4) * 800), 230, 50];
  if (v < 0.8) return [255, 220 - Math.floor((v - 0.6) * 700), 30];
  return [255, 50 - Math.floor((v - 0.8) * 200), 15];
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

/* ── Single-pass ELA ── */

async function runElaSinglePass(
  sourceCtx: CanvasRenderingContext2D,
  sourceCanvas: HTMLCanvasElement,
  width: number,
  height: number,
  quality: number
): Promise<Float32Array> {
  const compressedUrl = sourceCanvas.toDataURL("image/jpeg", quality);
  const compressedImg = await loadImage(compressedUrl);

  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext("2d")!;
  tempCtx.drawImage(compressedImg, 0, 0, width, height);

  const original = sourceCtx.getImageData(0, 0, width, height);
  const recompressed = tempCtx.getImageData(0, 0, width, height);

  const diffs = new Float32Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const idx = i * 4;
    const dr = Math.abs(original.data[idx] - recompressed.data[idx]);
    const dg = Math.abs(original.data[idx + 1] - recompressed.data[idx + 1]);
    const db = Math.abs(original.data[idx + 2] - recompressed.data[idx + 2]);
    diffs[i] = (dr + dg + db) / 765;
  }
  return diffs;
}

/* ── Multi-pass ELA Engine ── */

async function generateElaHeatmap(file: File): Promise<ElaResult> {
  const empty: ElaResult = {
    heatmapDataUrl: null, globalElaRatio: 0, localizedTamperScore: 0,
    width: 0, height: 0, blockVariance: 0, peakToMeanRatio: 0,
    blockAverages: [], formatPenalty: false,
  };
  if (!file.type.startsWith("image/")) return empty;

  // PNG/WebP → JPEG conversion always creates high ELA noise. Track this.
  const isNonJpeg = file.type !== "image/jpeg";

  const bitmap = await createImageBitmap(file);
  const maxWidth = 800;
  const width = Math.min(bitmap.width, maxWidth);
  const height = Math.max(1, Math.round((bitmap.height / bitmap.width) * width));

  const sourceCanvas = document.createElement("canvas");
  sourceCanvas.width = width;
  sourceCanvas.height = height;
  const sourceCtx = sourceCanvas.getContext("2d")!;
  sourceCtx.drawImage(bitmap, 0, 0, width, height);

  // For non-JPEG: first convert to JPEG baseline, then do ELA on THAT
  // This removes the format-conversion noise
  let elaCanvas = sourceCanvas;
  let elaCtx = sourceCtx;

  if (isNonJpeg) {
    // Pre-convert: PNG → JPEG → use as baseline
    const baselineUrl = sourceCanvas.toDataURL("image/jpeg", 0.92);
    const baselineImg = await loadImage(baselineUrl);
    const baselineCanvas = document.createElement("canvas");
    baselineCanvas.width = width;
    baselineCanvas.height = height;
    const baselineCtx = baselineCanvas.getContext("2d")!;
    baselineCtx.drawImage(baselineImg, 0, 0, width, height);
    elaCanvas = baselineCanvas;
    elaCtx = baselineCtx;
  }

  // Multi-pass ELA at different quality levels
  const pass1 = await runElaSinglePass(elaCtx, elaCanvas, width, height, 0.75);
  const pass2 = await runElaSinglePass(elaCtx, elaCanvas, width, height, 0.50);

  // Combine passes – take max difference per pixel
  const combined = new Float32Array(width * height);
  for (let i = 0; i < combined.length; i++) {
    combined[i] = Math.max(pass1[i], pass2[i]);
  }

  // Compute global stats BEFORE amplification
  let rawSum = 0;
  let rawMax = 0;
  for (let i = 0; i < combined.length; i++) {
    rawSum += combined[i];
    if (combined[i] > rawMax) rawMax = combined[i];
  }
  const rawMean = rawSum / combined.length;

  // Adaptive amplification: scale so mean maps to ~0.2 for visualization
  const ampFactor = rawMean > 0.001 ? Math.min(8, 0.2 / rawMean) : 2.0;

  // Block analysis with 24×24 grid
  const blockCols = 24;
  const blockRows = 24;
  const blockW = Math.max(1, Math.floor(width / blockCols));
  const blockH = Math.max(1, Math.floor(height / blockRows));
  const blockScores = Array.from({ length: blockCols * blockRows }, () => ({ sum: 0, count: 0 }));

  let highPixels = 0;

  // Build heatmap with adaptive amplification
  const heatmapCanvas = document.createElement("canvas");
  heatmapCanvas.width = width;
  heatmapCanvas.height = height;
  const heatmapCtx = heatmapCanvas.getContext("2d")!;
  const heatmapData = heatmapCtx.createImageData(width, height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const raw = combined[i];
      const amplified = Math.min(1, raw * ampFactor);

      if (raw > rawMean * 2.5) highPixels++;

      const bx = Math.min(blockCols - 1, Math.floor(x / blockW));
      const by = Math.min(blockRows - 1, Math.floor(y / blockH));
      // Store RAW values in blocks for statistical analysis
      blockScores[by * blockCols + bx].sum += raw;
      blockScores[by * blockCols + bx].count++;

      const idx = i * 4;
      const [r, g, b] = mapHeatColor(amplified);
      heatmapData.data[idx] = r;
      heatmapData.data[idx + 1] = g;
      heatmapData.data[idx + 2] = b;
      heatmapData.data[idx + 3] = Math.min(255, Math.floor(40 + amplified * 215));
    }
  }
  heatmapCtx.putImageData(heatmapData, 0, 0);

  // Block statistics on RAW (non-amplified) values
  const blockAverages = blockScores.map((b) => (b.count ? b.sum / b.count : 0));
  const avgBlock = blockAverages.reduce((a, b) => a + b, 0) / Math.max(blockAverages.length, 1);
  const maxBlock = Math.max(...blockAverages, 0);

  // Variance and standard deviation
  const variance = blockAverages.reduce((sum, val) => sum + (val - avgBlock) ** 2, 0) / Math.max(blockAverages.length, 1);
  const stdDev = Math.sqrt(variance);

  // Coefficient of Variation (CV) – key metric
  // High CV = some blocks very different from others = localized edit
  // Low CV = uniform noise = compression
  const cv = avgBlock > 0.0001 ? stdDev / avgBlock : 0;

  // Peak-to-mean ratio
  const peakToMeanRatio = avgBlock > 0.0001 ? maxBlock / avgBlock : 1;

  // Count outlier blocks (2.5 std devs above mean)
  const outlierThreshold = avgBlock + 2.5 * stdDev;
  const outlierBlocks = blockAverages.filter((v) => v > outlierThreshold).length;
  const outlierRatio = outlierBlocks / Math.max(blockAverages.length, 1);

  // Localized tamper score: based on CV, outlier ratio, and peak concentration
  // CV > 0.5 means high spatial inconsistency (genuine tampering)
  // CV < 0.3 means uniform (compression noise)
  let localizedTamperScore = 0;

  if (cv > 0.5 && peakToMeanRatio > 2.0) {
    // Strong spatial inconsistency — likely tampering
    localizedTamperScore = Math.min(1,
      (cv - 0.3) * 0.8 + outlierRatio * 2 + (peakToMeanRatio > 3 ? 0.2 : 0)
    );
  } else if (cv > 0.35 && peakToMeanRatio > 1.8) {
    // Moderate inconsistency
    localizedTamperScore = Math.min(0.5,
      (cv - 0.2) * 0.5 + outlierRatio * 1.5
    );
  } else {
    // Uniform — compression noise or clean image
    localizedTamperScore = Math.min(0.15, cv * 0.3);
  }

  const globalElaRatio = highPixels / (width * height);

  return {
    heatmapDataUrl: heatmapCanvas.toDataURL("image/png"),
    globalElaRatio,
    localizedTamperScore,
    width: bitmap.width,
    height: bitmap.height,
    blockVariance: variance,
    peakToMeanRatio,
    blockAverages,
    formatPenalty: isNonJpeg,
  };
}

/* ── Metadata analysis ── */

async function analyzeMetadata(file: File, source: "upload" | "camera") {
  const flags: MetadataFlag[] = [];
  const name = file.name.toLowerCase();
  const buffer = await file.arrayBuffer();
  const exifPresent = hasExifSignature(buffer);
  const ela = await generateElaHeatmap(file);

  // Filename heuristics
  if (name.includes("edited") || name.includes("modified") || name.includes("copy")) {
    flags.push({ label: "Edited naming pattern", severity: "medium", detail: "Filename suggests previous editing workflow" });
  }

  if (!exifPresent && source !== "camera") {
    flags.push({ label: "Unverified source", severity: "low", detail: "No original EXIF camera block found (common for screenshots/WhatsApp re-shares)" });
  }

  // Context-aware flagging using CV-based metrics
  const isUniform = ela.localizedTamperScore < 0.15;
  const isLocalizedTamper = ela.localizedTamperScore >= 0.2 && ela.localizedTamperScore < 0.5;
  const isHeavyTamper = ela.localizedTamperScore >= 0.5;

  if (isUniform && ela.formatPenalty) {
    flags.push({ label: "Format conversion detected", severity: "low", detail: "PNG/WebP source — ELA baseline adjusted to remove format-conversion noise" });
  } else if (isUniform) {
    flags.push({ label: "Uniform compression profile", severity: "low", detail: "ELA is consistent across image — no localized edits detected" });
  }

  if (isHeavyTamper) {
    flags.push({ label: "Strong tamper signature", severity: "high", detail: `High spatial inconsistency (CV-based score: ${(ela.localizedTamperScore * 100).toFixed(0)}%). Localized ELA hotspots suggest splicing or selective edits.` });
  } else if (isLocalizedTamper) {
    flags.push({ label: "Localized anomaly detected", severity: "medium", detail: `Moderate spatial inconsistency detected. Score: ${(ela.localizedTamperScore * 100).toFixed(0)}%. Some regions differ from baseline.` });
  }

  if (file.size < 35_000 && source !== "camera") {
    flags.push({ label: "Aggressive size reduction", severity: "low", detail: "Heavy recompression/cropping may reduce forensic confidence" });
  }

  if (file.type === "image/webp") {
    flags.push({ label: "Web-export format", severity: "low", detail: "WebP often strips provenance metadata during sharing" });
  }

  let sourceLabel = "Standard Upload Source";
  if (source === "camera") sourceLabel = "Verified Live Camera Source";
  else if (!exifPresent && isUniform) sourceLabel = "Digitally Processed Source (Compressed)";
  else if (exifPresent && isUniform) sourceLabel = "Original Camera Source";
  else if (!exifPresent && isLocalizedTamper) sourceLabel = "Unverified Source with Anomalies";
  else if (isHeavyTamper) sourceLabel = "Potentially Manipulated Source";
  else if (!exifPresent) sourceLabel = "Unverified Source (No EXIF)";

  return { flags, ela, exifPresent, sourceLabel };
}

/* ── Dynamic scoring ── */

function calculateScore(
  hashMatch: boolean,
  flags: MetadataFlag[],
  ela: ElaResult,
  source: "upload" | "camera"
): number {
  let score = 50; // neutral baseline

  // ── Positive signals ──
  if (hashMatch) score += 30;
  if (source === "camera") score += 15;

  // Clean ELA profile = strong authenticity signal
  if (ela.localizedTamperScore < 0.08) {
    score += 30; // very clean image
  } else if (ela.localizedTamperScore < 0.15) {
    score += 22; // clean with minor noise
  } else if (ela.localizedTamperScore < 0.20) {
    score += 12; // some noise but within normal range
  }

  // EXIF present = original camera image
  if (ela.blockAverages.length > 0) {
    const exifFlag = flags.find(f => f.label === "Unverified source");
    if (!exifFlag) {
      score += 5; // has EXIF data
    }
  }

  // ── Negative signals ──
  // Localized tampering is the primary negative signal
  if (ela.localizedTamperScore >= 0.5) {
    score -= 40; // heavy localized edit
  } else if (ela.localizedTamperScore >= 0.3) {
    score -= 25; // significant localized edit
  } else if (ela.localizedTamperScore >= 0.2) {
    score -= 15; // moderate anomaly
  }

  // High peak-to-mean with high tamper score = concentrated edit
  if (ela.peakToMeanRatio > 3.0 && ela.localizedTamperScore > 0.3) {
    score -= 10;
  }

  // Flag-based adjustments (secondary)
  for (const flag of flags) {
    if (flag.severity === "high") score -= 5;
    else if (flag.severity === "medium") score -= 2;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

/* ── Verdict ── */

function getVerdict(score: number): "authentic" | "suspicious" | "manipulated" {
  if (score >= 75) return "authentic";
  if (score >= 45) return "suspicious";
  return "manipulated";
}

/* ── Known-hash registry (in-memory simulation) ── */
const KNOWN_HASHES = new Set<string>();

/* ── Public API ── */

export async function analyzeImage(file: File, options: AnalysisOptions = {}): Promise<ImageAnalysis> {
  const source = options.source ?? "upload";
  const hash = await computeSHA256(file);
  const hashMatch = KNOWN_HASHES.has(hash);
  const { flags, ela, exifPresent, sourceLabel } = await analyzeMetadata(file, source);
  const truthScore = calculateScore(hashMatch, flags, ela, source);

  KNOWN_HASHES.add(hash);

  return {
    hash,
    truthScore,
    hashMatch,
    metadataFlags: flags,
    verdict: getVerdict(truthScore),
    analyzedAt: new Date().toISOString(),
    heatmapDataUrl: ela.heatmapDataUrl,
    sourceLabel,
    forensicMetrics: {
      globalElaRatio: Number(ela.globalElaRatio.toFixed(4)),
      localizedTamperScore: Number(ela.localizedTamperScore.toFixed(4)),
      exifPresent,
      dimensions: { width: ela.width, height: ela.height },
      blockVariance: Number(ela.blockVariance.toFixed(6)),
      peakToMeanRatio: Number(ela.peakToMeanRatio.toFixed(2)),
    },
  };
}
