// StudentForm.jsx
import { useState, useRef, useEffect } from 'react'

const StudentForm = ({ initialData = {}, onSubmit, onClose }) => {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    curso: '',
    edad: '',
    telefono: '',
    ...initialData
  })
  const isEditing = !!initialData?.id
  const overlayRef = useRef(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose()
  }

  return (
    <div ref={overlayRef} onMouseDown={handleOverlayClick} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-blue-600 px-6 py-3">
          <h3 className="text-lg font-semibold text-white">
            {isEditing ? 'Editar Estudiante' : 'Agregar Estudiante'}
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-400" required />
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-400" required />
          <input name="curso" value={form.curso} onChange={handleChange} placeholder="Curso" className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-400" required />
          <input name="edad" type="number" value={form.edad} onChange={handleChange} placeholder="Edad" className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-400" required />
          <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-400" required />
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border rounded hover:bg-gray-50">Cancelar</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StudentForm