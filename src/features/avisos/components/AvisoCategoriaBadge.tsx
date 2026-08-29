import { Badge } from '@/components/ui/badge'
import type { CategoriaAviso } from '../types'

const CATEGORIA_CONFIG: Record<
  CategoriaAviso,
  { label: string; variant: 'destructive' | 'outline' | 'secondary' | 'default' }
> = {
  emergencia: { label: 'Emergencia', variant: 'destructive' },
  mantenimiento: { label: 'Mantenimiento', variant: 'outline' },
  administrativo: { label: 'Administrativo', variant: 'secondary' },
  social: { label: 'Social', variant: 'default' },
}

export function AvisoCategoriaBadge({ categoria }: { categoria: CategoriaAviso }) {
  const { label, variant } = CATEGORIA_CONFIG[categoria]
  return <Badge variant={variant}>{label}</Badge>
}
