// src/components/TelemetryLog.jsx
import { useState } from "react";
import { ChevronDown, ChevronUp, Terminal } from "lucide-react";

export default function TelemetryLog({ result }) {
  const [open, setOpen] = useState(false);
  const history = result?.history || [];

  return (
    <div className="glass-panel overflow-hidden">
      <button onClick={() => setOpen((o) => !o)} className="w-full panel-header hover:text-ink transition-colors">
        <Terminal size={12} />
        Raw telemetry ({history.length})
        {open ? <ChevronUp size={12} className="ml-auto" /> : <ChevronDown size={12} className="ml-auto" />}
      </button>
      {open && (
        <div className="max-h-32 overflow-y-auto px-4 py-3 font-mono text-xs space-y-1">
          {history.length === 0 && <p className="text-muted py-2">No events yet.</p>}
          {history.map((h, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-muted shrink-0">[{i + 1}]</span>
              <span className="text-accent shrink-0 font-medium uppercase">[{h.action}]</span>
              <span className="text-ink/70 truncate">{h.reasoning}{h.error ? ` — ERROR: ${h.error}` : ""}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}