import { Check, Trophy } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import type { ResultadoOpcion } from '../lib/calcular-resultados'

function BarraResultado({
  resultado,
  cerrada,
}: {
  resultado: ResultadoOpcion
  cerrada: boolean
}) {
  const { opcion, votos, porcentaje, esVotoPropio, esGanadora } = resultado
  const destacada = esVotoPropio || (cerrada && esGanadora)

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className={cn('flex items-center gap-1.5', destacada && 'font-medium')}>
          {esVotoPropio && <Check className="size-3.5 shrink-0" aria-label="Tu voto" />}
          {cerrada && esGanadora && !esVotoPropio && (
            <Trophy className="size-3.5 shrink-0" aria-label="Opción más votada" />
          )}
          {opcion.texto}
        </span>
        <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
          <span className={cn(destacada && 'text-foreground font-semibold')}>
            {porcentaje}%
          </span>{' '}
          · {votos} {votos === 1 ? 'voto' : 'votos'}
        </span>
      </div>

      <div className="bg-muted h-2.5 overflow-hidden rounded-full">
        <div
          className={cn(
            'bg-primary h-full rounded-full',
            'transition-[width] duration-700 ease-out motion-reduce:transition-none',
            !destacada && 'opacity-60',
          )}
          style={{ width: `${porcentaje}%` }}
        />
      </div>
    </div>
  )
}

export function ResultadosEncuesta({
  resultados,
  cerrada,
}: {
  resultados: ResultadoOpcion[]
  cerrada: boolean
}) {
  return (
    // `aria-live` para que el lector de pantalla anuncie el conteo nuevo al votar.
    <div className="flex flex-col gap-3" aria-live="polite">
      {resultados.map((resultado) => (
        <BarraResultado
          key={resultado.opcion.id}
          resultado={resultado}
          cerrada={cerrada}
        />
      ))}
    </div>
  )
}
