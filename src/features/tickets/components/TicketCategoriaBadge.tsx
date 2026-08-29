import { Badge } from '@/components/ui/badge'
import { CATEGORIA_LABEL } from '../lib/opciones-ticket'
import type { CategoriaTicket } from '../types'

export function TicketCategoriaBadge({ categoria }: { categoria: CategoriaTicket }) {
  return <Badge variant="outline">{CATEGORIA_LABEL[categoria]}</Badge>
}
