// src/App.jsx
import { useState, useRef } from "react";
import Landing from "./components/Landing";
import InputStage from "./components/InputStage";
import RunningStage from "./components/RunningStage";
import ResultsStage from "./components/ResultsStage";
import AmbientCanvas from "./components/AmbientCanvas";

const DEFAULT_URL = "https://example.com";
const DEFAULT_GOAL = "";
const BACKEND = "https://jarvis-backend-2wtp.onrender.com";
const REPLAY_STEP_MS = 1400;

// black hole position per page (fraction of the viewport)
const LANDING_POS = { x: 0.55, y: 0.42 };
const DASHBOARD_POS = { x: 0.82, y: 0.5 };

export default function App() {
  const [page, setPage] = useState("landing");
  const [status, setStatus] = useState("idle");
  const [urlInput, setUrlInput] = useState(DEFAULT_URL);
  const [goalInput, setGoalInput] = useState(DEFAULT_GOAL);
  const [result, setResult] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState(null);
  const replayRef = useRef(null);

  const startReplay = (data) => {
    if (!data.history || data.history.length <= 1) {
      setActiveStep(0);
      setStatus("done");
      return;
    }
    setStatus("replaying");
    setActiveStep(0);
    let i = 0;
    clearInterval(replayRef.current);
    replayRef.current = setInterval(() => {
      i += 1;
      if (i >= data.history.length) {
        clearInterval(replayRef.current);
        setActiveStep(data.history.length - 1);
        setStatus("done");
      } else {
        setActiveStep(i);
      }
    }, REPLAY_STEP_MS);
  };

  const handleRun = async () => {
    clearInterval(replayRef.current);
    setStatus("running");
    setError(null);
    setResult(null);
    setActiveStep(0);
    try {
      const res = await fetch(`${BACKEND}/agent-run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput, goal: goalInput }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Run failed (${res.status})`);
      }
      const data = await res.json();
      setResult(data);
      startReplay(data);
    } catch (e) {
      setError(e.message || "Could not reach backend.");
      setStatus("error");
    }
  };

  const handleReset = () => {
    clearInterval(replayRef.current);
    setStatus("idle");
    setResult(null);
    setError(null);
    setActiveStep(0);
  };

  const stage =
    status === "running"
      ? "loading"
      : status === "replaying" || status === "done"
      ? "results"
      : "input";

  return (
    <>
      {/* mounted once, so it never restarts when you switch pages */}
      <AmbientCanvas pos={page === "landing" ? LANDING_POS : DASHBOARD_POS} />

      {page === "landing" ? (
        <Landing onLaunch={() => setPage("dashboard")} />
      ) : (
        <div className="min-h-screen text-ink font-sans flex flex-col relative" style={{ zIndex: 1 }}>
          <header className="border-b border-border bg-panel/60 backdrop-blur px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => { handleReset(); setPage("landing"); }}
              className="font-display font-semibold text-base tracking-tight text-ink hover:text-accent transition-colors"
            >
              JARVIS
            </button>
            {stage === "results" && (
              <button
                onClick={handleReset}
                className="text-sm font-medium text-ink/80 hover:text-ink transition-colors"
              >
                New audit
              </button>
            )}
          </header>

          <div key={stage} className="flex-1 flex flex-col stage-3d">
            {stage === "input" && (
              <InputStage
                urlInput={urlInput}
                goalInput={goalInput}
                onUrlChange={setUrlInput}
                onGoalChange={setGoalInput}
                onRun={handleRun}
                error={error}
              />
            )}

            {stage === "loading" && <RunningStage url={urlInput} goal={goalInput} />}

            {stage === "results" && (
              <ResultsStage
                result={result}
                status={status}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                goal={goalInput}
                url={urlInput}
              />
            )}
          </div>

          <style>{`
            .stage-3d {
              animation: stage3dIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
              transform-style: preserve-3d;
            }
            @keyframes stage3dIn {
              from { opacity: 0; transform: perspective(1200px) rotateX(6deg) translateY(16px); }
              to { opacity: 1; transform: perspective(1200px) rotateX(0deg) translateY(0); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}