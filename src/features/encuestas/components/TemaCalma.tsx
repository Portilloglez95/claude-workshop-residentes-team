import { FUENTE_CALMA, TEMA_CALMA_CLARO, TEMA_CALMA_OSCURO } from '../lib/tema-calma'

function aCss(vars: Record<string, string>): string {
  return Object.entries(vars)
    .map(([clave, valor]) => `${clave}:${valor};`)
    .join('')
}

/**
 * Aplica la dirección "Calma" a lo que envuelve. Las variables van en un
 * bloque de estilos con alcance en `[data-tema="calma"]` y no en `style`
 * inline, porque hacen falta dos juegos de valores (claro y oscuro) y un
 * atributo inline no puede reaccionar a la clase `.dark` del tema.
 */
export function TemaCalma({ children }: { children: React.ReactNode }) {
  const css = `
    [data-tema="calma"]{${aCss(TEMA_CALMA_CLARO)}font-family:${FUENTE_CALMA};}
    .dark [data-tema="calma"]{${aCss(TEMA_CALMA_OSCURO)}}
  `

  return (
    <>
      <style>{css}</style>
      <div
        data-tema="calma"
        className="-m-6 min-h-full bg-[var(--papel)] p-6 text-[var(--tinta)]"
      >
        {children}
      </div>
    </>
  )
}
