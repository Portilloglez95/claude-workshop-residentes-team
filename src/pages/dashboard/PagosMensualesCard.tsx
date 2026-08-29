import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { PagoMensual } from '@/features/finanzas/types'
import { ColumnChart, type PuntoColumna } from '@/shared/components/charts/ColumnChart'
import { formatMoneda, formatMonedaCompacta } from '@/shared/lib/format-moneda'

/**
 * Doce meses de pagos del residente. Serie única con forma de **énfasis**: los
 * meses liquidados van en el color de datos y el periodo en curso (pendiente)
 * en el gris de contexto, con leyenda — el estado nunca se lee solo por color.
 */
export function PagosMensualesCard({ serie }: { serie: PagoMensual[] }) {
  const puntos: PuntoColumna[] = serie.map((mes) => ({
    etiqueta: mes.etiqueta,
    etiquetaLarga: mes.periodo,
    valor: mes.monto,
    destacado: mes.estado === 'pagado',
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mis pagos</CardTitle>
        <CardDescription>
          Cuota liquidada por mes, últimos 12 meses. Los picos son cuotas extraordinarias
          aprobadas en asamblea.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ColumnChart
          puntos={puntos}
          etiquetaSerie="Monto pagado"
          formatValor={formatMoneda}
          formatTick={formatMonedaCompacta}
          leyenda={[
            { label: 'Pagado', className: 'bg-primary' },
            { label: 'Pendiente', className: 'bg-muted-foreground' },
          ]}
        />
      </CardContent>
    </Card>
  )
}
