import { CircleCheck, TriangleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Meter } from '@/shared/components/charts/Meter'
import { COLOR_ICONO_ESTADO, type NivelEstado } from '@/shared/lib/estado-visual'
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
  const nivel: NivelEstado = !exigeQuorum
    ? 'neutral'
    : quorumAlcanzado
      ? 'bueno'
      : 'advertencia'
  const Icono = quorumAlcanzado ? CircleCheck : TriangleAlert

  return (
    <div className="flex flex-col gap-1.5">
      <Meter
        label={`${totalVotos} de ${totalElegibles} vecinos`}
        valor={totalVotos}
        maximo={totalElegibles}
        textoValor={`${participacion}% de participación`}
        nivel={nivel}
      />

      {exigeQuorum && (
        <p className="flex items-start gap-1.5 text-xs">
          <Icono
            className={cn('mt-px size-3.5 shrink-0', COLOR_ICONO_ESTADO[nivel])}
            aria-hidden
          />
          <span className={quorumAlcanzado ? 'text-muted-foreground' : 'text-foreground'}>
            {quorumAlcanzado
              ? 'Quórum alcanzado — el resultado es vinculante.'
              : cerrada
                ? `Cerró sin quórum: faltaron ${votosParaQuorum} votos.`
                : `Faltan ${votosParaQuorum} votos para alcanzar el quórum.`}
          </span>
        </p>
      )}
    </div>
  )
}
