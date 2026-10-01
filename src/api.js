// In development, Vite forwards /api to VITE_API_URL (see vite.config.js); a production build
// calls the backend directly.
const API_URL = import.meta.env.DEV
  ? "/api"
  : (import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/$/, "");
const TOKEN_KEY = "adminToken";

// The backend hands out "Bearer/<token>" and accepts it back as-is.
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export class AuthError extends Error {}

async function request(path, options = {}) {
  const token = getToken();
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: token } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error("Can't reach the server. Check that the backend is running.");
  }

  const data = await res.json().catch(() => ({}));
  if (res.status === 401) {
    clearToken();
    throw new AuthError(data.message || "Please sign in again");
  }
  if (!res.ok || data.status === 0) {
    throw new Error(data.errors?.[0]?.msg || data.message || "Something went wrong");
  }
  return data;
}

export async function login(email, password) {
  const { data } = await request("/store-login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setToken(data);
}

// { usersCount, blogsCount, careersCount, contactCount, developerCount, chatCount }
export function getDashboard() {
  return request("/dashboard");
}

export function listConversations({ page = 1, limit = 20, search = "", visitorId = "" } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (search) params.set("search", search);
  if (visitorId) params.set("visitorId", visitorId);
  return request(`/chat-conversations?${params}`).then((r) => r.data);
}

export function getConversation(id) {
  return request(`/chat-conversations/${encodeURIComponent(id)}`).then((r) => r.data);
}
