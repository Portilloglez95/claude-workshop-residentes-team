import { Scales, Warning, Users, Wallet } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ResumenCartera } from '../lib/resumen-cartera'
import { formatMonto } from '../lib/format-monto'

/** Indicadores de cabecera de la cartera morosa, en el mismo formato que el Panel. */
export function ResumenCarteraCards({ resumen }: { resumen: ResumenCartera }) {
  const stats = [
    { label: 'Deuda total', value: formatMonto(resumen.deudaTotal), icon: Wallet },
    { label: 'Unidades en mora', value: String(resumen.unidadesEnMora), icon: Users },
    {
      label: 'Recargos e intereses',
      value: formatMonto(resumen.moraDevengada),
      icon: Warning,
    },
    { label: 'Saldo > 90 días', value: formatMonto(resumen.saldoMas90), icon: Scales },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map(({ label, value, icon: Icon }) => (
        <Card key={label}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{label}</CardTitle>
            <Icon className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">{value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
