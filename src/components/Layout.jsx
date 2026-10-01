import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearToken } from "../api.js";

const NAV_ITEMS = [
  {
    to: "/",
    label: "Dashboard",
    end: true,
    icon: (
      <>
        <rect x="3" y="3" width="7" height="9" rx="1.5" />
        <rect x="14" y="3" width="7" height="5" rx="1.5" />
        <rect x="14" y="12" width="7" height="9" rx="1.5" />
        <rect x="3" y="16" width="7" height="5" rx="1.5" />
      </>
    ),
  },
  {
    to: "/conversations",
    label: "Chat Conversations",
    icon: (
      <>
        <path d="M21 12a8 8 0 01-11.6 7.1L4 20l1-4.6A8 8 0 1121 12z" />
        <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" />
      </>
    ),
  },
];

const Icon = ({ children }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5 shrink-0"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const navLink = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
    isActive
      ? "bg-linear-to-br from-brand to-navy text-white shadow-md shadow-brand/25"
      : "text-brand-hover hover:bg-sky-soft hover:text-navy"
  }`;

export default function Layout() {
  const navigate = useNavigate();
  // Phones and tablets: the sidebar slides in over the page
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const logout = () => {
    clearToken();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-sky-soft/60 via-sky-tint to-sky-tint">
      {menuOpen && (
        <div
          className="fixed inset-0 z-30 bg-navy/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        id="sidebar"
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-sky-line bg-white transition-transform duration-200 lg:translate-x-0 ${
          menuOpen ? "translate-x-0 shadow-2xl shadow-navy/20" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-sky-line/70 px-5 py-5">
          <div>
            <img src="/logo.svg" alt="Techzarinfo" width="206" height="41" className="h-8 w-auto" />
            <span className="mt-2 inline-block rounded-full bg-sky-soft px-2.5 py-0.5 text-xs font-semibold text-brand">
              Admin Panel
            </span>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="rounded-full p-2 text-navy hover:bg-sky-soft lg:hidden"
            aria-label="Close menu"
          >
            <Icon>
              <path d="M6 6l12 12M18 6L6 18" />
            </Icon>
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto p-4" aria-label="Main">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={navLink}
              onClick={() => setMenuOpen(false)}
            >
              <Icon>{item.icon}</Icon>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-sky-line/70 p-4">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-navy transition-colors hover:bg-red-50 hover:text-red-700"
          >
            <Icon>
              <path d="M15 17l5-5-5-5M20 12H9M12 20H6a2 2 0 01-2-2V6a2 2 0 012-2h6" />
            </Icon>
            Log out
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-sky-line/80 bg-white/75 px-4 py-3 backdrop-blur-xl backdrop-saturate-150 lg:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="rounded-full p-2 text-navy hover:bg-sky-soft"
            aria-label="Open menu"
            aria-controls="sidebar"
            aria-expanded={menuOpen}
          >
            <Icon>
              <path d="M4 6h16M4 12h16M4 18h16" />
            </Icon>
          </button>
          <img src="/logo.svg" alt="Techzarinfo" width="206" height="41" className="h-6 w-auto" />
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
