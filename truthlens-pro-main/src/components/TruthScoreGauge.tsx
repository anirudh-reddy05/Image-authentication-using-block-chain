import { cn } from "@/lib/utils";

interface TruthScoreGaugeProps {
  score: number;
  size?: number;
}

export default function TruthScoreGauge({ score, size = 180 }: TruthScoreGaugeProps) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 78 ? "text-success" : score >= 55 ? "text-warning" : "text-destructive";
  const label =
    score >= 78 ? "Authentic" : score >= 55 ? "Suspicious" : "Manipulated";

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-lg">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="10"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
          className={cn("transition-all duration-1000 ease-out", color)}
          style={{ "--score-offset": offset } as React.CSSProperties}
        />
        <text
          x="50"
          y="46"
          textAnchor="middle"
          className="fill-foreground font-display text-2xl font-bold"
          style={{ fontSize: "22px" }}
        >
          {score}
        </text>
        <text
          x="50"
          y="62"
          textAnchor="middle"
          className="fill-muted-foreground"
          style={{ fontSize: "8px" }}
        >
          Truth Score
        </text>
      </svg>
      <span className={cn("text-sm font-semibold", color)}>{label}</span>
    </div>
  );
}
