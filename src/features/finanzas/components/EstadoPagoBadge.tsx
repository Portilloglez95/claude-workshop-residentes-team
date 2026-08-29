import { Badge } from '@/components/ui/badge'
import type { EstadoPago } from '../types'

export function EstadoPagoBadge({ estado }: { estado: EstadoPago }) {
  if (estado === 'pagado') {
    return <Badge variant="secondary">Pagado</Badge>
  }
  return <Badge variant="outline">Pendiente</Badge>
}
