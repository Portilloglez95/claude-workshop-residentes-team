import type { EstadoReserva, Reserva } from '../types'
import { fechaAISO } from './disponibilidad'

const ACTIVA_FUTURA = new Set<EstadoReserva>(['pendiente', 'confirmada'])

function clave(reserva: Reserva): string {
  return `${reserva.fecha}${reserva.horaInicio}`
}

/**
 * "Próximas" son reservas pendientes/confirmadas de hoy en adelante,
 * ordenadas de la más cercana a la más lejana. Todo lo demás (pasadas,
 * canceladas, rechazadas) va a "historial", más reciente primero.
 */
export function agruparReservas(reservas: Reserva[]) {
  const hoy = fechaAISO(new Date())
  const esProxima = (reserva: Reserva) =>
    reserva.fecha >= hoy && ACTIVA_FUTURA.has(reserva.estado)

  const proximas = reservas
    .filter(esProxima)
    .sort((a, b) => clave(a).localeCompare(clave(b)))

  const historial = reservas
    .filter((reserva) => !esProxima(reserva))
    .sort((a, b) => clave(b).localeCompare(clave(a)))

  return { proximas, historial }
}
