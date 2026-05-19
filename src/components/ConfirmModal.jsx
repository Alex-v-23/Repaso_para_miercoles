// ConfirmModal.jsx
import { useRef, useEffect } from 'react'

const ConfirmModal = ({ title, message, onConfirm, onCancel, isOpen = false, isDangerous = false }) => {
  const overlayRef = useRef(null)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onCancel()
    if (isOpen) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onCancel])

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onCancel()
  }

  if (!isOpen) return null

  return (
    <div ref={overlayRef} onMouseDown={handleOverlayClick} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        <div className={`px-6 py-3 ${isDangerous ? 'bg-red-500' : 'bg-blue-600'}`}>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <div className="p-6">
          <p className="text-gray-600">{message}</p>
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={onCancel} className="px-4 py-2 border rounded hover:bg-gray-50">Cancelar</button>
            <button onClick={onConfirm} className={`px-4 py-2 rounded text-white ${isDangerous ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}`}>Confirmar</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal