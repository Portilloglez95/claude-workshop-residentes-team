import { cn } from '@/lib/utils'
import type { ResultadosEncuesta } from '../lib/calcular-resultados'

/**
 * Participación sobre el padrón y estado del quórum. En un condominio el
 * quórum decide si el resultado es vinculante, así que se muestra siempre
 * que la encuesta lo exija.
 */
export function ParticipacionEncuesta({
  resultados,
  totalElegibles,
  exigeQuorum,
  cerrada,
}: {
  resultados: ResultadosEncuesta
  totalElegibles: number
  exigeQuorum: boolean
  cerrada: boolean
}) {
  const { totalVotos, participacion, quorumAlcanzado, votosParaQuorum } = resultados

  return (
    <div className="flex flex-col gap-1.5">
      <div className="text-muted-foreground flex items-baseline justify-between gap-3 text-xs">
        <span>
          <span className="text-foreground font-medium tabular-nums">{totalVotos}</span>{' '}
          de {totalElegibles} residentes
        </span>
        <span className="tabular-nums">{participacion}% de participación</span>
      </div>

      <div className="bg-muted h-1 overflow-hidden rounded-full" aria-hidden>
        <div
          className="bg-muted-foreground/50 h-full rounded-full transition-[width] duration-500 ease-out"
          style={{ width: `${participacion}%` }}
        />
      </div>

      {exigeQuorum && (
        <p
          className={cn(
            'text-xs',
            quorumAlcanzado ? 'text-muted-foreground' : 'text-foreground font-medium',
          )}
        >
          {quorumAlcanzado
            ? 'Quórum alcanzado — el resultado es vinculante.'
            : cerrada
              ? `Cerró sin quórum: faltaron ${votosParaQuorum} votos.`
              : `Faltan ${votosParaQuorum} votos para alcanzar el quórum.`}
        </p>
      )}
    </div>
  )
}
