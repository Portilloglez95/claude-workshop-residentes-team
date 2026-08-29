import type { Encuesta, OpcionEncuesta } from '../types'

export type ResultadoOpcion = {
  opcion: OpcionEncuesta
  votos: number
  /** 0–100, redondeado. Es 0 cuando todavía no hay ningún voto. */
  porcentaje: number
  esVotoPropio: boolean
  /** Va en cabeza. Puede ser más de una opción si hay empate. */
  esGanadora: boolean
}

export type ResultadosEncuesta = {
  resultados: ResultadoOpcion[]
  totalVotos: number
  /** Opción elegida por este residente, venga del backend o del cliente. */
  opcionVotada: string | null
  /** Participación sobre el padrón, 0–100. */
  participacion: number
  /** Votos que faltan para alcanzar el quórum. 0 si ya se alcanzó o no se exige. */
  votosParaQuorum: number
  quorumAlcanzado: boolean
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
  const maxVotos = Math.max(...votosPorOpcion)

  const votosQuorum = Math.ceil(encuesta.totalElegibles * encuesta.quorumRequerido)

  return {
    resultados: encuesta.opciones.map((opcion, indice) => ({
      opcion,
      votos: votosPorOpcion[indice],
      porcentaje:
        totalVotos === 0 ? 0 : Math.round((votosPorOpcion[indice] / totalVotos) * 100),
      esVotoPropio: opcion.id === opcionVotada,
      esGanadora: totalVotos > 0 && votosPorOpcion[indice] === maxVotos,
    })),
    totalVotos,
    opcionVotada,
    participacion:
      encuesta.totalElegibles === 0
        ? 0
        : Math.round((totalVotos / encuesta.totalElegibles) * 100),
    votosParaQuorum: Math.max(0, votosQuorum - totalVotos),
    quorumAlcanzado: totalVotos >= votosQuorum,
  }
}
