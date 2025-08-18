export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5165";

function withBase(path) {
  return path.startsWith("/") ? `${API_BASE}${path}` : `${API_BASE}/${path}`;
}

async function safeJson(res) {
  const text = await res.text();
  try { return text ? JSON.parse(text) : {}; }
  catch { return { raw: text }; }
}

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handle(res) {
  const data = await safeJson(res);
  if (!res.ok) {
    const msg = data?.error || data?.message || `Error ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export const API = {
  base: API_BASE,

  async get(path) {
    const res = await fetch(withBase(path), {
      method: "GET",
      headers: {
        ...authHeaders()
      }
    });
    return handle(res);
  },

  async post(path, body) {
    const res = await fetch(withBase(path), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders()
      },
      body: JSON.stringify(body ?? {})
    });
    return handle(res);
  },

  async put(path, body) {
    const res = await fetch(withBase(path), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders()
      },
      body: JSON.stringify(body ?? {})
    });
    return handle(res);
  },

  async del(path) {
    const res = await fetch(withBase(path), {
      method: "DELETE",
      headers: {
        ...authHeaders()
      }
    });
    return handle(res);
  }
};
