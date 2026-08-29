import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { COLOR_PUNTO_ESTADO, type NivelEstado } from '@/shared/lib/estado-visual'
import { Sparkline } from './Sparkline'

/**
 * Tile de una cifra: `label` · `value` · `delta` opcional · `trend` opcional.
 *
 * El valor usa figuras proporcionales (sin `tabular-nums`): a este tamaño los
 * dígitos de ancho fijo se ven flojos. `tabular-nums` se reserva para columnas
 * que tienen que alinearse verticalmente.
 *
 * Superset del `StatTile` de `features/finanzas` (agrega delta y sparkline).
 * TODO: al tocar finanzas conviene apuntar esa página aquí y borrar el local.
 */
export function StatTile({
  label,
  value,
  hint,
  delta,
  serie,
  accent = false,
  nivelDelta = 'neutral',
}: {
  label: string
  value: string
  hint?: string
  /** Variación ya formateada y con signo, p. ej. `+8.4%`. */
  delta?: string | null
  /** 12 puntos para el sparkline de tendencia. */
  serie?: number[]
  accent?: boolean
  /** Colorea el punto del delta según si la dirección es buena o mala. */
  nivelDelta?: NivelEstado
}) {
  return (
    <Card className={cn(accent && 'border-l-primary border-l-2')}>
      <CardContent className="flex flex-col gap-1.5">
        <div className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          {label}
        </div>

        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <div className="font-heading text-2xl font-medium">{value}</div>
            {delta && (
              <div className="mt-1 flex items-center gap-1.5">
                <span
                  className={cn(
                    'size-1.5 shrink-0 rounded-full',
                    COLOR_PUNTO_ESTADO[nivelDelta],
                  )}
                  aria-hidden
                />
                {/* El texto va en tinta, nunca en el color del dato. */}
                <span className="text-muted-foreground text-xs">{delta}</span>
              </div>
            )}
          </div>

          {serie && serie.length > 1 && (
            <Sparkline puntos={serie} etiqueta={`Tendencia de ${label}`} />
          )}
        </div>

        {hint && <div className="text-muted-foreground text-xs">{hint}</div>}
      </CardContent>
    </Card>
  )
}
