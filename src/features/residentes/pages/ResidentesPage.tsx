import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EstadoBadge } from '../components/EstadoBadge'
import { useResidentes } from '../hooks/use-residentes'

export function ResidentesPage() {
  const { data: residentes, isLoading, isError } = useResidentes()

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Residentes</h1>
        <p className="text-muted-foreground text-sm">
          Listado de residentes del condominio.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Residentes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p className="text-muted-foreground text-sm">Cargando…</p>}
          {isError && (
            <p className="text-destructive text-sm">
              No se pudo cargar el listado de residentes.
            </p>
          )}
          {residentes && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Unidad</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {residentes.map((residente) => (
                  <TableRow key={residente.id}>
                    <TableCell className="font-medium">{residente.nombre}</TableCell>
                    <TableCell>{residente.unidad}</TableCell>
                    <TableCell>{residente.email}</TableCell>
                    <TableCell>
                      <EstadoBadge estado={residente.estado} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
