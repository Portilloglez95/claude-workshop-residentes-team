import { Bell, Calendar, Users } from '@phosphor-icons/react'
import { Link } from 'react-router'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  useGastosFinanzas,
  useMorosidadFinanzas,
  useResumenPanel,
} from '@/features/finanzas/hooks/use-finanzas'
import { EgresosCategoriaCard } from './dashboard/EgresosCategoriaCard'
import { EstadoCuentaCard } from './dashboard/EstadoCuentaCard'
import { KpiRow } from './dashboard/KpiRow'
import { PagosMensualesCard } from './dashboard/PagosMensualesCard'
import { PanelSkeleton } from './dashboard/PanelSkeleton'
import { ProximosCargosCard } from './dashboard/ProximosCargosCard'

const ACCESOS_COMUNIDAD = [
  { label: 'Residentes', value: '128', icon: Users, to: '/residentes' },
  { label: 'Reservas hoy', value: '3', icon: Calendar, to: '/reservas' },
  { label: 'Avisos activos', value: '2', icon: Bell, to: '/avisos' },
]

export function DashboardPage() {
  const panelQuery = useResumenPanel()
  const { data: gastos } = useGastosFinanzas()
  const { data: morosidad } = useMorosidadFinanzas()

  const panel = panelQuery.data
  // Al refrescar se sostiene el render anterior en opacidad reducida: sin
  // parpadeo de skeleton y sin salto de layout.
  const refrescando = panelQuery.isFetching && !panelQuery.isLoading

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-medium">Panel</h1>
        <p className="text-muted-foreground text-sm">
          Tu estado de cuenta y el resumen del condominio.
        </p>
      </div>

      {panelQuery.isLoading && <PanelSkeleton />}

      {panelQuery.isError && (
        <p className="text-destructive text-sm">
          No se pudo cargar el panel. Reintenta en unos momentos.
        </p>
      )}

      {panel && (
        <div
          className={cn(
            'flex flex-col gap-4 transition-opacity',
            refrescando && 'opacity-60',
          )}
        >
          <div className="grid gap-4 lg:grid-cols-3">
            <EstadoCuentaCard panel={panel} />
            <ProximosCargosCard cargos={panel.proximosCargos} />
          </div>

          <KpiRow panel={panel} gastos={gastos} morosidad={morosidad} />

          <div className="grid gap-4 lg:grid-cols-2">
            <PagosMensualesCard serie={panel.serieMensual} />
            {gastos && <EgresosCategoriaCard gastos={gastos} />}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {ACCESOS_COMUNIDAD.map(({ label, value, icon: Icon, to }) => (
              <Link
                key={label}
                to={to}
                className="focus-visible:ring-ring rounded-xl focus-visible:ring-2 focus-visible:outline-none"
              >
                <Card className="hover:border-primary/40 h-full transition-colors">
                  <CardContent className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                        {label}
                      </div>
                      <div className="font-heading mt-1 text-2xl font-medium">
                        {value}
                      </div>
                    </div>
                    <Icon className="text-muted-foreground size-4 shrink-0" aria-hidden />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
