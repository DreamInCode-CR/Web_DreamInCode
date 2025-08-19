import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { API } from '../lib/api'

export default function Setup() {
  const { token, logout } = useAuth()
  const authToken = useMemo(() => token || localStorage.getItem('token'), [token])

  const [form, setForm] = useState({
    nombre: '',
    apellido1: '',
    apellido2: '',
    fechaNacimiento: '',
    telefono: '',
    direccion: '',
    preferencias: '',
    notasMedicas: ''
  })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const onChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  // GET /profiles/setup
  useEffect(() => {
    if (!authToken) return
    ;(async () => {
      setMsg('')
      try {
        const data = await API.get('/profiles/setup')
        setForm({
          nombre: data?.nombre ?? '',
          apellido1: data?.apellido1 ?? '',
          apellido2: data?.apellido2 ?? '',
          fechaNacimiento: data?.fechaNacimiento ? String(data.fechaNacimiento).substring(0,10) : '',
          telefono: data?.telefono ?? '',
          direccion: data?.direccion ?? '',
          preferencias: data?.preferencias ?? '',
          notasMedicas: data?.notasMedicas ?? ''
        })
      } catch (e) {
        if (String(e.message).includes('401')) logout()
        setMsg(String(e.message || e))
      }
    })()
  }, [authToken, logout])

  // PUT /profiles/setup
  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')

    const payload = {
      nombre: form.nombre || null,
      apellido1: form.apellido1 || null,
      apellido2: form.apellido2 || null,
      fechaNacimiento: form.fechaNacimiento || null,
      telefono: form.telefono || null,
      direccion: form.direccion || null,
      preferencias: form.preferencias || null,
      notasMedicas: form.notasMedicas || null
    }

    try {
      await API.put('/profiles/setup', payload)
      setMsg('Perfil guardado')
    } catch (e) {
      if (String(e.message).includes('401')) logout()
      setMsg(String(e.message || e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="grid gap-6 sm:gap-8 md:grid-cols-2">
      <div className="overflow-hidden rounded-xl2 shadow-soft">
        <img src="/images/auth.png" alt="AI" className="h-48 sm:h-64 md:h-full min-h-[240px] w-full object-cover" />
      </div>

      <div className="card p-4 sm:p-6">
        <div className="mb-4 sm:mb-6 flex items-center gap-3">
          <div className="rounded-full bg-bg p-2">
            <img src="/images/logo.png" alt="DCODE" className="h-9 w-9 rounded" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">DreamInCode</h2>
        </div>

        <h3 className="mb-3 sm:mb-4 text-lg sm:text-xl font-bold">Configurar Perfil</h3>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Nombre</label>
              <input className="input" name="nombre" value={form.nombre} onChange={onChange} />
            </div>
            <div>
              <label className="label">Primer Apellido</label>
              <input className="input" name="apellido1" value={form.apellido1} onChange={onChange} />
            </div>
            <div>
              <label className="label">Segundo Apellido</label>
              <input className="input" name="apellido2" value={form.apellido2} onChange={onChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Fecha de Nacimiento</label>
              <input className="input" type="date" name="fechaNacimiento" value={form.fechaNacimiento} onChange={onChange} />
            </div>
            <div>
              <label className="label">Teléfono</label>
              <input className="input" name="telefono" value={form.telefono} onChange={onChange} />
            </div>
          </div>

          <div>
            <label className="label">Dirección</label>
            <input className="input" name="direccion" value={form.direccion} onChange={onChange} />
          </div>

          <div>
            <label className="label">Preferencias</label>
            <textarea className="input min-h-[84px]" name="preferencias" value={form.preferencias} onChange={onChange} />
          </div>

          <div>
            <label className="label">Notas Médicas</label>
            <textarea className="input min-h-[84px]" name="notasMedicas" value={form.notasMedicas} onChange={onChange} />
          </div>

          {msg && <div className="text-sm whitespace-pre-wrap">{msg}</div>}

          <div className="flex items-center gap-3">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Guardando…' : 'Guardar'}
            </button>
            <Link to="/" className="btn-accent">Volver</Link>
          </div>
        </form>
      </div>
    </section>
  )
}
