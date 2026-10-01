import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { getToken, login } from "../api.js";
import { btnPrimary, card, errorBox, input } from "../ui.js";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (getToken()) return <Navigate to="/" replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-sky-soft via-sky-tint to-sky-mid px-4 py-10">
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand/15 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-navy/10 blur-3xl" aria-hidden="true" />

      <form className={`${card} relative w-full max-w-sm p-8 shadow-xl shadow-navy/10`} onSubmit={onSubmit}>
        <img src="/logo.svg" alt="Techzarinfo" width="206" height="41" className="mx-auto mb-6 h-9 w-auto" />
        <h1 className="text-center text-2xl font-bold text-navy">Admin Panel</h1>
        <p className="mt-1 mb-7 text-center text-sm text-muted">Sign in with your admin account.</p>

        <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-navy">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={input}
        />

        <label htmlFor="password" className="mt-4 mb-1.5 block text-sm font-semibold text-navy">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={input}
        />

        {error && (
          <p className={`${errorBox} mt-4`} role="alert">
            {error}
          </p>
        )}

        <button type="submit" className={`${btnPrimary} mt-6 w-full py-3`} disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
