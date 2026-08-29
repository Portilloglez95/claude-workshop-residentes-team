import type { Paquete, Visita } from '../types'

function hace(dias: number, horas = 0): string {
  const fecha = new Date()
  fecha.setDate(fecha.getDate() - dias)
  fecha.setHours(fecha.getHours() - horas)
  return fecha.toISOString()
}

// TODO: reemplazar por `apiClient.get<Paquete[]>('/control-acceso/paquetes')`
// y `apiClient.get<Visita[]>('/control-acceso/visitas')` cuando el backend
// esté disponible; el backend ya debería devolver solo lo de la unidad del
// residente autenticado. Mientras tanto se mockea el condominio completo y
// la vista filtra por `RESIDENTE_ACTUAL.unidad`. Lo que el residente hace
// (pre-autorizar / cancelar visita) vive en `store/use-control-acceso-store.ts`.

const MOCK_PAQUETES: Paquete[] = [
  {
    id: 'p1',
    residente: 'Ana Torres',
    unidad: 'C-305',
    mensajeria: 'Amazon',
    folio: 'MX998211',
    notas: 'Caja mediana, no requiere firma',
    estado: 'pendiente',
    recibidoEn: hace(0, 2),
    entregadoEn: null,
  },
  {
    id: 'p2',
    residente: 'Ana Torres',
    unidad: 'C-305',
    mensajeria: 'Mercado Libre',
    folio: null,
    notas: null,
    estado: 'entregado',
    recibidoEn: hace(1, 5),
    entregadoEn: hace(1, 1),
  },
  {
    id: 'p3',
    residente: 'María Pérez',
    unidad: 'A-101',
    mensajeria: 'DHL',
    folio: 'DHL-45120097',
    notas: 'Sobre, documentos',
    estado: 'pendiente',
    recibidoEn: hace(0, 6),
    entregadoEn: null,
  },
  {
    id: 'p4',
    residente: 'Juan Gómez',
    unidad: 'B-204',
    mensajeria: 'FedEx',
    folio: 'FX7781234522',
    notas: 'Caja grande, requiere firma',
    estado: 'pendiente',
    recibidoEn: hace(1, 3),
    entregadoEn: null,
  },
  {
    id: 'p5',
    residente: 'Juan Gómez',
    unidad: 'B-204',
    mensajeria: 'Amazon',
    folio: 'MX771002',
    notas: null,
    estado: 'entregado',
    recibidoEn: hace(3, 4),
    entregadoEn: hace(2, 20),
  },
  {
    id: 'p6',
    residente: 'María Pérez',
    unidad: 'A-101',
    mensajeria: 'Estafeta',
    folio: null,
    notas: null,
    estado: 'entregado',
    recibidoEn: hace(4),
    entregadoEn: hace(3, 18),
  },
]

const MOCK_VISITAS: Visita[] = [
  {
    id: 'v1',
    nombre: 'Carlos Hernández',
    unidadDestino: 'C-305',
    residenteDestino: 'Ana Torres',
    motivo: 'personal',
    identificacion: 'INE 5521',
    fotoVisitante: null,
    fotoId: null,
    estado: 'esperada',
    creadaEn: hace(0, 4),
    entradaEn: null,
    salidaEn: null,
    preautorizada: true,
  },
  {
    id: 'v2',
    nombre: 'Plomería del Valle (Luis R.)',
    unidadDestino: 'C-305',
    residenteDestino: 'Ana Torres',
    motivo: 'servicio',
    identificacion: null,
    fotoVisitante: null,
    fotoId: null,
    estado: 'finalizada',
    creadaEn: hace(2, 8),
    entradaEn: hace(2, 7),
    salidaEn: hace(2, 5),
    preautorizada: false,
  },
  {
    id: 'v3',
    nombre: 'Sofía Ramírez',
    unidadDestino: 'A-101',
    residenteDestino: 'María Pérez',
    motivo: 'personal',
    identificacion: 'Licencia 88213',
    fotoVisitante: null,
    fotoId: null,
    estado: 'en_condominio',
    creadaEn: hace(0, 1),
    entradaEn: hace(0, 1),
    salidaEn: null,
    preautorizada: false,
  },
  {
    id: 'v4',
    nombre: 'Repartidor Rappi',
    unidadDestino: 'B-204',
    residenteDestino: 'Juan Gómez',
    motivo: 'delivery',
    identificacion: null,
    fotoVisitante: null,
    fotoId: null,
    estado: 'finalizada',
    creadaEn: hace(1, 3),
    entradaEn: hace(1, 3),
    salidaEn: hace(1, 2),
    preautorizada: false,
  },
]

export async function fetchPaquetes(): Promise<Paquete[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return MOCK_PAQUETES
}

export async function fetchVisitas(): Promise<Visita[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return MOCK_VISITAS
}
