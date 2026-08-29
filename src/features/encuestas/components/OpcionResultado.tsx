import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ResultadoOpcion } from '../lib/calcular-resultados'

/** Barra de resultado de una opción, una vez que el residente ya votó o la encuesta cerró. */
export function OpcionResultado({ resultado }: { resultado: ResultadoOpcion }) {
  const { opcion, votos, porcentaje, esVotoPropio } = resultado

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className={cn('flex items-center gap-1.5', esVotoPropio && 'font-medium')}>
          {esVotoPropio && (
            <Check className="text-primary size-3.5 shrink-0" aria-hidden />
          )}
          {opcion.texto}
          {esVotoPropio && <span className="sr-only">(tu voto)</span>}
        </span>
        <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
          {porcentaje}% · {votos} {votos === 1 ? 'voto' : 'votos'}
        </span>
      </div>

      <div className="bg-muted h-2 overflow-hidden rounded-full">
        <div
          className={cn(
            'h-full rounded-full',
            esVotoPropio ? 'bg-primary' : 'bg-primary/40',
          )}
          style={{ width: `${porcentaje}%` }}
        />
      </div>
    </div>
  )
}
