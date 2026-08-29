import { Badge } from '@/components/ui/badge'
import type { EstadoReserva } from '../types'

const ESTADO_CONFIG: Record<
  EstadoReserva,
  { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }
> = {
  pendiente: { label: 'Pendiente de aprobación', variant: 'secondary' },
  confirmada: { label: 'Confirmada', variant: 'default' },
  cancelada: { label: 'Cancelada', variant: 'outline' },
  rechazada: { label: 'Rechazada', variant: 'destructive' },
}

export function ReservaEstadoBadge({ estado }: { estado: EstadoReserva }) {
  const { label, variant } = ESTADO_CONFIG[estado]
  return <Badge variant={variant}>{label}</Badge>
}
