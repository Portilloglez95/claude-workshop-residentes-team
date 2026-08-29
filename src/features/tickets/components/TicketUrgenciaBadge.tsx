import { Badge } from '@/components/ui/badge'
import { URGENCIA_LABEL } from '../lib/opciones-ticket'
import type { UrgenciaTicket } from '../types'

const VARIANT: Record<UrgenciaTicket, 'destructive' | 'secondary' | 'outline'> = {
  alta: 'destructive',
  media: 'secondary',
  baja: 'outline',
}

export function TicketUrgenciaBadge({ urgencia }: { urgencia: UrgenciaTicket }) {
  return <Badge variant={VARIANT[urgencia]}>{URGENCIA_LABEL[urgencia]}</Badge>
}
