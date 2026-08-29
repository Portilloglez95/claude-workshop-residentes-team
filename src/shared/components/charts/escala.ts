/**
 * Redondea el techo del eje a un número limpio y devuelve los ticks. Los ticks
 * cargan los valores que no se etiquetan directamente, así que tienen que ser
 * legibles: 0 / 1,500 / 3,000, nunca 0 / 1,483 / 2,966.
 */
/**
 * Proporción del alto que puede ocupar la marca más alta. El resto es aire
 * sobre la barra: es donde cabe el tooltip sin encimarse con la leyenda, y
 * evita que la columna máxima toque el borde del área de trazado.
 */
const OCUPACION_MAXIMA = 0.85

export function escalaLimpia(maximoDatos: number, cortes = 2) {
  if (maximoDatos <= 0) return { techo: 1, ticks: [1, 0] }

  const objetivo = maximoDatos / OCUPACION_MAXIMA
  const magnitud = 10 ** Math.floor(Math.log10(objetivo))
  const pasos = [1, 1.5, 2, 2.5, 3, 4, 5, 7.5, 10]
  const paso = pasos.find((p) => p * magnitud >= objetivo) ?? pasos[pasos.length - 1]
  const techo = paso * magnitud

  const ticks = Array.from({ length: cortes + 1 }, (_, i) => techo - (techo / cortes) * i)

  return { techo, ticks }
}
