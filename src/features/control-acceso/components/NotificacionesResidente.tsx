import { useEffect, useRef, useState } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Paquete } from '../types'
import { formatFechaHora } from '../lib/format-fecha'
import { useControlAccesoStore } from '../store/use-control-acceso-store'

/**
 * Campana de notificaciones del residente. Cada paquete pendiente de su
 * unidad es una notificación ("tu paquete llegó a portería"); el residente
 * puede marcarlas como leídas. Sin backend ni push real: el estado de
 * leídas vive en el cliente.
 */
export function NotificacionesResidente({
  paquetesResidente,
}: {
  paquetesResidente: Paquete[]
}) {
  const [abierto, setAbierto] = useState(false)
  const contenedorRef = useRef<HTMLDivElement>(null)

  const notifsLeidas = useControlAccesoStore((s) => s.notifsLeidas)
  const marcarNotifsLeidas = useControlAccesoStore((s) => s.marcarNotifsLeidas)

  const pendientes = paquetesResidente.filter((p) => p.estado === 'pendiente')
  const noLeidas = pendientes.filter((p) => !notifsLeidas[p.id])

  useEffect(() => {
    if (!abierto) return
    function onClickFuera(event: MouseEvent) {
      if (!contenedorRef.current?.contains(event.target as Node)) setAbierto(false)
    }
    document.addEventListener('mousedown', onClickFuera)
    return () => document.removeEventListener('mousedown', onClickFuera)
  }, [abierto])

  return (
    <div ref={contenedorRef} className="relative">
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Notificaciones"
        aria-expanded={abierto}
        onClick={() => setAbierto((v) => !v)}
      >
        <Bell />
        {noLeidas.length > 0 && (
          <span className="bg-primary text-primary-foreground absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full text-[10px] font-semibold">
            {noLeidas.length}
          </span>
        )}
      </Button>

      {abierto && (
        <div className="bg-popover text-popover-foreground ring-foreground/10 absolute right-0 z-50 mt-2 w-72 rounded-lg p-2 shadow-md ring-1">
          <div className="flex items-center justify-between px-1 py-1">
            <span className="text-sm font-medium">Notificaciones</span>
            {noLeidas.length > 0 && (
              <button
                type="button"
                className="text-primary text-xs font-medium hover:underline"
                onClick={() => marcarNotifsLeidas(noLeidas.map((p) => p.id))}
              >
                Marcar leídas
              </button>
            )}
          </div>

          {pendientes.length === 0 ? (
            <p className="text-muted-foreground px-1 py-3 text-sm">Sin notificaciones.</p>
          ) : (
            <ul className="flex flex-col">
              {pendientes.map((p) => (
                <li
                  key={p.id}
                  className={cn(
                    'flex flex-col gap-0.5 rounded-md px-1 py-2',
                    !notifsLeidas[p.id] && 'bg-primary/[0.06]',
                  )}
                >
                  <span className="text-sm">
                    Tu paquete de <span className="font-medium">{p.mensajeria}</span>{' '}
                    llegó a portería.
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {formatFechaHora(p.recibidoEn)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
