import type { Paquete } from '../types'
import { formatFechaHora } from '../lib/format-fecha'
import { PaqueteEstadoBadge } from './PaqueteEstadoBadge'

export function PaqueteItem({ paquete }: { paquete: Paquete }) {
  return (
    <li className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 py-3">
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-sm font-medium">
          {paquete.mensajeria}
          {paquete.folio && (
            <span className="text-muted-foreground font-normal">
              {' '}
              · Folio {paquete.folio}
            </span>
          )}
        </span>
        <span className="text-muted-foreground text-xs">
          Recibido en portería {formatFechaHora(paquete.recibidoEn)}
          {paquete.estado === 'entregado' && paquete.entregadoEn && (
            <> · Entregado {formatFechaHora(paquete.entregadoEn)}</>
          )}
        </span>
        {paquete.notas && (
          <span className="text-muted-foreground text-xs italic">{paquete.notas}</span>
        )}
      </div>

      <PaqueteEstadoBadge estado={paquete.estado} />
    </li>
  )
}
