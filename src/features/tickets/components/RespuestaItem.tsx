import { formatFechaHora } from '@/shared/lib/format-fecha'
import { cn } from '@/lib/utils'
import type { RespuestaTicket } from '../types'

export function RespuestaItem({ respuesta }: { respuesta: RespuestaTicket }) {
  const esAdministracion = respuesta.rol === 'administracion'

  return (
    <div className={cn('rounded-lg border p-3', esAdministracion && 'bg-muted/50')}>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <span className="text-sm font-medium">
          {respuesta.autor}
          {esAdministracion && (
            <span className="text-muted-foreground ml-1.5 text-xs font-normal">
              · Administración
            </span>
          )}
        </span>
        <span className="text-muted-foreground text-xs">
          {formatFechaHora(respuesta.fecha)}
        </span>
      </div>
      <p className="text-muted-foreground mt-1 text-sm whitespace-pre-line">
        {respuesta.mensaje}
      </p>
    </div>
  )
}
