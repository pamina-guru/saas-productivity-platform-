import { NavLink, Outlet } from "react-router-dom";
import { clearToken } from "../api/http";

export default function Layout() {
  function logout() {
    clearToken();
    window.location.href = "/login";
  }

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="w-64 bg-black border-r border-purple-900 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-purple-900">
          <h1 className="text-xl font-bold text-purple-400">Productivity</h1>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 space-y-2">
          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg transition ${
                isActive ? "bg-purple-700 text-white" : "hover:bg-purple-900/40"
              }`
            }
          >
            Tasks
          </NavLink>

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg transition ${
                isActive ? "bg-purple-700 text-white" : "hover:bg-purple-900/40"
              }`
            }
          >
            Dashboard
          </NavLink>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-purple-900">
          <button
            onClick={logout}
            className="w-full bg-purple-700 hover:bg-purple-800 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto bg-black">
        <div className="max-w-6xl mx-auto p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
