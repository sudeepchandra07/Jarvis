// src/components/DiagnosticsPanel.jsx
import { useState, useEffect } from "react";
import { FileJson, FileText, Accessibility, Flag, AlertTriangle, Users, Wrench, CheckCircle2, XCircle, HelpCircle } from "lucide-react";

const TABS = ["Goal Verdict", "Accessibility", "Export"];

const IMPACT_STYLE = {
  critical: "bg-blocker/15 text-blocker border-blocker/30",
  serious: "bg-blocker/15 text-blocker border-blocker/30",
  moderate: "bg-friction/15 text-friction border-friction/30",
  minor: "bg-accent/15 text-accent border-accent/30",
};

const IMPACT_LABEL = {
  critical: "Critical — blocks real users",
  serious: "Serious — major barrier",
  moderate: "Moderate — noticeable friction",
  minor: "Minor — small improvement",
};

// Plain-language translations for common axe-core rule categories.
// Falls back to a generic explanation built from the rule's own description if no match.
function explainViolation(v) {
  const id = (v.id || "").toLowerCase();
  const title = v.title || "";

  if (id.includes("contrast")) {
    return {
      plain: "Some text on this page is too faint against its background to read comfortably.",
      affects: "People with low vision, color blindness, or anyone using the site in bright light.",
    };
  }
  if (id.includes("label") || id.includes("name-role-value") || id.includes("aria-input")) {
    return {
      plain: "An interactive element (like a button or input field) has no clear name attached to it.",
      affects: "Screen reader users, who hear only 'button' or 'edit text' with no idea what it's for.",
    };
  }
  if (id.includes("alt") || id.includes("image")) {
    return {
      plain: "An image has no text description, so its meaning is lost to anyone who can't see it.",
      affects: "Screen reader users and anyone with images turned off.",
    };
  }
  if (id.includes("heading") || id.includes("landmark") || id.includes("region")) {
    return {
      plain: "The page's structure (headings/sections) isn't marked up clearly, making it hard to navigate by section.",
      affects: "Screen reader users, who rely on headings to jump around a page quickly.",
    };
  }
  if (id.includes("keyboard") || id.includes("focus") || id.includes("tabindex")) {
    return {
      plain: "This element can't be reached or operated using only a keyboard.",
      affects: "Keyboard-only users and anyone who can't use a mouse.",
    };
  }
  if (id.includes("link")) {
    return {
      plain: "A link's text doesn't clearly describe where it goes (e.g. just says 'click here').",
      affects: "Screen reader users, who often scan a list of links out of context.",
    };
  }

  // Generic fallback: simplify the technical description into one plain sentence.
  return {
    plain: title
      ? `This page has an issue described as: "${title}".`
      : "This element doesn't meet an accessibility standard.",
    affects: "People using assistive technology to browse this page.",
  };
}

