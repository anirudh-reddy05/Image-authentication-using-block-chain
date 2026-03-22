import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Upload, FileText, Settings, Shield, FileCheck, BookOpen, Users, Menu, X, UserCog } from "lucide-react";
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

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="md:hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6" />
          <span className="font-display text-lg font-bold">TruthLens</span>
        </div>
        <button onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <nav className="bg-primary/95 backdrop-blur px-4 py-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                pathname === item.to
                  ? "bg-white/20 text-primary-foreground"
                  : "text-primary-foreground/70 hover:bg-white/10 hover:text-primary-foreground"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
