export default function LandingPage({ onStart }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-16">
      <span className="sway text-6xl" aria-hidden="true">🌱</span>
      <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-moss-900 sm:text-6xl">TouchGrass AI 🌱</h1>
      <p className="mt-4 font-display text-2xl font-semibold text-moss-700">AI plans your outdoor escape. You go live it.</p>
      <p className="mt-5 max-w-xl text-lg leading-relaxed">
        Tell us how much time you have and what kind of experience you want. We’ll create a simple outdoor plan — then it’s time to put the phone down.
      </p>
      <div className="mt-10">
        <button className="btn-primary" onClick={onStart}>Plan My Outdoor Activity</button>
      </div>
      <p className="mt-10 text-sm text-moss-700">Plan → Save → Close the screen → Go outside.</p>
    </main>
  );
}
