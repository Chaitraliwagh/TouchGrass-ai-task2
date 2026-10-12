import { useState } from "react";
import { planToText } from "../services/plan.js";

function Section({ icon, title, children }) {
  return (
    <section className="panel">
      <h3 className="text-lg font-bold text-moss-900"><span aria-hidden="true">{icon}</span> {title}</h3>
      <div className="mt-2 leading-relaxed">{children}</div>
    </section>
  );
}

export default function ActivityCard({ plan, onGoOutside, onRetry }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(planToText(plan));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.alert("Copy is not available in this browser. Try Download or Print instead.");
    }
  };

  const download = () => {
    const blob = new Blob([planToText(plan)], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `touchgrass-${plan.activity_name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="pop mx-auto max-w-2xl space-y-4 px-5 py-10">
      <header className="rounded-3xl bg-moss-700 p-6 text-white shadow-md">
        <p className="text-sm text-moss-100">Your outdoor activity</p>
        <h2 className="mt-1 text-3xl font-extrabold">🌱 {plan.activity_name}</h2>
        {plan.description && <p className="mt-3 text-moss-50">{plan.description}</p>}
        <div className="mt-4 flex flex-wrap gap-2 text-sm font-semibold">
          <span className="rounded-full bg-white/15 px-3 py-1">⏱ {plan.duration}</span>
          <span className="rounded-full bg-white/15 px-3 py-1">🎯 {plan.difficulty}</span>
          {plan.company && <span className="rounded-full bg-white/15 px-3 py-1">👥 {plan.company}</span>}
        </div>
      </header>

      {plan.why && <Section icon="💭" title="Why this suits you"><p>{plan.why}</p></Section>}

      {plan.what_to_carry.length > 0 && (
        <Section icon="🎒" title="What to carry">
          <ul className="list-disc space-y-1 pl-5">{plan.what_to_carry.map((i) => <li key={i}>{i}</li>)}</ul>
        </Section>
      )}

      <Section icon="📝" title="Steps">
        <ol className="list-decimal space-y-2 pl-5">{plan.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
      </Section>

      <section className="rounded-3xl border-2 border-sun bg-amber-50 p-5 sm:p-6">
        <h3 className="text-lg font-bold text-moss-900"><span aria-hidden="true">🌿</span> Screen-Off Challenge</h3>
        <p className="mt-2 text-lg leading-relaxed">{plan.offline_challenge}</p>
        <p className="mt-3"><span aria-hidden="true">📵</span> <strong>Screen-off goal:</strong> {plan.screen_off_goal}</p>
      </section>

      <Section icon="⚠️" title="Safety reminder">
        <p>{plan.safety}</p>
        <p className="mt-2 text-sm">TouchGrass AI is not a professional outdoor safety expert. Use your own judgment and follow local rules.</p>
      </Section>

      <div className="no-print space-y-4 pt-2">
        <button className="btn-primary w-full text-xl" onClick={onGoOutside}>I’m Going Outside 🌱</button>
        <div className="grid grid-cols-3 gap-2">
          <button className="btn-secondary" onClick={() => window.print()}>Print</button>
          <button className="btn-secondary" onClick={download}>Download</button>
          <button className="btn-secondary" onClick={copy}>{copied ? "Copied ✓" : "Copy"}</button>
        </div>
        <button className="block w-full text-center text-sm font-medium text-moss-700 underline" onClick={onRetry}>Try Another Plan</button>
      </div>
    </main>
  );
}
