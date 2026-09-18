// src/components/ControlBar.jsx
import { Play, Pause, RotateCcw, Bot, ArrowLeft, Info } from "lucide-react";

const STATE_COLOR = {
  IDLE: "text-muted",
  OBSERVING: "text-accent",
  DECIDING: "text-accent",
  EXECUTING: "text-accent",
  EVALUATING: "text-accent",
};

export default function ControlBar({
  status, urlInput, goalInput, onUrlChange, onGoalChange,
  onRun, onPause, onReset, onHome, current, visibleEvents,
}) {
  const agentState = current?.state || "IDLE";
  const stepCount = visibleEvents.length;
  const activeBranch = current?.path || "—";
  const visitedStates = new Set(visibleEvents.map((e) => e.path)).size;
  const busy = status === "running" || status === "paused";

  return (
    <header className="border-b border-border bg-panel px-5 py-4">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onHome} className="flex items-center gap-1 text-muted hover:text-ink text-sm transition-colors">
          <ArrowLeft size={16} />
        </button>
        <Bot size={24} className={`text-accent ${status === "running" ? "animate-pulse" : ""}`} />
        <h1 className="text-lg font-semibold tracking-tight">JARVIS</h1>
        <span className="text-sm text-muted ml-1 hidden md:inline">
          Autonomous Black-Box UI/UX &amp; Accessibility Testing
        </span>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-muted">Target URL</label>
          <input
            value={urlInput}
            onChange={(e) => onUrlChange(e.target.value)}
            disabled={busy}
            placeholder="https://example.com"
            className="bg-base border border-border rounded px-2.5 py-2 text-sm w-64 focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-60"
          />
        </div>
        <div className="flex flex-col gap-1 flex-1 min-w-[260px]">
          <label className="text-sm text-muted">Natural Language Goal</label>
          <input
            value={goalInput}
            onChange={(e) => onGoalChange(e.target.value)}
            disabled={busy}
            placeholder="Find X under $Y and complete checkout"
            className="bg-base border border-border rounded px-2.5 py-2 text-sm w-full focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-60"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={onRun}
            disabled={busy}
            className="flex items-center gap-1.5 bg-accent hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-3.5 py-2 rounded transition-colors"
          >
            <Play size={15} /> Run Autonomous Audit
          </button>
          <button
            onClick={onPause}
            disabled={status === "idle" || status === "done"}
            className="flex items-center gap-1.5 bg-panel border border-border hover:border-muted disabled:opacity-40 disabled:cursor-not-allowed text-sm px-3.5 py-2 rounded transition-colors"
          >
            <Pause size={15} /> {status === "paused" ? "Resume" : "Pause"}
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
        <div><span className="text-muted">Agent State: </span><span className={`font-mono font-medium ${STATE_COLOR[agentState]}`}>{agentState}</span></div>
        <div><span className="text-muted">Step Count: </span><span className="font-mono">{stepCount}</span></div>
        <div><span className="text-muted">Visited States: </span><span className="font-mono">{visitedStates}</span></div>
        <div><span className="text-muted">Active Branch: </span><span className="font-mono">{activeBranch}</span></div>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-muted">
          <Info size={13} /> Reference simulation engine — type any goal/URL, agent reasoning adapts live
        </div>
      </div>
    </header>
  );
}