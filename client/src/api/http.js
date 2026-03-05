const BASE_URL = "http://localhost:4000";

export function setToken(token) {
  localStorage.setItem("token", token);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function clearToken() {
  localStorage.removeItem("token");
}

export async function apiFetch(path, options = {}) {
  const token = getToken();

  const headers = { ...(options.headers || {}) };

  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  } catch (e) {
    // Backend OFF / network issue
    throw new Error(
      "Server is not reachable. Is backend running on port 4000?",
    );
  }

  let data = {};
  try {
    data = await res.json();
  } catch {
    // If backend returned no JSON
    data = {};
  }

  // If token is invalid/expired -> clear it so app doesn't get stuck
  if (res.status === 401) {
    clearToken();
    throw new Error("Session expired. Please login again.");
  }

  if (!res.ok) {
    const msg =
      data?.message || data?.error || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data;
}
