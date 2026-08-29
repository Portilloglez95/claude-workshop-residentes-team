export type FilaBarra = {
  label: string
  valor: number
  /** Proporción 0–100 respecto al total; si falta se calcula sobre el máximo. */
  porcentaje?: number
}

/**
 * Barras horizontales para comparar magnitudes con nombres largos.
 *
 * Todas las barras llevan el *mismo* color. Las categorías (Vigilancia,
 * Limpieza…) son nominales: no tienen orden natural, así que pintarlas
 * "más oscuro donde es más grande" gastaría el canal de identidad
 * re-codificando lo que el largo de la barra ya dice.
 */
export function BarList({
  filas,
  formatValor,
}: {
  filas: FilaBarra[]
  formatValor: (valor: number) => string
}) {
  const maximo = Math.max(...filas.map((f) => f.valor)) || 1

  return (
    <ul className="flex flex-col gap-3">
      {filas.map((fila) => {
        const ancho = fila.porcentaje ?? (fila.valor / maximo) * 100

        return (
          <li key={fila.label} className="flex items-center gap-4">
            <span className="text-muted-foreground w-32 shrink-0 truncate text-sm">
              {fila.label}
            </span>
            <div className="bg-border h-2 min-w-0 flex-1 rounded-full">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: `${ancho}%` }}
              />
            </div>
            <span className="w-28 shrink-0 text-right text-sm tabular-nums">
              {formatValor(fila.valor)}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
