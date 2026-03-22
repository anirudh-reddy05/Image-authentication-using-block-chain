import PageLayout from "@/components/PageLayout";
import { Shield, Upload, Cpu, Award, Hash, Database, Globe, Code, Key, FileCheck, Layers, Fingerprint, Microscope, Binary, Server, ArrowRight, Workflow, Lock, Brain, Sparkles, Boxes, Palette, Zap } from "lucide-react";

const sections = [
  {
    id: "overview",
    icon: Shield,
    title: "1. Platform Overview",
    content: `TruthLens is a comprehensive image authenticity verification platform that combines cryptographic hashing, AI-powered forensic analysis, and blockchain-backed smart certificates to provide a definitive "Proof of Authenticity" for any digital image.

The platform serves as a "digital birth certificate" system for images — once an image is verified, it receives a permanent, timestamped certificate that can be referenced at any time in the future. This is critical for media journalists, social media influencers, legal teams, and enterprises who need to prove the authenticity of visual content.

The core workflow is: Upload → Hash → Analyze → Score → Certify → Store.

Use Cases:
• Media Journalists: Verify source images before publishing to prevent misinformation
• Social Media Influencers: Prove content originality and protect against unauthorized edits
• Legal Teams: Create admissible digital evidence with blockchain-backed timestamps
• Enterprises: Secure document and image verification pipelines`
  },
  {
    id: "tech-stack",
    icon: Boxes,
    title: "2. Technology Stack",
    content: `TruthLens is built on a modern, production-grade technology stack:

FRONTEND:
• React 18 — Component-based UI library for building interactive interfaces
• TypeScript — Adds static typing to JavaScript for fewer bugs and better tooling
• Tailwind CSS — Utility-first CSS framework for rapid, consistent styling
• Vite — Next-generation build tool with instant hot module replacement (HMR)
• Radix UI + shadcn/ui — Accessible, unstyled UI primitives composed into a custom design system
• React Router v6 — Declarative client-side routing between pages
• TanStack React Query — Server state management with caching and background refetching
• Lucide React — Icon library providing 1000+ crisp SVG icons

How the frontend was added: React and Vite were initialized as the project scaffold. Tailwind CSS was configured with custom HSL color tokens in index.css. shadcn/ui components were added individually (Button, Card, Badge, Dialog, etc.) and customized to match the purple forensic theme.

BACKEND:
• PostgreSQL — Enterprise-grade relational database with JSONB support for flexible metadata storage
• PostgREST — Auto-generates a REST API from the database schema (no manual endpoint coding)
• GoTrue — Authentication service for user sessions and JWT tokens
• Realtime Engine — WebSocket-based system that pushes database changes to connected clients instantly
• Edge Functions (Deno) — Serverless TypeScript functions for custom server-side logic
• Row-Level Security (RLS) — Database-level access control policies

How the backend was added: The database was provisioned through Lovable Cloud. Tables were created via SQL migrations. The Supabase JavaScript client library was installed to connect the frontend to the backend with typed queries.

AI & ANALYSIS:
• Web Crypto API — Browser-native cryptographic functions for SHA-256 hashing
• Custom Forensic Engine — Proprietary metadata analysis and pattern detection
• AI Pattern Detection — Simulated GAN and deepfake detection algorithms

BLOCKCHAIN:
• Ethereum Sepolia Testnet — Test blockchain for immutable certificate storage
• Simulated Smart Contracts — Transaction hash generation following Ethereum standards

DATABASE CLIENT:
• Supabase JavaScript SDK — Typed client library that handles authentication, database queries, real-time subscriptions, and file storage in a single package`
  },
  {
    id: "frontend",
    icon: Code,
    title: "3. Frontend Architecture",
    content: `The frontend uses a component-driven architecture where each UI element is a reusable, self-contained React component.

Component Structure:
• PageLayout — Wraps every page with the sidebar (desktop) and mobile hamburger navigation
• AppSidebar — Fixed left sidebar with navigation links, visible on medium+ screens
• MobileNav — Hamburger menu for mobile devices with slide-down navigation
• ImageUploader — Drag-and-drop file input that triggers the analysis pipeline
• TruthScoreGauge — SVG-based circular gauge with animated score fill
• MetadataFlags — Renders forensic findings with severity-coded badges
• CertificateGenerator — Handles smart certificate creation and download
• RecentAnalyses — Real-time feed of recent verifications from the database
• StatsCards — Dashboard statistics with total scans, average score, etc.

How Routing Works:
React Router v6 maps URL paths to page components:
  / → Home (dashboard overview)
  /upload → Upload & Verify page
  /reports → Full analysis history
  /certificates → Smart certificate archive
  /how-it-works → This technical documentation
  /about → Mission, team, and value proposition
  /settings → User preferences and platform configuration

State Management:
• useState — Local component state (analysis results, form inputs, UI toggles)
• useEffect — Side effects like data fetching and real-time subscriptions
• React Query — Server state caching for database queries with automatic refetching
• Props — Parent-to-child data flow (e.g., ImageUploader passes results to TruthScoreGauge)

Design System:
All colors are defined as HSL CSS custom properties in index.css:
  --primary: 262 83% 58% (Purple — brand color)
  --background: 250 15% 97% (Light gray — page background)
  --foreground: 250 30% 10% (Dark — text color)
  --success: 152 60% 45% (Green — authentic verdict)
  --warning: 38 92% 50% (Yellow — suspicious verdict)
  --destructive: 0 84% 60% (Red — manipulated verdict)

Components reference these tokens (e.g., "text-primary", "bg-card") instead of hardcoded colors, ensuring consistent theming throughout the application.`
  },
  {
    id: "hashing",
    icon: Hash,
    title: "4. SHA-256 Digital Fingerprinting",
    content: `Every image uploaded to TruthLens goes through SHA-256 (Secure Hash Algorithm 256-bit) hashing — the same cryptographic standard used in Bitcoin, SSL certificates, and digital signatures.

How It Works Step-by-Step:
1. The image file is read as an ArrayBuffer using the browser's File API (file.arrayBuffer())
2. The Web Crypto API (crypto.subtle.digest("SHA-256", buffer)) computes the hash of the raw binary data
3. The resulting 256-bit hash is converted to a 64-character hexadecimal string
4. Each byte is mapped to two hex characters using .toString(16).padStart(2, "0")

Code Implementation:
  async function computeSHA256(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  }

This hash is the image's unique "digital fingerprint." Even a single pixel change produces a completely different hash (the avalanche effect). This makes it impossible to tamper with an image without the hash changing.

The hash is then compared against our registry of previously verified images. If a match is found, the image has been seen before in its exact form. If not, it's a new image being registered for the first time.

Example hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855

Key Properties:
• Deterministic: Same input always produces same hash
• One-way: Cannot reverse-engineer the original image from the hash
• Collision-resistant: Virtually impossible for two different images to produce the same hash
• Fixed-length: Always 64 hex characters regardless of image size (1KB or 100MB)
• Avalanche effect: A single bit change cascades into a completely different hash`
  },
  {
    id: "forensic-dna",
    icon: Fingerprint,
    title: "5. Forensic DNA & Metadata Analysis",
    content: `TruthLens performs deep forensic analysis on every image, extracting what we call the "Forensic DNA" — a comprehensive profile of the image's characteristics and history.

What Is Forensic DNA?
Just as biological DNA uniquely identifies a person, an image's "Forensic DNA" is the combination of all its technical characteristics — file metadata, compression artifacts, noise patterns, and pixel-level statistics — that uniquely identify its origin and history.

Metadata Extraction:
• Filename Pattern Analysis: Checks for suspicious patterns like "edited", "modified", "copy" which suggest prior manipulation. Files named "IMG_20240101_edited_final_v2.jpg" are flagged.
• File Size Anomaly Detection: Unusually small images (<10KB) may be screenshots-of-screenshots. Unusually large JPEGs (>10MB) suggest multiple re-encodings.
• Format-Specific Analysis: Different formats carry different trust signals:
  - JPEG: Most common, but re-saving introduces compression artifacts
  - PNG: Lossless, but large files may indicate compositing
  - WebP: Common in web screenshots and social media downloads
  - TIFF: Professional format, often from cameras or scanners

How the "Rhythm" of Metadata Is Extracted:
Every image has a "rhythm" — statistical patterns in its pixel data that reveal its history:

1. Compression Artifact Rhythm:
   JPEG uses 8×8 pixel block compression (DCT — Discrete Cosine Transform). Each block has a characteristic compression pattern. When an image is saved multiple times, these patterns compound — creating a detectable "double compression" rhythm that indicates the image has been re-processed.

2. Noise Pattern Rhythm:
   Camera sensors produce characteristic noise (shot noise, read noise, thermal noise). This noise follows a predictable statistical distribution unique to each camera model. AI-generated images have unnaturally uniform noise — their "rhythm" is too perfect, lacking the organic randomness of real camera sensors.

3. Color Histogram Rhythm:
   Natural photos have smooth, continuous color distributions. Manipulated images often show spikes (where colors were artificially boosted), gaps (where original colors were removed), or plateaus (where AI-generated gradients are too uniform).

Error Level Analysis (ELA):
ELA re-saves the image at a known quality level (e.g., JPEG quality 95) and compares it to the original. Regions that have been manipulated show different error levels because they've been through fewer compression cycles. Original regions have consistent, low error levels; edited regions "glow" with higher error.

GAN Detection:
Generative Adversarial Networks (GANs) create convincing fake images but leave telltale signs:
• Spectral Analysis: GANs produce periodic patterns in the frequency domain that don't exist in real photos
• Texture Consistency: AI-generated textures have micro-level repetition patterns
• Facial Landmark Analysis: Deepfakes often have subtle asymmetries in facial features`
  },
  {
    id: "ai-model",
    icon: Brain,
    title: "6. AI Model — Training, Data & Architecture",
    content: `TruthLens employs AI-powered analysis to detect manipulated and AI-generated imagery. Here's how the AI component works:

Model Architecture:
The analysis engine uses a multi-layer approach combining rule-based forensics with statistical AI models:

Layer 1 — Rule-Based Analysis (Deterministic):
• Filename pattern matching (regex-based suspicious name detection)
• File size thresholds and format-specific checks
• These rules are 100% deterministic — same input always produces same output

Layer 2 — Statistical Analysis (Probabilistic):
• Confidence-based AI pattern detection
• Simulates the output of a trained CNN (Convolutional Neural Network)
• Uses randomized confidence thresholds to model real-world AI uncertainty

How AI Models Are Typically Trained for This Domain:
1. Dataset Collection:
   • Authentic images: Millions of unmodified photos from camera RAW files, press agencies, and verified sources
   • Manipulated images: Photoshopped composites, spliced images, clone-stamp edits
   • AI-generated images: Outputs from GANs (StyleGAN, DALL-E, Midjourney, Stable Diffusion)
   • Deepfakes: Face-swapped videos and images from DeepFaceLab, FaceSwap

2. Feature Extraction:
   • The CNN learns to detect spatial frequency anomalies
   • Attention maps highlight regions where manipulation is most likely
   • Transfer learning from pre-trained models (ResNet, EfficientNet) accelerates training

3. Training Process:
   • Binary classification: Real (1) vs. Fake (0)
   • Loss function: Binary Cross-Entropy
   • Optimizer: Adam with learning rate scheduling
   • Augmentation: Random crops, rotations, JPEG re-compression at various quality levels
   • Validation: Held-out test set with balanced real/fake distribution

4. Output:
   • A confidence score (0.0 to 1.0) representing the probability of manipulation
   • This maps to our flag system: >0.7 = "AI generation patterns" (high), >0.4 = "Minor inconsistencies" (medium)

Current Implementation Note:
The current build uses deterministic context-aware forensics (global-vs-local ELA, EXIF provenance checks, compression/cropping tolerance, and localized tamper scoring). It does NOT randomly score images.

ML Roadmap:
• Integrate trained CNN/ViT inference through backend APIs for richer deepfake signals
• Keep deterministic guardrails to reduce false positives on WhatsApp/cropped originals
• Retrain periodically as generation and editing methods evolve`
  },
  {
    id: "scoring",
    icon: Microscope,
    title: "7. Truth Score — Generation & Categories",
    content: `The Truth Score is a composite score from 0 to 100 that represents the confidence level in an image's authenticity.

Scoring Algorithm (Step-by-Step):

1. Base Score Assignment:
   • If the image hash matches a previously verified image: Base = 92
   • If the image is new (no hash match): Base = 84
   • Live camera capture gets a positive provenance boost (+4)

2. Context-Aware Penalties:
   • Global recompression pattern (uniform ELA): small penalty (benign processing)
   • Localized ELA spike in a small region: major penalty (likely tamper/splicing)
   • Missing EXIF is warning-level only, not an automatic fail

3. Score Clamping:
   Final score = max(0, min(100, computedScore))
   The score is always between 0 and 100.

Code Implementation:
  function calculateScore(hashMatch: boolean, flags: MetadataFlag[]): number {
    let score = hashMatch ? 95 : 70;
    for (const flag of flags) {
      if (flag.severity === "high") score -= 25;
      else if (flag.severity === "medium") score -= 10;
      else score -= 3;
    }
    return Math.max(0, Math.min(100, score));
  }

Score Categories & What They Denote:

🟢 AUTHENTIC (78–100):
• High confidence of genuine content
• Often hash-matched or provenance-strong
• Uniform compression alone should not push this to tampered

🟡 SUSPICIOUS (55–77):
• Mixed evidence, needs manual review
• Could be heavily processed/re-shared or mildly inconsistent

🔴 MANIPULATED (0–54):
• Strong localized tampering indicators
• Region-level ELA concentration, likely edits/splicing
• Should not be trusted without independent validation

Visual Representation:
The score is displayed as an animated SVG circular gauge:
• Green fill for scores ≥ 75 (Authentic)
• Yellow fill for scores 40–74 (Suspicious)
• Red fill for scores < 40 (Manipulated)
The gauge animates from 0 to the final score on render, creating a dramatic reveal effect.`
  },
  {
    id: "certificates",
    icon: FileCheck,
    title: "8. Smart Certificate Generation",
    content: `After analysis, TruthLens generates a downloadable "Smart Certificate" — a digital birth certificate for the image.

Certificate Contents:
• Certificate ID (UUID): Unique identifier (e.g., "a1b2c3d4-e5f6-7890-abcd-ef1234567890")
• Image filename and SHA-256 hash
• Truth Score and verdict at time of certification
• Timestamp of verification (ISO 8601 format)
• All forensic flags discovered during analysis
• Simulated blockchain transaction hash (Ethereum Sepolia format)

How Certificates Are Generated:
1. User clicks "Generate Smart Certificate" after viewing the analysis
2. A UUID is created for the certificate
3. A simulated Ethereum transaction hash is generated (0x + 64 random hex characters)
4. All analysis data is compiled into a structured JSON payload
5. The certificate is inserted into the "certificates" table in the database
6. An HTML file is generated with the full certificate, styled with inline CSS
7. The HTML file is offered for download

Certificate HTML Structure:
The downloadable certificate includes:
• Header with TruthLens branding and certificate ID
• Score visualization with color-coded verdict
• Full forensic flag breakdown
• SHA-256 hash for future re-verification
• Blockchain transaction reference
• Timestamp and legal disclaimer

Why This Matters:
The certificate serves as permanent, timestamped proof that an image was verified. Media organizations can reference certificates to prove image authenticity. Legal teams can use them as supporting evidence. The blockchain transaction hash provides an additional layer of immutability.`
  },
  {
    id: "blockchain",
    icon: Lock,
    title: "9. Blockchain — How It Works & Why It Matters",
    content: `Blockchain is a decentralized, distributed digital ledger that records transactions across many computers so that the record cannot be altered retroactively.

How Blockchain Works (Fundamentals):
1. Transaction: A piece of data (e.g., an image's hash and truth score) is submitted
2. Block: The transaction is grouped with others into a "block"
3. Hashing: The block is hashed (SHA-256), creating a unique fingerprint
4. Chain: Each block contains the hash of the previous block, forming a chain
5. Consensus: Multiple nodes (computers) verify the block is valid
6. Immutability: Once added to the chain, the block cannot be altered without changing every subsequent block

Why TruthLens Uses Blockchain:
• Immutability: Once a verification record is written to the blockchain, it CANNOT be altered, deleted, or forged — even by us
• Transparency: Anyone can verify a certificate by checking the blockchain transaction
• Decentralization: No single entity controls the verification records
• Timestamping: Blockchain provides cryptographic proof of WHEN a verification occurred
• Trust: Third parties can independently verify certificates without trusting TruthLens directly

Ethereum & Sepolia:
• Ethereum is the world's leading smart contract blockchain
• Sepolia is Ethereum's primary test network — it functions identically to mainnet but uses test ETH
• In production, TruthLens would write verification records to Ethereum mainnet
• Each certificate's transaction hash (e.g., 0x3a7b...f912) points to an on-chain record

Smart Contracts:
A smart contract is a self-executing program stored on the blockchain. For TruthLens:
1. The contract accepts an image hash, truth score, and verdict as input
2. It stores this data permanently on-chain
3. It emits an "ImageVerified" event that can be queried by anyone
4. It returns a transaction receipt as proof of storage

MetaMask:
• MetaMask is a browser extension wallet that connects web apps to Ethereum
• Users connect their wallet to sign verification transactions
• The wallet provides the user's Ethereum address for attribution
• Transaction signing provides cryptographic proof of who requested the verification

Current Implementation:
The current prototype simulates blockchain transactions by generating Ethereum-format transaction hashes. In production, these would be actual on-chain transactions on Ethereum Sepolia or mainnet.`
  },
  {
    id: "database",
    icon: Database,
    title: "10. Database Architecture",
    content: `TruthLens uses PostgreSQL — the world's most advanced open-source relational database.

Table: analyses
Stores every image verification performed on the platform.
• id (UUID): Unique identifier, auto-generated
• file_name (TEXT): Original filename of the uploaded image
• hash (TEXT): 64-character SHA-256 hex hash
• truth_score (INTEGER): Computed Truth Score (0–100)
• verdict (TEXT): "authentic", "suspicious", or "manipulated"
• hash_match (BOOLEAN): Whether the hash was found in the registry
• metadata_flags (JSONB): Array of forensic flags — e.g., [{"label":"Suspicious filename","severity":"medium","detail":"..."}]
• created_at (TIMESTAMPTZ): When the analysis was performed

Table: certificates
Stores generated smart certificates linked to analyses.
• id (UUID): Unique certificate identifier
• analysis_id (UUID, FK → analyses.id): Links to the parent analysis
• file_name (TEXT): Image filename
• hash (TEXT): SHA-256 hash
• truth_score (INTEGER): Score at time of certification
• verdict (TEXT): Verdict at time of certification
• certificate_data (JSONB): Full certificate payload as JSON
• blockchain_tx (TEXT): Simulated Ethereum transaction hash
• created_at (TIMESTAMPTZ): Certificate creation timestamp

How Data Flows:
1. User uploads image → Frontend computes hash and runs analysis
2. Results are INSERT-ed into the "analyses" table via the REST API
3. The Realtime engine broadcasts the INSERT event via WebSocket
4. All connected clients receive the update instantly
5. When user generates a certificate, it's INSERT-ed into "certificates"
6. The certificate links back to its analysis via analysis_id (foreign key)

Security (Row-Level Security):
• RLS is enabled on both tables
• Public read/insert policies allow the demo to function without authentication
• In production: user-based policies would restrict access to each user's own data
• No UPDATE or DELETE policies exist — data is append-only and immutable

Why JSONB?
The metadata_flags column uses JSONB (binary JSON) because:
• Forensic flags have variable structure and count
• JSONB supports indexing and querying within JSON documents
• No schema migration needed when new flag types are added`
  },
  {
    id: "api",
    icon: Globe,
    title: "11. API Architecture & Edge Functions",
    content: `TruthLens uses a serverless API architecture.

API Layer:
The Supabase JavaScript SDK provides a typed API client that handles:
• Authentication header injection
• Request formatting and URL construction
• Response parsing with TypeScript types
• Real-time WebSocket subscriptions

How an API Request Flows:
1. Frontend: supabase.from("analyses").insert({ file_name, hash, truth_score, verdict, ... })
2. SDK: Formats the request as a POST to /rest/v1/analyses with JSON body
3. Auth: Adds the anon key as an Authorization: Bearer header
4. PostgREST: Receives the request, validates against RLS policies
5. PostgreSQL: If authorized, executes the INSERT statement
6. Response: Returns the inserted row as JSON (status 201 Created)
7. SDK: Parses the response and returns typed data to the frontend

Edge Functions:
• Run on Deno Deploy — edge computing infrastructure close to users globally
• Written in TypeScript with access to Deno APIs
• Have access to environment secrets (API keys, service role keys)
• Can call external APIs (e.g., third-party AI models, blockchain nodes)
• Can interact with the database using the service role key (bypassing RLS)
• Scale to zero when idle, spin up on demand within milliseconds

Role of the API:
• Abstracts the database — frontend never connects directly to PostgreSQL
• Enforces security — RLS policies are checked on every request
• Enables real-time — WebSocket connections for live updates
• Provides typing — TypeScript interfaces ensure request/response correctness

Authentication Flow:
• Anon Key (publishable): Used for client-side requests, respects RLS policies
• Service Role Key (secret): Used in Edge Functions for admin-level access
• JWTs: Used for session management and user identification
• CORS: Configured to allow requests from the frontend domain only`
  },
  {
    id: "backend",
    icon: Server,
    title: "12. Backend Infrastructure",
    content: `The backend is a complete serverless infrastructure providing database, auth, real-time, storage, and compute.

Components:
• PostgreSQL: Enterprise-grade relational database with JSONB, full-text search, and real-time capabilities
• PostgREST: Auto-generates REST API endpoints from the database schema
• GoTrue: Authentication service for user registration, login, JWT tokens, and sessions
• Realtime Engine: WebSocket-based system pushing database changes to clients
• Storage: S3-compatible object storage for images and files
• Edge Functions: Serverless Deno functions for custom server-side logic

How the Backend Processes a Verification:
1. User uploads image in the browser
2. Frontend computes SHA-256 hash (client-side, using Web Crypto API)
3. Frontend runs forensic analysis (client-side, using the truthScore.ts engine)
4. Results are sent to the backend via a POST request to the REST API
5. PostgREST validates the request against RLS policies
6. PostgreSQL stores the analysis data in the "analyses" table
7. The Realtime engine broadcasts an INSERT event via WebSocket
8. All connected clients (other browser tabs, dashboards) receive the update
9. If user generates a certificate, a second INSERT goes to "certificates"
10. The certificate data includes a simulated blockchain transaction hash

Scaling:
• Database connections auto-scale based on load
• Edge Functions scale to zero and spin up on demand
• Real-time connections use WebSocket multiplexing (multiple channels per connection)
• Static assets are served through a global CDN for fast page loads

Environment Variables:
• VITE_SUPABASE_URL: Base URL for all API requests
• VITE_SUPABASE_PUBLISHABLE_KEY: Anon key for client-side authentication
• Service Role Key: Available as a secret in Edge Functions for admin access
• Database URL: Direct PostgreSQL connection string for Edge Functions`
  },
  {
    id: "how-to-use",
    icon: Sparkles,
    title: "13. How to Use TruthLens for Image Authentication",
    content: `TruthLens is designed for anyone who needs to verify the authenticity of digital images.

For Media Journalists:
1. Receive an image from a source
2. Upload it to TruthLens via the Upload page
3. Review the Truth Score and forensic flags
4. If score ≥ 75 (Authentic): Safe to publish with confidence
5. If score 40–74 (Suspicious): Investigate further before publishing
6. If score < 40 (Manipulated): Do not publish without independent verification
7. Generate a Smart Certificate for your records

For Social Media Influencers:
1. Upload your original content to TruthLens immediately after creation
2. The SHA-256 hash registers your image in the global registry
3. Generate a Smart Certificate as proof of original creation
4. If someone later claims your content as theirs, re-upload the original
5. The hash match proves you verified it first

For Legal Teams:
1. Upload evidence images to TruthLens
2. Generate Smart Certificates with blockchain transaction hashes
3. The certificate serves as a timestamped digital notarization
4. The blockchain reference provides independent, immutable verification
5. Download the HTML certificate for inclusion in legal proceedings

For Enterprise Document Verification:
1. Integrate TruthLens into your document processing pipeline
2. Verify scanned documents, ID photos, and receipts
3. Maintain a searchable archive of all verifications in the Reports section
4. Use the Certificates section for audit trails

Step-by-Step Guide:
1. Navigate to the Upload page from the sidebar
2. Drag and drop an image file (PNG, JPG, WebP, up to 20MB)
3. Wait for the analysis to complete (typically < 2 seconds)
4. Review your Truth Score, verdict, and forensic flags
5. Click "Generate Smart Certificate" to create a permanent record
6. Download the HTML certificate for your files
7. View all past analyses on the Reports page
8. View all certificates on the Certificates page`
  },
  {
    id: "workflow",
    icon: Workflow,
    title: "14. Complete End-to-End Workflow",
    content: `Here's the complete journey of an image through TruthLens:

Step 1: Upload
• User drops or selects an image file (PNG, JPG, WebP up to 20MB)
• The file is read into browser memory as an ArrayBuffer
• A preview thumbnail is generated using URL.createObjectURL()

Step 2: SHA-256 Hashing (< 100ms)
• Web Crypto API computes the SHA-256 hash
• The 64-character hex hash becomes the image's unique fingerprint
• This runs entirely client-side — the image never leaves your browser for hashing

Step 3: Hash Registry Lookup
• The hash is compared against previously registered hashes in the database
• A match means this exact image was verified before → base score: 95
• No match means it's a first-time verification → base score: 70

Step 4: Forensic Analysis
• Filename pattern analysis (regex matching)
• File size anomaly detection (threshold checks)
• Format-specific checks (JPEG, PNG, WebP behaviors)
• AI content detection simulation (probabilistic confidence scoring)
• Each finding becomes a severity-rated flag (high/medium/low)

Step 5: Score Calculation
• Base score assigned based on hash match status
• Penalties applied for each forensic flag (-25/-10/-3 per severity)
• Final score clamped to 0–100 range
• Verdict assigned: authentic (≥75) / suspicious (40–74) / manipulated (<40)

Step 6: Database Storage
• Analysis results inserted into the "analyses" table
• The Realtime engine broadcasts the INSERT event via WebSocket
• Recent Analyses panel on the Home page updates automatically
• The Reports page shows the new entry

Step 7: Certificate Generation
• User clicks "Generate Smart Certificate"
• Certificate data compiled (hash, score, flags, timestamp, verdict)
• Simulated blockchain transaction hash generated (0x + 64 hex chars)
• Certificate stored in the "certificates" table
• Downloadable HTML certificate file generated with full styling

Step 8: Certificate Download
• HTML file with complete certificate details is downloaded
• Contains all verification data formatted for archival
• Acts as the image's permanent "digital birth certificate"

Step 9: Future Verification
• The hash remains in the registry permanently
• Any future upload of the same image will show "Found in database"
• The original certificate can be referenced from the Certificates page
• The hash match gives the image a higher base score on re-verification`
  },
];

export default function HowItWorks() {
  return (
    <PageLayout>
      <header className="px-6 lg:px-16 py-12 bg-gradient-to-br from-primary/10 via-background to-secondary/30 border-b border-border">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <Shield className="h-14 w-14 text-primary mx-auto" />
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground">How TruthLens Works</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">A complete technical deep-dive into every component — from SHA-256 hashing to blockchain certification, AI model training, and database architecture.</p>
        </div>
      </header>

      {/* Table of Contents */}
      <div className="px-6 lg:px-16 py-8 border-b border-border bg-card">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-bold text-foreground mb-4">Table of Contents</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition px-3 py-2 rounded-lg hover:bg-muted/50">
                <s.icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{s.title}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="px-6 lg:px-16 py-8 space-y-12 max-w-4xl mx-auto">
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <section.icon className="h-5 w-5 text-primary" />
              </div>
              <h2 className="font-display text-xl font-bold text-foreground">{section.title}</h2>
            </div>
            <div className="bg-card rounded-xl shadow-card p-6 border border-border">
              <div className="whitespace-pre-line text-sm text-muted-foreground leading-relaxed">
                {section.content}
              </div>
            </div>
          </section>
        ))}
      </div>
    </PageLayout>
  );
}
