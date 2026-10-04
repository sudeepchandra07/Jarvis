// src/components/InputStage.jsx
import { Play, AlertTriangle, Globe, Target } from "lucide-react";

export default function InputStage({ urlInput, goalInput, onUrlChange, onGoalChange, onRun, error }) {
  return (
    <div className="flex-1 flex items-center justify-center px-6 py-16 relative overflow-hidden">
      <div className="input-glow" />

      <div className="w-full max-w-lg relative stage-enter">
        <div className="text-center mb-8">
          <span className="inline-block text-xs font-mono text-accent bg-accent/10 border border-accent/30 rounded-full px-3 py-1 mb-4">
            Ready to run
          </span>
          <h1 className="font-display text-3xl font-semibold mb-2">
            What should the agent check?
          </h1>
          <p className="text-muted text-sm max-w-sm mx-auto">
            Enter any real website. Add a task to have it navigate, or leave it blank for a quick accessibility scan.
          </p>
        </div>

        <div className="input-card bg-panel/80 backdrop-blur border border-border rounded-xl p-6 space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-muted flex items-center gap-1.5">
              <Globe size={13} /> Website URL
            </label>
            <input
              value={urlInput}
              onChange={(e) => onUrlChange(e.target.value)}
              placeholder="https://your-app.com"
              className="bg-base border border-border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-shadow"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-muted flex items-center gap-1.5">
              <Target size={13} /> Task <span className="opacity-60">(optional)</span>
            </label>
            <input
              value={goalInput}
              onChange={(e) => onGoalChange(e.target.value)}
              placeholder="e.g. Click the Learn more link"
              className="bg-base border border-border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-shadow"
            />
          </div>

          <button
            onClick={onRun}
            className="group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-accent to-accent2 hover:brightness-110 text-white font-medium text-sm py-3 rounded-lg transition-all shadow-[0_0_20px_-6px_rgba(79,142,247,0.6)]"
          >
            <Play size={16} className="transition-transform group-hover:scale-110" /> Run Audit
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-2 mt-4 text-sm text-blocker bg-blocker/10 border border-blocker/30 rounded-lg px-4 py-3 stage-enter">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <p className="text-xs text-muted text-center mt-6 flex items-center justify-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          Genuinely browses and acts on the site you enter — no simulation.
        </p>
      </div>

      <style>{`
        .input-glow {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(79,142,247,0.12) 0%, transparent 70%);
          pointer-events: none;
          animation: glowPulse 4s ease-in-out infinite;
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.08); }
        }
        .stage-enter {
          animation: stageEnter 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes stageEnter {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .input-card {
          box-shadow: 0 0 50px -15px rgba(79,142,247,0.3);
          transition: box-shadow 0.4s ease, border-color 0.4s ease, transform 0.4s ease;
        }
        .input-card:hover {
          box-shadow: 0 0 60px -10px rgba(79,142,247,0.45), 0 0 0 1px rgba(91,157,255,0.3) inset;
          border-color: rgba(91,157,255,0.5);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}