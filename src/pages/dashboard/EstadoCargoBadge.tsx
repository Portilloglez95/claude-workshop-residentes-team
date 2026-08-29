import { AlertTriangle, CalendarClock, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { COLOR_ICONO_ESTADO, type NivelEstado } from '@/shared/lib/estado-visual'
import type { EstadoCargo } from '@/features/finanzas/types'

const PRESENTACION: Record<
  EstadoCargo,
  { label: string; nivel: NivelEstado; icono: typeof Clock }
> = {
  vencido: { label: 'Vencido', nivel: 'critico', icono: AlertTriangle },
  por_vencer: { label: 'Por vencer', nivel: 'advertencia', icono: Clock },
  programado: { label: 'Programado', nivel: 'neutral', icono: CalendarClock },
}

/**
 * Estatus de un cargo. El color viaja en el ícono y el texto va en tinta:
 * el ámbar de `advertencia` está a 1.83:1 contra el blanco y sería ilegible
 * como texto. Ícono + etiqueta es lo que hace legal ese tono.
 */
export function EstadoCargoBadge({ estado }: { estado: EstadoCargo }) {
  const { label, nivel, icono: Icono } = PRESENTACION[estado]

  return (
    <Badge variant="outline" className="gap-1.5 font-normal">
      <Icono className={cn('size-3', COLOR_ICONO_ESTADO[nivel])} aria-hidden />
      {label}
    </Badge>
  )
}
