import { useState } from 'react'
import { Circle, Lock, Warning } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { COLOR_ICONO_ESTADO } from '@/shared/lib/estado-visual'
import type { Encuesta } from '../types'
import { useVotosStore } from '../store/use-votos-store'
import { calcularResultados } from '../lib/calcular-resultados'
import { estaCerrada, esUrgente } from '../lib/estado-encuesta'
import { OpcionesVotacion } from './OpcionesVotacion'
import { ParticipacionEncuesta } from './ParticipacionEncuesta'
import { PlazoEncuesta } from './PlazoEncuesta'
import { ResultadosEncuesta } from './ResultadosEncuesta'

const LARGO_PREVIEW = 180

export function EncuestaCard({ encuesta }: { encuesta: Encuesta }) {
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
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {cerrada ? (
              <Badge variant="outline" className="gap-1.5 font-normal">
                <Lock className={cn('size-3', COLOR_ICONO_ESTADO.neutral)} aria-hidden />
                Cerrada
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1.5 font-normal">
                <Circle
                  weight="fill"
                  className={cn('size-3', COLOR_ICONO_ESTADO.bueno)}
                  aria-hidden
                />
                Abierta
              </Badge>
            )}
            {urgente && (
              <Badge variant="outline" className="gap-1.5 font-normal">
                <Warning
                  className={cn('size-3', COLOR_ICONO_ESTADO.advertencia)}
                  aria-hidden
                />
                Por cerrar
              </Badge>
            )}
            {!cerrada && opcionVotada !== null && !editando && (
              <Badge variant="outline">Ya votaste</Badge>
            )}
          </div>

          <h2 className="text-base leading-snug font-medium text-balance">
            {encuesta.pregunta}
          </h2>

          <p className="text-muted-foreground text-sm">
            {descripcion}
            {descripcionLarga && (
              <button
                type="button"
                onClick={() => setExpandida((valor) => !valor)}
                className="text-primary ml-1 font-medium underline-offset-4 hover:underline"
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
