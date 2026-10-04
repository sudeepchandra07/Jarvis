// src/components/ResultsStage.jsx
import AgentViewport from "./AgentViewport";
import JourneyGraph from "./JourneyGraph";
import DiagnosticsPanel from "./DiagnosticsPanel";
import TelemetryLog from "./TelemetryLog";
import { CheckCircle2, XCircle, HelpCircle, PlaySquare, FileCheck } from "lucide-react";

export default function ResultsStage({ result, status, activeStep, setActiveStep, goal, url }) {
  const done = status === "done";
  const isQuickScan = result?.quickScanOnly;

  const verdict = done
    ? result.goalCompleted
      ? isQuickScan ? "Scan completed" : "Task completed"
      : result.errored
      ? "Task blocked"
      : "Did not finish"
    : "Replaying real steps...";

  return (
    <div className="flex-1 px-6 py-6 space-y-10 max-w-6xl w-full mx-auto">
      <div className="flex items-center gap-3 bg-panel border border-border rounded-lg px-5 py-4 stage-enter">
        {done ? (
          result.goalCompleted ? (
            <CheckCircle2 size={22} className="text-success shrink-0" />
          ) : (
            <XCircle size={22} className="text-blocker shrink-0" />
          )
        ) : (
          <HelpCircle size={22} className="text-muted shrink-0 animate-pulse" />
        )}
        <div className="min-w-0">
          <div className="font-medium text-sm">{verdict}</div>
          <div className="text-xs text-muted font-mono truncate">{url}{goal ? ` — "${goal}"` : ""}</div>
        </div>
      </div>

      <section className="stage-enter" style={{ animationDelay: "0.08s" }}>
        <div className="flex items-center gap-2 mb-1">
          <PlaySquare size={16} className="text-accent" />
          <h2 className="font-display text-base font-medium">Live Replay</h2>
        </div>
        <p className="text-sm text-muted mb-4 ml-6">What the agent actually saw, and the exact element it acted on, step by step.</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <AgentViewport result={result} status={status} activeStep={activeStep} setActiveStep={setActiveStep} />
          <JourneyGraph result={result} status={status} activeStep={activeStep} setActiveStep={setActiveStep} />
        </div>
      </section>

      <section className="stage-enter" style={{ animationDelay: "0.16s" }}>
        <div className="flex items-center gap-2 mb-1">
          <FileCheck size={16} className="text-accent" />
          <h2 className="font-display text-base font-medium">Audit Report</h2>
        </div>
        <p className="text-sm text-muted mb-4 ml-6">Goal verdict, real accessibility findings, and export.</p>
        <DiagnosticsPanel result={result} status={status} goal={goal} url={url} />
      </section>

      <div className="stage-enter" style={{ animationDelay: "0.24s" }}>
        <TelemetryLog result={result} />
      </div>

      <style>{`
        .stage-enter {
          animation: stageEnter 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes stageEnter {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}