export default function DiagnosticsPanel({ result, status, goal, url }) {
  const [tab, setTab] = useState(0);
  useEffect(() => setTab(0), [result]);
  const done = status === "done" && result;

  const violations = result?.violations || [];
  const isQuickScan = result?.quickScanOnly;

  const verdict = done
    ? result.goalCompleted
      ? isQuickScan ? "Scan completed" : "Task completed"
      : result.errored
      ? "Task blocked"
      : "Did not finish (step limit reached)"
    : "Pending";

  const verdictExplain = done
    ? isQuickScan
      ? "The agent loaded the page and checked it for accessibility issues — no navigation was requested."
      : result.goalCompleted
      ? "The agent successfully found and completed the requested task on this real website."
      : result.errored
      ? "The agent tried to complete the task but got stuck or hit an error partway through."
      : "The agent took its maximum allowed steps without clearly finishing the task."
    : "Run the audit to see whether the task was completed.";

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const urlObj = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = urlObj;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(urlObj);
  };

  const exportJSON = () => downloadFile(JSON.stringify(result, null, 2), "report.json", "application/json");

  const exportMarkdown = () => {
    const md = `# Audit Report

**Website:** ${url}
**Task:** ${goal || "(none — quick scan only)"}
**Verdict:** ${verdict}
**Summary:** ${verdictExplain}
**Steps taken:** ${result?.stepsTaken}
**Final URL:** ${result?.finalUrl}

## Accessibility Findings
${violations.length === 0 ? "None detected." : violations.map((v) => {
  const { plain, affects } = explainViolation(v);
  return `- [${v.impact.toUpperCase()}] ${v.title}\n  What this means: ${plain}\n  Affects: ${affects}\n  Technical selector: \`${v.selector}\` (${v.wcag})`;
}).join("\n")}
`;
    downloadFile(md, "report.md", "text/markdown");
  };

  return (
        <section className="glass-panel overflow-hidden">
            <div className="flex items-center gap-1 px-3 pt-2 border-b border-border overflow-x-auto bg-panel2/40">
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
            {status === "idle" ? "Run the audit to populate results." : status === "error" ? "Run failed — see error above." : "Working — real steps in progress..."}
          </p>
        )}

        {tab === 0 && (
          <div>
            <div className="flex items-start gap-3 mb-4 p-3 rounded-lg border border-border bg-base">
              {done ? (
                result.goalCompleted ? (
                  <CheckCircle2 size={20} className="text-success shrink-0 mt-0.5" />
                ) : (
                  <XCircle size={20} className="text-blocker shrink-0 mt-0.5" />
                )
              ) : (
                <HelpCircle size={20} className="text-muted shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-medium text-sm">{verdict}</div>
                <p className="text-xs text-muted mt-1 leading-relaxed">{verdictExplain}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-5 text-sm">
              <Badge label="Website" value={url} wide />
              <Badge label="Task" value={goal || "None (quick scan)"} wide />
              <Badge label="Steps Taken" value={done ? result.stepsTaken : "—"} />
              <Badge icon={Accessibility} label="Accessibility Issues Found" value={done ? violations.length : "—"} />
            </div>
          </div>
        )}

        {tab === 1 && (
          <div className="space-y-3">
            {done && violations.length > 0 && (
              <p className="text-xs text-muted pb-1">
                These are real issues found by scanning the actual page. Each one explains what it means and who it affects, with the technical detail underneath for developers.
              </p>
            )}
            {(done ? violations : []).map((v, i) => {
              const { plain, affects } = explainViolation(v);
              return (
                <div key={i} className={`border rounded-lg px-4 py-3 text-sm ${IMPACT_STYLE[v.impact] || IMPACT_STYLE.minor}`}>
                  <div className="flex items-center gap-2 font-medium">
                    <Accessibility size={14} />
                    <span className="text-xs uppercase font-mono">{IMPACT_LABEL[v.impact] || v.impact}</span>
                  </div>
                  <p className="mt-2 text-ink/90 leading-relaxed">{plain}</p>
                  <div className="mt-2 flex items-start gap-1.5 text-xs opacity-80">
                    <Users size={12} className="mt-0.5 shrink-0" />
                    <span><strong>Affects:</strong> {affects}</span>
                  </div>
                  <details className="mt-2">
                    <summary className="text-xs opacity-60 cursor-pointer hover:opacity-100">Technical details</summary>
                    <p className="mt-1 text-xs opacity-70">{v.description}</p>
                    <p className="mt-1 font-mono text-xs opacity-60">selector: {v.selector}</p>
                    <p className="font-mono text-xs opacity-60">standard: {v.wcag}</p>
                  </details>
                </div>
              );
            })}
            {done && violations.length === 0 && (
              <div className="flex items-center gap-2 text-muted text-sm py-4">
                <Accessibility size={16} /> No accessibility issues were found on this page — nice.
              </div>
            )}
            {!done && (
              <div className="flex items-center gap-2 text-muted text-sm py-4">
                <AlertTriangle size={16} /> Run the audit to get a real accessibility check of this page.
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