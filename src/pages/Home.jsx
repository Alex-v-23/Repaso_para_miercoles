// Home.jsx - Solo RICALDONE y Bienvenidos :3
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
    <div className="min-h-screen bg-white">
      <Sidebar />

      <div className="ml-64 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Inicio</h1>

        {/* Tarjeta RICALDONE */}
        <div className="border border-gray-300 p-4 mb-4 bg-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">RICALDONE</h2>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">INSTITUTO TÉCNICO</p>
              <p className="text-md font-bold">RICALDONE</p>
            </div>
          </div>
        </div>

        {/* Tarjeta Bienvenidos :3 */}
        <div className="border border-gray-300 p-6 text-center bg-white">
          <h2 className="text-xl font-bold">¡Bienvenidos :3!</h2>
        </div>
      </div>
    </div>
  )
}

export default Home