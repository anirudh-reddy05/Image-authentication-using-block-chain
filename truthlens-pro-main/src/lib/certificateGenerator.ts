interface CertData {
  id: string;
  file_name: string;
  hash: string;
  truth_score: number;
  verdict: string;
  certificate_data: any;
  blockchain_tx: string | null;
  created_at: string;
}

export function generateCertificatePDF(cert: CertData) {
  const verdictColor = cert.verdict === "authentic" ? "#22c55e" : cert.verdict === "suspicious" ? "#f59e0b" : "#ef4444";
  
  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>TruthLens Certificate - ${cert.id}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', system-ui, sans-serif; background: #f8f7ff; padding: 40px; }
  .cert { max-width: 800px; margin: 0 auto; background: white; border: 3px solid #7c3aed; border-radius: 16px; overflow: hidden; }
  .header { background: linear-gradient(135deg, #7c3aed, #a855f7); color: white; padding: 40px; text-align: center; }
  .header h1 { font-size: 28px; margin-bottom: 8px; }
  .header p { opacity: 0.9; font-size: 14px; }
  .badge { display: inline-block; background: ${verdictColor}; color: white; padding: 8px 24px; border-radius: 100px; font-weight: bold; font-size: 18px; margin-top: 16px; text-transform: uppercase; }
  .body { padding: 40px; }
  .score-section { text-align: center; margin-bottom: 32px; }
  .score { font-size: 72px; font-weight: bold; color: ${verdictColor}; }
  .score-label { color: #6b7280; font-size: 14px; }
  .details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 32px; }
  .detail-box { background: #f8f7ff; border: 1px solid #e5e3ff; border-radius: 12px; padding: 16px; }
  .detail-box label { display: block; font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
  .detail-box p { font-size: 13px; color: #1f2937; word-break: break-all; font-family: 'Courier New', monospace; }
  .full-width { grid-column: 1 / -1; }
  .flags { margin-bottom: 32px; }
  .flags h3 { font-size: 16px; color: #1f2937; margin-bottom: 12px; }
  .flag { display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: #fef3c7; border-radius: 8px; margin-bottom: 8px; font-size: 13px; }
  .flag.high { background: #fee2e2; }
  .flag.low { background: #f0fdf4; }
  .footer { text-align: center; padding: 24px 40px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; }
  .footer p { margin-bottom: 4px; }
  @media print { body { padding: 0; background: white; } .cert { border: none; } }
</style>
</head>
<body>
<div class="cert">
  <div class="header">
    <h1>🛡️ TruthLens Smart Certificate</h1>
    <p>Blockchain-Backed Image Authenticity Verification</p>
    <div class="badge">${cert.verdict}</div>
  </div>
  <div class="body">
    <div class="score-section">
      <div class="score">${cert.truth_score}</div>
      <div class="score-label">Truth Score (out of 100)</div>
    </div>
    <div class="details">
      <div class="detail-box">
        <label>Certificate ID</label>
        <p>${cert.id}</p>
      </div>
      <div class="detail-box">
        <label>Issued At</label>
        <p>${new Date(cert.created_at).toLocaleString()}</p>
      </div>
      <div class="detail-box full-width">
        <label>SHA-256 Image Hash</label>
        <p>${cert.hash}</p>
      </div>
      ${cert.blockchain_tx ? `<div class="detail-box full-width">
        <label>Blockchain Transaction (Sepolia)</label>
        <p>${cert.blockchain_tx}</p>
      </div>` : ''}
    </div>
    ${cert.certificate_data?.metadataFlags?.length ? `
    <div class="flags">
      <h3>Forensic Findings</h3>
      ${cert.certificate_data.metadataFlags.map((f: any) => `<div class="flag ${f.severity}"><strong>[${f.severity.toUpperCase()}]</strong> ${f.label}: ${f.detail}</div>`).join('')}
    </div>` : ''}
  </div>
  <div class="footer">
    <p><strong>TruthLens</strong> — Truth-as-a-Service Platform</p>
    <p>This certificate serves as a digital birth certificate for the verified image.</p>
    <p>Powered by SHA-256 Cryptographic Hashing • AI Forensic Analysis • Ethereum Blockchain</p>
  </div>
</div>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `TruthLens-Certificate-${cert.id.substring(0, 8)}.html`;
  a.click();
  URL.revokeObjectURL(url);
}
