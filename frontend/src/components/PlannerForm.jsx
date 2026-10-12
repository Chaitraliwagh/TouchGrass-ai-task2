import { useState } from "react";

export const OPTIONS = {
  time: ["15 minutes", "30 minutes", "1 hour", "2 hours", "Half day"],
  difficulty: ["Easy", "Moderate", "Challenging"],
  company: ["Alone", "With Friends", "With Family", "With Partner"],
  mood: ["Relaxing", "Adventurous", "Social", "Active", "Creative", "Curious"],
  interest: ["Nature", "Walking", "Photography", "Fitness", "Observation", "Exploring", "Games"],
};

const FIELDS = [
  ["time", "How much time do you have?"],
  ["difficulty", "How hard should it be?"],
  ["company", "Who is coming?"],
  ["mood", "What's your mood?"],
  ["interest", "What are you into?"],
];

const pick = (list) => list[Math.floor(Math.random() * list.length)];

export default function PlannerForm({ onSubmit, error, initial }) {
  const [values, setValues] = useState(initial || { environment: "" });
  const [missing, setMissing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (FIELDS.some(([key]) => !values[key])) return setMissing(true);
    setMissing(false);
    onSubmit(values);
  };

  const surprise = () => {
    onSubmit({
      time: pick(OPTIONS.time), difficulty: pick(OPTIONS.difficulty), company: pick(OPTIONS.company),
      mood: pick(OPTIONS.mood), interest: pick(OPTIONS.interest), environment: "",
    });
  };

  return (
    <main className="mx-auto max-w-2xl px-5 py-10">
      <h2 className="text-3xl font-extrabold text-moss-900">Plan your outing</h2>
      <p className="mt-2">Five quick choices, then you’re done with the screen.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
        {FIELDS.map(([key, label]) => (
          <fieldset key={key} className="panel">
            <legend className="px-1 font-display text-lg font-bold text-moss-900">{label}</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {OPTIONS[key].map((opt) => {
                const active = values[key] === opt;
                return (
                  <button
                    type="button" key={opt} aria-pressed={active}
                    onClick={() => setValues({ ...values, [key]: opt })}
                    className={`rounded-full border-2 px-4 py-2 font-medium transition ${
                      active ? "border-moss-700 bg-moss-700 text-white" : "border-moss-200 bg-white hover:border-moss-500"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}

        <div className="panel">
          <label htmlFor="env" className="font-display text-lg font-bold text-moss-900">Where? <span className="font-body text-sm font-normal">(optional)</span></label>
          <input
            id="env" type="text" maxLength={80} value={values.environment}
            onChange={(e) => setValues({ ...values, environment: e.target.value })}
            placeholder="Park, neighborhood, garden, trail, anywhere outdoors"
            className="mt-2 w-full rounded-xl border-2 border-moss-200 px-4 py-3 focus:border-moss-500"
          />
        </div>

        {(missing || error) && (
          <p role="alert" className="rounded-2xl bg-amber-50 p-4 text-amber-900 ring-1 ring-amber-200">
            {missing ? "Please pick one option in every question above." : error}
          </p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="submit" className="btn-primary flex-1">Generate My Plan 🌱</button>
          <button type="button" onClick={surprise} className="btn-secondary">Surprise Me 🌿</button>
        </div>
      </form>
    </main>
  );
}
