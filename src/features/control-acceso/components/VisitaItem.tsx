import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import type { Rol, Visita } from '../types'
import { formatFechaHora } from '../lib/format-fecha'
import { labelMotivo } from '../lib/motivo-visita'
import { useControlAccesoStore } from '../store/use-control-acceso-store'
import { FotoThumb } from './FotoThumb'
import { VisitaEstadoBadge } from './VisitaEstadoBadge'

export function VisitaItem({ visita, rol }: { visita: Visita; rol: Rol }) {
  const registrarEntrada = useControlAccesoStore((s) => s.registrarEntrada)
  const registrarSalida = useControlAccesoStore((s) => s.registrarSalida)
  const cancelarVisita = useControlAccesoStore((s) => s.cancelarVisita)

  function onEntrada() {
    registrarEntrada(visita)
    toast.success(`Entrada de ${visita.nombre} registrada.`)
  }
  function onSalida() {
    registrarSalida(visita)
    toast.success(`Salida de ${visita.nombre} registrada.`)
  }
  function onCancelar() {
    cancelarVisita(visita)
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
          <span className="text-sm font-medium">
            {visita.nombre}
            {visita.preautorizada && (
              <span className="text-muted-foreground font-normal"> · pre-autorizada</span>
            )}
          </span>
          <span className="text-muted-foreground text-xs">
            {rol === 'porteria' && (
              <>
                Visita a {visita.residenteDestino} · {visita.unidadDestino} ·{' '}
              </>
            )}
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
        {rol === 'porteria' && visita.estado === 'esperada' && (
          <Button type="button" variant="outline" size="sm" onClick={onEntrada}>
            Registrar entrada
          </Button>
        )}
        {rol === 'porteria' && visita.estado === 'en_condominio' && (
          <Button type="button" variant="outline" size="sm" onClick={onSalida}>
            Registrar salida
          </Button>
        )}
        {rol === 'residente' && visita.estado === 'esperada' && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancelar}>
            Cancelar
          </Button>
        )}
      </div>
    </li>
  )
}
