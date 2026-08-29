import { useState } from 'react'
import { ChevronDown, Pin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { Aviso } from '../types'
import { formatFecha } from '@/shared/lib/format-fecha'
import { useAvisosLeidosStore } from '../store/use-avisos-leidos-store'
import { AvisoCategoriaBadge } from './AvisoCategoriaBadge'

const LARGO_PREVIEW = 140

export function AvisoCard({ aviso }: { aviso: Aviso }) {
  const [expandido, setExpandido] = useState(false)
  const leidoEnCliente = useAvisosLeidosStore((store) => Boolean(store.leidos[aviso.id]))
  const marcarLeido = useAvisosLeidosStore((store) => store.marcarLeido)

  const leido = aviso.leido || leidoEnCliente
  const cuerpoLargo = aviso.cuerpo.length > LARGO_PREVIEW
  const cuerpoMostrado =
    expandido || !cuerpoLargo
      ? aviso.cuerpo
      : `${aviso.cuerpo.slice(0, LARGO_PREVIEW).trimEnd()}…`

  function alAbrir() {
    if (!leido) marcarLeido(aviso.id)
    if (cuerpoLargo) setExpandido((valor) => !valor)
  }

  return (
    <Card className={cn(!leido && 'border-primary/40 bg-primary/[0.03]')}>
      <CardContent>
        <button
          type="button"
          onClick={alAbrir}
          className="flex w-full items-start gap-3 text-left"
        >
          <span
            className={cn(
              'mt-1.5 size-2 shrink-0 rounded-full',
              leido ? 'bg-transparent' : 'bg-primary',
            )}
            aria-hidden
          />

          <span className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
              <span className="flex items-center gap-1.5">
                {aviso.fijado && (
                  <Pin
                    className="text-muted-foreground size-3.5 shrink-0"
                    aria-label="Fijado"
                  />
                )}
                <span className={cn('text-sm', !leido && 'font-semibold')}>
                  {aviso.titulo}
                </span>
              </span>
              <time
                dateTime={aviso.fecha}
                className="text-muted-foreground shrink-0 text-xs"
              >
                {formatFecha(aviso.fecha)}
              </time>
            </span>

            <span className="flex flex-wrap items-center gap-2">
              <AvisoCategoriaBadge categoria={aviso.categoria} />
              <span className="text-muted-foreground text-xs">
                Publicado por {aviso.autor}
              </span>
            </span>

            <span className="text-muted-foreground mt-1 block text-sm whitespace-pre-line">
              {cuerpoMostrado}
            </span>

            {cuerpoLargo && (
              <span className="text-primary mt-1 flex items-center gap-1 text-xs font-medium">
                {expandido ? 'Leer menos' : 'Leer más'}
                <ChevronDown
                  className={cn('size-3 transition-transform', expandido && 'rotate-180')}
                />
              </span>
            )}
          </span>
        </button>
      </CardContent>
    </Card>
  )
}
