import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { API } from '../lib/api'

export default function Setup() {
  const { token, logout } = useAuth()
  const authToken = useMemo(() => token || localStorage.getItem('token'), [token])

  // ---------------- Perfil ----------------
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

  // ---------------- Medicamentos ----------------
  const emptyMed = {
    medicamentoID: 0, // 0 = nuevo
    nombreMedicamento: '',
    dosis: '',
    instrucciones: '',
    fechaInicio: '',
    fechaHasta: '',
    horaToma: '',
    lunes: false, martes: false, miercoles: false, jueves: false, viernes: false, sabado: false, domingo: false,
    activo: true
  }

  const [meds, setMeds] = useState([])
  const [formMed, setFormMed] = useState(emptyMed)
  const [savingMed, setSavingMed] = useState(false)
  const [errMed, setErrMed] = useState('')
  const [okMed, setOkMed] = useState('')

  const setFieldMed = (name, value) => setFormMed(p => ({ ...p, [name]: value }))
  const setDayMed   = (name, value) => setFormMed(p => ({ ...p, [name]: value }))

  const resetMedForm = () => { setFormMed(emptyMed); setErrMed(''); setOkMed('') }

  const toTimeSpan = (hhmm) => (hhmm ? `${hhmm}:00` : null)
  const toHHMM = (timeStr) => (timeStr ? String(timeStr).slice(0,5) : '')

  const editMed = (m) => {
    setFormMed({
      medicamentoID: m.medicamentoID,
      nombreMedicamento: m.nombreMedicamento ?? '',
      dosis: m.dosis ?? '',
      instrucciones: m.instrucciones ?? '',
      fechaInicio: m.fechaInicio ? String(m.fechaInicio).substring(0,10) : '',
      fechaHasta: m.fechaHasta ? String(m.fechaHasta).substring(0,10) : '',
      horaToma: toHHMM(m.hora ?? m.horaToma),
      lunes: m.lunes, martes: m.martes, miercoles: m.miercoles, jueves: m.jueves, viernes: m.viernes, sabado: m.sabado, domingo: m.domingo,
      activo: m.activo
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ---------------- Carga inicial (perfil + meds) ----------------
  useEffect(() => {
    if (!authToken) return
    ;(async () => {
      setMsg('')
      try {
        // Perfil
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

      // Medicamentos
      try {
        const r = await API.get('/profiles/meds')
        setMeds(r?.items ?? [])
      } catch (e) {
        // si no hay medicamentos, seguimos
      }
    })()
  }, [authToken, logout])

  // --------- Guardar perfil ---------
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

  // ----- Crear/Actualizar medicamento ----------------
  const submitMed = async (e) => {
    e.preventDefault()
    setErrMed(''); setOkMed('')

    if (!formMed.nombreMedicamento?.trim()) {
      setErrMed('El nombre del medicamento es requerido')
      return
    }

    const payload = {
      nombreMedicamento: formMed.nombreMedicamento.trim(),
      dosis: formMed.dosis || null,
      instrucciones: formMed.instrucciones || null,
      fechaInicio: formMed.fechaInicio || null,
      fechaHasta: formMed.fechaHasta || null,
      hora: toTimeSpan(formMed.horaToma),
      lunes: !!formMed.lunes, martes: !!formMed.martes, miercoles: !!formMed.miercoles,
      jueves: !!formMed.jueves, viernes: !!formMed.viernes, sabado: !!formMed.sabado, domingo: !!formMed.domingo,
      activo: !!formMed.activo
    }

    try {
      setSavingMed(true)
      if (formMed.medicamentoID && formMed.medicamentoID > 0) {
        const res = await API.put(`/profiles/meds/${formMed.medicamentoID}`, payload)
        const updated = res?.item
        setMeds(list => list.map(x => x.medicamentoID === updated.medicamentoID ? updated : x))
        setOkMed('Medicamento actualizado')
      } else {
        const res = await API.post('/profiles/meds', payload)
        setMeds(list => [res?.item, ...list])
        setOkMed('Medicamento agregado')
      }
      resetMedForm()
    } catch (e) {
      setErrMed(String(e.message || e))
    } finally {
      setSavingMed(false)
      setTimeout(() => setOkMed(''), 2000)
    }
  }

  // ---------------- Eliminar --------------
  const removeMed = async (id) => {
    if (!confirm('¿Eliminar este medicamento? (se desactiva)')) return
    try {
      if (typeof API.del === 'function') {
        await API.del(`/profiles/meds/${id}`)
      } else {
        const tokenLS = localStorage.getItem('token')
        await fetch(`${API.base}/profiles/meds/${id}`, {
          method: 'DELETE',
          headers: tokenLS ? { Authorization: `Bearer ${tokenLS}` } : {}
        })
      }
      setMeds(list => list.map(m => m.medicamentoID === id ? { ...m, activo: false } : m))
    } catch (e) {
      alert(String(e.message || e))
    }
  }

  const Day = ({ name, label, value, onChange }) => (
    <label className="flex items-center gap-2 text-sm select-none">
      <input
        type="checkbox"
        className="h-4 w-4 accent-indigo-500"
        checked={!!value}
        onChange={(e) => onChange(name, e.target.checked)}
      />
      {label}
    </label>
  )

const prettyHora = (h) => {
  if (!h) return null;
  const s = String(h);
  if (/^\d{2}:\d{2}:\d{2}$/.test(s)) return s.slice(0,5);
  if (/^\d{2}:\d{2}$/.test(s)) return s;
  const m = s.match(/(\d{2}):(\d{2})/);
  return m ? `${m[1]}:${m[2]}` : null;
};

  return (
    <section className="grid gap-6 sm:gap-8 md:grid-cols-2">
      {/* Columna izquierda imagen */}
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

      {/* Medicamentos */}
      <div className="card p-4 sm:p-6 md:col-span-2">
        <h3 className="mb-3 sm:mb-4 text-lg sm:text-xl font-bold">Medicamentos</h3>

        {/* Form Medicamento */}
        <form onSubmit={submitMed} className="grid gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Nombre</label>
              <input
                className="input"
                value={formMed.nombreMedicamento}
                onChange={(e) => setFieldMed('nombreMedicamento', e.target.value)}
                placeholder="Ej. Paracetamol 500mg"
              />
            </div>
            <div>
              <label className="label">Dosis</label>
              <input
                className="input"
                value={formMed.dosis}
                onChange={(e) => setFieldMed('dosis', e.target.value)}
                placeholder="1 tableta cada 8h"
              />
            </div>
          </div>

          <div>
            <label className="label">Instrucciones</label>
            <input
              className="input"
              value={formMed.instrucciones}
              onChange={(e) => setFieldMed('instrucciones', e.target.value)}
              placeholder="Con comida, evitar alcohol, etc."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Desde</label>
              <input
                type="date"
                className="input"
                value={formMed.fechaInicio}
                onChange={(e) => setFieldMed('fechaInicio', e.target.value)}
              />
            </div>
            <div>
              <label className="label">Hasta</label>
              <input
                type="date"
                className="input"
                value={formMed.fechaHasta}
                onChange={(e) => setFieldMed('fechaHasta', e.target.value)}
              />
            </div>
            {/* NEW: Hora de toma */}
            <div>
              <label className="label">Hora de toma</label>
              <input
                type="time"
                className="input"
                value={formMed.horaToma}
                onChange={(e) => setFieldMed('horaToma', e.target.value)} //
              />
            </div>
          </div>

          <div>
            <label className="label block mb-2">Días de la semana</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <Day name="lunes"      label="Lunes"     value={formMed.lunes}      onChange={setDayMed} />
              <Day name="martes"     label="Martes"    value={formMed.martes}     onChange={setDayMed} />
              <Day name="miercoles"  label="Miércoles" value={formMed.miercoles}  onChange={setDayMed} />
              <Day name="jueves"     label="Jueves"    value={formMed.jueves}     onChange={setDayMed} />
              <Day name="viernes"    label="Viernes"   value={formMed.viernes}    onChange={setDayMed} />
              <Day name="sabado"     label="Sábado"    value={formMed.sabado}     onChange={setDayMed} />
              <Day name="domingo"    label="Domingo"   value={formMed.domingo}    onChange={setDayMed} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="activo"
              type="checkbox"
              className="h-4 w-4 accent-indigo-500"
              checked={formMed.activo}
              onChange={(e) => setFieldMed('activo', e.target.checked)}
            />
            <label htmlFor="activo" className="text-sm">Activo</label>
          </div>

          {errMed && <div className="text-sm text-red-400">{errMed}</div>}
          {okMed && <div className="text-sm text-emerald-400">{okMed}</div>}

          <div className="flex gap-3">
            <button className="btn-accent" type="submit" disabled={savingMed}>
              {savingMed ? 'Guardando…' : (formMed.medicamentoID ? 'Actualizar' : 'Agregar')}
            </button>
            {formMed.medicamentoID ? (
              <button type="button" className="btn" onClick={resetMedForm}>
                Cancelar edición
              </button>
            ) : null}
          </div>
        </form>

        {/* Lista de medicamentos */}
        <div className="mt-6">
          <h4 className="mb-2 font-semibold">Mis medicamentos</h4>
          {meds.length === 0 && <div className="text-sm text-white/60">Sin registros.</div>}

          <ul className="divide-y divide-white/10">
            {meds.map(m => (
              <li key={m.medicamentoID} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <div className="font-medium">
                    {m.nombreMedicamento}{' '}
                    {!m.activo && <span className="ml-2 text-xs rounded bg-white/10 px-2 py-0.5">Inactivo</span>}
                  </div>
                  <div className="text-xs text-white/70">
                    {m.dosis ? `${m.dosis} · ` : ''}
                    {m.instrucciones ? `${m.instrucciones} · ` : ''}
                    {m.fechaInicio ? `desde ${String(m.fechaInicio).substring(0,10)}` : ''}
                    {m.fechaHasta ? ` hasta ${String(m.fechaHasta).substring(0,10)}` : ''}
                    {prettyHora(m.hora ?? m.horaToma) ? ` · ${prettyHora(m.hora ?? m.horaToma)} h` : ''}
                  </div>
                  <div className="text-xs text-white/60 mt-0.5">
                    {['Lun','Mar','Mié','Jue','Vie','Sáb','Dom']
                      .filter((_,i)=>[m.lunes,m.martes,m.miercoles,m.jueves,m.viernes,m.sabado,m.domingo][i])
                      .join(' · ') || '—'}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="btn" onClick={() => editMed(m)}>Editar</button>
                  <button className="btn-danger" onClick={() => removeMed(m.medicamentoID)}>Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
