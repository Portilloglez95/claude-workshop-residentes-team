import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { OpcionEncuesta } from '../types'
import { varsDeColor } from '../lib/paleta'

/**
 * Selección de una opción y confirmación explícita. El voto no se emite al
 * primer clic a propósito: es una acción con consecuencia y un clic
 * accidental no debería registrarla.
 *
 * Implementa el patrón radiogroup a mano (no hay `radio-group` en
 * `components/ui`): flechas para moverse, roving tabindex para que el grupo
 * ocupe una sola parada de tabulador.
 */
export function OpcionesVotacion({
  opciones,
  votoActual,
  etiqueta,
  onConfirmar,
  onCancelar,
}: {
  opciones: OpcionEncuesta[]
  votoActual: string | null
  etiqueta: string
  onConfirmar: (opcionId: string) => void
  onCancelar?: () => void
}) {
  const [seleccion, setSeleccion] = useState<string | null>(votoActual)
  const refs = useRef<Array<HTMLButtonElement | null>>([])

  const indiceSeleccionado = opciones.findIndex((opcion) => opcion.id === seleccion)
  const indiceFocal = indiceSeleccionado === -1 ? 0 : indiceSeleccionado

  function moverFoco(evento: React.KeyboardEvent, indice: number) {
    const teclas: Record<string, number> = {
      ArrowDown: 1,
      ArrowRight: 1,
      ArrowUp: -1,
      ArrowLeft: -1,
    }
    const paso = teclas[evento.key]
    if (paso === undefined) return

    evento.preventDefault()
    const siguiente = (indice + paso + opciones.length) % opciones.length
    setSeleccion(opciones[siguiente].id)
    refs.current[siguiente]?.focus()
  }

  const cambiado = seleccion !== null && seleccion !== votoActual

  return (
    <div className="flex flex-col gap-3">
      <div role="radiogroup" aria-label={etiqueta} className="flex flex-col gap-2">
        {opciones.map((opcion, indice) => {
          const elegida = opcion.id === seleccion
          return (
            <button
              key={opcion.id}
              ref={(nodo) => {
                refs.current[indice] = nodo
              }}
              type="button"
              role="radio"
              aria-checked={elegida}
              tabIndex={indice === indiceFocal ? 0 : -1}
              onClick={() => setSeleccion(opcion.id)}
              onKeyDown={(evento) => moverFoco(evento, indice)}
              style={varsDeColor(indice)}
              className={cn(
                'group flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-sm',
                'focus-visible:ring-ring/50 transition-colors focus-visible:ring-3 focus-visible:outline-none',
                elegida
                  ? 'bg-muted/50 border-[var(--serie)] font-medium dark:border-[var(--serie-oscuro)]'
                  : 'border-border hover:border-foreground/20 hover:bg-muted/40',
              )}
            >
              <span
                className={cn(
                  'flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors',
                  elegida
                    ? 'border-[var(--serie)] dark:border-[var(--serie-oscuro)]'
                    : 'border-muted-foreground/40',
                )}
                aria-hidden
              >
                {elegida && (
                  <span className="size-2 rounded-full bg-[var(--serie)] dark:bg-[var(--serie-oscuro)]" />
                )}
              </span>
              {opcion.texto}
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          disabled={!cambiado}
          onClick={() => seleccion && onConfirmar(seleccion)}
        >
          {votoActual === null ? 'Enviar voto' : 'Guardar cambio'}
        </Button>
        {onCancelar && (
          <Button type="button" size="sm" variant="ghost" onClick={onCancelar}>
            Cancelar
          </Button>
        )}
      </div>
    </div>
  )
}
