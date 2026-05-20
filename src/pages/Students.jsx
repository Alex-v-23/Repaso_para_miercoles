// ============================================================
// ESTUDIANTES.JSX - PÁGINA DE ADMINISTRACIÓN DE ESTUDIANTES
// ============================================================
// Este archivo es el CORAZÓN de la gestión de estudiantes.
// Permite: VER, AGREGAR, EDITAR y ELIMINAR estudiantes.
// También CONSUME UNA API EXTERNA para obtener datos iniciales.

// ========== IMPORTACIONES ==========
import { useState, useEffect } from 'react'
// useState: crea variables que React vigila (lista de estudiantes, carga, página...)
// useEffect: ejecuta código automáticamente cuando el componente se monta o cambia

import { useNavigate } from 'react-router-dom'
// useNavigate: permite redirigir a otras páginas (ej: al login si no hay sesión)

import Sidebar from '../components/Nav'
// Sidebar: la barra lateral de navegación (menú)

import StudentForm from '../components/StudentForm'
// StudentForm: el modal (ventana emergente) para agregar/editar estudiantes

import ConfirmModal from '../components/ConfirmModal'
// ConfirmModal: ventana de confirmación para eliminar (pregunta "¿Estás seguro?")

// ========== COMPONENTE PRINCIPAL ==========
const Students = () => {

  // ----------------------------------------------------------
  // 1. ESTADOS PRINCIPALES (variables que cambian)
  // ----------------------------------------------------------
  
  const [students, setStudents] = useState([])
  // students: ARRAY con todos los estudiantes (vacío al inicio)
  // setStudents: función para actualizar la lista
  
  const [loading, setLoading] = useState(true)
  // loading: TRUE mientras carga datos, FALSE cuando ya cargó
  // Sirve para mostrar "Cargando..." mientras esperamos la API
  
  const [currentPage, setCurrentPage] = useState(1)
  // currentPage: página actual de la paginación (empieza en 1)
  
  const itemsPerPage = 5
  // itemsPerPage: cuántos estudiantes se muestran por PÁGINA (5)
  
  const navigate = useNavigate()
  // navigate: función para redirigir (ej: navigate('/') va al login)
  
  const token = localStorage.getItem('escuela_token')
  // token: revisa si el usuario está logueado (si no hay token, lo sacamos)

  // URL de la API pública que usamos para obtener datos de ejemplo
  const API_URL = 'https://jsonplaceholder.typicode.com/users'

  // ----------------------------------------------------------
  // 2. EFECTO 1: CARGAR ESTUDIANTES AL INICIAR
  // ----------------------------------------------------------
  // Este efecto se ejecuta UNA VEZ cuando la página se abre
  
  useEffect(() => {
    // PRIMERO: Verificar autenticación
    if (!token) {
      navigate('/')  // Si no hay token, redirigir al login
      return         // Salir de la función
    }

    // Función para traer datos (es asíncrona porque llama a una API)
    const fetchStudents = async () => {
      setLoading(true)  // Mostrar "Cargando..."
      
      try {
        // INTENTAR CARGAR DATOS GUARDADOS EN LOCALSTORAGE
        const stored = localStorage.getItem('escuela_students')
        
        if (stored && JSON.parse(stored).length > 0) {
          // Si HAY datos guardados, usarlos (para no llamar a la API)
          setStudents(JSON.parse(stored))
        } else {
          // Si NO HAY datos guardados, LLAMAR A LA API
          const response = await fetch(API_URL)  // Petición HTTP
          const apiData = await response.json()   // Convertir a JSON
          
          // TRANSFORMAR los datos de la API a nuestro formato
          // La API devuelve: id, name, email, phone
          // Nosotros necesitamos: id, nombre, email, curso, edad, telefono
          const transformedData = apiData.slice(0, 5).map((user, index) => ({
            id: user.id,                    // ID del usuario
            nombre: user.name,              // Nombre del usuario
            email: user.email,              // Email del usuario
            curso: ['3° A', '3° B', '4° A', '4° B', '5° A'][index % 5],
            edad: [16, 17, 16, 17, 18][index % 5],
            telefono: user.phone.split('x')[0].trim() || 'No disponible'
          }))
          
          // Guardar los datos transformados en el estado
          setStudents(transformedData)
          
          // También guardar en localStorage para la próxima vez
          localStorage.setItem('escuela_students', JSON.stringify(transformedData))
        }
      } catch (error) {
        // Si hay ERROR (ej: API no responde), mostrarlo en consola
        console.error('Error:', error)
      } finally {
        // Esto se ejecuta SIEMPRE (haya error o no)
        setLoading(false)  // Ocultar "Cargando..."
      }
    }

    fetchStudents()  // Ejecutar la función
  }, [navigate, token])  // Dependencias: si cambian, se ejecuta de nuevo

  // ----------------------------------------------------------
  // 3. EFECTO 2: GUARDAR CAMBIOS EN LOCALSTORAGE
  // ----------------------------------------------------------
  // Cada vez que cambia la lista de estudiantes, se guarda automáticamente
  
  useEffect(() => {
    // Solo guardar si hay estudiantes y ya terminó de cargar
    if (students.length > 0 && !loading) {
      localStorage.setItem('escuela_students', JSON.stringify(students))
    }
  }, [students, loading])  // Dependencias: students o loading

  // ----------------------------------------------------------
  // 4. LÓGICA DE PAGINACIÓN
  // ----------------------------------------------------------
  
  // startIndex: qué estudiante es el PRIMERO de la página actual
  // Ej: página 1 -> empieza en 0, página 2 -> empieza en 5
  const startIndex = (currentPage - 1) * itemsPerPage
  
  // currentStudents: los estudiantes que se muestran en la página ACTUAL
  const currentStudents = students.slice(startIndex, startIndex + itemsPerPage)
  
  // totalPages: número TOTAL de páginas (redondeado hacia arriba)
  // Ej: 7 estudiantes / 5 por página = 2 páginas
  const totalPages = Math.ceil(students.length / itemsPerPage)

  // ----------------------------------------------------------
  // 5. ESTADOS PARA MODALES (ventanas emergentes)
  // ----------------------------------------------------------
  
  const [showForm, setShowForm] = useState(false)
  // showForm: TRUE = mostrar el formulario, FALSE = ocultarlo
  
  const [editingStudent, setEditingStudent] = useState(null)
  // editingStudent: si NO es null, estamos EDITANDO a ese estudiante
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  // showDeleteConfirm: TRUE = mostrar confirmación para eliminar
  
  const [studentToDelete, setStudentToDelete] = useState(null)
  // studentToDelete: ID del estudiante que vamos a eliminar
  
  const [success, setSuccess] = useState('')
  // success: mensaje de éxito que aparece por 3 segundos

  // ----------------------------------------------------------
  // 6. FUNCIÓN: AGREGAR ESTUDIANTE
  // ----------------------------------------------------------
  // Se ejecuta cuando el usuario guarda un NUEVO estudiante
  
  const handleCreate = (data) => {
    // data viene del formulario con: nombre, email, curso, edad, telefono
    
    // Crear nuevo estudiante con ID único (timestamp = fecha actual en milisegundos)
    const newStudent = { ...data, id: Date.now() }
    
    // Agregar a la lista existente (los ...students mantienen los anteriores)
    setStudents([...students, newStudent])
    
    // Mostrar mensaje de éxito
    setSuccess('✓ Estudiante agregado correctamente')
    
    // Cerrar el modal del formulario
    setShowForm(false)
    
    // Borrar el mensaje después de 3 segundos
    setTimeout(() => setSuccess(''), 3000)
  }

  // ----------------------------------------------------------
  // 7. FUNCIÓN: EDITAR ESTUDIANTE
  // ----------------------------------------------------------
  // Se ejecuta cuando el usuario guarda CAMBIOS de un estudiante existente
  
  const handleUpdate = (data) => {
    // Recorrer la lista y reemplazar el estudiante editado
    // Si el ID coincide con editingStudent.id, usar los nuevos datos
    // Si no, mantener el estudiante original
    setStudents(students.map(s => 
      s.id === editingStudent.id ? { ...data, id: s.id } : s
    ))
    
    setSuccess('✓ Estudiante actualizado correctamente')
    setShowForm(false)       // Cerrar modal
    setEditingStudent(null)  // Limpiar estudiante en edición
    setTimeout(() => setSuccess(''), 3000)
  }

  // ----------------------------------------------------------
  // 8. FUNCIÓN: ELIMINAR ESTUDIANTE
  // ----------------------------------------------------------
  // Se ejecuta cuando el usuario CONFIRMA la eliminación
  
  const confirmDelete = () => {
    // Filtrar la lista: mantener SOLO los que NO tengan el ID a eliminar
    setStudents(students.filter(s => s.id !== studentToDelete))
    
    setSuccess('✓ Estudiante eliminado correctamente')
    setShowDeleteConfirm(false)  // Cerrar modal de confirmación
    setStudentToDelete(null)     // Limpiar ID
    setTimeout(() => setSuccess(''), 3000)
  }

  // ----------------------------------------------------------
  // 9. RENDERIZADO (lo que se ve en pantalla)
  // ----------------------------------------------------------
  
  return (
    // Contenedor principal: fondo blanco
    <div className="min-h-screen bg-white">
      
      {/* BARRA LATERAL (menú) */}
      <Sidebar />

      {/* CONTENIDO PRINCIPAL (con margen izquierdo de 64px para la sidebar) */}
      <div className="ml-64 p-6">

        {/* ----- TÍTULO Y BREADCRUMB ----- */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Administración</h1>
        </div>

        {/* ----- BOTÓN AGREGAR ----- */}
        <div className="mb-4 text-right">
          <button
            onClick={() => {
              setEditingStudent(null)  // Asegurar que NO es edición
              setShowForm(true)        // Mostrar formulario
            }}
            className="bg-green-600 text-white px-4 py-1 rounded text-sm"
          >
            Agregar
          </button>
        </div>

        {/* ----- MENSAJE DE ÉXITO (aparece temporalmente) ----- */}
        {success && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-3 py-1 text-sm">
            {success}
          </div>
        )}

        {/* ----- TABLA DE ESTUDIANTES ----- */}
        <div className="border border-gray-300">
          <table className="w-full border-collapse">
            
            {/* CABECERA DE LA TABLA */}
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left">Nombre</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Email</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Curso</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Edad</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Teléfono</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            
            {/* CUERPO DE LA TABLA */}
            <tbody>
              
              {/* CASO 1: ESTÁ CARGANDO */}
              {loading ? (
                <tr>
                  <td colSpan="6" className="border border-gray-300 px-3 py-8 text-center">
                    Cargando estudiantes desde API...
                  </td>
                </tr>
              ) : 
              /* CASO 2: NO HAY ESTUDIANTES */
              currentStudents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="border border-gray-300 px-3 py-8 text-center">
                    No hay estudiantes registrados
                  </td>
                </tr>
              ) : 
              /* CASO 3: MOSTRAR ESTUDIANTES */
              currentStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  {/* Cada columna con los datos del estudiante */}
                  <td className="border border-gray-300 px-3 py-2">{student.nombre}</td>
                  <td className="border border-gray-300 px-3 py-2">{student.email}</td>
                  <td className="border border-gray-300 px-3 py-2">{student.curso}</td>
                  <td className="border border-gray-300 px-3 py-2">{student.edad}</td>
                  <td className="border border-gray-300 px-3 py-2">{student.telefono}</td>
                  
                  {/* COLUMNA DE ACCIONES: botones Editar y Eliminar */}
                  <td className="border border-gray-300 px-3 py-2">
                    <button
                      onClick={() => {
                        setEditingStudent(student)  // Guardar estudiante a editar
                        setShowForm(true)           // Abrir formulario
                      }}
                      className="bg-blue-500 text-white px-2 py-0.5 rounded text-xs mr-1"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        setStudentToDelete(student.id)  // Guardar ID a eliminar
                        setShowDeleteConfirm(true)      // Mostrar confirmación
                      }}
                      className="bg-red-500 text-white px-2 py-0.5 rounded text-xs"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ----- PAGINACIÓN (solo si hay más de una página) ----- */}
        {!loading && students.length > 0 && totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {/* Botón ANTERIOR */}
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 text-sm disabled:opacity-50 bg-white"
            >
              Anterior
            </button>
            
            {/* Números de página (1, 2, 3...) */}
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border border-gray-300 text-sm ${
                  currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white'
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            {/* Botón SIGUIENTE */}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 text-sm disabled:opacity-50 bg-white"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {/* ----- MODAL: FORMULARIO (agregar/editar) ----- */}
      {showForm && (
        <StudentForm
          initialData={editingStudent || {}}  // Si es edición, pasar los datos
          onSubmit={editingStudent ? handleUpdate : handleCreate}  // Decide si actualizar o crear
          onClose={() => {
            setShowForm(false)      // Cerrar modal
            setEditingStudent(null) // Limpiar edición
          }}
        />
      )}

      {/* ----- MODAL: CONFIRMAR ELIMINACIÓN ----- */}
      <ConfirmModal
        title="Confirmar eliminación"
        message="¿Estás seguro de que deseas eliminar este estudiante?"
        isOpen={showDeleteConfirm}
        isDangerous={true}  // Estilo rojo para acción peligrosa
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false)
          setStudentToDelete(null)
        }}
      />
    </div>
  )
}

export default Students  // Exportar para usar en App.jsx