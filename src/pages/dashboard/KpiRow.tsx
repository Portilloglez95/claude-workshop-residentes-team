import type {
  GastosFinanzas,
  MorosidadFinanzas,
  ResumenPanel,
} from '@/features/finanzas/types'
import { StatTile } from '@/shared/components/charts/StatTile'
import { formatDelta, formatMoneda } from '@/shared/lib/format-moneda'

/**
 * Fila de cifras: lo del residente primero, lo del condominio después.
 * Ninguna compite con la hero figure del estado de cuenta.
 */
export function KpiRow({
  panel,
  gastos,
  morosidad,
}: {
  panel: ResumenPanel
  gastos?: GastosFinanzas
  morosidad?: MorosidadFinanzas
}) {
  const pagadoAnio = panel.serieMensual
    .filter((mes) => mes.anio === panel.anioEnCurso && mes.estado === 'pagado')
    .reduce((suma, mes) => suma + mes.monto, 0)

  const alCorriente = morosidad
    ? morosidad.unidadesTotales - morosidad.unidadesConAdeudo
    : 0

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatTile
        label={`Pagado en ${panel.anioEnCurso}`}
        value={formatMoneda(pagadoAnio)}
        delta={
          formatDelta(pagadoAnio, panel.pagadoAnioPrevio)
            ? `${formatDelta(pagadoAnio, panel.pagadoAnioPrevio)} vs ${panel.anioEnCurso - 1}`
            : null
        }
        serie={panel.serieMensual.map((mes) => mes.monto)}
        accent
      />

      {morosidad && (
        <StatTile
          label="Cobranza del mes"
          value={`${morosidad.cobranzaMes}%`}
          hint={`${alCorriente} de ${morosidad.unidadesTotales} unidades al corriente`}
        />
      )}

      {gastos && (
        <StatTile
          label="Saldo en caja"
          value={formatMoneda(gastos.saldoCaja)}
          delta={
            formatDelta(gastos.ingresosMes, gastos.egresosMes)
              ? `Ingresos ${formatDelta(gastos.ingresosMes, gastos.egresosMes)} vs egresos`
              : null
          }
          nivelDelta={gastos.ingresosMes >= gastos.egresosMes ? 'bueno' : 'critico'}
        />
      )}

      {morosidad && (
        <StatTile
          label="Monto en rezago"
          value={formatMoneda(morosidad.montoRezago)}
          hint={`${morosidad.unidadesConAdeudo} unidades con adeudo`}
        />
      )}
    </div>
  )
}
