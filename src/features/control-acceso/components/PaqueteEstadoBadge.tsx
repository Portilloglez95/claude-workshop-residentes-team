import { Badge } from '@/components/ui/badge'
import type { EstadoPaquete } from '../types'

export function PaqueteEstadoBadge({ estado }: { estado: EstadoPaquete }) {
  if (estado === 'entregado') {
    return <Badge variant="secondary">Entregado</Badge>
  }
  return <Badge variant="default">Pendiente</Badge>
}
