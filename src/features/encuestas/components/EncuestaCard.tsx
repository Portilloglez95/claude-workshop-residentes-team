import { useState } from 'react'
import { CircleDot, Lock, TriangleAlert } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { Encuesta } from '../types'
import { useVotosStore } from '../store/use-votos-store'
import { calcularResultados } from '../lib/calcular-resultados'
import { estaCerrada, esUrgente } from '../lib/estado-encuesta'
import { COLOR_ESTADO } from '../lib/paleta'
import { useRevelarAlScroll } from '../hooks/use-revelar-al-scroll'
import { OpcionesVotacion } from './OpcionesVotacion'
import { ParticipacionEncuesta } from './ParticipacionEncuesta'
import { PlazoEncuesta } from './PlazoEncuesta'
import { ResultadosEncuesta } from './ResultadosEncuesta'

const LARGO_PREVIEW = 180

export function EncuestaCard({ encuesta }: { encuesta: Encuesta }) {
  const { ref, visible } = useRevelarAlScroll<HTMLDivElement>()
  const votoLocal = useVotosStore((store) => store.votos[encuesta.id])
  const votar = useVotosStore((store) => store.votar)
  const [editando, setEditando] = useState(false)
  const [expandida, setExpandida] = useState(false)

  const cerrada = estaCerrada(encuesta)
  const urgente = esUrgente(encuesta)
  const resultados = calcularResultados(encuesta, votoLocal)
  const { opcionVotada } = resultados

  // Los resultados se revelan al votar o al cerrar la encuesta, para que el
  // conteo parcial no influya en quien todavía no participa.
  const mostrarResultados = cerrada || (opcionVotada !== null && !editando)

  const descripcionLarga = encuesta.descripcion.length > LARGO_PREVIEW
  const descripcion =
    expandida || !descripcionLarga
      ? encuesta.descripcion
      : `${encuesta.descripcion.slice(0, LARGO_PREVIEW).trimEnd()}…`

  function alConfirmar(opcionId: string) {
    const esCambio = opcionVotada !== null
    votar(encuesta.id, opcionId)
    setEditando(false)
    toast.success(esCambio ? 'Voto actualizado' : 'Voto registrado')
  }

  return (
    <Card
      ref={ref}
      className={cn(
        'transition-[opacity,transform,border-color] duration-500 ease-out',
        'motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
        urgente && 'border-foreground/25',
      )}
    >
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {cerrada ? (
              <Badge variant="secondary">
                <Lock className="size-3" aria-hidden />
                Cerrada
              </Badge>
            ) : (
              <Badge variant="outline">
                <CircleDot
                  className="size-3"
                  style={{ color: COLOR_ESTADO.bueno.claro }}
                  aria-hidden
                />
                Abierta
              </Badge>
            )}
            {urgente && (
              <Badge variant="outline">
                <TriangleAlert
                  className="size-3"
                  style={{ color: COLOR_ESTADO.advertencia.claro }}
                  aria-hidden
                />
                Por cerrar
              </Badge>
            )}
            {!cerrada && opcionVotada !== null && !editando && (
              <Badge variant="outline">Ya votaste</Badge>
            )}
          </div>

          <h2 className="text-base leading-snug font-semibold text-balance">
            {encuesta.pregunta}
          </h2>

          <p className="text-muted-foreground text-sm">
            {descripcion}
            {descripcionLarga && (
              <button
                type="button"
                onClick={() => setExpandida((valor) => !valor)}
                className="text-foreground ml-1 font-medium underline-offset-4 hover:underline"
              >
                {expandida ? 'Leer menos' : 'Leer más'}
              </button>
            )}
          </p>
        </div>

        <Separator />

        {mostrarResultados ? (
          <div className="flex flex-col gap-3">
            <ResultadosEncuesta resultados={resultados.resultados} cerrada={cerrada} />
            {!cerrada && (
              <div>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="-ml-2.5"
                  onClick={() => setEditando(true)}
                >
                  Cambiar voto
                </Button>
              </div>
            )}
            {cerrada && opcionVotada === null && (
              <p className="text-muted-foreground text-xs">
                Esta encuesta cerró sin registrar tu voto.
              </p>
            )}
          </div>
        ) : (
          <OpcionesVotacion
            opciones={encuesta.opciones}
            votoActual={opcionVotada}
            etiqueta={encuesta.pregunta}
            onConfirmar={alConfirmar}
            onCancelar={editando ? () => setEditando(false) : undefined}
          />
        )}

        <Separator />

        <div className="flex flex-col gap-2">
          <ParticipacionEncuesta
            resultados={resultados}
            totalElegibles={encuesta.totalElegibles}
            exigeQuorum={encuesta.quorumRequerido > 0}
            cerrada={cerrada}
          />
          <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            <PlazoEncuesta
              fechaCierre={encuesta.fechaCierre}
              cerrada={cerrada}
              urgente={urgente}
            />
            <span aria-hidden>·</span>
            <span>Publicada por {encuesta.autor}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
