import { Badge } from '@/components/ui/badge'
import type { EstadoVisita } from '../types'

const CONFIG: Record<
  EstadoVisita,
  { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }
> = {
  esperada: { label: 'Esperada', variant: 'outline' },
  en_condominio: { label: 'En el condominio', variant: 'default' },
  finalizada: { label: 'Finalizada', variant: 'secondary' },
  cancelada: { label: 'Cancelada', variant: 'destructive' },
}

export function VisitaEstadoBadge({ estado }: { estado: EstadoVisita }) {
  const { label, variant } = CONFIG[estado]
  return <Badge variant={variant}>{label}</Badge>
}
