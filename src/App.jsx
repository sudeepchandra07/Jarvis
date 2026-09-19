// src/App.jsx
import { useState } from "react";
import Landing from "./components/Landing";
import ControlBar from "./components/ControlBar";
import AgentViewport from "./components/AgentViewport";
import JourneyGraph from "./components/JourneyGraph";
import DiagnosticsPanel from "./components/DiagnosticsPanel";
import TelemetryLog from "./components/TelemetryLog";
import LiveScanPanel from "./components/LiveScanPanel";
import { ShieldAlert, Compass } from "lucide-react";

const DEFAULT_URL = "https://example.com";
const DEFAULT_GOAL = "Click the More information link";
const BACKEND = "https://jarvis-backend-2wtp.onrender.com";

export default function App() {
  const [page, setPage] = useState("landing");
  const [mode, setMode] = useState("journey"); // journey | live
  const [status, setStatus] = useState("idle"); // idle | running | done | error
  const [urlInput, setUrlInput] = useState(DEFAULT_URL);
  const [goalInput, setGoalInput] = useState(DEFAULT_GOAL);
  const [result, setResult] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState(null);

  const handleRun = async () => {
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
        throw new Error(err.detail || `Agent run failed (${res.status})`);
      }
      const data = await res.json();
      setResult(data);
      setStatus("done");
    } catch (e) {
      setError(e.message || "Could not reach backend.");
      setStatus("error");
    }
  };

  const handleReset = () => {
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
      <div className="border-b border-border bg-panel px-5 flex gap-1 overflow-x-auto">
        <button
          onClick={() => setMode("journey")}
          className={`flex items-center gap-1.5 text-sm px-4 py-2.5 border-b-2 whitespace-nowrap transition-colors ${
            mode === "journey" ? "border-accent text-ink" : "border-transparent text-muted hover:text-ink"
          }`}
        >
          <Compass size={15} /> Agentic Journey (Real)
        </button>
        <button
          onClick={() => setMode("live")}
          className={`flex items-center gap-1.5 text-sm px-4 py-2.5 border-b-2 whitespace-nowrap transition-colors ${
            mode === "live" ? "border-accent text-ink" : "border-transparent text-muted hover:text-ink"
          }`}
        >
          <ShieldAlert size={15} /> Accessibility Only Scan
        </button>
      </div>

      {mode === "journey" ? (
        <>
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
        </>
      ) : (
        <LiveScanPanel />
      )}
    </div>
  );
}