// src/components/LiveScanPanel.jsx
import { useState } from "react";
import { Play, Loader2, ShieldAlert, ImageIcon, ExternalLink } from "lucide-react";

const IMPACT_STYLE = {
  critical: "bg-blocker/15 text-blocker border-blocker/30",
  serious: "bg-blocker/15 text-blocker border-blocker/30",
  moderate: "bg-friction/15 text-friction border-friction/30",
  minor: "bg-accent/15 text-accent border-accent/30",
};

export default function LiveScanPanel() {
  const [url, setUrl] = useState("https://www.wikipedia.org");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const runScan = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("http://localhost:8000/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Scan failed (${res.status})`);
      }
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError(e.message || "Could not reach backend. Is uvicorn running on port 8000?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-3 gap-3 min-h-0">
      <div className="bg-panel border border-border rounded-lg px-5 py-4">
        <div className="flex items-center gap-2 mb-3">
          <ShieldAlert size={18} className="text-accent" />
          <h2 className="font-medium">Live Accessibility Scan</h2>
          <span className="text-xs text-muted ml-2">Real Playwright + axe-core — no simulation, no fixed script</span>
        </div>
        <div className="flex gap-2">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 bg-base border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <button
            onClick={runScan}
            disabled={loading}
            className="flex items-center gap-1.5 bg-accent hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded transition-colors"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Play size={15} />}
            {loading ? "Scanning live site..." : "Run Real Scan"}
          </button>
        </div>
        {error && (
          <p className="text-blocker text-sm mt-2">{error}</p>
        )}
      </div>

      {result && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 min-h-0">
          <div className="bg-panel border border-border rounded-lg flex flex-col overflow-hidden">
            <div className="px-3 py-2 border-b border-border bg-base text-xs font-mono text-muted flex items-center gap-2">
              <ImageIcon size={13} /> {result.title || result.url}
              <a href={result.url} target="_blank" rel="noreferrer" className="ml-auto text-accent hover:underline flex items-center gap-1">
                <ExternalLink size={12} /> open
              </a>
            </div>
            <div className="flex-1 overflow-auto p-2">
              <img src={result.screenshot} alt="Live screenshot" className="w-full rounded border border-border" />
            </div>
            <div className="px-3 py-2 border-t border-border text-xs text-muted font-mono">
              Scanned in {result.scanTimeMs}ms · {result.violations.length} violation(s) found
            </div>
          </div>

          <div className="bg-panel border border-border rounded-lg flex flex-col overflow-hidden">
            <div className="px-3 py-2 border-b border-border bg-base text-xs font-medium text-muted">
              WCAG Violations (real, from axe-core)
            </div>
            <div className="flex-1 overflow-auto p-3 space-y-2">
              {result.violations.length === 0 && (
                <p className="text-muted text-sm py-4 text-center">No violations detected by axe-core on this page.</p>
              )}
              {result.violations.map((v, i) => (
                <div key={i} className={`border rounded-lg px-3 py-2.5 text-sm ${IMPACT_STYLE[v.impact] || IMPACT_STYLE.minor}`}>
                  <div className="flex items-center gap-2 font-medium">
                    {v.title}
                    <span className="ml-auto text-xs font-mono opacity-70">{v.impact}</span>
                  </div>
                  <p className="text-ink/80 mt-1 text-xs leading-relaxed">{v.description}</p>
                  <p className="font-mono text-xs opacity-60 mt-1.5">selector: {v.selector}</p>
                  <p className="font-mono text-xs opacity-60">{v.wcag}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!result && !loading && !error && (
        <div className="flex-1 flex items-center justify-center text-muted text-sm">
          Enter any real URL above and click "Run Real Scan" — this genuinely loads the page and runs axe-core against it.
        </div>
      )}
    </div>
  );
}