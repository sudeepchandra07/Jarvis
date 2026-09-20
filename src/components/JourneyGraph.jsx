// src/components/JourneyGraph.jsx
import { CheckCircle2, XCircle, Flag, MousePointerClick, Type as TypeIcon } from "lucide-react";

const ICON = { click: MousePointerClick, type: TypeIcon, done: Flag, error: XCircle };
const COLOR = { click: "#3B82F6", type: "#3B82F6", done: "#22C55E", error: "#EF4444" };

export default function JourneyGraph({ result, status, activeStep, setActiveStep }) {
  const history = result?.history || [];

  return (
    <section className="bg-panel border border-border rounded-lg flex flex-col overflow-hidden min-h-[420px]">
      <div className="px-3 py-2 border-b border-border bg-base text-xs font-medium text-muted">
        Real Checkpoints (each is an action the agent actually took)
      </div>

      <div className="flex-1 overflow-auto p-4">
        {history.length === 0 && (
          <div className="h-full flex items-center justify-center text-muted text-sm text-center px-6">
            {status === "running" ? "Agent is deciding and acting in real time..." : "Run the agent to see its real checkpoints"}
          </div>
        )}

        <div className="flex flex-col gap-0">
          {history.map((h, i) => {
            const Icon = ICON[h.error ? "error" : h.action] || MousePointerClick;
            const color = COLOR[h.error ? "error" : h.action] || "#3B82F6";
            const isActive = i === activeStep;
            const isLast = i === history.length - 1;

            return (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => setActiveStep(i)}
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
                </div>

                <button
                  onClick={() => setActiveStep(i)}
                  className={`flex-1 text-left rounded-lg p-2.5 mb-2 transition-colors ${
                    isActive ? "bg-accent/10 border border-accent/30" : "border border-transparent hover:bg-base"
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span className="font-mono uppercase text-xs">{h.action}</span>
                    {h.index != null && <span className="text-muted font-mono text-xs">on element [{h.index}]</span>}
                    {h.error ? <XCircle size={12} className="text-blocker ml-auto" /> : <CheckCircle2 size={12} className="text-success ml-auto" />}
                  </div>
                  {h.text && <p className="text-xs text-ink/70 font-mono mt-1 truncate">typed: "{h.text}"</p>}
                  <p className="text-xs text-muted italic mt-1">{h.reasoning}</p>
                  {h.error && <p className="text-xs text-blocker mt-1">{h.error}</p>}
                </button>
              </div>
            );
          })}
        </div>

        {result && (
          <div className="mt-2 pt-3 border-t border-border text-xs text-muted space-y-0.5">
            <div>Started at: <span className="font-mono text-ink/70">{result.startUrl}</span></div>
            <div>Ended at: <span className="font-mono text-ink/70">{result.finalUrl}</span></div>
          </div>
        )}
      </div>
    </section>
  );
}