// src/components/JourneyGraph.jsx
import { CheckCircle2, XCircle, Flag, MousePointerClick, Type as TypeIcon, Loader2, Radio } from "lucide-react";

const ICON = { click: MousePointerClick, type: TypeIcon, done: Flag, error: XCircle };
const COLOR = { click: "#3B82F6", type: "#3B82F6", done: "#22C55E", error: "#EF4444" };

export default function JourneyGraph({ result, status, activeStep, setActiveStep }) {
  const fullHistory = result?.history || [];
  const isRunning = status === "running";
  const isReplaying = status === "replaying";
  const visibleHistory = isReplaying ? fullHistory.slice(0, activeStep + 1) : fullHistory;

  return (
    <section className="bg-panel border border-border rounded-lg flex flex-col overflow-hidden min-h-[420px]">
      <div className="px-3 py-2 border-b border-border bg-base text-xs font-medium text-muted flex items-center gap-2">
        <Radio size={12} className={isReplaying ? "text-accent animate-pulse" : ""} />
        Real Checkpoints (each is an action the agent actually took)
        {(isRunning || isReplaying) && <Loader2 size={12} className="animate-spin text-accent ml-auto" />}
      </div>

      <div className="flex-1 overflow-auto p-4">
        {isRunning && (
          <div className="flex flex-col gap-0">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full border-2 border-border flex items-center justify-center shrink-0 checkpoint-pulse" style={{ animationDelay: `${i * 0.3}s` }}>
                    <div className="w-2 h-2 rounded-full bg-accent/50" />
                  </div>
                  {i < 3 && <div className="w-px flex-1 bg-border my-1" style={{ minHeight: "16px" }} />}
                </div>
                <div className="flex-1 mb-2 pt-1">
                  <div className="h-3 bg-base rounded w-24 mb-2 checkpoint-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                  <div className="h-2.5 bg-base rounded w-40 checkpoint-pulse" style={{ animationDelay: `${i * 0.3 + 0.1}s` }} />
                </div>
              </div>
            ))}
            <p className="text-xs text-muted font-mono text-center pt-2 animate-pulse">&gt; agent is deciding and acting in real time_</p>
          </div>
        )}

        {!isRunning && visibleHistory.length === 0 && (
          <div className="h-full flex items-center justify-center text-muted text-sm text-center px-6">
            Run the agent to see its real checkpoints
          </div>
        )}

        {!isRunning && visibleHistory.length > 0 && (
          <div className="flex flex-col gap-0">
            {visibleHistory.map((h, i) => {
              const Icon = ICON[h.error ? "error" : h.action] || MousePointerClick;
              const color = COLOR[h.error ? "error" : h.action] || "#3B82F6";
              const isActive = i === activeStep;
              const isLast = i === visibleHistory.length - 1;
              const isNewest = isReplaying && isLast;

              return (
                <div key={i} className={`flex gap-3 ${isNewest ? "checkpoint-reveal" : ""}`}>
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => !isReplaying && setActiveStep(i)}
                      className="w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-transform"
                      style={{
                        borderColor: color,
                        backgroundColor: isActive ? color : "transparent",
                        boxShadow: isActive ? `0 0 10px ${color}88` : "none",
                      }}
                    >
                      <Icon size={14} color={isActive ? "white" : color} />
                    </button>
                    {!isLast && <div className="w-px flex-1 bg-border my-1" style={{ minHeight: "16px" }} />}
                    {isLast && isReplaying && <div className="w-px flex-1 my-1 pulse-line" style={{ minHeight: "16px" }} />}
                  </div>

                  <button
                    onClick={() => !isReplaying && setActiveStep(i)}
                    className={`flex-1 text-left rounded-lg p-2.5 mb-2 transition-colors font-mono ${
                      isActive ? "bg-accent/10 border border-accent/30" : "border border-transparent hover:bg-base"
                    }`}
                  >
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <span className="text-muted">[{String(i + 1).padStart(2, "0")}]</span>
                      <span className="uppercase text-xs">{h.action}</span>
                      {h.index != null && <span className="text-muted text-xs">→ el[{h.index}]</span>}
                      {h.error ? <XCircle size={12} className="text-blocker ml-auto" /> : <CheckCircle2 size={12} className="text-success ml-auto" />}
                    </div>
                    {h.text && <p className="text-xs text-ink/70 mt-1 truncate">payload: "{h.text}"</p>}
                    <p className="text-xs text-muted italic mt-1 font-sans">{h.reasoning}</p>
                    {h.error && <p className="text-xs text-blocker mt-1">{h.error}</p>}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {result && status === "done" && (
          <div className="mt-2 pt-3 border-t border-border text-xs text-muted space-y-0.5 font-mono">
            <div>start: <span className="text-ink/70">{result.startUrl}</span></div>
            <div>end:&nbsp;&nbsp;<span className="text-ink/70">{result.finalUrl}</span></div>
          </div>
        )}
      </div>

      <style>{`
        .checkpoint-pulse { animation: checkpointPulse 1.4s ease-in-out infinite; }
        @keyframes checkpointPulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.8; } }
        .checkpoint-reveal { animation: revealIn 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
        @keyframes revealIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .pulse-line {
          background: linear-gradient(#3B82F6, transparent);
          animation: pulseLine 1.2s ease-in-out infinite;
        }
        @keyframes pulseLine { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
      `}</style>
    </section>
  );
}