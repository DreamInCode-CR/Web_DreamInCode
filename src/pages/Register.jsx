import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API } from '../lib/api'

export default function Register(){
  const [form, setForm] = useState({
    nombre: '', primerApellido: '', segundoApellido: '', fechaNacimiento: '',
    correo: '', telefono: '', direccion: '', password: '', password2: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ok, setOk] = useState(false)
  const navigate = useNavigate()

  const onChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(''); setOk(false)

    if (!form.password || form.password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres')
    if (form.password !== form.password2) return setError('Las contraseñas no coinciden')

    setLoading(true)
    try {
      const payload = {
        correo: form.correo,
        password: form.password,
        nombre: form.nombre || null,
        primerApellido: form.primerApellido || null,
        segundoApellido: form.segundoApellido || null,
        fechaNacimiento: form.fechaNacimiento || null,
        telefono: form.telefono || null,
        direccion: form.direccion || null
      }
      await API.post('/auth/register', payload)
      setOk(true)
      setTimeout(() => navigate('/Login'), 800)
    } catch (err) {
      setError(err.message || 'No se pudo registrar')
    } finally {
      setLoading(false)
    }
  }
}


  return (
    <section className="grid gap-6 sm:gap-8 md:grid-cols-2">
      <div className="overflow-hidden rounded-xl2 shadow-soft">
        <img
          src="/images/auth.png"
          alt="Registro"
          className="h-48 sm:h-64 md:h-full min-h-[240px] w-full object-cover"
        />
      </div>

      {/* Formulario */}
      <div className="card p-4 sm:p-6">
        <div className="mb-4 sm:mb-6 flex items-center gap-3">
          <img src="/images/logo.png" alt="DCODE" className="h-9 w-9 rounded" />
          <h2 className="text-xl sm:text-2xl font-bold">DreamInCode</h2>
        </div>

        <h3 className="mb-3 sm:mb-4 text-lg sm:text-xl font-bold">Registrar Usuario</h3>

        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm">Nombre</label>
              <input className="input" name="nombre" value={form.nombre} onChange={onChange} placeholder="Nombre" />
            </div>
            <div>
              <label className="mb-1 block text-sm">Primer Apellido</label>
              <input className="input" name="primerApellido" value={form.primerApellido} onChange={onChange} placeholder="Primer Apellido" />
            </div>
            <div>
              <label className="mb-1 block text-sm">Segundo Apellido</label>
              <input className="input" name="segundoApellido" value={form.segundoApellido} onChange={onChange} placeholder="Segundo Apellido" />
            </div>
            <div>
              <label className="mb-1 block text-sm">Fecha de nacimiento</label>
              <input className="input" type="date" name="fechaNacimiento" value={form.fechaNacimiento} onChange={onChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm">Correo</label>
              <input className="input" type="email" name="correo" value={form.correo} onChange={onChange} placeholder="correo@ejemplo.com" required />
            </div>
            <div>
              <label className="mb-1 block text-sm">Teléfono</label>
              <input className="input" name="telefono" value={form.telefono} onChange={onChange} placeholder="+506 8888-8888" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm">Dirección</label>
            <input className="input" name="direccion" value={form.direccion} onChange={onChange} placeholder="Provincia, cantón, distrito, señas" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm">Contraseña</label>
              <input className="input" type="password" name="password" value={form.password} onChange={onChange} placeholder="••••••••" required />
            </div>
            <div>
              <label className="mb-1 block text-sm">Confirmar contraseña</label>
              <input className="input" type="password" name="password2" value={form.password2} onChange={onChange} placeholder="••••••••" required />
            </div>
          </div>

          {error && <div className="text-red-400 text-sm">{error}</div>}
          {ok && <div className="text-emerald-400 text-sm">¡Registro exitoso! Redirigiendo…</div>}

          <button type="submit" className="btn-accent mt-2 w-full" disabled={loading}>
            {loading ? 'Registrando…' : 'Registrar'}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-end gap-4 text-white/70">
          <a href="#" aria-label="facebook" className="hover:text-white">f</a>
          <a href="#" aria-label="twitter" className="hover:text-white">𝕏</a>
          <a href="#" aria-label="instagram" className="hover:text-white">ig</a>
        </div>
      </div>
    </section>
  );
}
