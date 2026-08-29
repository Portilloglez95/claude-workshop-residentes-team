export type EstadoCobranza = 'al_dia' | 'en_mora' | 'en_gestion' | 'proceso_legal'

export type Cuota = {
  id: string
  /** Periodo facturado en formato `AAAA-MM`, ej. `2026-03`. */
  periodo: string
  concepto: string
  /** Monto original de la cuota, sin recargos ni intereses. */
  monto: number
  /** Abonos ya aplicados a esta cuota. El capital pendiente es `monto - abonado`. */
  abonado: number
  /** ISO 8601 — último día para pagar sin recargo. */
  fechaVencimiento: string
}

export type CuentaMorosa = {
  id: string
  unidad: string
  residente: string
  email: string
  telefono: string
  cuotas: Cuota[]
  /**
   * Estado que reporta el backend. Administración puede escalar una cuenta
   * antes de los umbrales automáticos (convenio de pago incumplido, unidad
   * reincidente), por eso el estado no se deriva solo de los días de
   * atraso — ver `estadoCobranza()`.
   */
  estado: EstadoCobranza | null
  /** ISO 8601 de la última gestión de cobranza registrada, o `null` si no hay ninguna. */
  ultimaGestion: string | null
}
