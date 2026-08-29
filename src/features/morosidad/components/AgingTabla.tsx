import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { FilaAging } from '../lib/aging'
import { formatMonto } from '../lib/format-monto'

/** Antigüedad de saldos de la cartera, por tramo de días de atraso. */
export function AgingTabla({ filas }: { filas: FilaAging[] }) {
  const total = filas.reduce((suma, fila) => suma + fila.monto, 0)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tramo</TableHead>
          <TableHead className="text-right">Unidades</TableHead>
          <TableHead className="text-right">Saldo</TableHead>
          <TableHead className="text-right">% cartera</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filas.map((fila) => (
          <TableRow key={fila.tramo.id}>
            <TableCell className="font-medium">{fila.tramo.label}</TableCell>
            <TableCell className="text-right tabular-nums">{fila.unidades}</TableCell>
            <TableCell className="text-right tabular-nums">
              {formatMonto(fila.monto)}
            </TableCell>
            <TableCell className="text-right tabular-nums">{fila.porcentaje}%</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell />
          <TableCell className="text-right tabular-nums">{formatMonto(total)}</TableCell>
          <TableCell className="text-right tabular-nums">100%</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
