import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEncuestas } from '../hooks/use-encuestas'
import { useVotosStore } from '../store/use-votos-store'
import { estaCerrada } from '../lib/estado-encuesta'
import type { Encuesta } from '../types'
import { AcompananteScroll } from '../components/AcompananteScroll'
import { EncuestaCard } from '../components/EncuestaCard'
import { EncuestaSkeleton } from '../components/EncuestaSkeleton'
import { TemaCalma } from '../components/TemaCalma'

function ListaEncuestas({ encuestas, vacio }: { encuestas: Encuesta[]; vacio: string }) {
  if (encuestas.length === 0) {
    return (
      <div className="rounded-[20px] border border-dashed border-[var(--linea)] px-4 py-12 text-center">
        <p className="text-sm text-[var(--tinta-suave)]">{vacio}</p>
      </div>
    )
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
    <TemaCalma>
      <div className="relative mx-auto w-full max-w-3xl lg:max-w-[848px] lg:pr-20">
        <AcompananteScroll />

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[27px] leading-8 font-bold tracking-[-0.5px]">
              Encuestas
            </h1>
            <p className="text-sm leading-[21px] text-pretty text-[var(--tinta-suave)]">
              Lo que se está decidiendo en el condominio.{' '}
              {encuestas &&
                (pendientes > 0 ? (
                  <span className="font-semibold text-[var(--acento)]">
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
            <Tabs defaultValue="abiertas" className="gap-5">
              <TabsList className="gap-2 bg-transparent p-0">
                <TabsTrigger
                  value="abiertas"
                  className="rounded-full border-0 bg-[var(--pista)] px-4 py-1.5 text-[13px] data-[state=active]:bg-[var(--tinta)] data-[state=active]:text-[var(--papel)] data-[state=active]:shadow-none"
                >
                  Abiertas · {abiertas.length}
                </TabsTrigger>
                <TabsTrigger
                  value="cerradas"
                  className="rounded-full border-0 bg-[var(--pista)] px-4 py-1.5 text-[13px] data-[state=active]:bg-[var(--tinta)] data-[state=active]:text-[var(--papel)] data-[state=active]:shadow-none"
                >
                  Cerradas · {cerradas.length}
                </TabsTrigger>
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
      </div>
    </TemaCalma>
  )
}
