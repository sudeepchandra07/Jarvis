// src/components/ControlBar.jsx
import { Play, RotateCcw, Bot, ArrowLeft, Info, Loader2 } from "lucide-react";

export default function ControlBar({
  status, urlInput, goalInput, onUrlChange, onGoalChange,
  onRun, onReset, onHome, result, activeStep,
}) {
  const busy = status === "running";
  const stepCount = result?.history?.length || 0;

  return (
    <header className="border-b border-border bg-panel px-5 py-4">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onHome} className="flex items-center gap-1 text-muted hover:text-ink text-sm transition-colors">
          <ArrowLeft size={16} />
        </button>
        <Bot size={24} className={`text-accent ${busy ? "animate-pulse" : ""}`} />
        <h1 className="text-lg font-semibold tracking-tight">JARVIS</h1>
        <span className="text-sm text-muted ml-1 hidden md:inline">
          Real Autonomous Agent — Playwright + Groq LLM
        </span>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-muted">Target URL (any real website)</label>
          <input
            value={urlInput}
            onChange={(e) => onUrlChange(e.target.value)}
            disabled={busy}
            placeholder="https://example.com"
            className="bg-base border border-border rounded px-2.5 py-2 text-sm w-72 focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-60"
          />
        </div>
        <div className="flex flex-col gap-1 flex-1 min-w-[260px]">
          <label className="text-sm text-muted">Real Task / Goal</label>
          <input
            value={goalInput}
            onChange={(e) => onGoalChange(e.target.value)}
            disabled={busy}
            placeholder="e.g. Click the More information link"
            className="bg-base border border-border rounded px-2.5 py-2 text-sm w-full focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-60"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={onRun}
            disabled={busy}
            className="flex items-center gap-1.5 bg-accent hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-medium px-3.5 py-2 rounded transition-colors"
          >
            {busy ? <Loader2 size={15} className="animate-spin" /> : <Play size={15} />}
            {busy ? "Agent working..." : "Run Autonomous Audit"}
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 bg-panel border border-border hover:border-muted text-sm px-3.5 py-2 rounded transition-colors"
          >
            <RotateCcw size={15} /> Reset
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-border text-sm">
        <div><span className="text-muted">Status: </span><span className="font-mono font-medium text-accent">{status.toUpperCase()}</span></div>
        <div><span className="text-muted">Steps Taken: </span><span className="font-mono">{stepCount}</span></div>
        <div><span className="text-muted">Current Step: </span><span className="font-mono">{result ? activeStep + 1 : "—"}</span></div>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-muted">
          <Info size={13} /> Real agent — genuinely browses, decides, and scans the site you enter
        </div>
      </div>
    </header>
  );
}