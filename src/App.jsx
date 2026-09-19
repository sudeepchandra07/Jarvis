// src/App.jsx
import { useEffect, useRef, useState } from "react";
import TelemetryLog from "./components/TelemetryLog";
import Landing from "./components/Landing";
import ControlBar from "./components/ControlBar";
import AgentViewport from "./components/AgentViewport";
import JourneyGraph from "./components/JourneyGraph";
import DiagnosticsPanel from "./components/DiagnosticsPanel";
import LiveScanPanel from "./components/LiveScanPanel";
import { generateRun } from "./data/simulationGenerator";
import { Compass, ShieldAlert } from "lucide-react";

const DEFAULT_URL = "https://demo-shop.example.com";
const DEFAULT_GOAL = "Find blue running shoes under $100 and complete guest checkout";

export default function App() {
  const [page, setPage] = useState("landing");
  const [mode, setMode] = useState("journey"); // journey | live
  const [status, setStatus] = useState("idle");
  const [elapsed, setElapsed] = useState(0);
  const [urlInput, setUrlInput] = useState(DEFAULT_URL);
  const [goalInput, setGoalInput] = useState(DEFAULT_GOAL);
  const [run, setRun] = useState(null);
  const intervalRef = useRef(null);

  const runEnd = run ? run.timeline[run.timeline.length - 1].t + 0.6 : 15.5;

  const tick = () => {
    setElapsed((prev) => {
      const next = prev + 0.1;
      if (next >= runEnd) {
        clearInterval(intervalRef.current);
        setStatus("done");
        return runEnd;
      }
      return next;
    });
  };

  const handleRun = () => {
    clearInterval(intervalRef.current);
    const freshRun = generateRun(goalInput, urlInput);
    setRun(freshRun);
    setElapsed(0);
    setStatus("running");
    intervalRef.current = setInterval(tick, 100);
  };

  const handlePause = () => {
    if (status === "running") {
      clearInterval(intervalRef.current);
      setStatus("paused");
    } else if (status === "paused") {
      setStatus("running");
      intervalRef.current = setInterval(tick, 100);
    }
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setElapsed(0);
    setStatus("idle");
    setRun(null);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  if (page === "landing") {
    return <Landing onLaunch={() => setPage("dashboard")} />;
  }

  const visibleEvents = run && status !== "idle" ? run.timeline.filter((e) => e.t <= elapsed) : [];
  const current = visibleEvents[visibleEvents.length - 1] || null;

  return (
    <div className="min-h-screen bg-base text-ink font-sans flex flex-col">
      <div className="border-b border-border bg-panel px-5 flex gap-1">
        <button
          onClick={() => setMode("journey")}
          className={`flex items-center gap-1.5 text-sm px-4 py-2.5 border-b-2 transition-colors ${
            mode === "journey" ? "border-accent text-ink" : "border-transparent text-muted hover:text-ink"
          }`}
        >
          <Compass size={15} /> Agentic Journey (Simulated)
        </button>
        <button
          onClick={() => setMode("live")}
          className={`flex items-center gap-1.5 text-sm px-4 py-2.5 border-b-2 transition-colors ${
            mode === "live" ? "border-accent text-ink" : "border-transparent text-muted hover:text-ink"
          }`}
        >
          <ShieldAlert size={15} /> Live Accessibility Scan (Real)
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
            onPause={handlePause}
            onReset={handleReset}
            onHome={() => { handleReset(); setPage("landing"); }}
            current={current}
            visibleEvents={visibleEvents}
          />
          {current?.loopWarning && (
            <div className="bg-friction/10 border-y border-friction/30 text-friction text-sm font-mono px-4 py-2">
              ⚠ Branch abandoned — repeated no-op detected on Path A. Backtracking to Path Priority Queue.
            </div>
          )}
          <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 p-3 min-h-0">
            <AgentViewport current={current} elapsed={elapsed} run={run} />
            <JourneyGraph elapsed={elapsed} status={status} run={run} />
          </main>
          <TelemetryLog visibleEvents={visibleEvents} />
          <DiagnosticsPanel elapsed={elapsed} status={status} run={run} runEnd={runEnd} />
        </>
      ) : (
        <LiveScanPanel />
      )}
    </div>
  );
}