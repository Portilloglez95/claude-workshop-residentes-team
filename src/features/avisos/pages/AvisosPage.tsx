import { useAvisos } from '../hooks/use-avisos'
import { useAvisosLeidosStore } from '../store/use-avisos-leidos-store'
import { AvisoCard } from '../components/AvisoCard'

export function AvisosPage() {
  const { data: avisos, isLoading, isError } = useAvisos()
  const leidosEnCliente = useAvisosLeidosStore((store) => store.leidos)

  const sinLeer =
    avisos?.filter((aviso) => !aviso.leido && !leidosEnCliente[aviso.id]).length ?? 0

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Avisos</h1>
        <p className="text-muted-foreground text-sm">
          Comunicados de administración y la junta directiva.
          {avisos && sinLeer > 0 && ` Tienes ${sinLeer} sin leer.`}
        </p>
      </div>

      {isLoading && <p className="text-muted-foreground text-sm">Cargando…</p>}
      {isError && (
        <p className="text-destructive text-sm">
          No se pudo cargar el listado de avisos.
        </p>
      )}

      {avisos && (
        <div className="flex flex-col gap-3">
          {avisos.map((aviso) => (
            <AvisoCard key={aviso.id} aviso={aviso} />
          ))}
        </div>
      )}
    </div>
  )
}
