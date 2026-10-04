// src/components/JourneyGraph.jsx
import { CheckCircle2, XCircle, Flag, MousePointerClick, Type as TypeIcon, Radio } from "lucide-react";

const ICON = { click: MousePointerClick, type: TypeIcon, done: Flag, error: XCircle, scan: CheckCircle2 };
const COLOR = { click: "#5B9DFF", type: "#5B9DFF", done: "#34D399", error: "#F87171", scan: "#34D399" };

export default function JourneyGraph({ result, status, activeStep, setActiveStep }) {
  const fullHistory = result?.history || [];
  const isReplaying = status === "replaying";
  const visibleHistory = isReplaying ? fullHistory.slice(0, activeStep + 1) : fullHistory;

  return (
    <section className="glass-panel flex flex-col overflow-hidden min-h-[420px]">
      <div className="panel-header">
        <Radio size={12} className={isReplaying ? "text-accent animate-pulse" : ""} />
        Checkpoints
        <span className="ml-auto font-mono text-ink/50">{fullHistory.length} total</span>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {visibleHistory.length === 0 && (
          <div className="h-full flex items-center justify-center text-muted text-sm text-center px-6">
            No checkpoints yet
          </div>
        )}

        <div className="flex flex-col gap-0">
          {visibleHistory.map((h, i) => {
            const Icon = ICON[h.error ? "error" : h.action] || MousePointerClick;
            const color = COLOR[h.error ? "error" : h.action] || "#5B9DFF";
            const isActive = i === activeStep;
            const isLast = i === visibleHistory.length - 1;
            const isNewest = isReplaying && isLast;

            return (
              <div key={i} className={`flex gap-3 ${isNewest ? "checkpoint-reveal" : ""}`}>
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => !isReplaying && setActiveStep(i)}
                    className="w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                    style={{
                      borderColor: color,
                      backgroundColor: isActive ? color : "transparent",
                      boxShadow: isActive ? `0 0 12px ${color}99` : "none",
                    }}
                  >
                    <Icon size={14} color={isActive ? "white" : color} />
                  </button>
                  {!isLast && <div className="w-px flex-1 bg-gradient-to-b from-border to-transparent my-1" style={{ minHeight: "18px" }} />}
                </div>

                <button
                  onClick={() => !isReplaying && setActiveStep(i)}
                  className={`flex-1 text-left rounded-lg p-3 mb-2 transition-colors font-mono ${
                    isActive ? "bg-gradient-to-r from-accent/15 to-transparent border border-accent/30" : "border border-transparent hover:bg-panel2"
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span className="text-muted">[{String(i + 1).padStart(2, "0")}]</span>
                    <span className="uppercase text-xs" style={{ color }}>{h.action}</span>
                    {h.index != null && <span className="text-muted text-xs">→ el[{h.index}]</span>}
                  </div>
                  {h.text && <p className="text-xs text-ink/70 mt-1 truncate">payload: "{h.text}"</p>}
                  <p className="text-xs text-muted italic mt-1 font-sans">{h.reasoning}</p>
                  {h.error && <p className="text-xs text-blocker mt-1">{h.error}</p>}
                </button>
              </div>
            );
          })}
        </div>

        {result && status === "done" && (
          <div className="mt-2 pt-3 border-t border-border text-xs text-muted space-y-0.5 font-mono">
            <div>start: <span className="text-ink/70">{result.startUrl}</span></div>
            <div>end:&nbsp;&nbsp;<span className="text-ink/70">{result.finalUrl}</span></div>
          </div>
        )}
      </div>

      <style>{`
        .checkpoint-reveal { animation: revealIn 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
        @keyframes revealIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </section>
  );
}