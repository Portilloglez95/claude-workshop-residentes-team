import { cn } from '@/lib/utils'
import { COLOR_PUNTO_ESTADO, type NivelEstado } from '@/shared/lib/estado-visual'

/**
 * Una razón contra un límite (7 de 8 meses, 88% de cobranza). Es la forma
 * correcta para un solo ratio — no un pie de dos rebanadas.
 *
 * El track es *chrome*, no un paso de rampa de datos: ningún gris "un paso"
 * fuera de la superficie llega a 2:1, así que el valor nunca depende de verlo.
 * Lo carga el relleno (17.9:1) más la etiqueta de texto obligatoria.
 */
export function Meter({
  label,
  valor,
  maximo,
  textoValor,
  nivel = 'neutral',
}: {
  label: string
  valor: number
  maximo: number
  /** Lectura textual del valor. Obligatoria: es el canal que no puede fallar. */
  textoValor: string
  nivel?: NivelEstado
}) {
  const porcentaje = maximo > 0 ? Math.min(100, Math.max(0, (valor / maximo) * 100)) : 0

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-muted-foreground text-xs">{label}</span>
        <span className="text-xs font-medium tabular-nums">{textoValor}</span>
      </div>
      <div
        role="meter"
        aria-valuenow={valor}
        aria-valuemin={0}
        aria-valuemax={maximo}
        aria-valuetext={textoValor}
        aria-label={label}
        className="bg-border h-1.5 w-full overflow-hidden rounded-full"
      >
        <div
          className={cn(
            'h-full rounded-full',
            nivel === 'neutral' ? 'bg-primary' : COLOR_PUNTO_ESTADO[nivel],
          )}
          style={{ width: `${porcentaje}%` }}
        />
      </div>
    </div>
  )
}
