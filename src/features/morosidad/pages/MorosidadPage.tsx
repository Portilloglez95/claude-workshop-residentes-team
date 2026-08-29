import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { EstadoCobranza } from '../types'
import { useCuentasMorosas } from '../hooks/use-cuentas-morosas'
import { calcularAging } from '../lib/aging'
import {
  DIAS_GRACIA,
  INTERES_MORATORIO_MENSUAL,
  RECARGO_MORA,
} from '../lib/calcular-mora'
import { ESTADO_LABEL, estadoCobranza } from '../lib/estado-cobranza'
import { formatPorcentaje } from '../lib/format-monto'
import { calcularResumenCartera } from '../lib/resumen-cartera'
import { AgingTabla } from '../components/AgingTabla'
import { CuentasMorosasTabla } from '../components/CuentasMorosasTabla'
import { ResumenCarteraCards } from '../components/ResumenCarteraCards'

type Filtro = 'todas' | EstadoCobranza

const FILTROS: { valor: Filtro; label: string }[] = [
  { valor: 'todas', label: 'Todas' },
  { valor: 'en_mora', label: ESTADO_LABEL.en_mora },
  { valor: 'en_gestion', label: 'En gestión' },
  { valor: 'proceso_legal', label: 'Proceso legal' },
]

// TODO: esta vista es solo para administración y el comité de cobranza —
// expone datos personales y de deuda de cada residente. Falta restringirla
// por rol cuando exista el esquema de auth (hoy `features/auth` solo tiene
// el formulario de login).
export function MorosidadPage() {
  const { data: cuentas, isLoading, isError } = useCuentasMorosas()
  const [filtro, setFiltro] = useState<Filtro>('todas')

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-medium">Morosidad</h1>
        <p className="text-muted-foreground text-sm">
          Cartera vencida del condominio, antigüedad de saldos y gestión de cobranza.
        </p>
      </div>

      {isLoading && <p className="text-muted-foreground text-sm">Cargando…</p>}
      {isError && (
        <p className="text-destructive text-sm">
          No se pudo cargar la cartera de morosidad.
        </p>
      )}

      {cuentas && (
        <>
          <ResumenCarteraCards resumen={calcularResumenCartera(cuentas)} />

          <Card>
            <CardHeader>
              <CardTitle>Antigüedad de saldos</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <AgingTabla filas={calcularAging(cuentas)} />
              <p className="text-muted-foreground text-xs">
                Después de {DIAS_GRACIA} días de gracia se aplica un recargo de{' '}
                {formatPorcentaje(RECARGO_MORA)} sobre el capital y un interés moratorio
                de {formatPorcentaje(INTERES_MORATORIO_MENSUAL)} mensual, prorrateado por
                día.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Unidades en mora</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs
                value={filtro}
                onValueChange={(valor) => setFiltro(valor as Filtro)}
                className="gap-4"
              >
                <TabsList>
                  {FILTROS.map(({ valor, label }) => (
                    <TabsTrigger key={valor} value={valor}>
                      {label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {FILTROS.map(({ valor }) => (
                  <TabsContent key={valor} value={valor}>
                    <CuentasMorosasTabla
                      cuentas={cuentas.filter(
                        (cuenta) => valor === 'todas' || estadoCobranza(cuenta) === valor,
                      )}
                    />
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
