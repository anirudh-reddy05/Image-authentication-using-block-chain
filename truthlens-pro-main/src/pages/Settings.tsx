import { useEffect, useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Settings as SettingsIcon, Moon, Bell, Lock, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

const SETTINGS_KEY = "truthlens.settings";

type AppSettings = {
  darkMode: boolean;
  notifications: boolean;
  autoHash: boolean;
  autoDownload: boolean;
};

const defaultSettings: AppSettings = {
  darkMode: false,
  notifications: true,
  autoHash: true,
  autoDownload: false,
};

export default function Settings() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  useEffect(() => {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as AppSettings;
        setSettings({ ...defaultSettings, ...parsed });
      } catch {
        setSettings(defaultSettings);
      }
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", settings.darkMode);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const Toggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? "bg-primary" : "bg-muted"}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-primary-foreground transition-transform ${enabled ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );

  const update = (key: keyof AppSettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <PageLayout>
      <div className="p-6 lg:p-8 space-y-6 max-w-3xl">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Fully functional local preferences for your current browser</p>
        </div>

        <div className="bg-card rounded-xl shadow-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <SettingsIcon className="h-5 w-5 text-primary" />
            <h2 className="font-display font-semibold text-foreground">Preferences</h2>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <p className="text-sm font-medium text-foreground">Dark Mode</p>
                <p className="text-xs text-muted-foreground">Applies immediately to the full app</p>
              </div>
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4 text-muted-foreground" />
                <Toggle enabled={settings.darkMode} onToggle={() => update("darkMode")} />
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <p className="text-sm font-medium text-foreground">Analysis Alerts</p>
                <p className="text-xs text-muted-foreground">Enable in-app completion notifications</p>
              </div>
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <Toggle enabled={settings.notifications} onToggle={() => update("notifications")} />
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <p className="text-sm font-medium text-foreground">Auto Register Hash</p>
                <p className="text-xs text-muted-foreground">Keep hashes in your verification registry</p>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <Toggle enabled={settings.autoHash} onToggle={() => update("autoHash")} />
              </div>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-foreground">Auto Download Certificate</p>
                <p className="text-xs text-muted-foreground">Download certificate file after generation</p>
              </div>
              <Toggle enabled={settings.autoDownload} onToggle={() => update("autoDownload")} />
            </div>
          </div>

          <button
            type="button"
            onClick={() => toast.success("Settings saved")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition"
          >
            <Save className="h-4 w-4" /> Save Preferences
          </button>
        </div>

        <div className="bg-card rounded-xl shadow-card p-6 border border-destructive/20 space-y-3">
          <div className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            <p className="font-semibold text-foreground">Reset Local App Data</p>
          </div>
          <p className="text-xs text-muted-foreground">This clears local UI preferences only (it does not delete backend analyses/certificates).</p>
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem(SETTINGS_KEY);
              setSettings(defaultSettings);
              document.documentElement.classList.remove("dark");
              toast.success("Local settings reset");
            }}
            className="px-4 py-2 rounded-lg border border-destructive text-destructive text-sm font-semibold hover:bg-destructive/10 transition"
          >
            Reset Settings
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
