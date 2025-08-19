import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { API } from '../lib/api'

export default function Login() {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await API.post('/auth/login', { correo, password })
      // data: { id, correo, nombre, ... , token }
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data))
      navigate('/Setup')
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="grid gap-6 sm:gap-8 md:grid-cols-2">
      <div className="overflow-hidden rounded-xl2 shadow-soft">
        <img src="/images/auth.png" alt="Login" className="h-48 sm:h-64 md:h-full min-h-[240px] w-full object-cover" />
      </div>

      <div className="card p-4 sm:p-6">
        <div className="mb-4 sm:mb-6 flex items-center gap-3">
          <img src="/images/logo.png" alt="DCODE" className="h-9 w-9 rounded" />
          <h2 className="text-xl sm:text-2xl font-bold">DreamInCode</h2>
        </div>

        <h3 className="mb-3 sm:mb-4 text-lg sm:text-xl font-bold">Iniciar sesión</h3>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="label">Correo</label>
            <input className="input" type="email" value={correo} onChange={e=>setCorreo(e.target.value)} required />
          </div>
          <div>
            <label className="label">Contraseña</label>
            <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>

          {error && <div className="text-red-400 text-sm">{error}</div>}

          <button className="btn-primary w-full" disabled={loading}>
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <p className="mt-4 text-sm">
          ¿No tienes cuenta? <Link to="/Register" className="text-accent underline">Regístrate</Link>
        </p>
      </div>
    </section>
  )
}
