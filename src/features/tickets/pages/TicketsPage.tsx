import { Link } from 'react-router'
import { Plus } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { useTickets } from '../hooks/use-tickets'
import { TicketCard } from '../components/TicketCard'

export function TicketsPage() {
  const { data: tickets, isLoading, isError } = useTickets()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-medium">Tickets</h1>
          <p className="text-muted-foreground text-sm">
            Reporta fallas o quejas y da seguimiento a su estado.
          </p>
        </div>
        <Button asChild>
          <Link to="/tickets/nuevo">
            <Plus className="size-4" />
            Nuevo ticket
          </Link>
        </Button>
      </div>

      {isLoading && <p className="text-muted-foreground text-sm">Cargando…</p>}
      {isError && (
        <p className="text-destructive text-sm">
          No se pudo cargar el listado de tickets.
        </p>
      )}

      {tickets && tickets.length === 0 && (
        <p className="text-muted-foreground text-sm">
          Todavía no has reportado ningún ticket.
        </p>
      )}

      {tickets && tickets.length > 0 && (
        <div className="flex flex-col gap-3">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  )
}
