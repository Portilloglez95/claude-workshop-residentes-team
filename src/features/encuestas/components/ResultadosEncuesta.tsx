import { Check, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ResultadoOpcion } from '../lib/calcular-resultados'
import { varsDeColor } from '../lib/paleta'

function BarraResultado({
  resultado,
  indice,
  cerrada,
}: {
  resultado: ResultadoOpcion
  indice: number
  cerrada: boolean
}) {
  const { opcion, votos, porcentaje, esVotoPropio, esGanadora } = resultado
  // El color pertenece a la opción, no a su lugar en el ranking: la ganadora
  // se destaca con ícono y peso, nunca recoloreándola.
  const destacada = esVotoPropio || (cerrada && esGanadora)

  return (
    <div className="flex flex-col gap-1.5" style={varsDeColor(indice)}>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className={cn('flex items-center gap-1.5', destacada && 'font-medium')}>
          <span
            className="size-2.5 shrink-0 rounded-[3px] bg-[var(--serie)] dark:bg-[var(--serie-oscuro)]"
            aria-hidden
          />
          {esVotoPropio && <Check className="size-3.5 shrink-0" aria-label="Tu voto" />}
          {cerrada && esGanadora && !esVotoPropio && (
            <Trophy className="size-3.5 shrink-0" aria-label="Opción más votada" />
          )}
          {opcion.texto}
        </span>
        <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
          <span className={cn(destacada && 'text-foreground font-medium')}>
            {porcentaje}%
          </span>{' '}
          · {votos} {votos === 1 ? 'voto' : 'votos'}
        </span>
      </div>

      <div className="bg-muted h-2.5 overflow-hidden rounded-[4px]">
        <div
          className={cn(
            'h-full rounded-[4px] bg-[var(--serie)] dark:bg-[var(--serie-oscuro)]',
            'transition-[width] duration-700 ease-out motion-reduce:transition-none',
            !destacada && 'opacity-70',
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
      {resultados.map((resultado, indice) => (
        <BarraResultado
          key={resultado.opcion.id}
          resultado={resultado}
          indice={indice}
          cerrada={cerrada}
        />
      ))}
    </div>
  )
}
