// src/components/Landing.jsx
import { Bot, Eye, GitBranch, ShieldCheck, ArrowRight, Zap } from "lucide-react";

export default function Landing({ onLaunch }) {
  return (
    <div className="min-h-screen bg-base text-ink font-sans">
      <nav className="border-b border-border px-6 py-4 flex items-center gap-2">
        <Bot size={22} className="text-accent" />
        <span className="font-semibold tracking-tight">JARVIS</span>
      </nav>

      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <span className="inline-block text-xs font-mono text-accent bg-accent/10 border border-accent/30 rounded-full px-3 py-1 mb-6">
          Autonomous Black-Box UI/UX &amp; Accessibility Testing
        </span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5 leading-tight">
          Meet <span className="text-accent">JARVIS</span> — an agent that tests<br />your product like a real user would.
        </h1>
        <p className="text-muted text-lg max-w-2xl mx-auto mb-9">
          Give it a goal in plain English. It clicks, types, and scrolls through your live
          UI — no code injected, no test hooks — and tells you exactly where a real person
          would get stuck, and where assistive technology users hit a wall.
        </p>
        <button
          onClick={onLaunch}
          className="inline-flex items-center gap-2 bg-accent hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
        >
          Launch JARVIS <ArrowRight size={18} />
        </button>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-5">
        <FeatureCard
          icon={Eye}
          title="Sees like a human"
          text="Reads only the rendered screenshot and the accessibility tree — the same two things a person or a screen reader relies on."
        />
        <FeatureCard
          icon={GitBranch}
          title="Explores, doesn't script"
          text="When one path fails (a dead button, a broken filter) it backtracks and tries a different route on its own — just like a frustrated user would."
        />
        <FeatureCard
          icon={ShieldCheck}
          title="Flags what matters"
          text="Every friction point and WCAG violation comes with a plain-English explanation of who it affects and how to fix it — not just a code."
        />
      </section>

      <section className="border-t border-border">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <h2 className="text-sm font-semibold text-muted mb-4 flex items-center gap-2">
            <Zap size={14} className="text-accent" /> How to read the demo
          </h2>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <LegendItem color="bg-success" label="Green" text="Smooth, low-friction path a user completed easily." />
            <LegendItem color="bg-friction" label="Amber" text="Completed, but the user hit friction or a minor a11y issue." />
            <LegendItem color="bg-blocker" label="Red" text="Dead end, loop, or a blocker that stops real users." />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, text }) {
  return (
    <div className="bg-panel border border-border rounded-lg p-5">
      <Icon size={20} className="text-accent mb-3" />
      <h3 className="font-medium mb-1.5">{title}</h3>
      <p className="text-sm text-muted leading-relaxed">{text}</p>
    </div>
  );
}

function LegendItem({ color, label, text }) {
  return (
    <div className="flex gap-2.5">
      <span className={`w-3 h-3 rounded-full ${color} mt-1 shrink-0`} />
      <div>
        <span className="font-medium">{label}</span>
        <p className="text-muted">{text}</p>
      </div>
    </div>
  );
}