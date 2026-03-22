import PageLayout from "@/components/PageLayout";
import { Shield, Upload, Cpu, Award, Lock, Zap, Building2 } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Step 1: Secure Upload & Hashing",
    description: "When you upload an image, TruthLens immediately generates a unique SHA-256 digital fingerprint. This 'hash' is compared against our global registry of verified media on the Sepolia blockchain.",
  },
  {
    icon: Cpu,
    title: "Step 2: Multi-Layer AI Analysis",
    description: "Our proprietary AI engine performs Error Level Analysis (ELA) and texture consistency checks to identify pixel-level tampering, GAN artifacts, or metadata inconsistencies that are invisible to the naked eye.",
  },
  {
    icon: Award,
    title: "Step 3: The Truth Certificate",
    description: "Within seconds, you receive a comprehensive Truth Report. Authentic images are awarded a permanent, timestamped 'Verified' badge on the blockchain, creating an unalterable paper trail for the digital age.",
  },
];

const values = [
  { icon: Lock, title: "Tamper-Proof Records", description: "Every verification is etched into the blockchain, making it impossible to forge or alter later." },
  { icon: Zap, title: "Real-Time Forensics", description: "Get high-speed results powered by edge-computing AI models." },
  { icon: Building2, title: "Enterprise Grade", description: "Designed for newsrooms, legal teams, and high-security document verification." },
];

const team = [
  { name: "Mohammed Abrar Waseem", id: "2411CS070050", role: "Team Lead" },
  { name: "Narwade Himavarsha", id: "79", role: "Project Manager" },
  { name: "Chamanthula Sreekar", id: "84", role: "Lead Developer" },
  { name: "Konda Venkat Mahesh Reddy", id: "93", role: "QA Engineer" },
];

export default function About() {
  return (
    <PageLayout>
      <section className="relative overflow-hidden px-6 lg:px-16 py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/30">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <Shield className="h-14 w-14 text-primary mx-auto" />
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground">Redefining Digital Trust</h1>
          <p className="text-lg font-semibold text-primary">TruthLens is the world's first "Truth-as-a-Service" platform.</p>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            In an era where AI can generate flawless deepfakes and manipulated media, seeing is no longer believing. TruthLens was founded to bridge the gap between digital content and human trust. By combining advanced AI forensics with the immutable power of the Ethereum blockchain, we provide a definitive 'Proof of Authenticity' for every image.
          </p>
        </div>
      </section>

      <section className="px-6 lg:px-16 py-16">
        <h2 className="font-display text-3xl font-bold text-foreground text-center mb-12">Forensic Verification in Seconds</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <div key={i} className="bg-card rounded-xl shadow-card p-6 space-y-4 border border-border hover:shadow-elevated transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <step.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 lg:px-16 py-16 bg-secondary/30">
        <h2 className="font-display text-3xl font-bold text-foreground text-center mb-12">Why TruthLens?</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {values.map((v, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-10 w-10 shrink-0 rounded-lg bg-primary flex items-center justify-center">
                <v.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground">{v.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{v.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 lg:px-16 py-16">
        <h2 className="font-display text-3xl font-bold text-foreground text-center mb-12">Our Team</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {team.map((member) => (
            <div key={member.id} className="bg-card rounded-xl shadow-card p-6 text-center border border-border hover:shadow-elevated transition-shadow">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="font-display font-bold text-xl text-primary">
                  {member.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </span>
              </div>
              <h3 className="font-display font-semibold text-foreground text-sm">{member.name}</h3>
              <p className="text-xs text-primary font-medium mt-1">{member.role}</p>
              <p className="text-xs text-muted-foreground mt-1">ID: {member.id}</p>
            </div>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
