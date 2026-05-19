// Home.jsx - Página de inicio con diseño exacto
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import Sidebar from '../components/Nav'

const Home = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('escuela_token')
  const user = localStorage.getItem('escuela_user') || 'Administrador'

  useEffect(() => {
    if (!token) {
      navigate('/')
    }
  }, [navigate, token])

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      
      {/* Contenido principal */}
      <div className="ml-64 p-6">
        {/* Título Inicio */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Inicio</h1>

        {/* Tarjeta Estudiantes RICALDONE */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Estudiantes</h2>
              <p className="text-3xl font-bold text-blue-600 mt-2">RICALDONE</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">INSTITUTO TÉCNICO</p>
              <p className="text-xl font-bold text-blue-600">RICALDONE</p>
            </div>
          </div>
        </div>

        {/* Tarjeta Bienvenidos */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            ¡Bienvenidos, {user}!
          </h2>
          <p className="text-gray-500">Sistema de Administración de Estudiantes</p>
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-4xl mb-2">👥</div>
            <h3 className="text-gray-500 text-sm">Estudiante</h3>
            <p className="text-3xl font-bold text-gray-800">0</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-4xl mb-2">📚</div>
            <h3 className="text-gray-500 text-sm">Cursos</h3>
            <p className="text-3xl font-bold text-gray-800">0</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-4xl mb-2">🏆</div>
            <h3 className="text-gray-500 text-sm">Promedio</h3>
            <p className="text-3xl font-bold text-gray-800">0%</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home