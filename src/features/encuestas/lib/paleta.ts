/**
 * Paleta categórica para las barras de resultados. El orden es la garantía
 * de accesibilidad, no un detalle estético: se validó con el validador de
 * dataviz contra las superficies reales de la app (`#ffffff` en claro,
 * `#171717` en oscuro) y pasa banda de luminosidad, piso de croma,
 * separación para daltonismo y visión normal en ambos modos.
 *
 * Reglas al tocar esto:
 * - Se asignan en orden fijo, nunca cíclico. La 9ª opción no inventa un tono.
 * - El color pertenece a la opción, nunca a su posición en el ranking: la
 *   ganadora no se recolorea, se destaca con ícono y peso tipográfico.
 * - Tres tonos en claro quedan bajo 3:1 contra el blanco (aqua, amarillo,
 *   magenta). Eso es aceptable solo porque cada barra lleva su etiqueta de
 *   texto y su porcentaje al lado — si algún día se quitan, hay que
 *   re-escalonar los tonos.
 */
export type SlotColor = { claro: string; oscuro: string }

const PALETA: SlotColor[] = [
  { claro: '#2a78d6', oscuro: '#3987e5' }, // azul
  { claro: '#eb6834', oscuro: '#d95926' }, // naranja
  { claro: '#1baf7a', oscuro: '#199e70' }, // aqua
  { claro: '#eda100', oscuro: '#c98500' }, // amarillo
  { claro: '#e87ba4', oscuro: '#d55181' }, // magenta
  { claro: '#008300', oscuro: '#008300' }, // verde
  { claro: '#4a3aa7', oscuro: '#9085e9' }, // violeta
  { claro: '#e34948', oscuro: '#e66767' }, // rojo
]

/** Color fijo de la opción por su posición en la encuesta. */
export function colorDeOpcion(indice: number): SlotColor {
  return PALETA[indice] ?? PALETA[PALETA.length - 1]
}

/**
 * Variables CSS para pintar un elemento con el color del slot. Se pasan por
 * `style` y se consumen con `bg-[var(--serie)] dark:bg-[var(--serie-oscuro)]`,
 * que es la forma de tener claro/oscuro sin tocar `index.css` (archivo
 * compartido y de alto riesgo de conflicto).
 */
export function varsDeColor(indice: number): React.CSSProperties {
  const { claro, oscuro } = colorDeOpcion(indice)
  return { '--serie': claro, '--serie-oscuro': oscuro } as React.CSSProperties
}

/** Estados del quórum. Nunca van solos: siempre con ícono y etiqueta. */
export const COLOR_ESTADO = {
  bueno: { claro: '#0ca30c', oscuro: '#0ca30c' },
  advertencia: { claro: '#fab219', oscuro: '#fab219' },
} as const
