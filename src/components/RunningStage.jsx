// src/components/RunningStage.jsx
import { useState, useEffect } from "react";

const MESSAGES = [
  "Capturing viewport...",
  "Parsing accessibility tree...",
  "Indexing interactive elements...",
  "Reasoning about next action...",
  "Dispatching synthetic input...",
];

function AIStatusCycle() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setIndex((i) => (i + 1) % MESSAGES.length), 1600);
    return () => clearInterval(interval);
  }, []);
  return (
    <div key={index} className="font-mono text-sm text-accent status-fade">
      {MESSAGES[index]}
    </div>
  );
}

export default function RunningStage({ url, goal }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-7 px-6">
      <div className="scene3d">
        <div className="cube3d">
          <div className="cube-face cube-front" />
          <div className="cube-face cube-back" />
          <div className="cube-face cube-right" />
          <div className="cube-face cube-left" />
          <div className="cube-face cube-top" />
          <div className="cube-face cube-bottom" />
        </div>
        <div className="orbit-ring-3d orbit-ring-3d-1" />
        <div className="orbit-ring-3d orbit-ring-3d-2" />
      </div>

      <div className="waveform">
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} className="wave-bar" style={{ animationDelay: `${i * 0.1}s` }} />
        ))}
      </div>

      <AIStatusCycle />

      <div className="text-center mt-2">
        <p className="text-sm text-ink/80">{goal ? `Working toward: "${goal}"` : "Running a quick accessibility scan"}</p>
        <p className="text-xs text-muted font-mono mt-1">{url}</p>
      </div>

      <style>{`
        .scene3d {
          position: relative;
          width: 100px; height: 100px;
          perspective: 500px;
          display: flex; align-items: center; justify-content: center;
        }
        .cube3d {
          position: relative;
          width: 36px; height: 36px;
          transform-style: preserve-3d;
          animation: cubeSpin 5s linear infinite;
        }
        @keyframes cubeSpin {
          from { transform: rotateX(0deg) rotateY(0deg); }
          to { transform: rotateX(360deg) rotateY(360deg); }
        }
        .cube-face {
          position: absolute;
          width: 36px; height: 36px;
          background: linear-gradient(135deg, rgba(91,157,255,0.35), rgba(155,124,255,0.25));
          border: 1px solid rgba(91,157,255,0.6);
          box-shadow: 0 0 16px rgba(91,157,255,0.3) inset;
        }
        .cube-front  { transform: translateZ(18px); }
        .cube-back   { transform: translateZ(-18px) rotateY(180deg); }
        .cube-right  { transform: translateX(18px) rotateY(90deg); }
        .cube-left   { transform: translateX(-18px) rotateY(-90deg); }
        .cube-top    { transform: translateY(-18px) rotateX(90deg); }
        .cube-bottom { transform: translateY(18px) rotateX(-90deg); }
        .orbit-ring-3d {
          position: absolute;
          border: 1px solid rgba(91,157,255,0.3);
          border-radius: 50%;
          transform-style: preserve-3d;
        }
        .orbit-ring-3d-1 {
          width: 90px; height: 90px;
          transform: rotateX(70deg);
          animation: ring3dSpin 4s linear infinite;
        }
        .orbit-ring-3d-2 {
          width: 100px; height: 100px;
          border-color: rgba(155,124,255,0.25);
          transform: rotateX(70deg) rotateZ(60deg);
          animation: ring3dSpin 6s linear infinite reverse;
        }
        @keyframes ring3dSpin {
          from { transform: rotateX(70deg) rotateZ(0deg); }
          to { transform: rotateX(70deg) rotateZ(360deg); }
        }
        .waveform { display: flex; align-items: center; gap: 3px; height: 20px; }
        .wave-bar { width: 3px; height: 6px; background: #5B9DFF; border-radius: 2px; animation: waveBounce 0.9s ease-in-out infinite; }
        @keyframes waveBounce { 0%, 100% { height: 6px; opacity: 0.5; } 50% { height: 20px; opacity: 1; } }
        .status-fade { animation: statusFade 1.6s ease-in-out; }
        @keyframes statusFade { 0% { opacity: 0; transform: translateY(4px); } 15% { opacity: 1; transform: translateY(0); } 85% { opacity: 1; } 100% { opacity: 0.3; } }
      `}</style>
    </div>
  );
}