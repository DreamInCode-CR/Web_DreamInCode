import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'

function NavItem({ to, children, onClick }){
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({isActive}) =>
        `px-3 py-2 font-semibold transition block md:inline-block
         ${isActive ? 'text-primary' : 'text-white/80 hover:text-white'}`
      }
    >
      {children}
    </NavLink>
  )
}

export default function Navbar(){
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-black/40 backdrop-blur">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <img src="/images/logo.png" alt="DCODE" className="h-8 w-8 rounded-full" />
          <span className="font-bold text-white">DreamInCode</span>
        </Link>

        {/* Botón hamburguesa (móvil) */}
        <button
          className="md:hidden rounded-md p-2 text-white/80 hover:bg-white/10 hover:text-white"
          aria-label="Abrir menú"
          onClick={() => setOpen(v => !v)}
        >
          {open ? '✕' : '☰'}
        </button>

        {/* Navegación desktop */}
        <nav className="hidden gap-2 md:flex">
          <NavItem to="/">Home</NavItem>
          <NavItem to="/faq">FAQ</NavItem>
          <NavItem to="/setup">Perfil</NavItem>
          <NavItem to="/login">Login</NavItem>
        </nav>
      </div>

      {/* Navegación móvil */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-black/50">
          <div className="mx-auto max-w-screen-xl px-2 py-2">
            <NavItem to="/"        onClick={() => setOpen(false)}>Home</NavItem>
            <NavItem to="/faq"     onClick={() => setOpen(false)}>FAQ</NavItem>
            <NavItem to="/setup"   onClick={() => setOpen(false)}>Perfil</NavItem>
            <NavItem to="/login"   onClick={() => setOpen(false)}>Login</NavItem>
          </div>
        </div>
      )}
    </header>
  )
}
