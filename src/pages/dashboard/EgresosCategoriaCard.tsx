import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { GastosFinanzas } from '@/features/finanzas/types'
import { BarList } from '@/shared/components/charts/BarList'
import { formatMoneda } from '@/shared/lib/format-moneda'

/** En qué se gasta la cuota. Contesta la pregunta que sigue a "¿cuánto pago?". */
export function EgresosCategoriaCard({ gastos }: { gastos: GastosFinanzas }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>En qué se usa tu cuota</CardTitle>
          <CardDescription>Egresos del condominio en agosto.</CardDescription>
        </div>
        <Button asChild variant="ghost" size="sm" className="text-muted-foreground h-7">
          <Link to="/finanzas">Detalle</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <BarList
          filas={gastos.categorias.map((categoria) => ({
            label: categoria.categoria,
            valor: categoria.monto,
            porcentaje: categoria.porcentaje,
          }))}
          formatValor={formatMoneda}
        />
      </CardContent>
    </Card>
  )
}
