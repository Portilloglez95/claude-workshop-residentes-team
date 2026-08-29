import type { MensajeChat } from '../types'

// TODO: reemplazar por integración real con WhatsApp Cloud API (envío vía
// POST /messages y recepción vía un webhook propio) cuando exista una
// cuenta de negocio verificada en Meta. Mientras tanto la conversación
// vive en memoria — simula el historial que traería la API, siguiendo el
// mismo patrón mockeado que `tickets.api.ts`.
function hace(dias: number, horas = 0): string {
  const fecha = new Date()
  fecha.setDate(fecha.getDate() - dias)
  fecha.setHours(fecha.getHours() - horas)
  return fecha.toISOString()
}

function nuevoId(): string {
  return `wa-${Math.random().toString(36).slice(2, 9)}`
}

let MENSAJES_DB: MensajeChat[] = [
  {
    id: nuevoId(),
    rol: 'administracion',
    texto:
      '¡Hola! Este es tu chat directo con administración, integrado al portal. Escríbenos cualquier duda o urgencia y te respondemos en horario de atención.',
    fecha: hace(4),
  },
]

export async function fetchMensajes(): Promise<MensajeChat[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return MENSAJES_DB
}

export async function enviarMensaje(texto: string): Promise<MensajeChat> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const mensaje: MensajeChat = {
    id: nuevoId(),
    rol: 'residente',
    texto,
    fecha: new Date().toISOString(),
  }
  // Crear un arreglo nuevo (no mutar en sitio): TanStack Query invalida por
  // queryKey, pero si reutilizamos la misma referencia la UI no se entera.
  MENSAJES_DB = [...MENSAJES_DB, mensaje]
  return mensaje
}
