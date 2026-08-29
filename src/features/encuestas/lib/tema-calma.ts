/**
 * Dirección "Calma": el condominio es la casa de alguien, no una oficina.
 * Papel cálido, radios amplios, sombra suave y un acento terracota.
 *
 * Vive como variables CSS puestas en el contenedor de la página en vez de
 * en `index.css`, por dos razones: `index.css` es archivo compartido y de
 * alto riesgo de conflicto, y el equipo todavía no decide si la dirección
 * se adopta en toda la app. Si se adopta, esto se muda a los tokens
 * globales y este archivo desaparece.
 */
export const TEMA_CALMA_CLARO = {
  '--papel': '#f7f4ee',
  '--tarjeta': '#ffffff',
  '--tinta': '#2e2a24',
  '--tinta-suave': '#6d675c',
  '--linea': '#e3ddd1',
  '--linea-tenue': '#eee9df',
  '--pista': '#f0ece3',
  '--acento': '#9a5b3d',
  '--acento-contraste': '#ffffff',
  '--sombra': '0 1px 2px rgba(46,42,36,0.05), 0 8px 24px rgba(46,42,36,0.06)',
} as const

export const TEMA_CALMA_OSCURO = {
  '--papel': '#1b1916',
  '--tarjeta': '#262320',
  '--tinta': '#f3ede3',
  '--tinta-suave': '#a89f91',
  '--linea': '#3a352f',
  '--linea-tenue': '#332e29',
  '--pista': '#332e29',
  '--acento': '#d08a63',
  '--acento-contraste': '#1b1916',
  '--sombra': '0 1px 2px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.25)',
} as const

export const FUENTE_CALMA = "'Karla', system-ui, sans-serif"
