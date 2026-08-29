import { useEffect, useRef, useState } from 'react'

/**
 * Revela un elemento cuando entra en el viewport. Se desconecta al primer
 * cruce: la animación es de entrada, no debe repetirse al subir y bajar.
 *
 * Respeta `prefers-reduced-motion`: si el usuario pidió menos movimiento,
 * devuelve `visible` de entrada y nunca observa nada.
 */
export function useRevelarAlScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(
    () =>
      typeof window === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const nodo = ref.current
    if (visible || !nodo) return

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return
        setVisible(true)
        observador.disconnect()
      },
      // Se dispara un poco antes de que el borde inferior entre, para que la
      // card ya esté completa cuando el usuario la alcanza con la vista.
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    )

    observador.observe(nodo)
    return () => observador.disconnect()
  }, [visible])

  return { ref, visible }
}
