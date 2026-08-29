import { Send } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import type { CuentaMorosa } from '../types'
import { useGestionesStore } from '../store/use-gestiones-store'
import { calcularMoraCuenta } from '../lib/calcular-mora'
import { siguienteGestion } from '../lib/escalamiento'
import { estadoCobranza } from '../lib/estado-cobranza'
import { formatUltimaGestion } from '../lib/format-fecha'
import { formatMonto } from '../lib/format-monto'
import { EstadoCobranzaBadge } from './EstadoCobranzaBadge'

export function CuentaMorosaFila({ cuenta }: { cuenta: CuentaMorosa }) {
  const gestionLocal = useGestionesStore((store) => store.gestiones[cuenta.id])
  const registrarGestion = useGestionesStore((store) => store.registrar)

  const mora = calcularMoraCuenta(cuenta)
  const estado = estadoCobranza(cuenta)
  const gestion = siguienteGestion(estado)
  const ultimaGestion = gestionLocal?.fecha ?? cuenta.ultimaGestion

  function alGestionar() {
    if (gestion === null) return
    registrarGestion(cuenta.id, gestion.tipo)
    toast.success(gestion.confirmacion, {
      description: `${cuenta.unidad} · ${cuenta.residente}`,
    })
  }

  return (
    <TableRow>
      <TableCell>
        <span className="font-medium">{cuenta.unidad}</span>
        <span className="text-muted-foreground block text-xs">{cuenta.residente}</span>
      </TableCell>
      <TableCell className="text-right tabular-nums">{mora.cuotasVencidas}</TableCell>
      <TableCell className="text-right tabular-nums">
        {mora.diasAtrasoMax === 0 ? '—' : `${mora.diasAtrasoMax} días`}
      </TableCell>
      <TableCell className="text-right tabular-nums">
        {formatMonto(mora.capital)}
      </TableCell>
      <TableCell className="text-right tabular-nums">
        {formatMonto(mora.recargos + mora.intereses)}
      </TableCell>
      <TableCell className="text-right font-medium tabular-nums">
        {formatMonto(mora.total)}
      </TableCell>
      <TableCell>
        <EstadoCobranzaBadge estado={estado} />
        <span className="text-muted-foreground mt-1 block text-xs">
          {formatUltimaGestion(ultimaGestion)}
        </span>
      </TableCell>
      <TableCell className="text-right">
        {gestion && (
          <Button variant="outline" size="sm" onClick={alGestionar}>
            <Send className="size-3.5" />
            {gestion.accion}
          </Button>
        )}
      </TableCell>
    </TableRow>
  )
}
