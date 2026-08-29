import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import type { Paquete, Rol } from '../types'
import { formatFechaHora } from '../lib/format-fecha'
import { useControlAccesoStore } from '../store/use-control-acceso-store'
import { PaqueteEstadoBadge } from './PaqueteEstadoBadge'

export function PaqueteItem({ paquete, rol }: { paquete: Paquete; rol: Rol }) {
  const marcarEntregado = useControlAccesoStore((s) => s.marcarEntregado)

  const puedeEntregar = rol === 'porteria' && paquete.estado === 'pendiente'

  function onEntregar() {
    marcarEntregado(paquete.id)
    toast.success(`Paquete de ${paquete.mensajeria} marcado como entregado.`)
  }

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
          {rol === 'porteria' && (
            <>
              {paquete.residente} · {paquete.unidad} ·{' '}
            </>
          )}
          Recibido {formatFechaHora(paquete.recibidoEn)}
          {paquete.estado === 'entregado' && paquete.entregadoEn && (
            <> · Entregado {formatFechaHora(paquete.entregadoEn)}</>
          )}
        </span>
        {paquete.notas && (
          <span className="text-muted-foreground text-xs italic">{paquete.notas}</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <PaqueteEstadoBadge estado={paquete.estado} />
        {puedeEntregar && (
          <Button type="button" variant="outline" size="sm" onClick={onEntregar}>
            Marcar entregado
          </Button>
        )}
      </div>
    </li>
  )
}
