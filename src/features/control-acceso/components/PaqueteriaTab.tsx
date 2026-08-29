import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { EstadoPaquete } from '../types'
import { usePaquetes } from '../hooks/use-paquetes'
import { esHoy } from '../lib/format-fecha'
import { RESIDENTE_ACTUAL } from '../lib/residente-actual'
import { sortPaquetes } from '../lib/sort'
import { NotificacionesResidente } from './NotificacionesResidente'
import { PaqueteItem } from './PaqueteItem'

type FiltroEstado = EstadoPaquete | 'todos'

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card size="sm">
      <CardContent className="flex flex-col gap-0.5">
        <span className="text-2xl font-bold tabular-nums">{value}</span>
        <span className="text-muted-foreground text-xs">{label}</span>
      </CardContent>
    </Card>
  )
}

export function PaqueteriaTab() {
  const { data: base, isLoading, isError } = usePaquetes()

  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>('todos')

  // Solo los paquetes de la unidad del residente: nunca ve los de otros.
  const paquetes = useMemo(() => {
    if (!base) return []
    const mios = base.filter(
      (p) => p.unidad.toLowerCase() === RESIDENTE_ACTUAL.unidad.toLowerCase(),
    )
    return sortPaquetes(mios)
  }, [base])

  const visibles = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()
    return paquetes.filter((p) => {
      const coincideEstado = filtroEstado === 'todos' || p.estado === filtroEstado
      const coincideTexto =
        !termino ||
        p.mensajeria.toLowerCase().includes(termino) ||
        (p.folio ?? '').toLowerCase().includes(termino)
      return coincideEstado && coincideTexto
    })
  }, [paquetes, busqueda, filtroEstado])

  const pendientes = paquetes.filter((p) => p.estado === 'pendiente').length
  const entregadosHoy = paquetes.filter(
    (p) => p.estado === 'entregado' && esHoy(p.entregadoEn),
  ).length

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground text-sm">
          Estatus de los paquetes de tu unidad ({RESIDENTE_ACTUAL.unidad}).
        </p>
        <NotificacionesResidente paquetesResidente={paquetes} />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Pendientes de entrega" value={pendientes} />
        <StatCard label="Entregados hoy" value={entregadosHoy} />
        <StatCard label="Total" value={paquetes.length} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mis paquetes</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
              <Input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por mensajería o folio…"
                className="pl-8"
              />
            </div>
            <Select
              value={filtroEstado}
              onValueChange={(v) => setFiltroEstado(v as FiltroEstado)}
            >
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="pendiente">Pendientes</SelectItem>
                <SelectItem value="entregado">Entregados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading && <p className="text-muted-foreground text-sm">Cargando…</p>}
          {isError && (
            <p className="text-destructive text-sm">
              No se pudieron cargar los paquetes.
            </p>
          )}
          {base && visibles.length === 0 && (
            <p className="text-muted-foreground py-2 text-sm">
              No hay paquetes que coincidan.
            </p>
          )}

          {visibles.length > 0 && (
            <ul className="divide-y">
              {visibles.map((paquete) => (
                <PaqueteItem key={paquete.id} paquete={paquete} />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
