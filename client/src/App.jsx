import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { getToken } from "./api/http";

import Login from "./pages/Login";
import Register from "./pages/Register";

import AppShell from "./components/AppShell";
import AppDashboard from "./pages/AppDashboard";
import Tasks from "./pages/Tasks";

function ProtectedRoute({ children }) {
  return getToken() ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  return getToken() ? <Navigate to="/app/dashboard" replace /> : children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* protected app */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AppDashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* default */}
        <Route path="/" element={<Navigate to="/app" replace />} />
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
