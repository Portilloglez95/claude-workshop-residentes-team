import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEncuestas } from '../hooks/use-encuestas'
import { useVotosStore } from '../store/use-votos-store'
import { estaCerrada } from '../lib/estado-encuesta'
import type { Encuesta } from '../types'
import { EncuestaCard } from '../components/EncuestaCard'
import { EncuestaSkeleton } from '../components/EncuestaSkeleton'

function ListaEncuestas({ encuestas, vacio }: { encuestas: Encuesta[]; vacio: string }) {
  if (encuestas.length === 0) {
    return <p className="text-muted-foreground text-sm">{vacio}</p>
  }

  return (
    <div className="flex flex-col gap-4">
      {encuestas.map((encuesta) => (
        <EncuestaCard key={encuesta.id} encuesta={encuesta} />
      ))}
    </div>
  )
}

export function EncuestasPage() {
  const { data: encuestas, isLoading, isError } = useEncuestas()
  const votosLocales = useVotosStore((store) => store.votos)

  const abiertas = encuestas?.filter((encuesta) => !estaCerrada(encuesta)) ?? []
  const cerradas = encuestas?.filter((encuesta) => estaCerrada(encuesta)) ?? []
  const pendientes = abiertas.filter(
    (encuesta) => encuesta.opcionVotada === null && !votosLocales[encuesta.id],
  ).length

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-medium">Encuestas</h1>
        <p className="text-muted-foreground text-sm">
          Lo que se está decidiendo en el condominio.{' '}
          {encuestas &&
            (pendientes > 0 ? (
              <span className="text-foreground font-medium">
                {pendientes === 1
                  ? 'Falta tu voz en una.'
                  : `Falta tu voz en ${pendientes}.`}
              </span>
            ) : (
              'Ya votaste en todas las abiertas.'
            ))}
        </p>
      </div>

      {isError && (
        <p className="text-destructive text-sm">
          No se pudo cargar el listado de encuestas.
        </p>
      )}

      {isLoading && (
        <div className="flex flex-col gap-4">
          <EncuestaSkeleton />
          <EncuestaSkeleton />
        </div>
      )}

      {encuestas && (
        <Tabs defaultValue="abiertas">
          <TabsList>
            <TabsTrigger value="abiertas">Abiertas · {abiertas.length}</TabsTrigger>
            <TabsTrigger value="cerradas">Cerradas · {cerradas.length}</TabsTrigger>
          </TabsList>

          <TabsContent value="abiertas">
            <ListaEncuestas
              encuestas={abiertas}
              vacio="No hay encuestas abiertas en este momento."
            />
          </TabsContent>

          <TabsContent value="cerradas">
            <ListaEncuestas
              encuestas={cerradas}
              vacio="Todavía no hay encuestas cerradas."
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
