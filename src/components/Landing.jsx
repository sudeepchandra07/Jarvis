// src/components/Landing.jsx
import { useState, useEffect } from "react";
import { Eye, GitBranch, ShieldCheck, Terminal, ArrowRight, Check, X } from "lucide-react";
import Tilt3D from "./Tilt3D";

const SEQUENCE = [
  { n: "01", title: "Observe", detail: "Captures the rendered screenshot and the accessibility tree — the same two things a person or a screen reader relies on." },
  { n: "02", title: "Decide", detail: "A language model reasons over the real page content and the stated task, then chooses exactly one next action." },
  { n: "03", title: "Act", detail: "Dispatches a real click or keystroke through an actual browser — no code injected, nothing simulated." },
  { n: "04", title: "Verify", detail: "Checks whether the page moved toward the goal, then scans the result for real accessibility violations." },
];

const LOG_LINES = [
  { t: "0.0s", k: "OBSERVE", v: "viewport + a11y tree captured", c: "text-accent" },
  { t: "1.2s", k: "DECIDE", v: 'target: "Learn more" link, index 3', c: "text-accent2" },
  { t: "2.4s", k: "ACT", v: "click(x: 212, y: 318)", c: "text-friction" },
  { t: "3.1s", k: "VERIFY", v: "navigation confirmed → /help/example-domains", c: "text-success" },
];

const COMPARISON = [
  { trad: "Breaks when the UI changes slightly", jarvis: "Adapts, because it reasons about what it sees" },
  { trad: "Checks if the script ran, not if a user could", jarvis: "Checks if a real goal was actually reached" },
  { trad: "Blind to screen readers and assistive tech", jarvis: "Reads the same accessibility tree they rely on" },
  { trad: "Reports a selector and a rule code", jarvis: "Reports what happens to a real person, in plain words" },
];

function LiveLog() {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    setVisible(0);
    const interval = setInterval(() => {
      setVisible((v) => {
        if (v >= LOG_LINES.length) {
          clearInterval(interval);
          setTimeout(() => setVisible(0), 1800);
          return v;
        }
        return v + 1;
      });
    }, 950);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-5 font-mono text-sm space-y-2.5 min-h-[168px]">
      {LOG_LINES.slice(0, visible).map((line, i) => (
        <div key={i} className="flex gap-3 log-line-in">
          <span className="text-muted shrink-0 w-10">{line.t}</span>
          <span className={`${line.c} shrink-0 w-16`}>{line.k}</span>
          <span className="text-ink/80">{line.v}</span>
        </div>
      ))}
      {visible >= LOG_LINES.length && (
        <div className="flex gap-3 pt-1 log-line-in">
          <span className="text-muted w-10" />
          <span className="text-success w-16">DONE</span>
          <span className="text-ink/80">task completed in 4 real steps</span>
        </div>
      )}
    </div>
  );
}

