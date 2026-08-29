import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { BloqueHorario } from '../types'

export function SelectorHorario({
  bloques,
  seleccionado,
  onSeleccionar,
}: {
  bloques: BloqueHorario[]
  seleccionado: BloqueHorario | null
  onSeleccionar: (bloque: BloqueHorario) => void
}) {
  if (bloques.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Sin bloques de horario configurados.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {bloques.map((bloque) => {
        const estaSeleccionado = seleccionado?.horaInicio === bloque.horaInicio

        return (
          <Button
            key={bloque.horaInicio}
            type="button"
            variant={estaSeleccionado ? 'default' : 'outline'}
            disabled={!bloque.disponible}
            onClick={() => onSeleccionar(bloque)}
            className={cn(!bloque.disponible && 'line-through')}
          >
            {bloque.horaInicio} – {bloque.horaFin}
          </Button>
        )
      })}
    </div>
  )
}
