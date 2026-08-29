import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CargoProximo } from '@/features/finanzas/types'
import { formatMoneda } from '@/shared/lib/format-moneda'
import { EstadoCargoBadge } from './EstadoCargoBadge'

/** Qué se va a cobrar y cuándo. Los vencidos primero. */
export function ProximosCargosCard({ cargos }: { cargos: CargoProximo[] }) {
  const ordenados = [...cargos].sort((a, b) => a.diasRestantes - b.diasRestantes)
  const total = cargos.reduce((suma, cargo) => suma + cargo.monto, 0)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Próximos cargos</CardTitle>
        <Button asChild variant="ghost" size="sm" className="text-muted-foreground h-7">
          <Link to="/finanzas">Ver finanzas</Link>
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <ul className="flex flex-col divide-y">
          {ordenados.map((cargo) => (
            <li key={cargo.id} className="flex flex-col gap-1 py-2.5 first:pt-0">
              {/* Concepto y monto en su propia línea: el concepto necesita el
                  ancho completo de la card para no recortarse. */}
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-medium">{cargo.concepto}</span>
                <span className="shrink-0 text-sm tabular-nums">
                  {formatMoneda(cargo.monto)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground min-w-0 truncate text-xs">
                  {cargo.detalle} · vence {cargo.vence}
                </span>
                <EstadoCargoBadge estado={cargo.estado} />
              </div>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between border-t pt-3">
          <span className="text-muted-foreground text-sm">Total programado</span>
          <span className="text-sm font-medium tabular-nums">{formatMoneda(total)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
