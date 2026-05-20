// ========== IMPORTACIONES ==========
import { useRef, useEffect } from 'react'
// useRef: permite crear una referencia a un elemento HTML (para detectar clicks fuera del modal)
// useEffect: ejecuta código cuando el modal se abre o cierra

// ========== COMPONENTE PRINCIPAL ==========
// Recibe 6 props (propiedades) desde el componente padre (Students.jsx)
const ConfirmModal = ({ 
  title,        // Título del modal (ej: "Confirmar eliminación")
  message,      // Mensaje del modal (ej: "¿Estás seguro de que deseas eliminar...?")
  onConfirm,    // Función que se ejecuta si el usuario hace clic en "Confirmar"
  onCancel,     // Función que se ejecuta si el usuario hace clic en "Cancelar"
  isOpen = false,     // TRUE = mostrar el modal, FALSE = ocultarlo (por defecto FALSE)
  isDangerous = false // TRUE = fondo rojo (acción peligrosa), FALSE = fondo gris
}) => {

  // ========== REFERENCIA AL FONDO (overlay) ==========
  // overlayRef es una "referencia" que apunta al div del fondo gris
  // Sirve para detectar cuando el usuario hace clic FUERA del modal
  const overlayRef = useRef(null)
  // useRef(null) crea una referencia vacía
  // Luego la conectamos al div con ref={overlayRef}

  // ========== EFECTO: DETECTAR TECLA ESCAPE ==========
  // Este efecto se ejecuta cada vez que el modal se abre o se cierra
  
  useEffect(() => {
    // Función que se ejecuta cuando el usuario presiona una tecla
    const onKey = (e) => {
      // Si la tecla presionada es ESCAPE (código 'Escape')
      if (e.key === 'Escape') {
        onCancel()  // Ejecutar la función onCancel (cerrar modal)
      }
    }
    
    // Si el modal está ABIERTO (isOpen = true)
    if (isOpen) {
      // Agregar un "escuchador" de eventos para teclas
      window.addEventListener('keydown', onKey)
    }
    
    // Función de limpieza: cuando el modal se cierra o el componente se destruye
    return () => {
      // Remover el escuchador de eventos (buena práctica para evitar errores)
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, onCancel])  // Dependencias: si isOpen o onCancel cambian, se ejecuta de nuevo

  // ========== FUNCIÓN: DETECTAR CLICK FUERA DEL MODAL ==========
  // Esta función se ejecuta cuando el usuario hace clic en cualquier parte
  
  const handleOverlayClick = (e) => {
    // e.target es el elemento donde se hizo clic
    // overlayRef.current es el div del fondo gris
    
    // Si el clic fue EXACTAMENTE en el fondo (no en el contenido blanco)
    if (e.target === overlayRef.current) {
      onCancel()  // Cerrar el modal (como si presionara Cancelar)
    }
  }

  // ========== CONDICIÓN: SI EL MODAL ESTÁ CERRADO, NO MOSTRAR NADA ==========
  // Si isOpen es FALSE, este componente NO renderiza nada (retorna null)
  if (!isOpen) return null

  // ========== RENDERIZADO DEL MODAL ==========
  return (
    // ===== OVERLAY (fondo gris semitransparente) =====
    // fixed: posición fija en la pantalla
    // inset-0: ocupa toda la pantalla (top-0, left-0, right-0, bottom-0)
    // z-50: capa más alta (por encima de todo)
    // bg-black/50: fondo negro con 50% de opacidad
    // flex items-center justify-center: centra el contenido
    <div 
      ref={overlayRef}              // Conectar la referencia a este div
      onMouseDown={handleOverlayClick}  // Detectar clics en el fondo
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
    >
      
      {/* ===== CONTENEDOR DEL MODAL (cuadro blanco) ===== */}
      {/* w-full max-w-md: ancho máximo 448px, ocupa todo en móvil */}
      {/* bg-white: fondo blanco */}
      {/* border border-gray-300: borde gris */}
      <div className="w-full max-w-md bg-white border border-gray-300">
        
        {/* ===== CABECERA DEL MODAL ===== */}
        {/* isDangerous ? usa rojo : usa gris */}
        <div className={`px-4 py-2 ${isDangerous ? 'bg-red-500 text-white' : 'bg-gray-200'}`}>
          <h3 className="text-lg font-semibold">
            {title}  {/* Muestra el título que viene por prop */}
          </h3>
        </div>
        
        {/* ===== CUERPO DEL MODAL ===== */}
        <div className="p-4">
          {/* Mensaje de confirmación */}
          <p className="text-gray-700">{message}</p>
          
          {/* ===== BOTONES ===== */}
          <div className="flex justify-end gap-2 mt-4">
            
            {/* Botón CANCELAR */}
            <button 
              onClick={onCancel}  // Ejecuta onCancel cuando hace clic
              className="px-3 py-1 border border-gray-300 hover:bg-gray-100"
            >
              Cancelar
            </button>
            
            {/* Botón CONFIRMAR */}
            {/* Si isDangerous es TRUE: fondo rojo, si no: fondo azul */}
            <button 
              onClick={onConfirm}  // Ejecuta onConfirm cuando hace clic
              className={`px-3 py-1 text-white ${
                isDangerous 
                  ? 'bg-red-500 hover:bg-red-600'   // Modo peligroso (rojo)
                  : 'bg-blue-600 hover:bg-blue-700'  // Modo normal (azul)
              }`}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal