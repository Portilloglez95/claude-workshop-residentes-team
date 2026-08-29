import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { formatFecha } from '@/shared/lib/format-fecha'
import type { AreaComun, Reserva } from '../types'
import { ReservaEstadoBadge } from './ReservaEstadoBadge'

const CANCELABLE = new Set<Reserva['estado']>(['pendiente', 'confirmada'])

export function ReservaCard({
  reserva,
  area,
  onCancelar,
  cancelando,
}: {
  reserva: Reserva
  area: AreaComun | undefined
  onCancelar?: () => void
  cancelando?: boolean
}) {
  const puedeCancelar = Boolean(onCancelar) && CANCELABLE.has(reserva.estado)

  return (
    <Card>
      <CardContent className="flex flex-col gap-2">
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
          <span className="text-sm font-semibold">{area?.nombre ?? 'Área común'}</span>
          <ReservaEstadoBadge estado={reserva.estado} />
        </div>

        <p className="text-muted-foreground text-sm">
          {formatFecha(`${reserva.fecha}T00:00:00`)} · {reserva.horaInicio} –{' '}
          {reserva.horaFin}
        </p>

        {reserva.notas && (
          <p className="text-muted-foreground text-sm">"{reserva.notas}"</p>
        )}

        {reserva.respuestaAdministracion && (
          <p
            className={cn(
              'text-sm',
              reserva.estado === 'rechazada'
                ? 'text-destructive'
                : 'text-muted-foreground',
            )}
          >
            Administración: {reserva.respuestaAdministracion}
          </p>
        )}

        {puedeCancelar && (
          <Button
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={onCancelar}
            disabled={cancelando}
          >
            {cancelando ? 'Cancelando…' : 'Cancelar reserva'}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
