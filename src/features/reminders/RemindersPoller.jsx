import { useEffect, useState } from 'react'
import ReminderPopup from '../../components/ReminderPopup'
import { useAuth } from '../../context/AuthContext'
import api from '../../lib/api'
import { getRemindersNow } from '../../lib/api'

export default function RemindersPoller() {
  const { token } = useAuth()
  const [popup, setPopup] = useState({ open: false, title: '', message: '' })
  const [queue, setQueue] = useState([])

  useEffect(() => {
    if (!token) return
    let stopped = false

    async function tick() {
      try {
          const res = await getRemindersNow()
          const items = Array.isArray(res) ? res : []
        if (!stopped && items.length > 0) {
          // acumulamos en cola (encaso si llegan varios a la vez)
          setQueue(q => [...q, ...items.map(r => ({
            title: 'Recordatorio de medicamento',
            message: r.mensaje ?? `Esto es un recordatorio para tomarte tu medicamento ${r.nombre}`
          }))])
        }
      } catch { }
    }

    // llamada inmediata al montar
    tick()
    const id = setInterval(tick, 60000) // 60s

    return () => { stopped = true; clearInterval(id) }
  }, [token])

  // mostrar de a uno, tipo “cola”
  useEffect(() => {
    if (queue.length === 0 || popup.open) return
    const next = queue[0]
    setPopup({ open: true, title: next.title, message: next.message })
  }, [queue, popup.open])

  function closePopup() {
    setPopup(p => ({ ...p, open: false }))
    setQueue(q => q.slice(1))
  }

  return (
    <ReminderPopup
      open={popup.open}
      title={popup.title}
      message={popup.message}
      onClose={closePopup}
    />
  )
}
