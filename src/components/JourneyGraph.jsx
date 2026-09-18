// src/components/JourneyGraph.jsx
import { useState, useEffect } from "react";

const POS = {
  n0: { x: 50, y: 8 }, n1: { x: 22, y: 32 }, n2: { x: 22, y: 56 },
  n3: { x: 74, y: 32 }, n4: { x: 74, y: 50 }, n5: { x: 74, y: 68 },
  n6: { x: 74, y: 84 }, n7: { x: 74, y: 97 }, n8: { x: 95, y: 14 },
};

const STATUS_COLOR = {
  success: "#22C55E",
  friction: "#EAB308",
  blocker: "#EF4444",
  unexplored: "#374151",
};

export default function JourneyGraph({ elapsed, run }) {
  const [selected, setSelected] = useState(null);
  useEffect(() => setSelected(null), [run]);

  const nodes = run?.journeyGraph?.nodes || [];
  const edges = run?.journeyGraph?.edges || [];
  const revealed = (id) => {
    const n = nodes.find((n) => n.id === id);
    return n ? elapsed >= n.t : false;
  };

  return (
    <section className="bg-panel border border-border rounded-lg flex flex-col overflow-hidden min-h-[420px]">
      <div className="px-3 py-2 border-b border-border bg-base text-xs font-medium text-muted">
        Interactive Journey Graph
      </div>

      <div className="relative flex-1 m-3">
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          {edges.map((e, i) => {
            if (!revealed(e.to)) return null;
            const a = POS[e.from];
            const b = POS[e.to];
            return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#1F2530" strokeWidth="0.6" />;
          })}
        </svg>

        {nodes.map((n) => {
          const show = revealed(n.id);
          const pos = POS[n.id];
          const color = show ? STATUS_COLOR[n.status] : STATUS_COLOR.unexplored;
          return (
            <button
              key={n.id}
              onClick={() => show && setSelected(n)}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 group"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <span
                className="w-3.5 h-3.5 rounded-full border-2 transition-all duration-500"
                style={{ backgroundColor: show ? color : "transparent", borderColor: color, boxShadow: show ? `0 0 8px ${color}66` : "none" }}
              />
              <span className="text-[9px] font-mono text-muted whitespace-nowrap max-w-[100px] truncate group-hover:text-ink">
                {show ? n.label : "···"}
              </span>
            </button>
          );
        })}

        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-muted text-sm">
            Graph will populate once the audit runs
          </div>
        )}
      </div>

      {selected && (
        <div className="border-t border-border bg-base px-3 py-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="font-medium">{selected.label}</span>
            <button onClick={() => setSelected(null)} className="text-muted hover:text-ink">✕</button>
          </div>
          <span className="text-muted font-mono">status: {selected.status} · branch: {selected.path || "root"}</span>
        </div>
      )}
    </section>
  );
}