export default function Landing({ onLaunch }) {
  return (
    <div className="min-h-screen text-ink font-sans relative" style={{ zIndex: 1 }}>
      <nav className="border-b border-border px-6 py-5 flex items-center justify-between max-w-6xl mx-auto relative">
        <span className="font-display font-semibold text-lg tracking-tight">JARVIS</span>
        <span className="text-sm text-muted hidden sm:inline">Autonomous UI/UX &amp; accessibility testing</span>
      </nav>

      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 grid lg:grid-cols-[1.1fr_1fr] gap-16 items-center relative">
        <div>
          <h1 className="font-display text-[2.9rem] md:text-5xl font-semibold leading-[1.06] tracking-tight mb-6 max-w-lg bg-gradient-to-br from-ink to-ink/70 bg-clip-text text-transparent">
            An agent that uses your product the way a real person would.
          </h1>
          <p className="text-muted text-base leading-relaxed max-w-md mb-10">
            Give it a website and a task in plain English. It browses the real page, decides what
            to click, and reports exactly where a human — or someone on assistive technology —
            would get stuck.
          </p>
          <button
            onClick={onLaunch}
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-accent to-accent2 hover:brightness-110 text-white font-medium text-sm pl-6 pr-5 py-3 rounded-md transition-all shadow-[0_0_24px_-6px_rgba(79,142,247,0.5)]"
          >
            Open the dashboard
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        <Tilt3D intensity={6} className="relative bg-panel border border-border rounded-lg overflow-hidden shadow-[0_0_40px_-12px_rgba(79,142,247,0.25)]">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
            <span className="w-2.5 h-2.5 rounded-full bg-blocker/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-friction/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-success/60" />
            <span className="ml-2 text-xs text-muted font-mono flex items-center gap-1.5">
              <Terminal size={12} /> agent_run.log
            </span>
          </div>
          <LiveLog />
        </Tilt3D>
      </section>

      <section className="border-t border-border relative">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="font-display text-2xl font-semibold mb-2 max-w-md">
            Every run follows the same loop, visible the whole way through.
          </h2>
          <p className="text-muted text-sm mb-14 max-w-md">
            Four stages, repeated for each action the agent takes, on every real page it visits.
          </p>

          <div className="relative grid md:grid-cols-4 gap-x-8 gap-y-10">
            <div className="hidden md:block absolute top-[7px] left-[6%] right-[6%] h-px bg-gradient-to-r from-accent via-accent2 to-success opacity-40" />
            {SEQUENCE.map((step) => (
              <div key={step.n} className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-3.5 h-3.5 rounded-full bg-base border-2 border-accent shrink-0 relative z-10" />
                  <span className="font-mono text-xs text-muted">{step.n}</span>
                </div>
                <h3 className="font-display font-medium text-base mb-2">{step.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{step.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border relative">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="font-display text-2xl font-semibold mb-14 max-w-md">
            What changes when testing reasons instead of scripts.
          </h2>
          <div className="grid md:grid-cols-2 gap-px bg-border rounded-lg overflow-hidden border border-border backdrop-blur-sm">
            <div className="bg-base/60 p-6 space-y-5">
              <span className="text-xs font-mono text-muted uppercase tracking-wide">Traditional testing</span>
              {COMPARISON.map((row, i) => (
                <div key={i} className="flex items-start gap-3">
                  <X size={16} className="text-blocker shrink-0 mt-0.5" />
                  <p className="text-sm text-ink/80">{row.trad}</p>
                </div>
              ))}
            </div>
            <div className="bg-panel/60 p-6 space-y-5">
              <span className="text-xs font-mono text-accent uppercase tracking-wide">JARVIS</span>
              {COMPARISON.map((row, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check size={16} className="text-success shrink-0 mt-0.5" />
                  <p className="text-sm text-ink">{row.jarvis}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border relative">
        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-10">
          <Principle icon={Eye} title="Sees what a user sees" text="No embedded scripts, no test hooks. Only the rendered page and the accessibility tree." />
          <Principle icon={GitBranch} title="Reasons, doesn't script" text="Every click is a real decision made by a language model reading the actual page." />
          <Principle icon={ShieldCheck} title="Reports plainly" text="Findings explain what happens to a real person, not just a selector and a rule ID." />
        </div>
      </section>

      <section className="border-t border-border relative">
        <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col items-start gap-6">
          <h2 className="font-display text-2xl font-semibold max-w-md">
            Point it at anything you're building.
          </h2>
          <button
            onClick={onLaunch}
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-accent to-accent2 hover:brightness-110 text-white font-medium text-sm pl-6 pr-5 py-3 rounded-md transition-all shadow-[0_0_24px_-6px_rgba(79,142,247,0.5)]"
          >
            Open the dashboard
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </section>

      <style>{`
        .log-line-in {
          animation: logLineIn 0.35s ease-out;
        }
        @keyframes logLineIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function Principle({ icon: Icon, title, text }) {
  return (
    <div className="relative">
      <Icon size={18} className="text-accent mb-3" />
      <h3 className="font-medium text-sm mb-1.5">{title}</h3>
      <p className="text-sm text-muted leading-relaxed">{text}</p>
    </div>
  );
}