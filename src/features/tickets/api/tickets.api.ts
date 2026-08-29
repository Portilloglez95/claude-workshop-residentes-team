import type { NuevoTicketInput, Ticket } from '../types'
import { RESIDENTE_ACTUAL } from '../lib/residente-actual'

function hace(dias: number, horas = 0): string {
  const fecha = new Date()
  fecha.setDate(fecha.getDate() - dias)
  fecha.setHours(fecha.getHours() - horas)
  return fecha.toISOString()
}

function nuevoId(prefijo: string): string {
  return `${prefijo}-${Math.random().toString(36).slice(2, 9)}`
}

// TODO: reemplazar por llamadas reales a `apiClient` cuando el backend esté
// disponible (GET/POST /tickets, POST /tickets/:id/respuestas). Mientras
// tanto esto vive en un arreglo mutable en memoria — simula un servidor
// para poder construir la UI completa (crear, listar, responder) sin
// depender de la API. Se reinicia al recargar la página.
let TICKETS_DB: Ticket[] = [
  {
    id: 't1',
    titulo: 'Fuga de agua en pasillo del 3er piso',
    categoria: 'mantenimiento',
    urgencia: 'alta',
    descripcion:
      'Hay una fuga de agua constante en el pasillo frente al apartamento A-305, cerca del ducto de instalaciones. El agua ya está llegando hasta el ascensor y el piso está resbaloso.',
    estado: 'en_proceso',
    fechaCreacion: hace(3),
    respuestas: [
      {
        id: nuevoId('r'),
        autor: 'Administración',
        rol: 'administracion',
        mensaje:
          'Gracias por el reporte. Ya enviamos a mantenimiento a colocar señalización y cerramos la llave de paso general de ese ramal mientras se localiza la fuga.',
        fecha: hace(3, -2),
      },
      {
        id: nuevoId('r'),
        autor: 'Administración',
        rol: 'administracion',
        mensaje:
          'El plomero identificó la fuga en una unión de la tubería principal. El repuesto llega mañana en la mañana y se instala el mismo día. Disculpe las molestias.',
        fecha: hace(1),
      },
    ],
  },
  {
    id: 't2',
    titulo: 'Ruido excesivo después de las 11 p.m. en B-204',
    categoria: 'ruido',
    urgencia: 'media',
    descripcion:
      'Desde hace dos semanas hay música y ruido fuerte proveniente del apartamento B-204 varias noches entre semana, después de las 11 p.m., lo cual excede el horario permitido por el reglamento.',
    estado: 'abierto',
    fechaCreacion: hace(1),
    respuestas: [],
  },
  {
    id: 't3',
    titulo: 'Luz quemada en el parqueo nivel -1',
    categoria: 'mantenimiento',
    urgencia: 'baja',
    descripcion:
      'El foco del pasillo de parqueos, cerca del puesto 14 en el nivel -1, está quemado desde hace unos días. Esa zona queda bastante oscura de noche.',
    estado: 'cerrado',
    fechaCreacion: hace(15),
    respuestas: [
      {
        id: nuevoId('r'),
        autor: 'Administración',
        rol: 'administracion',
        mensaje: 'Anotado, lo revisamos esta semana con el equipo de mantenimiento.',
        fecha: hace(13),
      },
      {
        id: nuevoId('r'),
        autor: RESIDENTE_ACTUAL.nombre,
        rol: 'residente',
        mensaje: 'Perfecto, gracias. Sigue sin funcionar al día de hoy por si ayuda.',
        fecha: hace(10),
      },
      {
        id: nuevoId('r'),
        autor: 'Administración',
        rol: 'administracion',
        mensaje:
          'Se reemplazó el foco y el sensor de movimiento. Quedamos atentos si vuelve a fallar.',
        fecha: hace(8),
      },
    ],
  },
  {
    id: 't4',
    titulo: 'Puerta del gimnasio no cierra bien',
    categoria: 'seguridad',
    urgencia: 'alta',
    descripcion:
      'La puerta de acceso al gimnasio no está cerrando ni asegurando correctamente. Cualquier persona puede entrar sin usar la tarjeta de acceso, incluso fuera del horario del área.',
    estado: 'abierto',
    fechaCreacion: hace(0, 5),
    respuestas: [],
  },
]

export async function fetchTickets(): Promise<Ticket[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return TICKETS_DB
}

export async function fetchTicket(id: string): Promise<Ticket | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return TICKETS_DB.find((ticket) => ticket.id === id)
}

export async function crearTicket(input: NuevoTicketInput): Promise<Ticket> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const ticket: Ticket = {
    id: nuevoId('t'),
    ...input,
    estado: 'abierto',
    fechaCreacion: new Date().toISOString(),
    respuestas: [],
  }
  TICKETS_DB = [ticket, ...TICKETS_DB]
  return ticket
}

export async function agregarRespuesta(
  ticketId: string,
  mensaje: string,
): Promise<Ticket> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const ticket = TICKETS_DB.find((t) => t.id === ticketId)
  if (!ticket) throw new Error(`Ticket ${ticketId} no encontrado`)

  // Importante: crear un ticket (y arreglo TICKETS_DB) nuevos en vez de
  // mutar en sitio. TanStack Query decide si hay que volver a renderizar
  // comparando referencias — si reutilizamos el mismo objeto/array,
  // "invalidateQueries" refetchea pero la UI nunca se entera del cambio.
  const ticketActualizado: Ticket = {
    ...ticket,
    respuestas: [
      ...ticket.respuestas,
      {
        id: nuevoId('r'),
        autor: RESIDENTE_ACTUAL.nombre,
        rol: 'residente',
        mensaje,
        fecha: new Date().toISOString(),
      },
    ],
  }
  TICKETS_DB = TICKETS_DB.map((t) => (t.id === ticketId ? ticketActualizado : t))
  return ticketActualizado
}
