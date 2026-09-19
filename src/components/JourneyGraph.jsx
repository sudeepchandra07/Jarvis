// src/components/JourneyGraph.jsx
import { CheckCircle2, XCircle, MousePointerClick, Type as TypeIcon, Flag } from "lucide-react";

const ICON = { click: MousePointerClick, type: TypeIcon, done: Flag, error: XCircle };

export default function JourneyGraph({ result, status, activeStep, setActiveStep }) {
  const history = result?.history || [];

  return (
    <section className="bg-panel border border-border rounded-lg flex flex-col overflow-hidden min-h-[420px]">
      <div className="px-3 py-2 border-b border-border bg-base text-xs font-medium text-muted">
        Real Action Sequence (as actually executed)
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {history.length === 0 && (
          <div className="h-full flex items-center justify-center text-muted text-sm text-center px-6">
            {status === "running" ? "Agent is deciding and acting in real time..." : "Run the agent to see its real step-by-step path"}
          </div>
        )}

        <div className="relative pl-6">
          {history.length > 1 && (
            <div className="absolute left-[9px] top-2 bottom-2 w-px bg-border" />
          )}
          {history.map((h, i) => {
            const Icon = ICON[h.action] || MousePointerClick;
            const isActive = i === activeStep;
            const color = h.error ? "text-blocker border-blocker" : h.action === "done" ? "text-success border-success" : "text-accent border-accent";

            return (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                className={`relative flex items-start gap-3 w-full text-left mb-3 rounded-lg p-2 transition-colors ${
                  isActive ? "bg-accent/10 border border-accent/30" : "hover:bg-base border border-transparent"
                }`}
              >
                <span className={`absolute -left-6 top-2 w-4 h-4 rounded-full border-2 bg-panel flex items-center justify-center ${color}`}>
                  <Icon size={9} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span className="font-mono uppercase text-xs">{h.action}</span>
                    {h.index != null && <span className="text-muted font-mono text-xs">[{h.index}]</span>}
                    {h.error ? <XCircle size={12} className="text-blocker ml-auto" /> : <CheckCircle2 size={12} className="text-success ml-auto" />}
                  </div>
                  {h.text && <p className="text-xs text-ink/70 font-mono mt-0.5 truncate">"{h.text}"</p>}
                  <p className="text-xs text-muted italic mt-0.5 truncate">{h.reasoning}</p>
                  {h.error && <p className="text-xs text-blocker mt-0.5">{h.error}</p>}
                </div>
              </button>
            );
          })}
        </div>

        {result && (
          <div className="mt-3 pt-3 border-t border-border text-xs text-muted">
            <div>Started: <span className="font-mono text-ink/70">{result.startUrl}</span></div>
            <div>Ended: <span className="font-mono text-ink/70">{result.finalUrl}</span></div>
          </div>
        )}
      </div>
    </section>
  );
}