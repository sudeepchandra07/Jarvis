// src/components/TelemetryLog.jsx
import { useState } from "react";
import { ChevronDown, ChevronUp, Terminal } from "lucide-react";

const TYPE_COLOR = {
  SYS: "text-muted",
  ACT: "text-accent",
  VER: "text-success",
  A11Y: "text-friction",
};

export default function TelemetryLog({ visibleEvents }) {
  const [open, setOpen] = useState(true);
  const logs = visibleEvents.filter((e) => e.log);

  return (
    <div className="border-t border-border bg-base">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-muted hover:text-ink"
      >
        <Terminal size={12} />
        Telemetry Log ({logs.length})
        {open ? <ChevronUp size={12} className="ml-auto" /> : <ChevronDown size={12} className="ml-auto" />}
      </button>
      {open && (
        <div className="max-h-28 overflow-y-auto px-3 pb-2 font-mono text-xs space-y-0.5">
          {logs.length === 0 && <p className="text-muted py-2">No events yet — run the audit.</p>}
          {logs.map((e, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-muted shrink-0">[{e.t.toFixed(1)}s]</span>
              <span className={`shrink-0 font-medium ${TYPE_COLOR[e.log.type] || "text-ink"}`}>[{e.log.type}]</span>
              <span className="text-ink/80 truncate">{e.log.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}