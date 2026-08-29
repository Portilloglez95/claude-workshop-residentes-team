import { Clock, Lock, Users } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import type { Encuesta } from '../types'
import { useVotosStore } from '../store/use-votos-store'
import { calcularResultados } from '../lib/calcular-resultados'
import { estaCerrada } from '../lib/estado-encuesta'
import { formatCierre } from '../lib/format-fecha'
import { EncuestaEstadoBadge } from './EncuestaEstadoBadge'
import { OpcionResultado } from './OpcionResultado'
import { OpcionVoto } from './OpcionVoto'

export function EncuestaCard({ encuesta }: { encuesta: Encuesta }) {
  const votoLocal = useVotosStore((store) => store.votos[encuesta.id])
  const votar = useVotosStore((store) => store.votar)

  const cerrada = estaCerrada(encuesta)
  const { resultados, totalVotos, opcionVotada } = calcularResultados(encuesta, votoLocal)

  // Los resultados se revelan al votar o al cerrar la encuesta, para que el
  // conteo parcial no influya en el voto de quien todavía no participa.
  const mostrarResultados = cerrada || opcionVotada !== null

  function alVotar(opcionId: string) {
    votar(encuesta.id, opcionId)
    toast.success('Voto registrado')
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
          <h2 className="text-sm font-semibold">{encuesta.pregunta}</h2>
          <EncuestaEstadoBadge cerrada={cerrada} />
        </div>

        <p className="text-muted-foreground text-sm">{encuesta.descripcion}</p>

        <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
          <span className="flex items-center gap-1.5">
            {cerrada ? (
              <Lock className="size-3.5 shrink-0" aria-hidden />
            ) : (
              <Clock className="size-3.5 shrink-0" aria-hidden />
            )}
            <time dateTime={encuesta.fechaCierre}>
              {formatCierre(encuesta.fechaCierre, cerrada)}
            </time>
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="size-3.5 shrink-0" aria-hidden />
            {totalVotos} {totalVotos === 1 ? 'voto' : 'votos'}
          </span>
          <span>Publicada por {encuesta.autor}</span>
        </div>

        {mostrarResultados ? (
          <div className="flex flex-col gap-2.5">
            {resultados.map((resultado) => (
              <OpcionResultado key={resultado.opcion.id} resultado={resultado} />
            ))}
            {cerrada && opcionVotada === null && (
              <p className="text-muted-foreground text-xs">
                Esta encuesta cerró sin registrar tu voto.
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {encuesta.opciones.map((opcion) => (
              <OpcionVoto key={opcion.id} opcion={opcion} onVotar={alVotar} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
