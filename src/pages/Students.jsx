// Students.jsx - Tabla con diseño exacto de tu imagen
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import Sidebar from '../components/Nav'
import StudentForm from '../components/StudentForm'
import ConfirmModal from '../components/ConfirmModal'

const Students = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const navigate = useNavigate()
  const token = localStorage.getItem('escuela_token')

  const initialStudents = [
    { id: 1, nombre: 'Ana García', email: 'ana@escuela.com', curso: '3° A', edad: 16, telefono: '555-0101' },
    { id: 2, nombre: 'Carlos López', email: 'carlos@escuela.com', curso: '3° B', edad: 17, telefono: '555-0102' },
    { id: 3, nombre: 'María Fernández', email: 'maria@escuela.com', curso: '4° A', edad: 16, telefono: '555-0103' },
    { id: 4, nombre: 'José Martínez', email: 'jose@escuela.com', curso: '4° B', edad: 17, telefono: '555-0104' },
    { id: 5, nombre: 'Laura Sánchez', email: 'laura@escuela.com', curso: '5° A', edad: 18, telefono: '555-0105' },
    { id: 6, nombre: 'Pedro Ramírez', email: 'pedro@escuela.com', curso: '5° B', edad: 18, telefono: '555-0106' },
    { id: 7, nombre: 'Sofia Torres', email: 'sofia@escuela.com', curso: '3° A', edad: 15, telefono: '555-0107' },
  ]

  const startIndex = (currentPage - 1) * itemsPerPage
  const currentStudents = students.slice(startIndex, startIndex + itemsPerPage)
  const totalPages = Math.ceil(students.length / itemsPerPage)

  useEffect(() => {
    if (!token) {
      navigate('/')
      return
    }
    const stored = localStorage.getItem('escuela_students')
    if (stored) {
      setStudents(JSON.parse(stored))
    } else {
      setStudents(initialStudents)
      localStorage.setItem('escuela_students', JSON.stringify(initialStudents))
    }
    setLoading(false)
  }, [navigate, token])

  useEffect(() => {
    if (students.length > 0 && !loading) {
      localStorage.setItem('escuela_students', JSON.stringify(students))
    }
  }, [students, loading])

  const [showForm, setShowForm] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState(null)
  const [success, setSuccess] = useState('')

  const handleCreate = (data) => {
    const newStudent = { ...data, id: Date.now() }
    setStudents([newStudent, ...students])
    setSuccess('✓ Estudiante agregado correctamente')
    setShowForm(false)
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleUpdate = (data) => {
    setStudents(students.map(s => s.id === editingStudent.id ? { ...data, id: s.id } : s))
    setSuccess('✓ Estudiante actualizado correctamente')
    setShowForm(false)
    setEditingStudent(null)
    setTimeout(() => setSuccess(''), 3000)
  }

  const confirmDelete = () => {
    setStudents(students.filter(s => s.id !== studentToDelete))
    setSuccess('✓ Estudiante eliminado correctamente')
    setShowDeleteConfirm(false)
    setStudentToDelete(null)
    setTimeout(() => setSuccess(''), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />

      <div className="ml-64 p-6">
        {/* Administración */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Administración</h1>

        {/* Inicio y Estudiantes */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Inicio</h2>
              <p className="text-gray-500">Estudiantes</p>
            </div>
            <button
              onClick={() => {
                setEditingStudent(null)
                setShowForm(true)
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition"
            >
              Agregar
            </button>
          </div>
        </div>

        {/* Mensaje de éxito */}
        {success && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
            {success}
          </div>
        )}

        {/* Tabla con bordes exactos */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-600">Campo</th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-600">Campo</th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-600">Campo</th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-600">Campo</th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-600">Campo</th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                      Cargando estudiantes...
                    </td>
                  </tr>
                ) : currentStudents.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                      No hay estudiantes registrados
                    </td>
                  </tr>
                ) : (
                  currentStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 text-gray-700">{student.nombre}</td>
                      <td className="border border-gray-300 px-4 py-2 text-gray-700">{student.email}</td>
                      <td className="border border-gray-300 px-4 py-2 text-gray-700">{student.curso}</td>
                      <td className="border border-gray-300 px-4 py-2 text-gray-700">{student.edad}</td>
                      <td className="border border-gray-300 px-4 py-2 text-gray-700">{student.telefono}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <button
                          onClick={() => {
                            setEditingStudent(student)
                            setShowForm(true)
                          }}
                          className="bg-blue-500 text-white px-3 py-1 rounded text-sm mr-2 hover:bg-blue-600"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => {
                            setStudentToDelete(student.id)
                            setShowDeleteConfirm(true)
                          }}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                        >
                          Eliminar
                        </button>
                       </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación: Anterior 1 2 3 Siguiente */}
          {!loading && students.length > 0 && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-1 border border-gray-300 rounded text-gray-600 disabled:opacity-50 hover:bg-gray-100 transition"
              >
                Anterior
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-1 rounded transition ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-1 border border-gray-300 rounded text-gray-600 disabled:opacity-50 hover:bg-gray-100 transition"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      {showForm && (
        <StudentForm
          initialData={editingStudent || {}}
          onSubmit={editingStudent ? handleUpdate : handleCreate}
          onClose={() => {
            setShowForm(false)
            setEditingStudent(null)
          }}
        />
      )}

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