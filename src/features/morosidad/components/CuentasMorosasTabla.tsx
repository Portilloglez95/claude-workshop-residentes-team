import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { CuentaMorosa } from '../types'
import { CuentaMorosaFila } from './CuentaMorosaFila'

export function CuentasMorosasTabla({ cuentas }: { cuentas: CuentaMorosa[] }) {
  if (cuentas.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">No hay unidades en este estado.</p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Unidad</TableHead>
          <TableHead className="text-right">Cuotas vencidas</TableHead>
          <TableHead className="text-right">Atraso</TableHead>
          <TableHead className="text-right">Capital</TableHead>
          <TableHead className="text-right">Recargos e intereses</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Gestión</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cuentas.map((cuenta) => (
          <CuentaMorosaFila key={cuenta.id} cuenta={cuenta} />
        ))}
      </TableBody>
    </Table>
  )
}
