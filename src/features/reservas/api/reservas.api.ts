import { RESIDENTE_ACTUAL } from '@/shared/lib/residente-actual'
import { fechaAISO } from '../lib/disponibilidad'
import type { AreaComun, NuevaReservaInput, Reserva } from '../types'

function enDias(dias: number): string {
  const fecha = new Date()
  fecha.setDate(fecha.getDate() + dias)
  return fechaAISO(fecha)
}

function nuevoId(prefijo: string): string {
  return `${prefijo}-${Math.random().toString(36).slice(2, 9)}`
}

// Catálogo de áreas comunes. Estático por ahora — cuando exista backend
// esto se vuelve un GET /areas-comunes.
const AREAS_COMUNES: AreaComun[] = [
  {
    id: 'salon-eventos',
    nombre: 'Salón de eventos',
    descripcion:
      'Salón techado con cocina y mobiliario para fiestas y reuniones grandes.',
    capacidad: 80,
    horarioApertura: '08:00',
    horarioCierre: '23:00',
    duracionBloqueHoras: 4,
    costo: 50,
    requiereAprobacion: true,
  },
  {
    id: 'quincho',
    nombre: 'Quincho / zona BBQ',
    descripcion: 'Parrilla y mesas techadas junto al área verde, para grupos pequeños.',
    capacidad: 20,
    horarioApertura: '10:00',
    horarioCierre: '22:00',
    duracionBloqueHoras: 3,
    costo: 15,
    requiereAprobacion: true,
  },
  {
    id: 'cancha',
    nombre: 'Cancha multiusos',
    descripcion: 'Cancha techada para fútbol sala, básquet o vóley.',
    capacidad: 10,
    horarioApertura: '07:00',
    horarioCierre: '21:00',
    duracionBloqueHoras: 1,
    costo: 0,
    requiereAprobacion: false,
  },
  {
    id: 'gimnasio',
    nombre: 'Gimnasio',
    descripcion: 'Sala de pesas y cardio, aforo limitado por franja horaria.',
    capacidad: 15,
    horarioApertura: '06:00',
    horarioCierre: '22:00',
    duracionBloqueHoras: 1,
    costo: 0,
    requiereAprobacion: false,
  },
  {
    id: 'coworking',
    nombre: 'Sala de coworking',
    descripcion: 'Sala silenciosa con wifi y mesas de trabajo para llamadas o estudio.',
    capacidad: 8,
    horarioApertura: '08:00',
    horarioCierre: '20:00',
    duracionBloqueHoras: 2,
    costo: 0,
    requiereAprobacion: false,
  },
]

// TODO: reemplazar por `apiClient` (GET/POST /reservas) cuando el backend
// esté disponible. Vive en un arreglo mutable en memoria mientras tanto —
// cada escritura crea referencias nuevas (nunca muta un objeto/array
// existente), porque TanStack Query decide si re-renderizar comparando
// referencias.
let RESERVAS_DB: Reserva[] = [
  {
    id: 'r1',
    areaId: 'salon-eventos',
    fecha: enDias(6),
    horaInicio: '16:00',
    horaFin: '20:00',
    estado: 'pendiente',
    residente: RESIDENTE_ACTUAL.nombre,
    notas: 'Cumpleaños de mi hija, esperamos unos 40 invitados.',
    fechaCreacion: enDias(-1),
  },
  {
    id: 'r2',
    areaId: 'cancha',
    fecha: enDias(1),
    horaInicio: '18:00',
    horaFin: '19:00',
    estado: 'confirmada',
    residente: RESIDENTE_ACTUAL.nombre,
    fechaCreacion: enDias(-2),
  },
  {
    id: 'r3',
    areaId: 'gimnasio',
    fecha: enDias(-3),
    horaInicio: '07:00',
    horaFin: '08:00',
    estado: 'confirmada',
    residente: RESIDENTE_ACTUAL.nombre,
    fechaCreacion: enDias(-5),
  },
  {
    id: 'r4',
    areaId: 'quincho',
    fecha: enDias(4),
    horaInicio: '12:00',
    horaFin: '15:00',
    estado: 'rechazada',
    residente: RESIDENTE_ACTUAL.nombre,
    notas: 'Reunión familiar el sábado al mediodía.',
    respuestaAdministracion:
      'Ese día el quincho ya está asignado a mantenimiento de la parrilla. Por favor elige otra fecha.',
    fechaCreacion: enDias(-4),
  },
  // Reservas de otros residentes: no aparecen en "Mis reservas", pero sí
  // deben bloquear el horario para todos al calcular disponibilidad.
  {
    id: 'r5',
    areaId: 'salon-eventos',
    fecha: enDias(6),
    horaInicio: '12:00',
    horaFin: '16:00',
    estado: 'confirmada',
    residente: 'Juan Gómez',
    fechaCreacion: enDias(-8),
  },
  {
    id: 'r6',
    areaId: 'cancha',
    fecha: enDias(1),
    horaInicio: '19:00',
    horaFin: '20:00',
    estado: 'confirmada',
    residente: 'Ana Torres',
    fechaCreacion: enDias(-1),
  },
]

export async function fetchAreasComunes(): Promise<AreaComun[]> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return AREAS_COMUNES
}

export async function fetchReservas(): Promise<Reserva[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return RESERVAS_DB
}

export async function crearReserva(input: NuevaReservaInput): Promise<Reserva> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const area = AREAS_COMUNES.find((a) => a.id === input.areaId)
  if (!area) throw new Error(`Área ${input.areaId} no encontrada`)

  const reserva: Reserva = {
    id: nuevoId('r'),
    ...input,
    estado: area.requiereAprobacion ? 'pendiente' : 'confirmada',
    residente: RESIDENTE_ACTUAL.nombre,
    fechaCreacion: new Date().toISOString(),
  }
  RESERVAS_DB = [reserva, ...RESERVAS_DB]
  return reserva
}

export async function cancelarReserva(id: string): Promise<Reserva> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const reserva = RESERVAS_DB.find((r) => r.id === id)
  if (!reserva) throw new Error(`Reserva ${id} no encontrada`)

  const reservaCancelada: Reserva = { ...reserva, estado: 'cancelada' }
  RESERVAS_DB = RESERVAS_DB.map((r) => (r.id === id ? reservaCancelada : r))
  return reservaCancelada
}
