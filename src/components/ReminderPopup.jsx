import { useEffect } from 'react'

export default function ReminderPopup({ open, title, message, onClose }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-black/40">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-2xl w-[90%] max-w-md">
        <h2 className="text-xl font-semibold mb-2">{title || 'Recordatorio de medicamento'}</h2>
        <p className="mb-5">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
