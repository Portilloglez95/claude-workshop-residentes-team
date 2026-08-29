import { useMemo, useState } from 'react'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { EstadoVisita } from '../types'
import { useVisitas } from '../hooks/use-visitas'
import { mergeVisitas } from '../lib/merge'
import { RESIDENTE_ACTUAL } from '../lib/residente-actual'
import { sortVisitas } from '../lib/sort'
import { useControlAccesoStore } from '../store/use-control-acceso-store'
import { VisitaForm } from './VisitaForm'
import { VisitaItem } from './VisitaItem'

type FiltroEstado = EstadoVisita | 'todos'

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

export function VisitasTab() {
  const visitasCreadas = useControlAccesoStore((s) => s.visitasCreadas)
  const visitasCanceladas = useControlAccesoStore((s) => s.visitasCanceladas)

  const { data: base, isLoading, isError } = useVisitas()

  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>('todos')

  // Solo las visitas dirigidas a la unidad del residente.
  const visitas = useMemo(() => {
    if (!base) return []
    const merged = mergeVisitas(base, visitasCreadas, visitasCanceladas)
    const mias = merged.filter(
      (v) => v.unidadDestino.toLowerCase() === RESIDENTE_ACTUAL.unidad.toLowerCase(),
    )
    return sortVisitas(mias)
  }, [base, visitasCreadas, visitasCanceladas])

  const visibles = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()
    return visitas.filter((v) => {
      const coincideEstado = filtroEstado === 'todos' || v.estado === filtroEstado
      const coincideTexto = !termino || v.nombre.toLowerCase().includes(termino)
      return coincideEstado && coincideTexto
    })
  }, [visitas, busqueda, filtroEstado])

  const esperadas = visitas.filter((v) => v.estado === 'esperada').length
  const enCondominio = visitas.filter((v) => v.estado === 'en_condominio').length

  return (
    <div className="flex flex-col gap-4">
      <p className="text-muted-foreground text-sm">
        Pre-autoriza una visita con su foto y portería la identificará al llegar, sin
        pedirle la identificación física.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Esperadas" value={esperadas} />
        <StatCard label="En el condominio" value={enCondominio} />
        <StatCard label="Total" value={visitas.length} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,24rem)_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Pre-autorizar visita</CardTitle>
          </CardHeader>
          <CardContent>
            <VisitaForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mis visitas</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <MagnifyingGlass className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
                <Input
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar por visitante…"
                  className="pl-8"
                />
              </div>
              <Select
                value={filtroEstado}
                onValueChange={(v) => setFiltroEstado(v as FiltroEstado)}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="esperada">Esperadas</SelectItem>
                  <SelectItem value="en_condominio">En el condominio</SelectItem>
                  <SelectItem value="finalizada">Finalizadas</SelectItem>
                  <SelectItem value="cancelada">Canceladas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading && <p className="text-muted-foreground text-sm">Cargando…</p>}
            {isError && (
              <p className="text-destructive text-sm">
                No se pudieron cargar las visitas.
              </p>
            )}
            {base && visibles.length === 0 && (
              <p className="text-muted-foreground py-2 text-sm">
                No hay visitas que coincidan.
              </p>
            )}

            {visibles.length > 0 && (
              <ul className="divide-y">
                {visibles.map((visita) => (
                  <VisitaItem key={visita.id} visita={visita} />
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
