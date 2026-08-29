export type EstadoEncuesta = 'abierta' | 'cerrada'

export type OpcionEncuesta = {
  id: string
  texto: string
  /** Votos ya registrados en el backend (no incluye el voto local de esta sesión). */
  votos: number
}

export type Encuesta = {
  id: string
  pregunta: string
  descripcion: string
  /** ISO 8601 */
  fechaApertura: string
  /** ISO 8601 — after this date no more votes are accepted. */
  fechaCierre: string
  autor: string
  /**
   * Estado que reporta el backend. Administración puede cerrar una encuesta
   * antes de `fechaCierre`, por eso no se deriva solo de la fecha —
   * ver `estaCerrada()`.
   */
  estado: EstadoEncuesta
  /** Residentes con derecho a voto al momento de abrir la encuesta. */
  totalElegibles: number
  /**
   * Fracción de `totalElegibles` (0–1) necesaria para que el resultado sea
   * vinculante. Las consultas informativas usan 0.
   */
  quorumRequerido: number
  opciones: OpcionEncuesta[]
  /**
   * Opción que el backend ya tiene registrada para este residente (voto
   * emitido antes de esta sesión), o `null` si todavía no ha votado. El voto
   * emitido durante esta sesión vive en el cliente — ver `useVotosStore`.
   */
  opcionVotada: string | null
}
