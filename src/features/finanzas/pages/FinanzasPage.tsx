import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CategoriaBarra } from '../components/CategoriaBarra'
import { EstadoPagoBadge } from '../components/EstadoPagoBadge'
import { EstatusMorosidadBadge } from '../components/EstatusMorosidadBadge'
import { PagarCuotaDialog } from '../components/PagarCuotaDialog'
import { StatTile } from '../components/StatTile'
import {
  useCuentaFinanzas,
  useGastosFinanzas,
  useMorosidadFinanzas,
  useTransparenciaFinanzas,
} from '../hooks/use-finanzas'
import { formatCurrency } from '../lib/format'

export function FinanzasPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Finanzas</h1>
        <p className="text-muted-foreground text-sm">
          Cuotas, gastos y transparencia financiera del condominio.
        </p>
      </div>

      <Tabs defaultValue="cuotas">
        <TabsList className="w-fit">
          <TabsTrigger value="cuotas">Cuotas y pagos</TabsTrigger>
          <TabsTrigger value="gastos">Gastos</TabsTrigger>
          <TabsTrigger value="transparencia">Transparencia</TabsTrigger>
          <TabsTrigger value="morosidad">Morosidad</TabsTrigger>
        </TabsList>

        <TabsContent value="cuotas">
          <CuotasTab />
        </TabsContent>
        <TabsContent value="gastos">
          <GastosTab />
        </TabsContent>
        <TabsContent value="transparencia">
          <TransparenciaTab />
        </TabsContent>
        <TabsContent value="morosidad">
          <MorosidadTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function CuotasTab() {
  const { data: cuenta, isLoading, isError } = useCuentaFinanzas()

  if (isLoading) return <p className="text-muted-foreground text-sm">Cargando…</p>
  if (isError || !cuenta)
    return (
      <p className="text-destructive text-sm">No se pudo cargar el estado de cuenta.</p>
    )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          Cuota de mantenimiento del Depto. {cuenta.unidad}.
        </p>
        <PagarCuotaDialog cuenta={cuenta} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile
          label="Por pagar"
          value={formatCurrency(cuenta.porPagar)}
          hint={`Vence el ${cuenta.vencePago}`}
          accent
        />
        <StatTile
          label="Cuota mensual"
          value={formatCurrency(cuenta.cuotaMensual)}
          hint={`Indiviso ${cuenta.indiviso}%`}
        />
        <StatTile
          label="Pagado en 2026"
          value={formatCurrency(cuenta.pagadoAnio)}
          hint={`${cuenta.mesesPagados} de ${cuenta.mesesTotales} meses`}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Periodo</TableHead>
                <TableHead>Concepto</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Estatus</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cuenta.historial.map((pago) => (
                <TableRow key={pago.id}>
                  <TableCell className="font-medium">{pago.periodo}</TableCell>
                  <TableCell>{pago.concepto}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {pago.metodo ?? '—'}
                  </TableCell>
                  <TableCell>{formatCurrency(pago.monto)}</TableCell>
                  <TableCell>
                    <EstadoPagoBadge estado={pago.estado} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function GastosTab() {
  const { data: gastos, isLoading, isError } = useGastosFinanzas()

  if (isLoading) return <p className="text-muted-foreground text-sm">Cargando…</p>
  if (isError || !gastos)
    return (
      <p className="text-destructive text-sm">No se pudo cargar el resumen de gastos.</p>
    )

  return (
    <div className="flex flex-col gap-4">
      <p className="text-muted-foreground text-sm">
        Egresos del mes en curso, con comprobante disponible.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile label="Ingresos de agosto" value={formatCurrency(gastos.ingresosMes)} />
        <StatTile label="Egresos de agosto" value={formatCurrency(gastos.egresosMes)} />
        <StatTile label="Saldo en caja" value={formatCurrency(gastos.saldoCaja)} accent />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Egresos por categoría</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {gastos.categorias.map((categoria) => (
            <CategoriaBarra
              key={categoria.categoria}
              label={categoria.categoria}
              monto={categoria.monto}
              porcentaje={categoria.porcentaje}
            />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Movimientos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Concepto</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead className="text-right">Comprobante</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gastos.movimientos.map((movimiento) => (
                <TableRow key={movimiento.id}>
                  <TableCell className="text-muted-foreground">
                    {movimiento.fecha}
                  </TableCell>
                  <TableCell className="font-medium">{movimiento.concepto}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {movimiento.proveedor}
                  </TableCell>
                  <TableCell>{formatCurrency(movimiento.monto)}</TableCell>
                  <TableCell className="text-right">
                    <a href="#" className="text-primary text-sm hover:underline">
                      {movimiento.comprobante}
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function TransparenciaTab() {
  const { data: transparencia, isLoading, isError } = useTransparenciaFinanzas()

  if (isLoading) return <p className="text-muted-foreground text-sm">Cargando…</p>
  if (isError || !transparencia)
    return (
      <p className="text-destructive text-sm">
        No se pudo cargar la información de transparencia.
      </p>
    )

  const avanceGeneral = Math.round(
    (transparencia.ejecutado / transparencia.presupuestoAnual) * 100,
  )

  return (
    <div className="flex flex-col gap-4">
      <p className="text-muted-foreground text-sm">
        Presupuesto aprobado en asamblea y su ejecución al corte del mes.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile
          label="Presupuesto 2026"
          value={formatCurrency(transparencia.presupuestoAnual)}
        />
        <StatTile
          label="Ejecutado"
          value={formatCurrency(transparencia.ejecutado)}
          hint={`${avanceGeneral}% del anual`}
        />
        <StatTile
          label="Fondo de reserva"
          value={formatCurrency(transparencia.fondoReserva)}
          accent
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Presupuesto por rubro</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rubro</TableHead>
                <TableHead>Presupuesto anual</TableHead>
                <TableHead>Ejecutado</TableHead>
                <TableHead>Avance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transparencia.rubros.map((rubro) => (
                <TableRow key={rubro.rubro}>
                  <TableCell className="font-medium">{rubro.rubro}</TableCell>
                  <TableCell>{formatCurrency(rubro.presupuestoAnual)}</TableCell>
                  <TableCell>{formatCurrency(rubro.ejecutado)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {rubro.presupuestoAnual
                      ? Math.round((rubro.ejecutado / rubro.presupuestoAnual) * 100)
                      : 0}
                    %
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function MorosidadTab() {
  const { data: morosidad, isLoading, isError } = useMorosidadFinanzas()

  if (isLoading) return <p className="text-muted-foreground text-sm">Cargando…</p>
  if (isError || !morosidad)
    return <p className="text-destructive text-sm">No se pudo cargar la morosidad.</p>

  return (
    <div className="flex flex-col gap-4">
      <p className="text-muted-foreground text-sm">
        Publicada conforme al reglamento interno aprobado en asamblea. Se muestra unidad y
        antigüedad del adeudo, sin datos personales.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile
          label="Unidades con adeudo"
          value={`${morosidad.unidadesConAdeudo} de ${morosidad.unidadesTotales}`}
        />
        <StatTile label="Monto en rezago" value={formatCurrency(morosidad.montoRezago)} />
        <StatTile label="Cobranza del mes" value={`${morosidad.cobranzaMes}%`} accent />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Unidades en rezago</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unidad</TableHead>
                <TableHead>Meses de adeudo</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Estatus</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {morosidad.unidades.map((unidad) => (
                <TableRow key={unidad.unidad}>
                  <TableCell className="font-medium">{unidad.unidad}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {unidad.mesesAdeudo}
                  </TableCell>
                  <TableCell>{formatCurrency(unidad.monto)}</TableCell>
                  <TableCell>
                    <EstatusMorosidadBadge estatus={unidad.estatus} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
