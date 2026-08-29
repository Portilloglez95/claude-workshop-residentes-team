import { Badge } from '@/components/ui/badge'

export function EncuestaEstadoBadge({ cerrada }: { cerrada: boolean }) {
  return (
    <Badge variant={cerrada ? 'secondary' : 'default'}>
      {cerrada ? 'Cerrada' : 'Abierta'}
    </Badge>
  )
}
