import { Home, Upload, FileText, Settings, Crown, Shield, Users, FileCheck, BookOpen, UserCog } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", to: "/" },
  { icon: Upload, label: "Upload", to: "/upload" },
  { icon: FileText, label: "Reports", to: "/reports" },
  { icon: FileCheck, label: "Certificates", to: "/certificates" },
  { icon: UserCog, label: "Admin Panel", to: "/admin" },
  { icon: BookOpen, label: "How It Works", to: "/how-it-works" },
  { icon: Users, label: "About Us", to: "/about" },
  { icon: Settings, label: "Settings", to: "/settings" },
];

export default function AppSidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="hidden md:flex w-20 lg:w-64 flex-col bg-sidebar min-h-screen">
      <div className="flex items-center gap-3 px-5 py-6">
        <Shield className="h-8 w-8 text-sidebar-foreground" />
        <span className="hidden lg:block font-display text-xl font-bold text-sidebar-foreground">
          TruthLens
        </span>
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-3 mt-4">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className={cn(
              "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
              pathname === item.to
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <span className="hidden lg:block">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="px-3 pb-6">
        <Link to="/settings" className="flex items-center gap-3 w-full px-3 py-3 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-semibold text-sm transition hover:opacity-90">
          <Crown className="h-5 w-5 shrink-0" />
          <span className="hidden lg:block">Upgrade to Pro</span>
        </Link>
      </div>
    </aside>
  );
}
