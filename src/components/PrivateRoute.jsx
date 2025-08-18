import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'

export default function PrivateRoute({ children }) {
  const { token } = useAuth()
  const [ready, setReady] = useState(false)
  const location = useLocation()

  useEffect(() => {
    // pequeña hidratación: si el contexto aún no populó, intenta del storage
    if (token !== null && token !== undefined) {
      setReady(true)
    } else {
      const stored = localStorage.getItem('token')
      setReady(true) // ya podemos decidir
    }
  }, [token])

  if (!ready) {
    return <div className="p-4 text-center text-white/80">Cargando…</div>
  }

  const effectiveToken = token || localStorage.getItem('token')
  if (!effectiveToken) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
