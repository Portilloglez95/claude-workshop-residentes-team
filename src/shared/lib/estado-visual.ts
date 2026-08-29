/**
 * Escala de estatus compartida (bueno → crítico). No es una paleta categórica:
 * su significado está reservado y nunca se reusa como "serie 4".
 *
 * Validado con el validador de dataviz contra las superficies reales de card
 * (`#ffffff` en claro, `#171717` en oscuro):
 *
 *   bueno       #0ca30c  3.35:1 claro · 5.34:1 oscuro  ✓ ≥3:1
 *   advertencia #fab219  1.83:1 claro · 9.77:1 oscuro  ✗ en claro
 *   crítico     token `destructive`  4.77:1 · 6.21:1   ✓ ≥3:1
 *
 * `advertencia` queda bajo 3:1 en claro *por diseño*: la mitigación es que el
 * estatus nunca viaja solo en color. Cada uso lleva ícono + etiqueta de texto,
 * y el color vive en el punto/ícono — jamás en el texto (a 1.83:1 sería
 * ilegible). Si algún día se pinta texto con estos valores, hay que
 * re-escalonar el ámbar antes.
 *
 * TODO: `src/features/encuestas/lib/paleta.ts` define su propio `COLOR_ESTADO`
 * con los mismos hex. Al tocar encuestas conviene plegarlo aquí para tener una
 * sola fuente de verdad; se dejó intacto para no generar conflictos de merge.
 */
export type NivelEstado = 'bueno' | 'advertencia' | 'critico' | 'neutral'

/**
 * Clase de Tailwind para el punto/ícono de estatus. `critico` usa el token del
 * tema; los otros dos usan hex fijos porque el tema es monocromático y no
 * expone verde ni ámbar.
 */
export const COLOR_PUNTO_ESTADO: Record<NivelEstado, string> = {
  bueno: 'bg-[#0ca30c]',
  advertencia: 'bg-[#fab219]',
  critico: 'bg-destructive',
  neutral: 'bg-muted-foreground',
}

/** Misma escala para un ícono SVG (`text-*` en lugar de `bg-*`). */
export const COLOR_ICONO_ESTADO: Record<NivelEstado, string> = {
  bueno: 'text-[#0ca30c]',
  advertencia: 'text-[#fab219]',
  critico: 'text-destructive',
  neutral: 'text-muted-foreground',
}
