import { cn } from '@/lib/utils'
import type { OpcionEncuesta } from '../types'

/** Opción votable, mostrada mientras la encuesta sigue abierta y sin voto emitido. */
export function OpcionVoto({
  opcion,
  onVotar,
}: {
  opcion: OpcionEncuesta
  onVotar: (opcionId: string) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onVotar(opcion.id)}
      className={cn(
        'border-input hover:border-primary hover:bg-primary/[0.04] rounded-md border px-3 py-2',
        'focus-visible:ring-ring text-left text-sm transition-colors focus-visible:ring-2',
        'focus-visible:outline-none',
      )}
    >
      {opcion.texto}
    </button>
  )
}
