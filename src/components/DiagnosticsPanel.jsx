// src/components/DiagnosticsPanel.jsx
import { useState, useEffect } from "react";
import { FileJson, FileText, Accessibility, Users, Wrench, Flag, AlertTriangle } from "lucide-react";

const TABS = ["Goal Verdict", "Accessibility", "Export"];

const IMPACT_STYLE = {
  critical: "bg-blocker/15 text-blocker border-blocker/30",
  serious: "bg-blocker/15 text-blocker border-blocker/30",
  moderate: "bg-friction/15 text-friction border-friction/30",
  minor: "bg-accent/15 text-accent border-accent/30",
};

export default function DiagnosticsPanel({ result, status, goal, url }) {
  const [tab, setTab] = useState(0);
  useEffect(() => setTab(0), [result]);
  const done = status === "done" && result;

  const violations = result?.violations || [];
  const verdict = done
    ? result.goalCompleted ? "Completed" : result.errored ? "Blocked" : "Incomplete (step limit reached)"
    : "Pending";

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const urlObj = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = urlObj;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(urlObj);
  };

  const exportJSON = () => downloadFile(JSON.stringify(result, null, 2), "agent-run-report.json", "application/json");

  const exportMarkdown = () => {
    const md = `# Real Agent Run Report

**Goal:** ${goal}
**Target:** ${url}
**Verdict:** ${verdict}
**Steps taken:** ${result?.stepsTaken}
**Final URL:** ${result?.finalUrl}

## Action History
${(result?.history || []).map((h, i) => `${i + 1}. **${h.action}**${h.index != null ? ` on [${h.index}]` : ""}${h.text ? ` — "${h.text}"` : ""} — ${h.reasoning}${h.error ? ` (ERROR: ${h.error})` : ""}`).join("\n")}

## Accessibility Findings (real, axe-core)
${violations.length === 0 ? "None detected." : violations.map((v) => `- [${v.impact.toUpperCase()}] ${v.wcag} — ${v.title}\n  Selector: \`${v.selector}\``).join("\n")}
`;
    downloadFile(md, "agent-run-report.md", "text/markdown");
  };

  return (
    <section className="border-t border-border bg-panel">
      <div className="flex items-center gap-1 px-3 pt-2 border-b border-border overflow-x-auto">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`text-sm px-3.5 py-2 rounded-t-md border-b-2 whitespace-nowrap transition-colors ${
              tab === i ? "border-accent text-ink bg-base" : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="p-4 max-h-80 overflow-y-auto">
        {!done && (
          <p className="text-sm text-muted font-mono mb-3">
            {status === "idle" ? "Run the agent to populate real results." : status === "running" ? "Agent is working — real steps in progress..." : "Run failed — see error above."}
          </p>
        )}

        {tab === 0 && (
          <div className="flex flex-wrap gap-5 text-sm">
            <Badge icon={Flag} label="Verdict" value={done ? verdict : "Pending"} />
            <Badge label="Steps Taken" value={done ? result.stepsTaken : "—"} />
            <Badge label="Goal" value={goal} wide />
            <Badge label="A11y Violations (real)" value={done ? violations.length : "—"} />
          </div>
        )}

        {tab === 1 && (
          <div className="space-y-3">
            {(done ? violations : []).map((v, i) => (
              <div key={i} className={`border rounded-lg px-4 py-3 text-sm ${IMPACT_STYLE[v.impact] || IMPACT_STYLE.minor}`}>
                <div className="flex items-center gap-2 font-medium">
                  <Accessibility size={14} /> {v.title}
                  <span className="ml-auto font-mono text-xs opacity-70">{v.wcag}</span>
                </div>
                <p className="mt-2 text-ink/80 text-xs leading-relaxed">{v.description}</p>
                <p className="mt-2 font-mono text-xs opacity-60">selector: {v.selector}</p>
              </div>
            ))}
            {done && violations.length === 0 && (
              <div className="flex items-center gap-2 text-muted text-sm py-4">
                <Accessibility size={16} /> No violations detected by axe-core on the final page.
              </div>
            )}
            {!done && (
              <div className="flex items-center gap-2 text-muted text-sm py-4">
                <AlertTriangle size={16} /> Run the agent to get a real axe-core scan of the final page state.
              </div>
            )}
          </div>
        )}

        {tab === 2 && (
          <div className="flex gap-3">
            <button onClick={exportJSON} disabled={!done} className="flex items-center gap-2 bg-base border border-border hover:border-accent disabled:opacity-40 disabled:cursor-not-allowed text-sm px-4 py-2.5 rounded">
              <FileJson size={15} /> Export as JSON
            </button>
            <button onClick={exportMarkdown} disabled={!done} className="flex items-center gap-2 bg-base border border-border hover:border-accent disabled:opacity-40 disabled:cursor-not-allowed text-sm px-4 py-2.5 rounded">
              <FileText size={15} /> Export as Markdown
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function Badge({ icon: Icon, label, value, wide }) {
  return (
    <div className={`flex flex-col ${wide ? "max-w-xs" : ""}`}>
      <span className="text-muted text-xs flex items-center gap-1">{Icon && <Icon size={11} />} {label}</span>
      <span className="font-mono font-medium truncate">{value}</span>
    </div>
  );
}