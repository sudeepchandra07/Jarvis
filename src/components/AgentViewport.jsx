// src/components/AgentViewport.jsx
import { MousePointer2, ImageIcon } from "lucide-react";
import ThoughtStream from "./ThoughtStream";

const VIEWPORT_W = 1280;
const VIEWPORT_H = 800;

export default function AgentViewport({ result, status, activeStep, setActiveStep }) {
  const screenshots = result?.screenshots || [];
  const currentShot = screenshots[activeStep] || result?.finalScreenshot;
  const currentAction = result?.history?.[activeStep];
  const bbox = currentAction?.bbox;

  const markerStyle = bbox
    ? {
        left: `${((bbox.x + bbox.width / 2) / VIEWPORT_W) * 100}%`,
        top: `${((bbox.y + bbox.height / 2) / VIEWPORT_H) * 100}%`,
      }
    : null;

  const boxStyle = bbox
    ? {
        left: `${(bbox.x / VIEWPORT_W) * 100}%`,
        top: `${(bbox.y / VIEWPORT_H) * 100}%`,
        width: `${(bbox.width / VIEWPORT_W) * 100}%`,
        height: `${(bbox.height / VIEWPORT_H) * 100}%`,
      }
    : null;

  return (
    <section className="bg-panel border border-border rounded-lg flex flex-col overflow-hidden min-h-[420px]">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-base">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blocker/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-friction/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-success/60" />
        </div>
        <div className="flex-1 text-xs font-mono text-muted bg-panel border border-border rounded px-2 py-1 truncate flex items-center gap-1.5">
          <ImageIcon size={12} /> {result ? (result.finalUrl || result.startUrl) : "Awaiting run..."}
        </div>
      </div>

      <div className="relative flex-1 bg-[#0D1117] m-3 rounded border border-border overflow-hidden flex items-center justify-center">
        {status === "running" && (
          <div className="text-muted text-sm text-center px-6">
            Real browser is running — live screenshots appear as each step completes...
          </div>
        )}

        {currentShot && (
          <div className="relative w-full h-full">
            <img src={currentShot} alt={`Step ${activeStep + 1}`} className="w-full h-full object-contain" />

            {boxStyle && (
              <div
                className="absolute border-2 border-accent rounded-sm pointer-events-none"
                style={boxStyle}
              />
            )}
            {markerStyle && (
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={markerStyle}
              >
                <span className="absolute inset-0 -m-2 rounded-full bg-accent/40 animate-ping" />
                <MousePointer2 size={20} className="text-white drop-shadow-[0_0_5px_rgba(59,130,246,1)]" fill="white" />
                {currentAction?.action === "type" && currentAction?.text && (
                  <span className="absolute left-6 top-0 text-[10px] font-mono bg-accent text-white px-1.5 py-0.5 rounded whitespace-nowrap">
                    typing "{currentAction.text}"
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {!result && status !== "running" && (
          <div className="text-muted text-sm text-center px-6">
            Enter a real URL and task above, then press "Run Autonomous Audit"
          </div>
        )}
      </div>

      {screenshots.length > 0 && (
        <div className="flex gap-1 px-3 pb-2 overflow-x-auto">
          {screenshots.map((_, i) => (
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
      )}

      <ThoughtStream current={currentAction ? { thought: currentAction.reasoning || currentAction.action } : null} />
    </section>
  );
}