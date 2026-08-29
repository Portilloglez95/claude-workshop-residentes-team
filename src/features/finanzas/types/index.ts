export type EstadoPago = 'pendiente' | 'pagado'

export type PagoCuota = {
  id: string
  periodo: string
  concepto: string
  metodo: string | null
  monto: number
  estado: EstadoPago
}

export type CuentaFinanzas = {
  unidad: string
  porPagar: number
  vencePago: string
  cuotaMensual: number
  indiviso: number
  pagadoAnio: number
  mesesPagados: number
  mesesTotales: number
  historial: PagoCuota[]
}

export type CategoriaGasto = {
  categoria: string
  monto: number
  porcentaje: number
}

export type MovimientoGasto = {
  id: string
  fecha: string
  concepto: string
  proveedor: string
  monto: number
  comprobante: string
}

export type GastosFinanzas = {
  ingresosMes: number
  egresosMes: number
  saldoCaja: number
  categorias: CategoriaGasto[]
  movimientos: MovimientoGasto[]
}

export type RubroPresupuesto = {
  rubro: string
  presupuestoAnual: number
  ejecutado: number
}

export type TransparenciaFinanzas = {
  presupuestoAnual: number
  ejecutado: number
  fondoReserva: number
  rubros: RubroPresupuesto[]
}

export type EstatusMorosidad = 'cobranza_legal' | 'convenio_pago' | 'notificado'

export type UnidadMorosa = {
  unidad: string
  mesesAdeudo: number
  monto: number
  estatus: EstatusMorosidad
}

export type MorosidadFinanzas = {
  unidadesConAdeudo: number
  unidadesTotales: number
  montoRezago: number
  cobranzaMes: number
  unidades: UnidadMorosa[]
}

export type EstadoCargo = 'vencido' | 'por_vencer' | 'programado'

export type CargoProximo = {
  id: string
  concepto: string
  detalle: string
  vence: string
  diasRestantes: number
  monto: number
  estado: EstadoCargo
}

export type PagoMensual = {
  /** Etiqueta corta para el eje x. */
  etiqueta: string
  /** Etiqueta completa para tooltip y vista de tabla. */
  periodo: string
  monto: number
  estado: EstadoPago
  /** Año calendario, para agregar el total del ejercicio en curso. */
  anio: number
}

/** Métodos de pago guardados, para los accesos directos del panel. */
export type MetodoPago = {
  id: string
  tipo: 'tarjeta' | 'spei' | 'domiciliacion'
  etiqueta: string
  detalle: string
  activo: boolean
}

/**
 * Payload del panel: lo que el residente necesita ver de un golpe al entrar
 * (qué debe, cuándo vence, cómo va el año y cómo pagar).
 */
export type ResumenPanel = {
  unidad: string
  porPagar: number
  vencePago: string
  diasParaVencer: number
  cuotaMensual: number
  indiviso: number
  saldoFavor: number
  mesesPagados: number
  mesesTotales: number
  anioEnCurso: number
  /** Total pagado el año previo, para el delta del tile. */
  pagadoAnioPrevio: number
  /** 12 meses móviles; el último es el periodo en curso. */
  serieMensual: PagoMensual[]
  proximosCargos: CargoProximo[]
  metodosPago: MetodoPago[]
}
