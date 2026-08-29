import { ArrowLeft } from '@phosphor-icons/react'
import { Link, useParams } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatFecha } from '@/shared/lib/format-fecha'
import { useTicket } from '../hooks/use-ticket'
import { NuevaRespuestaForm } from '../components/NuevaRespuestaForm'
import { RespuestaItem } from '../components/RespuestaItem'
import { TicketCategoriaBadge } from '../components/TicketCategoriaBadge'
import { TicketEstadoBadge } from '../components/TicketEstadoBadge'
import { TicketUrgenciaBadge } from '../components/TicketUrgenciaBadge'

export function TicketDetallePage() {
  const { id } = useParams<{ id: string }>()
  const { data: ticket, isLoading, isError } = useTicket(id ?? '')

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <Button asChild variant="ghost" size="sm" className="w-fit">
        <Link to="/tickets">
          <ArrowLeft className="size-4" />
          Volver a tickets
        </Link>
      </Button>

      {isLoading && <p className="text-muted-foreground text-sm">Cargando…</p>}
      {isError && (
        <p className="text-destructive text-sm">No se pudo cargar el ticket.</p>
      )}
      {!isLoading && !isError && !ticket && (
        <p className="text-muted-foreground text-sm">No encontramos ese ticket.</p>
      )}

      {ticket && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{ticket.titulo}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <TicketEstadoBadge estado={ticket.estado} />
                <TicketUrgenciaBadge urgencia={ticket.urgencia} />
                <TicketCategoriaBadge categoria={ticket.categoria} />
                <span className="text-muted-foreground text-xs">
                  Reportado el {formatFecha(ticket.fechaCreacion)}
                </span>
              </div>

              <p className="text-sm whitespace-pre-line">{ticket.descripcion}</p>

              {ticket.fotoUrl && (
                <img
                  src={ticket.fotoUrl}
                  alt={`Foto adjunta al ticket: ${ticket.titulo}`}
                  className="max-h-80 w-fit rounded-md object-cover"
                />
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-medium">
              Historial de respuestas
              {ticket.respuestas.length > 0 && ` (${ticket.respuestas.length})`}
            </h2>

            {ticket.respuestas.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Todavía no hay respuestas. Administración responderá aquí en cuanto revise
                tu reporte.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {ticket.respuestas.map((respuesta) => (
                  <RespuestaItem key={respuesta.id} respuesta={respuesta} />
                ))}
              </div>
            )}

            <Separator className="my-1" />

            <NuevaRespuestaForm ticketId={ticket.id} />
          </div>
        </>
      )}
    </div>
  )
}
