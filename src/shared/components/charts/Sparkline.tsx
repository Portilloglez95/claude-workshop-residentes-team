/**
 * Sparkline de 12 puntos para acompañar el valor de un stat tile. Serie única:
 * el trazo va en el gris de de-énfasis y solo el periodo actual lleva el punto
 * en acento. Sin ejes, sin etiquetas, sin leyenda — el tile ya dice qué es.
 *
 * No es un canal de lectura de valores: da forma a la tendencia. Los valores
 * exactos viven en el tile, en el gráfico grande y en su vista de tabla.
 */
export function Sparkline({
  puntos,
  etiqueta,
  alto = 28,
}: {
  puntos: number[]
  /** Descripción para lectores de pantalla; el dibujo queda `aria-hidden`. */
  etiqueta: string
  alto?: number
}) {
  if (puntos.length < 2) return null

  const ancho = 96
  const min = Math.min(...puntos)
  const max = Math.max(...puntos)
  const rango = max - min || 1
  // 2px de margen arriba y abajo para que el trazo y el punto no se recorten.
  const margen = 2
  const utilizable = alto - margen * 2

  const coords = puntos.map((valor, i) => {
    const x = (i / (puntos.length - 1)) * ancho
    const y = margen + utilizable - ((valor - min) / rango) * utilizable
    return [x, y] as const
  })

  const trazo = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x} ${y}`).join(' ')
  const ultimo = coords[coords.length - 1]

  return (
    <svg
      width={ancho}
      height={alto}
      viewBox={`0 0 ${ancho} ${alto}`}
      role="img"
      aria-label={etiqueta}
      className="overflow-visible"
    >
      <path
        d={trazo}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-muted-foreground"
      />
      {/* Anillo de 2px en el color de la superficie: mantiene el punto legible
          donde cruza el trazo. */}
      <circle
        cx={ultimo[0]}
        cy={ultimo[1]}
        r={4}
        className="fill-primary stroke-card"
        strokeWidth={2}
      />
    </svg>
  )
}
