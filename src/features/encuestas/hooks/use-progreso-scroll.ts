import { useEffect, useState } from 'react'

/** Busca el ancestro que realmente scrollea (en esta app es el <main>). */
function contenedorScrolleable(nodo: HTMLElement | null): HTMLElement | null {
  let actual = nodo?.parentElement ?? null
  while (actual) {
    const desborde = getComputedStyle(actual).overflowY
    if (desborde === 'auto' || desborde === 'scroll') return actual
    actual = actual.parentElement
  }
  return null
}

/**
 * Progreso de lectura (0–1) del contenedor que scrollea. El layout de la app
 * scrollea en un `<main class="overflow-auto">`, no en la ventana, así que
 * escuchar `window` no serviría: hay que encontrar el contenedor real.
 */
export function useProgresoScroll(ancla: React.RefObject<HTMLElement | null>) {
  const [progreso, setProgreso] = useState(0)

  useEffect(() => {
    const contenedor = contenedorScrolleable(ancla.current)
    if (!contenedor) return

    let pendiente = 0
    const medir = () => {
      pendiente = 0
      const recorrido = contenedor.scrollHeight - contenedor.clientHeight
      setProgreso(recorrido <= 0 ? 0 : contenedor.scrollTop / recorrido)
    }
    // El scroll dispara muy seguido; se colapsa a un cálculo por frame.
    const alScrollear = () => {
      if (pendiente) return
      pendiente = requestAnimationFrame(medir)
    }

    medir()
    contenedor.addEventListener('scroll', alScrollear, { passive: true })
    const observador = new ResizeObserver(medir)
    observador.observe(contenedor)

    return () => {
      contenedor.removeEventListener('scroll', alScrollear)
      observador.disconnect()
      if (pendiente) cancelAnimationFrame(pendiente)
    }
  }, [ancla])

  return progreso
}
