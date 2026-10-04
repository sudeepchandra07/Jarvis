// src/components/AgentViewport.jsx
import { useState, useEffect } from "react";
import { MousePointer2, ImageIcon } from "lucide-react";
import ThoughtStream from "./ThoughtStream";

const VIEWPORT_W = 1280;
const VIEWPORT_H = 800;

export default function AgentViewport({ result, status, activeStep, setActiveStep }) {
  const screenshots = result?.screenshots || [];
  const currentShot = screenshots[activeStep] || result?.finalScreenshot;
  const currentAction = result?.history?.[activeStep];
  const bbox = currentAction?.bbox;
  const isLive = status === "replaying" || status === "done";

  const markerStyle = bbox
    ? { left: `${((bbox.x + bbox.width / 2) / VIEWPORT_W) * 100}%`, top: `${((bbox.y + bbox.height / 2) / VIEWPORT_H) * 100}%` }
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
    <section className="glass-panel flex flex-col overflow-hidden min-h-[420px]">
      <div className="panel-header">
        <span className="w-2 h-2 rounded-full bg-blocker/60" />
        <span className="w-2 h-2 rounded-full bg-friction/60" />
        <span className="w-2 h-2 rounded-full bg-success/60" />
        <span className="flex-1 truncate font-mono flex items-center gap-1.5 ml-1">
          <ImageIcon size={12} /> {result ? (result.finalUrl || result.startUrl) : "Awaiting run..."}
        </span>
        {status === "replaying" && <span className="text-accent animate-pulse shrink-0">● replaying</span>}
      </div>

      <div className="relative flex-1 bg-[#05070C] m-3 rounded-lg border border-border/80 overflow-hidden flex items-center justify-center">
        {currentShot && isLive && (
          <div className="relative w-full h-full">
            <img key={activeStep} src={currentShot} alt={`Step ${activeStep + 1}`} className="w-full h-full object-contain fade-in" />
            {boxStyle && <div className="absolute border-2 border-accent rounded-sm pointer-events-none viewport-transition shadow-[0_0_14px_rgba(91,157,255,0.5)]" style={boxStyle} />}
            {markerStyle && (
              <div className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none viewport-transition" style={markerStyle}>
                <span className="absolute inset-0 -m-2 rounded-full bg-accent/40 animate-ping" />
                <MousePointer2 size={20} className="text-white drop-shadow-[0_0_6px_rgba(91,157,255,1)]" fill="white" />
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
          <div className="text-muted text-sm text-center px-6">Awaiting a run</div>
        )}
      </div>

      {screenshots.length > 0 && status === "done" && (
        <div className="flex gap-1.5 px-3 pb-3 overflow-x-auto">
          {screenshots.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              className={`text-xs font-mono w-7 h-7 rounded-md shrink-0 transition-colors ${
                i === activeStep ? "bg-gradient-to-br from-accent to-accent2 text-white" : "bg-panel2 border border-border text-muted hover:border-border2"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      <ThoughtStream current={currentAction && isLive ? { thought: currentAction.reasoning || currentAction.action } : null} />

      <style>{`
        .viewport-transition {
          transition: left 1.1s cubic-bezier(0.4, 0, 0.2, 1), top 1.1s cubic-bezier(0.4, 0, 0.2, 1),
                      width 1.1s cubic-bezier(0.4, 0, 0.2, 1), height 1.1s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .fade-in { animation: fadeIn 0.4s ease-in; }
        @keyframes fadeIn { from { opacity: 0.3; } to { opacity: 1; } }
      `}</style>
    </section>
  );
}