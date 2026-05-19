// Sidebar.jsx - Barra lateral con colores exactos
import { Link, useLocation, useNavigate } from 'react-router'

const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const user = localStorage.getItem('escuela_user') || 'Administrador'

  const handleLogout = () => {
    localStorage.removeItem('escuela_token')
    localStorage.removeItem('escuela_user')
    localStorage.removeItem('escuela_email')
    navigate('/')
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-md z-40 border-r border-gray-200">
      {/* Escuela Admin */}
      <div className="p-5 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">Escuela Admin</h1>
      </div>

      {/* Administrador */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center">
            <span className="text-gray-600 text-lg">👤</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Administrador</p>
            <p className="text-xs text-gray-400">{user}</p>
          </div>
        </div>
      </div>

      {/* Menú */}
      <nav className="py-4">
        <ul>
          <li>
            <Link
              to="/home"
              className={`flex items-center gap-3 px-5 py-3 transition ${
                location.pathname === '/home'
                  ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>🏠</span>
              <span>Inicio</span>
            </Link>
          </li>
          <li>
            <Link
              to="/students"
              className={`flex items-center gap-3 px-5 py-3 transition ${
                location.pathname === '/students'
                  ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>👥</span>
              <span>Estudiantes</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Cerrar Sesión */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          <span>🚪</span>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar