import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-10">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-indigo-400">
            Crypto AI Dashboard
          </p>
          <h1 className="mt-1 text-3xl font-bold text-white">
            Hello, {user?.name || "Investor"}
          </h1>
          <p className="mt-2 text-slate-400">
            Your personalized feed will appear here in Stage 4.
          </p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:text-white"
        >
          Log out
        </button>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {["Market News", "Coin Prices", "Daily AI Insight", "Fun Crypto Meme"].map((section) => (
          <div
            key={section}
            className="rounded-xl border border-dashed border-slate-700 bg-slate-900/40 p-6"
          >
            <h2 className="text-lg font-semibold text-white">{section}</h2>
            <p className="mt-2 text-sm text-slate-500">Coming in the next stage.</p>
          </div>
        ))}
      </div>
    </div>
  );
}
