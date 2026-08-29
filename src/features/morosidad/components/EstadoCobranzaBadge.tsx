import { Badge } from '@/components/ui/badge'
import type { EstadoCobranza } from '../types'
import { ESTADO_LABEL } from '../lib/estado-cobranza'

const ESTADO_VARIANT: Record<
  EstadoCobranza,
  'destructive' | 'outline' | 'secondary' | 'default'
> = {
  al_dia: 'secondary',
  en_mora: 'outline',
  en_gestion: 'default',
  proceso_legal: 'destructive',
}

export function EstadoCobranzaBadge({ estado }: { estado: EstadoCobranza }) {
  return <Badge variant={ESTADO_VARIANT[estado]}>{ESTADO_LABEL[estado]}</Badge>
}
