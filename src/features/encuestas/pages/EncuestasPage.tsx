import { useEncuestas } from '../hooks/use-encuestas'
import { useVotosStore } from '../store/use-votos-store'
import { estaCerrada } from '../lib/estado-encuesta'
import { EncuestaCard } from '../components/EncuestaCard'

export function EncuestasPage() {
  const { data: encuestas, isLoading, isError } = useEncuestas()
  const votosLocales = useVotosStore((store) => store.votos)

  const pendientes =
    encuestas?.filter(
      (encuesta) =>
        !estaCerrada(encuesta) &&
        encuesta.opcionVotada === null &&
        !votosLocales[encuesta.id],
    ).length ?? 0

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Encuestas</h1>
        <p className="text-muted-foreground text-sm">
          Consultas de administración y la junta directiva.
          {encuestas &&
            (pendientes > 0
              ? ` Tienes ${pendientes} sin responder.`
              : ' Estás al día con las encuestas abiertas.')}
        </p>
      </div>

      {isLoading && <p className="text-muted-foreground text-sm">Cargando…</p>}
      {isError && (
        <p className="text-destructive text-sm">
          No se pudo cargar el listado de encuestas.
        </p>
      )}

      {encuestas && encuestas.length === 0 && (
        <p className="text-muted-foreground text-sm">No hay encuestas por ahora.</p>
      )}

      {encuestas && (
        <div className="flex flex-col gap-3">
          {encuestas.map((encuesta) => (
            <EncuestaCard key={encuesta.id} encuesta={encuesta} />
          ))}
        </div>
      )}
    </div>
  )
}
