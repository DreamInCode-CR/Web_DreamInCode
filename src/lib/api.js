export const API = {
  base: '/api', // o 'https://localhost:5165' si no usas proxy

  async post(path, body, token) {
    const res = await fetch(`${this.base}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(body)
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      const msg = data?.error || data?.message || `Error ${res.status}`
      throw new Error(msg)
    }
    return data
  },

  async get(path, token) {
    const res = await fetch(`${this.base}${path}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      const msg = data?.error || data?.message || `Error ${res.status}`
      throw new Error(msg)
    }
    return data
  }
}
