// src/components/TelemetryLog.jsx
import { useState } from "react";
import { ChevronDown, ChevronUp, Terminal } from "lucide-react";

export default function TelemetryLog({ result }) {
  const [open, setOpen] = useState(true);
  const history = result?.history || [];

  return (
    <div className="border-t border-border bg-base">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-muted hover:text-ink">
        <Terminal size={12} />
        Real Telemetry Log ({history.length})
        {open ? <ChevronUp size={12} className="ml-auto" /> : <ChevronDown size={12} className="ml-auto" />}
      </button>
      {open && (
        <div className="max-h-28 overflow-y-auto px-3 pb-2 font-mono text-xs space-y-0.5">
          {history.length === 0 && <p className="text-muted py-2">No events yet — run the agent.</p>}
          {history.map((h, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-muted shrink-0">[step {i + 1}]</span>
              <span className="text-accent shrink-0 font-medium uppercase">[{h.action}]</span>
              <span className="text-ink/80 truncate">{h.reasoning}{h.error ? ` — ERROR: ${h.error}` : ""}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}