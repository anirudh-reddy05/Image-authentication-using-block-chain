import type { MetadataFlag } from "@/lib/truthScore";
import { AlertTriangle, Info, XCircle } from "lucide-react";

const severityConfig = {
  low: { icon: Info, className: "text-info bg-info/10" },
  medium: { icon: AlertTriangle, className: "text-warning bg-warning/10" },
  high: { icon: XCircle, className: "text-destructive bg-destructive/10" },
};

export default function MetadataFlags({ flags }: { flags: MetadataFlag[] }) {
  if (!flags.length) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Metadata Flags</h4>
      {flags.map((flag, i) => {
        const config = severityConfig[flag.severity];
        const Icon = config.icon;
        return (
          <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${config.className}`}>
            <Icon className="h-4 w-4 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium">{flag.label}</p>
              <p className="text-xs opacity-80">{flag.detail}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
