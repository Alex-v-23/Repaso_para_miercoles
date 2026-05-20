// Nav.jsx - Línea amarilla, letras blancas/grises
import { Link, useLocation, useNavigate } from 'react-router-dom'

const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('escuela_token')
    localStorage.removeItem('escuela_user')
    localStorage.removeItem('escuela_email')
    navigate('/')
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-gray-700 border-r border-gray-600">
      {/* Escuela Admin */}
      <div className="p-4 border-b border-yellow-400">
        <h1 className="text-xl font-bold text-white">Ricaldone</h1>
        <p className="text-xs text-gray-300">Sistema de Gestión</p>
      </div>

      {/* Menú */}
      <nav className="py-4">
        <Link
          to="/home"
          className={`flex items-center gap-3 px-5 py-2 ${
            location.pathname === '/home'
              ? 'bg-gray-800 text-white border-r-4 border-yellow-400'
              : 'text-gray-200 hover:bg-gray-600'
          }`}
        >
          <span>Inicio</span>
        </Link>
        <Link
          to="/students"
          className={`flex items-center gap-3 px-5 py-2 ${
            location.pathname === '/students'
              ? 'bg-gray-800 text-white border-r-4 border-yellow-400'
              : 'text-gray-200 hover:bg-gray-600'
          }`}
        >
          <span>Estudiantes</span>
        </Link>
      </nav>

      {/* Cerrar Sesión */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-yellow-400">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 text-white hover:bg-gray-600 rounded transition"
        >
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar