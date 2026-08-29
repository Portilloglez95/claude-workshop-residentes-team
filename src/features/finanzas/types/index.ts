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
