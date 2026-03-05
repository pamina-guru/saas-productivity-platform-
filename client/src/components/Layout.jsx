import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearToken } from "../api/http";

function clsx(...arr) {
  return arr.filter(Boolean).join(" ");
}

function IconGrid({ className = "" }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconCheck({ className = "" }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M9 12.5 11 14.5 15.5 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 4h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export default function Layout() {
  const navigate = useNavigate();

  function logout() {
    clearToken();
    navigate("/login");
  }

  const baseItem =
    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-semibold " +
    "text-white/78 hover:text-white transition " +
    "hover:bg-white/[0.06] focus:outline-none focus:ring-4 focus:ring-purple-500/15";

  const activeItem =
    "bg-purple-600/20 text-white ring-1 ring-purple-500/25 shadow-[0_10px_30px_rgba(124,58,237,0.16)]";

  return (
    <div className="min-h-screen">
      {/* Whole app shell */}
      <div className="mx-auto w-[min(1200px,calc(100%-28px))] py-8">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <aside className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/70 shadow-[0_30px_90px_rgba(0,0,0,0.6)] backdrop-blur-xl">
            {/* Glow */}
            <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 -right-24 h-72 w-72 rounded-full bg-purple-400/10 blur-3xl" />

            <div className="relative flex h-full min-h-[640px] flex-col p-4">
              {/* Brand */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-purple-600/25 ring-1 ring-purple-500/25 shadow-[0_12px_40px_rgba(124,58,237,0.20)] flex items-center justify-center">
                    <div className="h-4 w-4 rounded-md bg-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[16px] font-extrabold tracking-tight text-white">
                      Productivity
                    </div>
                    <div className="text-[12px] text-white/45">
                      Minimal. Fast. Focused.
                    </div>
                  </div>
                </div>
              </div>

              {/* Nav */}
              <nav className="mt-4 flex flex-col gap-1">
                <NavLink
                  to="/app/dashboard"
                  className={({ isActive }) =>
                    clsx(baseItem, isActive && activeItem)
                  }
                >
                  {/* active left bar */}
                  <span className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-full bg-purple-500/0 group-[.active]:bg-purple-500/80" />
                  <IconGrid className="text-white/70 group-hover:text-white" />
                  <span className="truncate">Dashboard</span>
                </NavLink>

                <NavLink
                  to="/app/tasks"
                  className={({ isActive }) =>
                    clsx(baseItem, isActive && activeItem)
                  }
                >
                  <span className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-full bg-purple-500/0 group-[.active]:bg-purple-500/80" />
                  <IconCheck className="text-white/70 group-hover:text-white" />
                  <span className="truncate">Tasks</span>
                </NavLink>
              </nav>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Bottom area */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <button
                  onClick={logout}
                  className="w-full rounded-xl bg-purple-600 px-4 py-3 text-[14px] font-extrabold text-white shadow-[0_18px_50px_rgba(124,58,237,0.25)] hover:bg-purple-500 transition focus:outline-none focus:ring-4 focus:ring-purple-500/20"
                  type="button"
                >
                  Logout
                </button>
                <div className="mt-2 text-center text-[11px] text-white/35">
                  Built by Pamina ✦
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
