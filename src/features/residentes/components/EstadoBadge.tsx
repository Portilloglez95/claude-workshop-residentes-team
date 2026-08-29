import { Badge } from '@/components/ui/badge'
import type { Residente } from '../types'

export function EstadoBadge({ estado }: { estado: Residente['estado'] }) {
  if (estado === 'al_dia') {
    return <Badge variant="secondary">Al día</Badge>
  }
  return <Badge variant="destructive">Moroso</Badge>
}
