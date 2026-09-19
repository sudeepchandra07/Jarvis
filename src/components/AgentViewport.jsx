// src/components/AgentViewport.jsx
import { ImageIcon } from "lucide-react";
import ThoughtStream from "./ThoughtStream";

export default function AgentViewport({ result, status, activeStep, setActiveStep }) {
  const screenshots = result?.screenshots || [];
  const currentShot = screenshots[activeStep] || result?.finalScreenshot;
  const currentAction = result?.history?.[activeStep];

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
            Real browser is running — screenshots will appear once the agent finishes each step...
          </div>
        )}
        {currentShot && (
          <img src={currentShot} alt={`Step ${activeStep + 1}`} className="w-full h-full object-contain" />
        )}
        {!result && status !== "running" && (
          <div className="text-muted text-sm text-center px-6">
            Enter a real URL and goal above, then press "Run Autonomous Audit"
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