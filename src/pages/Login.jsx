import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API_BASE = '/api'

export default function Login(){
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password })
      })

      // Capturo el cuerpo crudo para ver errores del server
      const raw = await res.text()
      console.log('LOGIN RAW =>', res.status, raw)

      // Intentamos parsear a JSON (solo si aplica)
      let data = null
      try { data = JSON.parse(raw) } catch {}

      if (!res.ok) {
        const message = (data && (data.error || data.message)) || raw || `Error ${res.status}`
        throw new Error(message)
      }

      if (!data?.token) throw new Error('No se recibió token')

      // Guarda token y datos mínimos de usuario
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify({
        id: data.usuarioID,
        correo: data.correo,
        nombre: data.nombre,
        primerApellido: data.primerApellido,
        segundoApellido: data.segundoApellido
      }))

      navigate('/Setup')
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="grid gap-6 sm:gap-8 md:grid-cols-2">
      {/* Imagen lateral */}
      <div className="overflow-hidden rounded-xl2 shadow-soft">
        <img
          src="/images/auth.png"
          alt="AI"
          className="h-48 sm:h-64 md:h-full min-h-[240px] w-full object-cover"
        />
      </div>

      {/* Formulario */}
      <div className="card p-4 sm:p-6">
        <div className="mb-4 sm:mb-6 flex items-center gap-3">
          <img src="/images/logo.png" alt="DCODE" className="h-9 w-9 rounded" />
          <h2 className="text-xl sm:text-2xl font-bold">DreamInCode</h2>
        </div>

        <h3 className="mb-3 sm:mb-4 text-lg sm:text-xl font-bold">Iniciar Sesión</h3>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="mb-1 block text-sm">Correo</label>
            <input
              className="input"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">Contraseña</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div className="text-red-400 text-sm whitespace-pre-wrap">{error}</div>}

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Entrando…' : 'Iniciar Sesión'}
          </button>

          <div className="mt-3 sm:mt-4 text-right text-xs sm:text-sm text-white/60">
            <Link to="/register" className="hover:text-white">
              ¿No te has registrado?
            </Link>
          </div>
        </form>
      </div>
    </section>
  )
}
