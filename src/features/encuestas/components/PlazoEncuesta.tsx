import { Clock, Lock } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { formatCierre } from '../lib/format-fecha'

/** Plazo de la encuesta. Se resalta cuando cierra hoy o mañana. */
export function PlazoEncuesta({
  fechaCierre,
  cerrada,
  urgente,
}: {
  fechaCierre: string
  cerrada: boolean
  urgente: boolean
}) {
  const Icono = cerrada ? Lock : Clock

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5',
        urgente && 'text-foreground font-medium',
      )}
    >
      <Icono className="size-3.5 shrink-0" aria-hidden />
      <time dateTime={fechaCierre}>{formatCierre(fechaCierre, cerrada)}</time>
    </span>
  )
}
