import { useState, useEffect } from 'react'
// useState: hook para crear variables que React vigila (como email, password, errores)
// useEffect: hook para ejecutar código cuando el componente se monta o cambia

import { useNavigate } from 'react-router-dom'
// useNavigate: hook para redirigir al usuario a otras páginas (ej: después de login exitoso)

// ========== COMPONENTE PRINCIPAL ==========
const Login = () => {
  
  // ========== ESTADOS (variables que React controla) ==========
  
  const [email, setEmail] = useState('')
  // email: lo que el usuario escribe en el campo de correo (empieza vacío)
  // setEmail: función para actualizar el email
  
  const [password, setPassword] = useState('')
  // password: lo que el usuario escribe en el campo de contraseña (empieza vacío)
  // setPassword: función para actualizar la contraseña
  
  const [error, setError] = useState('')
  // error: mensaje de error si algo sale mal (empieza vacío)
  // setError: función para actualizar el mensaje de error
  
  const [loading, setLoading] = useState(false)
  // loading: indica si está procesando el login (true = mostrando "Ingresando...")
  // setLoading: función para cambiar el estado de carga
  
  const navigate = useNavigate()
  // navigate: función para redirigir (ej: navigate('/home') lleva a la página de inicio)

  // ========== EFECTO 1: Verificar si ya hay sesión activa ==========
  // Este efecto se ejecuta UNA SOLA VEZ cuando el componente se monta
  
  useEffect(() => {
    // Buscar en localStorage si hay un token guardado (sesión previa)
    const token = localStorage.getItem('escuela_token')
    
    // Si el token existe, el usuario ya está logueado
    if (token) {
      navigate('/home')  // Redirigir directamente al inicio
    }
  }, [navigate])  // Dependencia: solo se ejecuta si navigate cambia (casi nunca)

  // ========== FUNCIÓN: Manejar el envío del formulario ==========
  // Esta función se ejecuta cuando el usuario hace clic en "Iniciar Sesión"
  
  const handleSubmit = async (event) => {
    // event.preventDefault(): evita que el formulario recargue la página
    event.preventDefault()
    
    // Limpiar mensaje de error anterior (si lo había)
    setError('')

    // ========== VALIDACIÓN DE CAMPOS ==========
    // Verificar que email no esté vacío (trim() elimina espacios)
    // Verificar que password no esté vacío
    if (!email.trim() || !password) {
      setError('Por favor completa todos los campos')  // Mostrar error
      return  // Salir de la función (no continuar)
    }

    // ========== INICIAR PROCESO DE LOGIN ==========
    setLoading(true)  // Mostrar "Ingresando..." y deshabilitar botón

    try {
      // ========== VALIDACIÓN DE CREDENCIALES (SIMULADA) ==========
      // Aquí se comparan los datos ingresados con unas credenciales fijas
      // En una app real, aquí iría una llamada a un backend/API
      
      if (email === 'admin@escuela.com' && password === 'admin123') {
        // Si las credenciales son correctas:
        
        // Generar un token único (simulado) usando la fecha actual
        const token = `token-${Date.now()}`
        
        // Guardar el token en localStorage (para recordar sesión)
        localStorage.setItem('escuela_token', token)
        
        // Guardar el nombre del usuario
        localStorage.setItem('escuela_user', 'Administrador')
        
        // Guardar el email del usuario
        localStorage.setItem('escuela_email', email)
        
        // Redirigir al usuario a la página de inicio (/home)
        navigate('/home')
      } else {
        // Si las credenciales son incorrectas, lanzar un error
        throw new Error('Email o contraseña incorrectos')
      }
    } catch (error_) {
      // ========== MANEJO DE ERRORES ==========
      // Si ocurre cualquier error, mostrar el mensaje al usuario
      // Si error_.message no existe, mostrar mensaje genérico
      setError(error_.message || 'Error al iniciar sesión')
    } finally {
      // ========== FINALIZAR PROCESO ==========
      // Esto se ejecuta SIEMPRE (haya éxito o error)
      setLoading(false)  // Ocultar "Ingresando..." y habilitar botón
    }
  }

  // ========== RENDERIZADO (lo que se ve en pantalla) ==========
  
  return (
    // Contenedor principal: fondo degradado de azul claro a gris, centrado
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center px-4">
      
      <div className="w-full max-w-md">
        {/* Tarjeta blanca con sombra y bordes redondeados */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          
          {/* Título "Iniciar Sesión" */}
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            Iniciar Sesión
          </h2>

          {/* FORMULARIO */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* CAMPO: Correo Electrónico */}
            <div>
              {/* Etiqueta del campo */}
              <label className="block text-gray-700 font-medium mb-2">
                Correo Electrónico
              </label>
              
              {/* Input de email */}
              <input
                type="email"                    // Tipo email (validación básica)
                value={email}                   // Valor actual (controlado por React)
                onChange={(e) => setEmail(e.target.value)}  // Actualiza email cuando el usuario escribe
                placeholder="admin@escuela.com" // Texto de ejemplo
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required                        // Campo obligatorio
              />
            </div>

            {/* CAMPO: Contraseña */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Contraseña
              </label>
              
              <input
                type="password"                 // Tipo password (oculta los caracteres)
                value={password}                // Valor actual
                onChange={(e) => setPassword(e.target.value)}  // Actualiza password
                placeholder="••••••••"          // Placeholder con puntos
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              />
            </div>

            {/* MENSAJE DE ERROR (solo se muestra si error no está vacío) */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}  {/* Muestra el mensaje de error */}
              </div>
            )}

            {/* BOTÓN DE ENVÍO */}
            <button
              type="submit"                     // Tipo submit (envía el formulario)
              disabled={loading}                // Deshabilitado mientras loading = true
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
              {/* Si loading es true, muestra "Ingresando...", si no muestra "Iniciar Sesión" */}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}

export default Login  // Exportar el componente para usarlo en otras partes