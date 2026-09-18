// src/components/ThoughtStream.jsx
import { Brain } from "lucide-react";

export default function ThoughtStream({ current }) {
  return (
    <div className="border-t border-border bg-base px-3 py-2 flex items-start gap-2">
      <Brain size={14} className="text-accent mt-0.5 shrink-0" />
      <p className="text-xs font-mono text-ink leading-relaxed">
        <span className="text-muted">Thought: </span>
        {current ? `"${current.thought}"` : "Awaiting run..."}
      </p>
    </div>
  );
}