import { Link } from 'react-router'
import { cn } from '@/lib/utils'
import { formatHora } from '../lib/format-hora'
import type { MensajeChat } from '../types'

export function MensajeBubble({ mensaje }: { mensaje: MensajeChat }) {
  const esResidente = mensaje.rol === 'residente'

  return (
    <div className={cn('flex flex-col gap-1', esResidente ? 'items-end' : 'items-start')}>
      {mensaje.ticketId && (
        <Link
          to={`/tickets/${mensaje.ticketId}`}
          className="text-muted-foreground px-1 text-xs hover:underline"
        >
          Actualización de ticket #{mensaje.ticketId.toUpperCase()}
        </Link>
      )}
      <div
        className={cn(
          'max-w-[80%] rounded-lg px-3 py-2 text-sm',
          esResidente ? 'bg-primary text-primary-foreground' : 'bg-muted',
        )}
      >
        {mensaje.texto}
      </div>
      <span className="text-muted-foreground px-1 text-xs">
        {formatHora(mensaje.fecha)}
      </span>
    </div>
  )
}
