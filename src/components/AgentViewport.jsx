// src/components/AgentViewport.jsx
import { MousePointer2 } from "lucide-react";
import ThoughtStream from "./ThoughtStream";

export default function AgentViewport({ current, elapsed, run }) {
  const screens = run?.screens || [];
  const screen = [...screens].reverse().find((s) => s.from <= elapsed) || screens[0];
  const cursor = current?.cursor
    ? { x: (current.cursor.x / 1280) * 100, y: (current.cursor.y / 720) * 100 }
    : { x: 50, y: 5 };
  const isTyping = current?.action?.type === "TYPE";
  const isClicking = current?.action?.type === "CLICK";

  return (
    <section className="bg-panel border border-border rounded-lg flex flex-col overflow-hidden min-h-[420px]">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-base">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blocker/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-friction/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-success/60" />
        </div>
        <div className="flex-1 text-xs font-mono text-muted bg-panel border border-border rounded px-2 py-1 truncate">
          {screen?.title || "Awaiting session..."}
        </div>
      </div>

      <div className="relative flex-1 bg-[#0D1117] m-3 rounded border border-border overflow-hidden">
        {screen?.elements.map((el) => (
          <div
            key={el.id}
            className={`absolute border rounded-sm transition-all duration-500 ${
              el.flagged ? "border-blocker/70 bg-blocker/10" : "border-accent/40 bg-accent/5"
            }`}
            style={{ left: `${el.box.x}%`, top: `${el.box.y}%`, width: `${el.box.w}%`, height: `${el.box.h}%` }}
          >
            <span
              className={`absolute -top-4 left-0 text-[9px] font-mono px-1 rounded-sm whitespace-nowrap ${
                el.flagged ? "bg-blocker text-white" : "bg-accent text-white"
              }`}
            >
              [{el.id}: {el.label}]
            </span>
          </div>
        ))}

        {current && (
          <div
            className="absolute z-10 transition-all duration-500 ease-out -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${cursor.x}%`, top: `${cursor.y}%` }}
          >
            {isClicking && <span className="absolute inset-0 -m-2 rounded-full bg-accent/40 animate-ping" />}
            <MousePointer2 size={18} className="text-white drop-shadow-[0_0_4px_rgba(59,130,246,0.9)]" fill="white" />
            {isTyping && (
              <span className="absolute left-5 top-0 text-[10px] font-mono bg-accent text-white px-1.5 py-0.5 rounded whitespace-nowrap">
                typing "{current.action.text}"
              </span>
            )}
          </div>
        )}

        {!current && (
          <div className="absolute inset-0 flex items-center justify-center text-muted text-sm text-center px-6">
            Enter a target URL and goal above, then press "Run Autonomous Audit" to begin session
          </div>
        )}
      </div>

      <ThoughtStream current={current} />
    </section>
  );
}