import { Badge } from '@/components/ui/badge'
import type { EstatusMorosidad } from '../types'

const LABELS: Record<EstatusMorosidad, string> = {
  cobranza_legal: 'En cobranza legal',
  convenio_pago: 'Convenio de pago',
  notificado: 'Notificado',
}

const VARIANTS: Record<EstatusMorosidad, 'destructive' | 'outline' | 'secondary'> = {
  cobranza_legal: 'destructive',
  convenio_pago: 'outline',
  notificado: 'secondary',
}

export function EstatusMorosidadBadge({ estatus }: { estatus: EstatusMorosidad }) {
  return <Badge variant={VARIANTS[estatus]}>{LABELS[estatus]}</Badge>
}
