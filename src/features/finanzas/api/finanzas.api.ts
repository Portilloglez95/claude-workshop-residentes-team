import type {
  CuentaFinanzas,
  GastosFinanzas,
  MorosidadFinanzas,
  TransparenciaFinanzas,
} from '../types'

// TODO: reemplazar por llamadas a `apiClient` cuando el backend esté
// disponible. Se deja mockeado para que la UI se pueda construir en
// paralelo, siguiendo el mismo patrón que `residentes.api.ts`.

const MOCK_CUENTA: CuentaFinanzas = {
  unidad: 'A-101',
  porPagar: 2450,
  vencePago: '5 de septiembre',
  cuotaMensual: 2450,
  indiviso: 1.42,
  pagadoAnio: 17150,
  mesesPagados: 7,
  mesesTotales: 8,
  historial: [
    {
      id: '1',
      periodo: 'Ago 2026',
      concepto: 'Cuota de mantenimiento',
      metodo: null,
      monto: 2450,
      estado: 'pendiente',
    },
    {
      id: '2',
      periodo: 'Jul 2026',
      concepto: 'Cuota de mantenimiento',
      metodo: 'Tarjeta ···4218',
      monto: 2450,
      estado: 'pagado',
    },
    {
      id: '3',
      periodo: 'Jun 2026',
      concepto: 'Cuota + cuota extraordinaria',
      metodo: 'SPEI',
      monto: 3950,
      estado: 'pagado',
    },
    {
      id: '4',
      periodo: 'May 2026',
      concepto: 'Cuota de mantenimiento',
      metodo: 'Tarjeta ···4218',
      monto: 2450,
      estado: 'pagado',
    },
  ],
}

const MOCK_GASTOS: GastosFinanzas = {
  ingresosMes: 286400,
  egresosMes: 241780,
  saldoCaja: 412900,
  categorias: [
    { categoria: 'Vigilancia', monto: 106000, porcentaje: 44 },
    { categoria: 'Limpieza', monto: 53200, porcentaje: 22 },
    { categoria: 'Áreas verdes', monto: 33800, porcentaje: 14 },
    { categoria: 'Energía eléctrica', monto: 28900, porcentaje: 12 },
    { categoria: 'Mantenimientos', monto: 19880, porcentaje: 8 },
  ],
  movimientos: [
    {
      id: '1',
      fecha: '26 ago',
      concepto: 'Servicio de vigilancia · agosto',
      proveedor: 'Segurex SA de CV',
      monto: 106000,
      comprobante: 'Factura',
    },
    {
      id: '2',
      fecha: '20 ago',
      concepto: 'Cambio de bombas hidroneumáticas',
      proveedor: 'Hidroservicios MX',
      monto: 19880,
      comprobante: 'Factura',
    },
    {
      id: '3',
      fecha: '15 ago',
      concepto: 'Limpieza de áreas comunes',
      proveedor: 'Grupo Nítido',
      monto: 53200,
      comprobante: 'Factura',
    },
    {
      id: '4',
      fecha: '10 ago',
      concepto: 'Consumo CFE · bimestre',
      proveedor: 'CFE',
      monto: 28900,
      comprobante: 'Recibo',
    },
  ],
}

const MOCK_TRANSPARENCIA: TransparenciaFinanzas = {
  presupuestoAnual: 3436800,
  ejecutado: 1894240,
  fondoReserva: 684000,
  rubros: [
    { rubro: 'Vigilancia', presupuestoAnual: 1272000, ejecutado: 742000 },
    { rubro: 'Limpieza', presupuestoAnual: 638400, ejecutado: 372400 },
    { rubro: 'Áreas verdes', presupuestoAnual: 405600, ejecutado: 236600 },
    { rubro: 'Energía eléctrica y agua', presupuestoAnual: 520200, ejecutado: 289540 },
    {
      rubro: 'Mantenimientos y reparaciones',
      presupuestoAnual: 416600,
      ejecutado: 253700,
    },
    { rubro: 'Administración', presupuestoAnual: 184000, ejecutado: 0 },
  ],
}

const MOCK_MOROSIDAD: MorosidadFinanzas = {
  unidadesConAdeudo: 14,
  unidadesTotales: 118,
  montoRezago: 318500,
  cobranzaMes: 88.1,
  unidades: [
    { unidad: 'B-104', mesesAdeudo: 7, monto: 17150, estatus: 'cobranza_legal' },
    { unidad: 'A-302', mesesAdeudo: 5, monto: 12250, estatus: 'convenio_pago' },
    { unidad: 'C-201', mesesAdeudo: 4, monto: 9800, estatus: 'convenio_pago' },
    { unidad: 'A-108', mesesAdeudo: 3, monto: 7350, estatus: 'notificado' },
    { unidad: 'D-405', mesesAdeudo: 2, monto: 4900, estatus: 'notificado' },
  ],
}

async function delay() {
  await new Promise((resolve) => setTimeout(resolve, 300))
}

export async function fetchCuentaFinanzas(): Promise<CuentaFinanzas> {
  await delay()
  return MOCK_CUENTA
}

export async function fetchGastosFinanzas(): Promise<GastosFinanzas> {
  await delay()
  return MOCK_GASTOS
}

export async function fetchTransparenciaFinanzas(): Promise<TransparenciaFinanzas> {
  await delay()
  return MOCK_TRANSPARENCIA
}

export async function fetchMorosidadFinanzas(): Promise<MorosidadFinanzas> {
  await delay()
  return MOCK_MOROSIDAD
}
