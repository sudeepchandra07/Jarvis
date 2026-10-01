// src/App.jsx
import { useState, useRef } from "react";
import Landing from "./components/Landing";
import ControlBar from "./components/ControlBar";
import AgentViewport from "./components/AgentViewport";
import JourneyGraph from "./components/JourneyGraph";
import DiagnosticsPanel from "./components/DiagnosticsPanel";
import TelemetryLog from "./components/TelemetryLog";

const DEFAULT_URL = "https://example.com";
const DEFAULT_GOAL = "";
const BACKEND = "https://jarvis-backend-2wtp.onrender.com";
const REPLAY_STEP_MS = 1400;

export default function App() {
  const [page, setPage] = useState("landing");
  const [status, setStatus] = useState("idle"); // idle | running | replaying | done | error
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

  if (page === "landing") {
    return <Landing onLaunch={() => setPage("dashboard")} />;
  }

  return (
    <div className="min-h-screen bg-base text-ink font-sans flex flex-col">
      <ControlBar
        status={status}
        urlInput={urlInput}
        goalInput={goalInput}
        onUrlChange={setUrlInput}
        onGoalChange={setGoalInput}
        onRun={handleRun}
        onReset={handleReset}
        onHome={() => { handleReset(); setPage("landing"); }}
        result={result}
        activeStep={activeStep}
      />
      {error && (
        <div className="bg-blocker/10 border-y border-blocker/30 text-blocker text-sm font-mono px-4 py-2">
          ⚠ {error}
        </div>
      )}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 p-3 min-h-0">
        <AgentViewport result={result} status={status} activeStep={activeStep} setActiveStep={setActiveStep} />
        <JourneyGraph result={result} status={status} activeStep={activeStep} setActiveStep={setActiveStep} />
      </main>
      <TelemetryLog result={result} />
      <DiagnosticsPanel result={result} status={status} goal={goalInput} url={urlInput} />
    </div>
  );
}