import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import type { Visita } from '../types'
import { formatFechaHora } from '../lib/format-fecha'
import { labelMotivo } from '../lib/motivo-visita'
import { useControlAccesoStore } from '../store/use-control-acceso-store'
import { FotoThumb } from './FotoThumb'
import { VisitaEstadoBadge } from './VisitaEstadoBadge'

export function VisitaItem({ visita }: { visita: Visita }) {
  const cancelarVisita = useControlAccesoStore((s) => s.cancelarVisita)

  function onCancelar() {
    cancelarVisita(visita.id)
    toast.success(`Pre-autorización de ${visita.nombre} cancelada.`)
  }

  return (
    <li className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 py-3">
      <div className="flex min-w-0 gap-3">
        {(visita.fotoVisitante || visita.fotoId) && (
          <div className="flex gap-1.5">
            {visita.fotoVisitante && (
              <FotoThumb src={visita.fotoVisitante} alt="Foto del visitante" />
            )}
            {visita.fotoId && (
              <FotoThumb src={visita.fotoId} alt="Foto de identificación" />
            )}
          </div>
        )}

        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-sm font-medium">{visita.nombre}</span>
          <span className="text-muted-foreground text-xs">
            {labelMotivo(visita.motivo)}
            {visita.identificacion && <> · ID: {visita.identificacion}</>}
          </span>
          <span className="text-muted-foreground text-xs">
            {visita.entradaEn
              ? `Entrada ${formatFechaHora(visita.entradaEn)}`
              : `Pre-autorizada ${formatFechaHora(visita.creadaEn)}`}
            {visita.salidaEn && ` · Salida ${formatFechaHora(visita.salidaEn)}`}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <VisitaEstadoBadge estado={visita.estado} />
        {visita.estado === 'esperada' && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancelar}>
            Cancelar
          </Button>
        )}
      </div>
    </li>
  )
}
