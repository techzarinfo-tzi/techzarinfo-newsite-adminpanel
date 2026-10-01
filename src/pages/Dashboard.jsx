import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthError, getDashboard } from "../api.js";
import { card, errorBox } from "../ui.js";

// Totals from the backend's /dashboard endpoint
const STATS = [
  { key: "contactCount", label: "Contact enquiries" },
  { key: "developerCount", label: "Hire a developer requests" },
  { key: "blogsCount", label: "Blog posts" },
  { key: "careersCount", label: "Job openings" },
  { key: "usersCount", label: "Admin users" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    getDashboard()
      .then((data) => !cancelled && setStats(data))
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof AuthError) navigate("/login", { replace: true });
        else setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const value = (key) => (stats ? (stats[key] ?? 0).toLocaleString() : "–");

  return (
    <section>
      <h1 className="text-2xl font-bold text-navy sm:text-3xl">Dashboard</h1>
      <p className="mt-1 mb-8 text-muted">An overview of the website’s activity.</p>

      {error && (
        <p className={`${errorBox} mb-6`} role="alert">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Link
          to="/conversations"
          className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-brand to-navy p-6 text-white shadow-lg shadow-brand/25 transition-transform hover:-translate-y-0.5"
        >
          <div className="pointer-events-none absolute -top-10 -right-10 h-36 w-36 rounded-full bg-white/10" aria-hidden="true" />
          <p className="text-sm font-medium text-white/80">Chat conversations</p>
          <p className="mt-2 text-4xl font-bold">{value("chatCount")}</p>
          <p className="mt-4 text-sm font-semibold text-white/90 group-hover:text-white">
            View conversations →
          </p>
        </Link>

        {STATS.map((s) => (
          <div key={s.key} className={`${card} p-6`}>
            <p className="text-sm font-medium text-muted">{s.label}</p>
            <p className="mt-2 text-4xl font-bold text-navy">{value(s.key)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
