import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAreasComunes } from '../hooks/use-areas-comunes'
import { useMisReservas } from '../hooks/use-reservas'
import { useCancelarReserva } from '../hooks/use-cancelar-reserva'
import { agruparReservas } from '../lib/agrupar-reservas'
import { AreaCard } from '../components/AreaCard'
import { ReservaCard } from '../components/ReservaCard'

export function ReservasPage() {
  const { data: areas, isLoading: cargandoAreas, isError: errorAreas } = useAreasComunes()
  const {
    data: misReservas,
    isLoading: cargandoReservas,
    isError: errorReservas,
  } = useMisReservas()
  const {
    mutate: cancelar,
    isPending: cancelando,
    variables: idCancelando,
  } = useCancelarReserva()

  const { proximas, historial } = misReservas
    ? agruparReservas(misReservas)
    : { proximas: [], historial: [] }
  const buscarArea = (areaId: string) => areas?.find((area) => area.id === areaId)

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Reservas</h1>
        <p className="text-muted-foreground text-sm">
          Reserva áreas comunes del condominio y da seguimiento a tus reservas.
        </p>
      </div>

      <Tabs defaultValue="reservar">
        <TabsList>
          <TabsTrigger value="reservar">Reservar</TabsTrigger>
          <TabsTrigger value="mis-reservas">
            Mis reservas{proximas.length > 0 && ` (${proximas.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reservar" className="flex flex-col gap-3">
          {cargandoAreas && <p className="text-muted-foreground text-sm">Cargando…</p>}
          {errorAreas && (
            <p className="text-destructive text-sm">
              No se pudo cargar el listado de áreas.
            </p>
          )}
          {areas && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {areas.map((area) => (
                <AreaCard key={area.id} area={area} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="mis-reservas" className="flex flex-col gap-6">
          {cargandoReservas && <p className="text-muted-foreground text-sm">Cargando…</p>}
          {errorReservas && (
            <p className="text-destructive text-sm">No se pudo cargar tus reservas.</p>
          )}

          {misReservas && misReservas.length === 0 && (
            <p className="text-muted-foreground text-sm">
              Todavía no has hecho ninguna reserva.
            </p>
          )}

          {proximas.length > 0 && (
            <div className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold">Próximas</h2>
              {proximas.map((reserva) => (
                <ReservaCard
                  key={reserva.id}
                  reserva={reserva}
                  area={buscarArea(reserva.areaId)}
                  onCancelar={() => cancelar(reserva.id)}
                  cancelando={cancelando && idCancelando === reserva.id}
                />
              ))}
            </div>
          )}

          {historial.length > 0 && (
            <div className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold">Historial</h2>
              {historial.map((reserva) => (
                <ReservaCard
                  key={reserva.id}
                  reserva={reserva}
                  area={buscarArea(reserva.areaId)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
