// src/components/AgentViewport.jsx
import { useState, useEffect } from "react";
import { MousePointer2, ImageIcon } from "lucide-react";
import ThoughtStream from "./ThoughtStream";

const VIEWPORT_W = 1280;
const VIEWPORT_H = 800;

const SCAN_MESSAGES = [
  "Capturing viewport...",
  "Parsing accessibility tree...",
  "Indexing interactive elements...",
  "Reasoning about next action...",
  "Dispatching synthetic input...",
];

function AIStatusCycle({ messages }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 1600);
    return () => clearInterval(interval);
  }, [messages]);

  return (
    <div key={index} className="font-mono text-xs text-accent status-fade">
      {messages[index]}
    </div>
  );
}

export default function AgentViewport({ result, status, activeStep, setActiveStep }) {
  const screenshots = result?.screenshots || [];
  const currentShot = screenshots[activeStep] || result?.finalScreenshot;
  const currentAction = result?.history?.[activeStep];
  const bbox = currentAction?.bbox;
  const isLive = status === "replaying" || status === "done";

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
          {status === "replaying" && <span className="ml-auto text-accent animate-pulse">● REPLAYING REAL RUN</span>}
        </div>
      </div>

      <div className="relative flex-1 bg-[#0D1117] m-3 rounded border border-border overflow-hidden flex items-center justify-center">
        {status === "running" && (
          <div className="absolute inset-0 agent-scan-bg flex flex-col items-center justify-center gap-5 px-6">
            <div className="neural-orb">
              <div className="orb-core" />
              <div className="orb-ring orb-ring-1" />
              <div className="orb-ring orb-ring-2" />
              <div className="orbit-dot orbit-dot-1" />
              <div className="orbit-dot orbit-dot-2" />
              <div className="orbit-dot orbit-dot-3" />
            </div>

            <div className="waveform">
              {Array.from({ length: 9 }).map((_, i) => (
                <span key={i} className="wave-bar" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>

            <AIStatusCycle messages={SCAN_MESSAGES} />
          </div>
        )}

        {currentShot && isLive && (
          <div className="relative w-full h-full">
            <img key={activeStep} src={currentShot} alt={`Step ${activeStep + 1}`} className="w-full h-full object-contain fade-in" />

            {boxStyle && (
              <div className="absolute border-2 border-accent rounded-sm pointer-events-none viewport-transition" style={boxStyle} />
            )}
            {markerStyle && (
              <div className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none viewport-transition" style={markerStyle}>
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

      {screenshots.length > 0 && status === "done" && (
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

      <ThoughtStream current={currentAction && isLive ? { thought: currentAction.reasoning || currentAction.action } : null} />

      <style>{`
        .agent-scan-bg {
          background: radial-gradient(circle at center, rgba(59,130,246,0.06) 0%, transparent 70%);
        }
        .neural-orb {
          position: relative;
          width: 90px; height: 90px;
          display: flex; align-items: center; justify-content: center;
        }
        .orb-core {
          width: 28px; height: 28px;
          border-radius: 50%;
          background: radial-gradient(circle, #60A5FA, #3B82F6);
          box-shadow: 0 0 20px 6px rgba(59,130,246,0.5);
          animation: orbPulse 1.6s ease-in-out infinite;
        }
        @keyframes orbPulse {
          0%, 100% { transform: scale(0.9); opacity: 0.85; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        .orb-ring {
          position: absolute;
          border: 1px solid rgba(59,130,246,0.35);
          border-radius: 50%;
        }
        .orb-ring-1 { width: 60px; height: 60px; animation: ringSpin 4s linear infinite; }
        .orb-ring-2 { width: 90px; height: 90px; border-style: dashed; animation: ringSpin 7s linear infinite reverse; }
        @keyframes ringSpin { to { transform: rotate(360deg); } }
        .orbit-dot {
          position: absolute;
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #93C5FD;
          box-shadow: 0 0 6px 1px rgba(147,197,253,0.8);
          top: 50%; left: 50%;
          transform-origin: 0 0;
        }
        .orbit-dot-1 { animation: orbit1 2.2s linear infinite; }
        .orbit-dot-2 { animation: orbit2 3s linear infinite; }
        .orbit-dot-3 { animation: orbit3 2.6s linear infinite reverse; }
        @keyframes orbit1 { from { transform: rotate(0deg) translateX(45px); } to { transform: rotate(360deg) translateX(45px); } }
        @keyframes orbit2 { from { transform: rotate(120deg) translateX(45px); } to { transform: rotate(480deg) translateX(45px); } }
        @keyframes orbit3 { from { transform: rotate(240deg) translateX(30px); } to { transform: rotate(600deg) translateX(30px); } }
        .waveform {
          display: flex;
          align-items: center;
          gap: 3px;
          height: 20px;
        }
        .wave-bar {
          width: 3px;
          height: 6px;
          background: #3B82F6;
          border-radius: 2px;
          animation: waveBounce 0.9s ease-in-out infinite;
        }
        @keyframes waveBounce {
          0%, 100% { height: 6px; opacity: 0.5; }
          50% { height: 20px; opacity: 1; }
        }
        .status-fade {
          animation: statusFade 1.6s ease-in-out;
        }
        @keyframes statusFade {
          0% { opacity: 0; transform: translateY(4px); }
          15% { opacity: 1; transform: translateY(0); }
          85% { opacity: 1; }
          100% { opacity: 0.3; }
        }
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