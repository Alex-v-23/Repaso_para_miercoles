import { useState, useEffect } from 'react'      // Hooks de React para estado y efectos
import { useNavigate } from 'react-router-dom'   // Para redirigir entre páginas
import Sidebar from '../components/Nav'          // Barra lateral de navegación
import StudentForm from '../components/StudentForm'  // Modal para agregar/editar
import ConfirmModal from '../components/ConfirmModal' // Modal de confirmación para eliminar

const Students = () => {
  // ========== ESTADOS (variables que cambian y React vigila) ==========
  
  const [students, setStudents] = useState([])     
  // students: lista de estudiantes (array vacío al inicio)
  // setStudents: función para actualizar la lista
  
  const [loading, setLoading] = useState(true)     
  // loading: indica si está cargando datos (true/false)
  
  const [currentPage, setCurrentPage] = useState(1)   
  // currentPage: página actual de la paginación (empieza en 1)
  
  const itemsPerPage = 5                           
  // itemsPerPage: cuántos estudiantes se muestran por página (5)
  
  const navigate = useNavigate()                   
  // navigate: función para cambiar de página (ej: navigate('/home'))
  
  const token = localStorage.getItem('escuela_token')   
  // token: verifica si el usuario está logueado

  // URL de la API pública que trae datos de ejemplo
  const API_URL = 'https://jsonplaceholder.typicode.com/users'

  // ========== EFECTO 1: Cargar estudiantes al iniciar ==========
  // Este efecto se ejecuta UNA SOLA VEZ cuando el componente se monta
  
  useEffect(() => {
    // Si no hay token (usuario no logueado), redirigir al login
    if (!token) {
      navigate('/')
      return
    }

    // Función asíncrona para traer datos de la API
    const fetchStudents = async () => {
      setLoading(true)  // Mostrar "Cargando..."
      
      try {
        // 1. Intentar cargar datos guardados en localStorage
        const stored = localStorage.getItem('escuela_students')
        
        if (stored && JSON.parse(stored).length > 0) {
          // Si hay datos guardados, usarlos (para no llamar a la API cada vez)
          setStudents(JSON.parse(stored))
        } else {
          // 2. Si no hay datos guardados, llamar a la API externa
          const response = await fetch(API_URL)  // Petición HTTP a la API
          const apiData = await response.json()   // Convertir respuesta a JSON
          
          // 3. Transformar los datos de la API a nuestro formato
          // La API devuelve: { id, name, email, phone }
          // Nosotros necesitamos: { id, nombre, email, curso, edad, telefono }
          const transformedData = apiData.slice(0, 5).map((user, index) => ({
            id: user.id,                          // ID del usuario
            nombre: user.name,                    // Nombre del usuario
            email: user.email,                    // Email del usuario
            curso: ['3° A', '3° B', '4° A', '4° B', '5° A'][index % 5],  // Curso fijo
            edad: [16, 17, 16, 17, 18][index % 5],  // Edad fija
            telefono: user.phone.split('x')[0].trim() || 'No disponible'  // Teléfono
          }))
          
          setStudents(transformedData)  // Guardar en el estado
          localStorage.setItem('escuela_students', JSON.stringify(transformedData))  // Guardar copia
        }
      } catch (error) {
        console.error('Error:', error)  // Si hay error, mostrarlo en consola
      } finally {
        setLoading(false)  // Ocultar "Cargando..."
      }
    }

    fetchStudents()  // Ejecutar la función
  }, [navigate, token])  // Dependencias: si cambian, se ejecuta de nuevo

  // ========== EFECTO 2: Guardar cambios en localStorage ==========
  // Cada vez que cambia la lista de estudiantes, se guarda automáticamente
  
  useEffect(() => {
    if (students.length > 0 && !loading) {
      localStorage.setItem('escuela_students', JSON.stringify(students))
    }
  }, [students, loading])  // Dependencias: students o loading

  // ========== LÓGICA DE PAGINACIÓN ==========
  
  const startIndex = (currentPage - 1) * itemsPerPage  // Índice del primer estudiante en la página actual
  const currentStudents = students.slice(startIndex, startIndex + itemsPerPage)  // Estudiantes de la página actual
  const totalPages = Math.ceil(students.length / itemsPerPage)  // Total de páginas (redondeado hacia arriba)

  // ========== ESTADOS PARA MODALES ==========
  
  const [showForm, setShowForm] = useState(false)           // Mostrar/ocultar el formulario
  const [editingStudent, setEditingStudent] = useState(null) // Estudiante que se está editando
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)  // Mostrar confirmación de eliminar
  const [studentToDelete, setStudentToDelete] = useState(null)       // ID del estudiante a eliminar
  const [success, setSuccess] = useState('')                // Mensaje de éxito temporal

  // ========== FUNCIÓN: CREAR ESTUDIANTE ==========
  // Se ejecuta cuando el usuario guarda un nuevo estudiante
  
  const handleCreate = (data) => {
    // data viene del formulario con: nombre, email, curso, edad, telefono
    const newStudent = { ...data, id: Date.now() }  // Crear objeto con ID único (timestamp)
    setStudents([...students, newStudent])          // Agregar a la lista existente
    setSuccess('✓ Estudiante agregado correctamente')  // Mostrar mensaje
    setShowForm(false)                              // Cerrar el modal
    setTimeout(() => setSuccess(''), 3000)          // Borrar mensaje después de 3 segundos
  }

  // ========== FUNCIÓN: EDITAR ESTUDIANTE ==========
  // Se ejecuta cuando el usuario guarda cambios de un estudiante existente
  
  const handleUpdate = (data) => {
    // Reemplazar el estudiante viejo con los datos nuevos
    setStudents(students.map(s => s.id === editingStudent.id ? { ...data, id: s.id } : s))
    setSuccess('✓ Estudiante actualizado correctamente')
    setShowForm(false)        // Cerrar modal
    setEditingStudent(null)   // Limpiar estudiante en edición
    setTimeout(() => setSuccess(''), 3000)
  }

  // ========== FUNCIÓN: ELIMINAR ESTUDIANTE ==========
  // Se ejecuta después de confirmar en el modal de confirmación
  
  const confirmDelete = () => {
    // Filtrar la lista, quitando el estudiante con el ID seleccionado
    setStudents(students.filter(s => s.id !== studentToDelete))
    setSuccess('✓ Estudiante eliminado correctamente')
    setShowDeleteConfirm(false)  // Cerrar modal de confirmación
    setStudentToDelete(null)     // Limpiar ID a eliminar
    setTimeout(() => setSuccess(''), 3000)
  }

  // ========== RENDERIZADO (lo que se ve en pantalla) ==========
  
  return (
    <div className="min-h-screen bg-white">
      <Sidebar />  {/* Barra lateral */}

      <div className="ml-64 p-6">
        {/* Título y breadcrumb */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Administración</h1>
          <div className="flex gap-2 text-sm text-gray-500">
            <span>Inicio</span>
            <span>/</span>
            <span className="text-gray-800">Estudiantes</span>
          </div>
        </div>

        {/* Botón Agregar - abre el modal para crear estudiante */}
        <div className="mb-4 text-right">
          <button
            onClick={() => {
              setEditingStudent(null)  // Asegurar que no es edición
              setShowForm(true)        // Mostrar formulario
            }}
            className="bg-green-600 text-white px-4 py-1 rounded text-sm"
          >
            Agregar
          </button>
        </div>

        {/* Mensaje de éxito (aparece por 3 segundos) */}
        {success && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-3 py-1 text-sm">
            {success}
          </div>
        )}

        {/* TABLA DE ESTUDIANTES */}
        <div className="border border-gray-300">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Nombre</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Email</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Curso</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Edad</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Teléfono</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Estado de carga
                <tr><td colSpan="6" className="border border-gray-300 px-3 py-8 text-center">Cargando...</td></tr>
              ) : currentStudents.length === 0 ? (
                // Sin datos
                <tr><td colSpan="6" className="border border-gray-300 px-3 py-8 text-center">No hay estudiantes</td></tr>
              ) : (
                // Mostrar cada estudiante
                currentStudents.map((student) => (
                  <tr key={student.id}>
                    <td className="border border-gray-300 px-3 py-2">{student.nombre}</td>
                    <td className="border border-gray-300 px-3 py-2">{student.email}</td>
                    <td className="border border-gray-300 px-3 py-2">{student.curso}</td>
                    <td className="border border-gray-300 px-3 py-2">{student.edad}</td>
                    <td className="border border-gray-300 px-3 py-2">{student.telefono}</td>
                    <td className="border border-gray-300 px-3 py-2">
                      {/* Botón Editar */}
                      <button onClick={() => {
                        setEditingStudent(student)  // Guardar estudiante a editar
                        setShowForm(true)           // Abrir formulario
                      }} className="bg-blue-500 text-white px-2 py-0.5 rounded text-xs mr-1">
                        Editar
                      </button>
                      {/* Botón Eliminar */}
                      <button onClick={() => {
                        setStudentToDelete(student.id)  // Guardar ID a eliminar
                        setShowDeleteConfirm(true)      // Mostrar confirmación
                      }} className="bg-red-500 text-white px-2 py-0.5 rounded text-xs">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINACIÓN */}
        {!loading && students.length > 0 && totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 text-sm">Anterior</button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 border border-gray-300 text-sm ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white'}`}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 text-sm">Siguiente</button>
          </div>
        )}
      </div>

      {/* MODAL DEL FORMULARIO (aparece cuando showForm = true) */}
      {showForm && (
        <StudentForm
          initialData={editingStudent || {}}  // Si es edición, manda los datos del estudiante
          onSubmit={editingStudent ? handleUpdate : handleCreate}  // Decide si actualizar o crear
          onClose={() => {
            setShowForm(false)
            setEditingStudent(null)
          }}
        />
      )}

      {/* MODAL DE CONFIRMACIÓN PARA ELIMINAR */}
      <ConfirmModal
        title="Confirmar eliminación"
        message="¿Estás seguro de que deseas eliminar este estudiante?"
        isOpen={showDeleteConfirm}
        isDangerous={true}
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false)
          setStudentToDelete(null)
        }}
      />
    </div>
  )
}

export default Students