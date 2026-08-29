import type { AreaComun, BloqueHorario, Reserva } from '../types'

const ESTADOS_QUE_OCUPAN = new Set<Reserva['estado']>(['pendiente', 'confirmada'])

function sumarHoras(hora: string, horas: number): string {
  const [h, m] = hora.split(':').map(Number)
  return `${String(h + horas).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/**
 * Divide el horario del área en bloques de `duracionBloqueHoras` y marca
 * como no disponibles los que ya tienen una reserva pendiente o
 * confirmada de cualquier residente ese mismo día (las canceladas o
 * rechazadas liberan el horario).
 */
export function calcularBloques(
  area: AreaComun,
  reservasDelDia: Reserva[],
): BloqueHorario[] {
  const horasOcupadas = new Set(
    reservasDelDia
      .filter((reserva) => ESTADOS_QUE_OCUPAN.has(reserva.estado))
      .map((reserva) => reserva.horaInicio),
  )

  const bloques: BloqueHorario[] = []
  let horaInicio = area.horarioApertura
  while (horaInicio < area.horarioCierre) {
    const horaFin = sumarHoras(horaInicio, area.duracionBloqueHoras)
    if (horaFin > area.horarioCierre) break
    bloques.push({ horaInicio, horaFin, disponible: !horasOcupadas.has(horaInicio) })
    horaInicio = horaFin
  }
  return bloques
}

/** Convierte un Date (del calendario) a "YYYY-MM-DD" en hora local. */
export function fechaAISO(fecha: Date): string {
  const año = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${año}-${mes}-${dia}`
}
