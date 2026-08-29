import type { Encuesta, OpcionEncuesta } from '../types'

export type ResultadoOpcion = {
  opcion: OpcionEncuesta
  votos: number
  /** 0–100, redondeado. Es 0 cuando todavía no hay ningún voto. */
  porcentaje: number
  esVotoPropio: boolean
}

export type ResultadosEncuesta = {
  resultados: ResultadoOpcion[]
  totalVotos: number
  /** Opción elegida por este residente, venga del backend o del cliente. */
  opcionVotada: string | null
}

/**
 * Combina los votos del backend con el voto local. El voto local solo se
 * suma cuando el backend todavía no lo tiene registrado (`opcionVotada`
 * nula); de lo contrario se contaría dos veces.
 */
export function calcularResultados(
  encuesta: Encuesta,
  votoLocal: string | undefined,
): ResultadosEncuesta {
  const sumarVotoLocal = encuesta.opcionVotada === null && votoLocal !== undefined
  const opcionVotada = encuesta.opcionVotada ?? votoLocal ?? null

  const votosPorOpcion = encuesta.opciones.map(
    (opcion) => opcion.votos + (sumarVotoLocal && opcion.id === votoLocal ? 1 : 0),
  )
  const totalVotos = votosPorOpcion.reduce((suma, votos) => suma + votos, 0)

  return {
    resultados: encuesta.opciones.map((opcion, indice) => ({
      opcion,
      votos: votosPorOpcion[indice],
      porcentaje:
        totalVotos === 0 ? 0 : Math.round((votosPorOpcion[indice] / totalVotos) * 100),
      esVotoPropio: opcion.id === opcionVotada,
    })),
    totalVotos,
    opcionVotada,
  }
}
