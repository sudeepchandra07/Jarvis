// src/components/RealAgentPanel.jsx
import { useState } from "react";
import { Play, Loader2, Bot, ImageIcon, CheckCircle2, XCircle } from "lucide-react";

export default function RealAgentPanel() {
  const [url, setUrl] = useState("https://example.com");
  const [goal, setGoal] = useState("Click the More information link");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  const runAgent = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setActiveStep(0);
    try {
      const res = await fetch("https://jarvis-backend-2wtp.onrender.com/agent-run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, goal }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Agent run failed (${res.status})`);
      }
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError(e.message || "Could not reach backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-3 gap-3 min-h-0">
      <div className="bg-panel border border-border rounded-lg px-5 py-4">
        <div className="flex items-center gap-2 mb-3">
          <Bot size={18} className="text-accent" />
          <h2 className="font-medium">Real Autonomous Agent</h2>
          <span className="text-xs text-muted ml-2">Real Playwright + Groq LLM — genuinely decides each action</span>
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 bg-base border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <input
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="What should the agent do?"
            className="flex-1 bg-base border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <button
            onClick={runAgent}
            disabled={loading}
            className="flex items-center gap-1.5 bg-accent hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded transition-colors whitespace-nowrap"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Play size={15} />}
            {loading ? "Agent is working..." : "Run Real Agent"}
          </button>
        </div>
        {loading && (
          <p className="text-xs text-muted mt-2">This takes 20-60s — real browser + real LLM calls, step by step.</p>
        )}
        {error && <p className="text-blocker text-sm mt-2">{error}</p>}
      </div>

      {result && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 min-h-0">
          <div className="bg-panel border border-border rounded-lg flex flex-col overflow-hidden">
            <div className="px-3 py-2 border-b border-border bg-base text-xs font-mono text-muted flex items-center gap-2">
              <ImageIcon size={13} /> Step {activeStep + 1} of {result.screenshots.length}
            </div>
            <div className="flex-1 overflow-auto p-2">
              <img
                src={result.screenshots[activeStep] || result.finalScreenshot}
                alt={`Step ${activeStep + 1}`}
                className="w-full rounded border border-border"
              />
            </div>
            <div className="flex gap-1 px-3 py-2 border-t border-border overflow-x-auto">
              {result.screenshots.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveStep(i)}
                  className={`text-xs font-mono px-2 py-1 rounded shrink-0 ${
                    i === activeStep ? "bg-accent text-white" : "bg-base border border-border text-muted"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-panel border border-border rounded-lg flex flex-col overflow-hidden">
            <div className="px-3 py-2 border-b border-border bg-base text-xs font-medium text-muted">
              Agent Decision Log (real, from the LLM)
            </div>
            <div className="flex-1 overflow-auto p-3 space-y-2">
              {result.history.map((h, i) => (
                <button
                  key={i}
                  onClick={() => setActiveStep(Math.min(i, result.screenshots.length - 1))}
                  className={`w-full text-left border rounded-lg px-3 py-2 text-sm transition-colors ${
                    i === activeStep ? "border-accent bg-accent/10" : "border-border bg-base hover:border-muted"
                  }`}
                >
                  <div className="flex items-center gap-2 font-medium">
                    {h.error ? <XCircle size={13} className="text-blocker" /> : <CheckCircle2 size={13} className="text-success" />}
                    <span className="font-mono uppercase text-xs">{h.action}</span>
                    {h.index != null && <span className="text-muted font-mono text-xs">[{h.index}]</span>}
                  </div>
                  {h.text && <p className="text-ink/70 text-xs mt-1 font-mono">"{h.text}"</p>}
                  <p className="text-muted text-xs mt-1 italic">{h.reasoning}</p>
                  {h.error && <p className="text-blocker text-xs mt-1">{h.error}</p>}
                </button>
              ))}
              <div className="text-xs text-muted pt-2 border-t border-border mt-2">
                Final URL: <span className="font-mono text-ink/70">{result.finalUrl}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {!result && !loading && !error && (
        <div className="flex-1 flex items-center justify-center text-muted text-sm text-center px-6">
          Enter any real URL and a goal — a real LLM will look at the real page and decide each action itself.
        </div>
      )}
    </div>
  );
}