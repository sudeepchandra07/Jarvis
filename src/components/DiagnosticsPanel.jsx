// src/components/DiagnosticsPanel.jsx
import { useState, useEffect } from "react";
import { FileJson, FileText, MousePointerClick, Accessibility, ListChecks, Users, Wrench } from "lucide-react";

const TABS = ["Goal Verdict", "UX Friction", "Accessibility", "Export"];

const SEVERITY_STYLE = {
  critical: "bg-blocker/15 text-blocker border-blocker/30",
  high: "bg-friction/15 text-friction border-friction/30",
  medium: "bg-accent/15 text-accent border-accent/30",
};

export default function DiagnosticsPanel({ elapsed, status, run, runEnd }) {
  const [tab, setTab] = useState(0);
  useEffect(() => setTab(0), [run]);
  const done = status === "done" && run;

  const pathComparison = run?.pathComparison || [];
  const uxFindings = run?.uxFindings || [];
  const a11yFindings = run?.a11yFindings || [];
  const summary = run?.summary;
  const goalSpec = run?.goalSpec;

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    downloadFile(JSON.stringify({ goalSpec, summary, pathComparison, uxFindings, a11yFindings }, null, 2), "audit-report.json", "application/json");
  };

  const exportMarkdown = () => {
    const md = `# Audit Report — ${goalSpec?.raw}

**Verdict:** ${summary?.verdict}
**Paths explored:** ${summary?.pathsExplored} · **Blocked:** ${summary?.pathsBlocked} · **Total steps:** ${summary?.totalSteps} · **Time:** ${summary?.totalTime}

## Path Comparison
${pathComparison.map((p) => `- **${p.path}** — ${p.steps} steps, ${p.time}, friction ${p.frictionScore ?? "—"}, verdict: ${p.verdict}. ${p.detail}`).join("\n")}

## UX Friction Findings
${uxFindings.map((f) => `- [${f.severity.toUpperCase()}] ${f.title}\n  What happens: ${f.plain}\n  (${f.coords}, ${f.timestamp})`).join("\n")}

## Accessibility Audit (WCAG 2.1)
${a11yFindings.map((f) => `- [${f.severity.toUpperCase()}] ${f.wcag} — ${f.title}\n  What happens: ${f.plain}\n  Affects: ${f.affects}\n  Selector: \`${f.selector}\`\n  Fix: ${f.fix}`).join("\n")}
`;
    downloadFile(md, "audit-report.md", "text/markdown");
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
            {status === "idle" ? "Run the audit to populate diagnostics." : `Run in progress — ${elapsed.toFixed(1)}s / ${runEnd.toFixed(1)}s`}
          </p>
        )}

        {tab === 0 && (
          <div>
            <div className="flex flex-wrap gap-5 mb-4 text-sm">
              <Badge label="Verdict" value={done ? summary.verdict : "Pending"} />
              <Badge label="Paths Explored" value={done ? summary.pathsExplored : "—"} />
              <Badge label="Blocked" value={done ? summary.pathsBlocked : "—"} />
              <Badge label="A11y Violations" value={done ? summary.a11yViolations : "—"} />
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted text-left border-b border-border">
                  <th className="py-2 font-medium">Path</th>
                  <th className="font-medium">Steps</th>
                  <th className="font-medium">Time</th>
                  <th className="font-medium">Friction</th>
                  <th className="font-medium">Verdict</th>
                </tr>
              </thead>
              <tbody>
                {(done ? pathComparison : []).map((p) => (
                  <tr key={p.path} className="border-b border-border/50 align-top">
                    <td className="py-2.5 pr-2">
                      <div className="font-medium">{p.path}</div>
                      <div className="text-muted text-xs mt-0.5">{p.detail}</div>
                    </td>
                    <td className="font-mono">{p.steps}</td>
                    <td className="font-mono">{p.time}</td>
                    <td className="font-mono">{p.frictionScore ?? "—"}</td>
                    <td>
                      <span className={p.verdict.startsWith("Passed") ? "text-success" : p.verdict === "Blocked" ? "text-blocker" : "text-muted"}>
                        {p.verdict}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 1 && (
          <div className="space-y-3">
            {(done ? uxFindings : []).map((f, i) => (
              <div key={i} className={`border rounded-lg px-4 py-3 text-sm ${SEVERITY_STYLE[f.severity] || SEVERITY_STYLE.medium}`}>
                <div className="flex items-center gap-2 font-medium">
                  <MousePointerClick size={14} /> {f.title}
                  <span className="ml-auto font-mono text-xs opacity-70">{f.timestamp}</span>
                </div>
                <p className="mt-2 text-ink/90 leading-relaxed">{f.plain}</p>
                <p className="mt-2 font-mono text-xs opacity-60">technical: {f.detail} (coords: {f.coords})</p>
              </div>
            ))}
            {done && uxFindings.length === 0 && <EmptyState icon={ListChecks} text="No UX friction detected." />}
          </div>
        )}

        {tab === 2 && (
          <div className="space-y-3">
            {(done ? a11yFindings : []).map((f, i) => (
              <div key={i} className={`border rounded-lg px-4 py-3 text-sm ${SEVERITY_STYLE[f.severity]}`}>
                <div className="flex items-center gap-2 font-medium">
                  <Accessibility size={14} /> {f.title}
                  <span className="ml-auto font-mono text-xs opacity-70">{f.wcag}</span>
                </div>
                <p className="mt-2 text-ink/90 leading-relaxed">{f.plain}</p>
                <div className="mt-2.5 flex items-start gap-1.5 text-xs opacity-80">
                  <Users size={12} className="mt-0.5 shrink-0" /><span><strong>Affects:</strong> {f.affects}</span>
                </div>
                <div className="mt-1.5 flex items-start gap-1.5 text-xs text-success/90">
                  <Wrench size={12} className="mt-0.5 shrink-0" /><span><strong>Fix:</strong> {f.fix}</span>
                </div>
                <p className="mt-2 font-mono text-xs opacity-50">selector: {f.selector}</p>
              </div>
            ))}
            {done && a11yFindings.length === 0 && <EmptyState icon={Accessibility} text="No accessibility violations found." />}
          </div>
        )}

        {tab === 3 && (
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

function Badge({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-muted text-xs">{label}</span>
      <span className="font-mono font-medium">{value}</span>
    </div>
  );
}

function EmptyState({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-2 text-muted text-sm py-4">
      <Icon size={16} /> {text}
    </div>
  );
}