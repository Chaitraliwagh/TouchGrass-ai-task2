import { useState } from "react";

const ITEMS = ["Water packed", "Comfortable shoes", "Activity plan saved", "Phone away"];

export default function GoingOutside({ plan }) {
  const [checked, setChecked] = useState([]);
  const toggle = (item) =>
    setChecked((c) => (c.includes(item) ? c.filter((x) => x !== item) : [...c, item]));

  return (
    <main className="pop mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12 text-center">
      <p className="text-6xl" aria-hidden="true">🌳</p>
      <h2 className="mt-6 text-3xl font-extrabold leading-snug text-moss-900">Your plan is ready.</h2>
      <p className="mt-4 text-2xl font-semibold leading-snug text-moss-700">
        Now close this screen.<br />Step outside.<br />Enjoy the real world.
      </p>
      <p className="mt-4">Today: <strong>{plan.activity_name}</strong></p>

      <ul className="panel mt-8 space-y-3 text-left text-lg">
        {ITEMS.map((item) => (
          <li key={item}>
            <label className="flex cursor-pointer items-center gap-3">
              <input type="checkbox" className="h-6 w-6 accent-moss-700" checked={checked.includes(item)} onChange={() => toggle(item)} />
              <span className={checked.includes(item) ? "line-through opacity-60" : ""}>{item}</span>
            </label>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-xl font-semibold text-moss-900">Have fun. See you later.</p>
    </main>
  );
}
