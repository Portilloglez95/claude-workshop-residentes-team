import { Link } from 'react-router'
import { Card, CardContent } from '@/components/ui/card'
import { formatFecha } from '@/shared/lib/format-fecha'
import type { Ticket } from '../types'
import { TicketCategoriaBadge } from './TicketCategoriaBadge'
import { TicketEstadoBadge } from './TicketEstadoBadge'
import { TicketUrgenciaBadge } from './TicketUrgenciaBadge'

export function TicketCard({ ticket }: { ticket: Ticket }) {
  const cantidadRespuestas = ticket.respuestas.length

  return (
    <Card>
      <CardContent>
        <Link to={`/tickets/${ticket.id}`} className="flex flex-col gap-2">
          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
            <span className="text-sm font-semibold">{ticket.titulo}</span>
            <span className="text-muted-foreground shrink-0 text-xs">
              {formatFecha(ticket.fechaCreacion)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <TicketEstadoBadge estado={ticket.estado} />
            <TicketUrgenciaBadge urgencia={ticket.urgencia} />
            <TicketCategoriaBadge categoria={ticket.categoria} />
          </div>

          <p className="text-muted-foreground line-clamp-2 text-sm">
            {ticket.descripcion}
          </p>

          <span className="text-muted-foreground text-xs">
            {cantidadRespuestas === 0
              ? 'Sin respuestas todavía'
              : `${cantidadRespuestas} respuesta${cantidadRespuestas === 1 ? '' : 's'}`}
          </span>
        </Link>
      </CardContent>
    </Card>
  )
}
