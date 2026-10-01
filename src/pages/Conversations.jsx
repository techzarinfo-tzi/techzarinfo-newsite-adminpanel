import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthError, listConversations } from "../api.js";
import { formatDate, visitorLabel } from "../format.js";
import { btnDark, btnGhost, card, errorBox, input } from "../ui.js";

const PAGE_SIZE = 20;

export default function Conversations() {
  const navigate = useNavigate();
  // Page and search live in the URL, so "Back" from a conversation returns to the same list
  const [params, setParams] = useSearchParams();
  const page = Math.max(1, Number(params.get("page")) || 1);
  const search = params.get("search") || "";
  const visitor = params.get("visitor") || "";

  const [searchInput, setSearchInput] = useState(search);
  // The last response and which page/search/visitor it was for; the previous page stays
  // on screen (dimmed) while the next one loads.
  const query = `${page}|${search}|${visitor}`;
  const [loaded, setLoaded] = useState({ query: null, result: null, error: "" });
  const loading = loaded.query !== query;
  const result = loaded.result;
  const error = loading ? "" : loaded.error;

  useEffect(() => {
    let cancelled = false;
    listConversations({ page, limit: PAGE_SIZE, search, visitorId: visitor })
      .then((data) => !cancelled && setLoaded({ query, result: data, error: "" }))
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof AuthError) navigate("/login", { replace: true });
        else setLoaded((prev) => ({ ...prev, query, error: err.message }));
      });
    return () => {
      cancelled = true;
    };
  }, [query, page, search, visitor, navigate]);

  const goTo = (next) => {
    const p = new URLSearchParams(params);
    Object.entries(next).forEach(([key, value]) => (value ? p.set(key, value) : p.delete(key)));
    setParams(p);
  };

  const onSearch = (e) => {
    e.preventDefault();
    goTo({ search: searchInput.trim(), page: "" });
  };

  const emptyText =
    !result && loading
      ? "Loading…"
      : result?.items.length === 0
        ? search || visitor
          ? "No conversations match your search."
          : "No conversations yet."
        : "";

  const clearSearch = () => {
    setSearchInput("");
    goTo({ search: "", page: "" });
  };

  return (
    <section>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy sm:text-3xl">Chat Conversations</h1>
          <p className="mt-1 text-muted">
            Every question visitors asked the website chatbot, and the answers it gave.
          </p>
        </div>
        {result && (
          <span className="self-start rounded-full bg-sky-soft px-4 py-1.5 text-sm font-semibold whitespace-nowrap text-brand sm:self-auto">
            {result.total} conversation{result.total === 1 ? "" : "s"}
            {(search || visitor) && " found"}
          </span>
        )}
      </div>

      <form className="mb-5 flex flex-wrap gap-2 sm:flex-nowrap" onSubmit={onSearch} role="search">
        <div className="relative w-full">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="pointer-events-none absolute top-1/2 left-4 h-4.5 w-4.5 -translate-y-1/2 text-muted"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <input
            type="search"
            placeholder="Search questions and answers…"
            aria-label="Search questions and answers"
            maxLength={200}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className={`${input} pl-11`}
          />
        </div>
        <button type="submit" className={btnDark}>
          Search
        </button>
        {search && (
          <button type="button" className={btnGhost} onClick={clearSearch}>
            Clear
          </button>
        )}
      </form>

      {visitor && (
        <p className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-sky-line bg-sky-tint px-4 py-3 text-sm text-navy">
          <span>
            Showing chats from visitor{" "}
            <strong className="font-mono" title={visitor}>
              {visitorLabel(visitor)}
            </strong>{" "}
            only.
          </span>
          <button type="button" className={btnGhost} onClick={() => goTo({ visitor: "", page: "" })}>
            Show all visitors
          </button>
        </p>
      )}

      {error && (
        <p className={`${errorBox} mb-5`} role="alert">
          {error}
        </p>
      )}

      {/* Phones: one card per conversation */}
      <ul className={`flex flex-col gap-3 transition-opacity sm:hidden ${loading && result ? "opacity-60" : ""}`}>
        {result?.items.map((c) => (
          <li key={c._id}>
            <Link
              to={`/conversations/${c._id}`}
              className={`${card} block p-4 transition-colors hover:border-brand/40`}
            >
              <span className="line-clamp-2 font-semibold text-navy">{c.firstQuestion || "(empty)"}</span>
              <span className="mt-2 flex items-center gap-2 text-xs text-muted">
                <span className="rounded-full bg-sky-soft px-2 py-0.5 font-semibold text-brand">
                  {c.questionCount} question{c.questionCount === 1 ? "" : "s"}
                </span>
                <span className="font-mono">{visitorLabel(c.visitorId)}</span>
                {formatDate(c.updatedAt)}
              </span>
            </Link>
          </li>
        ))}
        {emptyText && <li className={`${card} px-4 py-10 text-center text-muted`}>{emptyText}</li>}
      </ul>

      <div className={`${card} hidden overflow-x-auto transition-opacity sm:block ${loading && result ? "opacity-60" : ""}`}>
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-sky-line bg-sky-tint text-xs font-semibold tracking-wide text-muted uppercase">
              <th className="px-5 py-3.5">First question</th>
              <th className="px-5 py-3.5 text-right">Questions</th>
              <th className="px-5 py-3.5">Visitor</th>
              <th className="px-5 py-3.5">Started</th>
              <th className="px-5 py-3.5">Last message</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sky-line/70">
            {result?.items.map((c) => (
              <tr key={c._id} className="align-top transition-colors hover:bg-sky-tint/70">
                <td className="max-w-lg px-5 py-4">
                  <Link
                    to={`/conversations/${c._id}`}
                    className="line-clamp-2 font-medium text-navy hover:text-brand hover:underline"
                  >
                    {c.firstQuestion || "(empty)"}
                  </Link>
                </td>
                <td className="px-5 py-4 text-right">
                  <span className="inline-block min-w-8 rounded-full bg-sky-soft px-2.5 py-0.5 text-center text-sm font-semibold text-brand">
                    {c.questionCount}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm whitespace-nowrap">
                  {c.visitorId ? (
                    <button
                      type="button"
                      onClick={() => goTo({ visitor: c.visitorId, page: "" })}
                      className="font-mono text-brand hover:underline"
                      title={`All chats from this visitor${c.ip ? ` (IP ${c.ip})` : ""}`}
                    >
                      {visitorLabel(c.visitorId)}
                    </button>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td className="px-5 py-4 text-sm whitespace-nowrap text-muted">{formatDate(c.createdAt)}</td>
                <td className="px-5 py-4 text-sm whitespace-nowrap text-muted">{formatDate(c.updatedAt)}</td>
              </tr>
            ))}
            {emptyText && (
              <tr>
                <td colSpan={5} className="px-5 py-14 text-center text-muted">
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {result && result.pages > 1 && (
        <nav className="mt-6 flex items-center justify-center gap-4" aria-label="Pages">
          <button
            type="button"
            className={btnGhost}
            disabled={page <= 1}
            onClick={() => goTo({ page: page - 1 > 1 ? page - 1 : "" })}
          >
            ← Newer
          </button>
          <span className="text-sm text-muted">
            Page <strong className="text-navy">{page}</strong> of {result.pages}
          </span>
          <button
            type="button"
            className={btnGhost}
            disabled={page >= result.pages}
            onClick={() => goTo({ page: page + 1 })}
          >
            Older →
          </button>
        </nav>
      )}
    </section>
  );
}
