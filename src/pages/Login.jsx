// Login.jsx - Diseño exacto como la imagen
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('escuela_token')
    if (token) {
      navigate('/home')
    }
  }, [navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Por favor completa todos los campos')
      return
    }

    setLoading(true)

    try {
      // Usuario de prueba
      if (email === 'admin@escuela.com' && password === 'admin123') {
        const token = `token-${Date.now()}`
        localStorage.setItem('escuela_token', token)
        localStorage.setItem('escuela_user', 'Administrador')
        localStorage.setItem('escuela_email', email)
        navigate('/home')
      } else {
        throw new Error('Email o contraseña incorrectos')
      }
    } catch (error_) {
      setError(error_.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Título Login */}
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">Login</h1>

        {/* Tarjeta blanca */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">
            Iniciar Sesión
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo E-mail */}
            <div>
              <label className="block text-gray-700 mb-2">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* Campo Contraseña */}
            <div>
              <label className="block text-gray-700 mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                {error}
              </div>
            )}

            {/* Botón Iniciar Sesión */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:bg-gray-400"
            >
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login