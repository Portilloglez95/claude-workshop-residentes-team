import { useRef } from 'react'
import { useProgresoScroll } from '../hooks/use-progreso-scroll'

/**
 * Casita pixel que baja caminando por un riel mientras lees.
 *
 * Personaje propio, dibujado aquí en una retícula de 16×16: no es la
 * mascota de Claude ni la de nadie más. La idea temática es que las
 * ventanas son los ojos — es un condominio mirándote de vuelta.
 *
 * Es decorativo, pero se gana el lugar marcando el progreso de lectura:
 * el riel es el largo de la página y él es dónde vas. Por eso `aria-hidden`,
 * no aporta nada que la barra de scroll no diga ya.
 */

// '#' cuerpo · 'o' hueco (ventanas y puerta) · '.' vacío
const CUERPO = [
  '................',
  '.......##.......',
  '......####......',
  '.....######.....',
  '....########....',
  '...##########...',
  '..############..',
  '...##########...',
  '...#oo####oo#...',
  '...#oo####oo#...',
  '...##########...',
  '...####oo####...',
  '...####oo####...',
  '...##########...',
  '....##....##....',
]

// Las patas alternan para que se lea como caminata, no como deslizamiento.
const PASOS = ['....##..........', '..........##....']

export function AcompananteScroll() {
  const ancla = useRef<HTMLDivElement>(null)
  const progreso = useProgresoScroll(ancla)

  const filas = [...CUERPO, PASOS[Math.floor(progreso * 26) % 2]]
  const rebote = Math.sin(progreso * Math.PI * 13) * 1.2

  return (
    <div
      ref={ancla}
      aria-hidden
      className="pointer-events-none absolute top-0 right-0 hidden h-full w-9 lg:block"
    >
      <div className="sticky top-24 h-[62vh]">
        <div className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 rounded-full bg-[var(--linea)]" />
        <div
          className="absolute left-1/2 transition-[top] duration-150 ease-out motion-reduce:transition-none"
          style={{
            top: `calc(${progreso * 100}% - 16px)`,
            transform: `translateX(-50%) translateY(${rebote}px)`,
          }}
        >
          <svg width="32" height="32" viewBox="0 0 16 16" shapeRendering="crispEdges">
            {filas.map((fila, y) =>
              [...fila].map((celda, x) =>
                celda === '.' ? null : (
                  <rect
                    key={`${x}-${y}`}
                    x={x}
                    y={y}
                    width="1"
                    height="1"
                    fill={celda === 'o' ? 'var(--acento-contraste)' : 'var(--acento)'}
                  />
                ),
              ),
            )}
          </svg>
        </div>
      </div>
    </div>
  )
}
