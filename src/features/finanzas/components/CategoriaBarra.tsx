import { formatCurrency } from '../lib/format'

export function CategoriaBarra({
  label,
  monto,
  porcentaje,
}: {
  label: string
  monto: number
  porcentaje: number
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-muted-foreground w-32 shrink-0 text-sm">{label}</span>
      <div className="bg-muted h-2 flex-1 rounded-full">
        <div
          className="bg-primary h-2 rounded-full"
          style={{ width: `${porcentaje}%` }}
        />
      </div>
      <span className="w-28 shrink-0 text-right text-sm">{formatCurrency(monto)}</span>
    </div>
  )
}
