export default function LoadingState() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center" role="status" aria-live="polite">
      <span className="sway text-6xl" aria-hidden="true">🌿</span>
      <h2 className="mt-6 text-2xl font-bold text-moss-900">Gemma is planning your outing…</h2>
      <p className="mt-2">This can take a little while when it runs on your own computer.</p>
    </main>
  );
}
