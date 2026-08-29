import { Badge } from '@/components/ui/badge'
import type { EstadoTicket } from '../types'

const ESTADO_CONFIG: Record<
  EstadoTicket,
  { label: string; variant: 'default' | 'secondary' | 'outline' }
> = {
  abierto: { label: 'Abierto', variant: 'default' },
  en_proceso: { label: 'En proceso', variant: 'secondary' },
  cerrado: { label: 'Cerrado', variant: 'outline' },
}

export function TicketEstadoBadge({ estado }: { estado: EstadoTicket }) {
  const { label, variant } = ESTADO_CONFIG[estado]
  return <Badge variant={variant}>{label}</Badge>
}
