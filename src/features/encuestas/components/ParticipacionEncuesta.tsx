import { CircleCheck, TriangleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ResultadosEncuesta } from '../lib/calcular-resultados'
import { COLOR_ESTADO } from '../lib/paleta'

/**
 * Participación sobre el padrón y estado del quórum. En un condominio el
 * quórum decide si el resultado es vinculante, así que se muestra siempre
 * que la encuesta lo exija.
 *
 * El color de estado nunca va solo: siempre acompañado de ícono y texto. El
 * ámbar de advertencia queda bajo 3:1 sobre blanco, y esa es justamente la
 * mitigación que exige la paleta de estados.
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
  const color = quorumAlcanzado ? COLOR_ESTADO.bueno : COLOR_ESTADO.advertencia
  const Icono = quorumAlcanzado ? CircleCheck : TriangleAlert

  return (
    <div className="flex flex-col gap-1.5">
      <div className="text-muted-foreground flex items-baseline justify-between gap-3 text-xs">
        <span>
          <span className="text-foreground font-medium tabular-nums">{totalVotos}</span>{' '}
          de {totalElegibles} residentes
        </span>
        <span className="tabular-nums">{participacion}% de participación</span>
      </div>

      <div className="bg-muted h-1.5 overflow-hidden rounded-[3px]" aria-hidden>
        <div
          className={cn(
            'h-full rounded-[3px] transition-[width] duration-700 ease-out',
            'motion-reduce:transition-none',
            // Sin quórum exigido la barra es informativa: tono neutro, sin
            // sugerir que hay un umbral que cumplir.
            !exigeQuorum && 'bg-muted-foreground/50',
          )}
          style={{
            width: `${participacion}%`,
            backgroundColor: exigeQuorum ? color.claro : undefined,
          }}
        />
      </div>

      {exigeQuorum && (
        <p className="flex items-start gap-1.5 text-xs">
          <Icono
            className="mt-px size-3.5 shrink-0"
            style={{ color: color.claro }}
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
