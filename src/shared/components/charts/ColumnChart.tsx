import { useId, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { escalaLimpia } from './escala'

export type PuntoColumna = {
  /** Etiqueta corta del eje x (`Sep`). */
  etiqueta: string
  /** Etiqueta completa para tooltip y tabla (`Sep 2025`). */
  etiquetaLarga: string
  valor: number
  /** `false` pinta la columna en el gris de contexto (forma de énfasis). */
  destacado?: boolean
}

/**
 * Columnas de serie única con capa de hover y vista de tabla.
 *
 * Construido con divs en lugar de SVG: es lo que ya hace el resto del repo
 * (`CategoriaBarra`), es responsivo sin medir el contenedor, y evita meter una
 * librería de charts para doce barras.
 *
 * Especificaciones que no son negociables aquí:
 * - columnas ≤24px, esquina superior de 4px y base cuadrada sobre una sola línea base
 * - separación de 2px en el color de la superficie entre columnas contiguas
 * - gridlines hairline sólidas (nunca punteadas), un paso fuera de la superficie
 * - el tooltip nunca es el único acceso al valor: existe la vista de tabla
 * - el área de hover es toda la banda (mucho más que la columna), y el foco de
 *   teclado muestra exactamente lo mismo que el hover
 */
export function ColumnChart({
  puntos,
  formatValor,
  formatTick,
  etiquetaSerie,
  leyenda,
}: {
  puntos: PuntoColumna[]
  formatValor: (valor: number) => string
  formatTick: (valor: number) => string
  /** Nombra qué se está graficando; encabeza la columna de valores en la tabla. */
  etiquetaSerie: string
  /** Clases visuales cuando hay más de una (p. ej. pagado / pendiente). */
  leyenda?: { label: string; className: string }[]
}) {
  const [verTabla, setVerTabla] = useState(false)
  const [activo, setActivo] = useState<number | null>(null)
  const idTabla = useId()

  const { techo, ticks } = escalaLimpia(Math.max(...puntos.map((p) => p.valor)))

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        {leyenda && leyenda.length > 1 && (
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {leyenda.map((item) => (
              <li key={item.label} className="flex items-center gap-1.5">
                <span className={cn('size-2 rounded-full', item.className)} />
                <span className="text-muted-foreground text-xs">{item.label}</span>
              </li>
            ))}
          </ul>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground ml-auto h-7 px-2 text-xs"
          aria-expanded={verTabla}
          aria-controls={idTabla}
          onClick={() => setVerTabla((v) => !v)}
        >
          {verTabla ? 'Ver gráfico' : 'Ver tabla'}
        </Button>
      </div>

      {verTabla ? (
        <div id={idTabla}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Periodo</TableHead>
                <TableHead className="text-right">{etiquetaSerie}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {puntos.map((punto) => (
                <TableRow key={punto.etiquetaLarga}>
                  <TableCell className="font-medium">{punto.etiquetaLarga}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatValor(punto.valor)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div id={idTabla} className="flex gap-3">
          {/* Eje y: ticks redondeados, alineados con las gridlines. */}
          <div className="text-muted-foreground flex h-40 flex-col justify-between text-[11px] tabular-nums">
            {ticks.map((tick) => (
              <span key={tick} className="leading-none">
                {formatTick(tick)}
              </span>
            ))}
          </div>

          <div className="min-w-0 flex-1">
            <div className="relative h-40">
              {/* Gridlines hairline sólidas, recesivas. */}
              {ticks.map((tick) => (
                <div
                  key={tick}
                  className="bg-border absolute inset-x-0 h-px"
                  style={{ top: `${((techo - tick) / techo) * 100}%` }}
                  aria-hidden
                />
              ))}

              {/* Bandas: el área de hover es la banda completa, no la columna. */}
              <div className="absolute inset-0 flex items-end gap-[2px]">
                {puntos.map((punto, i) => {
                  const alto = techo > 0 ? (punto.valor / techo) * 100 : 0
                  const contexto = punto.destacado === false

                  return (
                    <div
                      key={punto.etiquetaLarga}
                      className="group relative flex h-full min-w-0 flex-1 items-end justify-center"
                      tabIndex={0}
                      role="img"
                      aria-label={`${punto.etiquetaLarga}: ${formatValor(punto.valor)}`}
                      onMouseEnter={() => setActivo(i)}
                      onMouseLeave={() => setActivo(null)}
                      onFocus={() => setActivo(i)}
                      onBlur={() => setActivo(null)}
                    >
                      <div
                        className={cn(
                          'w-full max-w-6 rounded-t-[4px]',
                          contexto ? 'bg-muted-foreground' : 'bg-primary',
                        )}
                        style={{ height: `${alto}%` }}
                      />

                      {activo === i && (
                        <div className="bg-popover text-popover-foreground pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 -translate-x-1/2 rounded-md border px-2 py-1 whitespace-nowrap shadow-md">
                          <div className="text-[11px] font-medium">
                            {punto.etiquetaLarga}
                          </div>
                          <div className="text-[11px] tabular-nums">
                            {formatValor(punto.valor)}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Banda del eje x dentro del flujo: la card crece con ella en vez
                de recortarla con un scroll anidado. */}
            <div className="mt-2 flex gap-[2px]">
              {puntos.map((punto) => (
                <span
                  key={punto.etiquetaLarga}
                  className="text-muted-foreground min-w-0 flex-1 truncate text-center text-[11px]"
                >
                  {punto.etiqueta}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
