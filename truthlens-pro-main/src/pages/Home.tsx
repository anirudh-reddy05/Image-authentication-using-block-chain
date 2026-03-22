import PageLayout from "@/components/PageLayout";
import StatsCards from "@/components/StatsCards";
import RecentAnalyses from "@/components/RecentAnalyses";
import { Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <PageLayout>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Hero */}
        <section className="bg-card rounded-xl shadow-card p-8 flex flex-col items-center text-center gap-4 animate-fade-in">
          <Shield className="h-16 w-16 text-primary" />
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground">Welcome to TruthLens</h1>
          <p className="text-muted-foreground max-w-xl">The world's first Truth-as-a-Service platform. Verify any image's authenticity using SHA-256 hashing, AI forensics, and blockchain-backed smart certificates.</p>
          <div className="flex gap-4 mt-2">
            <Link to="/upload" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition">
              Upload &amp; Verify <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/how-it-works" className="inline-flex items-center gap-2 border border-border text-foreground px-6 py-3 rounded-lg font-semibold text-sm hover:bg-muted transition">
              How It Works
            </Link>
          </div>
        </section>

        <StatsCards />

        <div className="grid lg:grid-cols-2 gap-6">
          <RecentAnalyses />
          <div className="bg-card rounded-xl shadow-card p-6 space-y-4">
            <h3 className="font-display font-semibold text-foreground">Quick Links</h3>
            <div className="space-y-3">
              <Link to="/upload" className="block p-4 rounded-lg border border-border hover:bg-muted/50 transition">
                <p className="font-semibold text-sm text-foreground">🔬 Analyze an Image</p>
                <p className="text-xs text-muted-foreground mt-1">Upload and get a Truth Score with forensic certificate</p>
              </Link>
              <Link to="/certificates" className="block p-4 rounded-lg border border-border hover:bg-muted/50 transition">
                <p className="font-semibold text-sm text-foreground">📜 View Certificates</p>
                <p className="text-xs text-muted-foreground mt-1">Browse your smart contract certificates</p>
              </Link>
              <Link to="/reports" className="block p-4 rounded-lg border border-border hover:bg-muted/50 transition">
                <p className="font-semibold text-sm text-foreground">📊 Reports</p>
                <p className="text-xs text-muted-foreground mt-1">View all past analysis reports in detail</p>
              </Link>
              <Link to="/how-it-works" className="block p-4 rounded-lg border border-border hover:bg-muted/50 transition">
                <p className="font-semibold text-sm text-foreground">📖 Technical Documentation</p>
                <p className="text-xs text-muted-foreground mt-1">Deep dive into how TruthLens works</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
