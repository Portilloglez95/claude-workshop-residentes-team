import { useQuery } from '@tanstack/react-query'
import { RESIDENTE_ACTUAL } from '@/shared/lib/residente-actual'
import { fetchReservas } from '../api/reservas.api'

/** Todas las reservas (de cualquier residente) — se usa para calcular disponibilidad. */
export function useReservas() {
  return useQuery({
    queryKey: ['reservas'],
    queryFn: fetchReservas,
  })
}

/** Solo las reservas del residente actual — para la pestaña "Mis reservas". */
export function useMisReservas() {
  return useQuery({
    queryKey: ['reservas'],
    queryFn: fetchReservas,
    select: (reservas) =>
      reservas.filter((reserva) => reserva.residente === RESIDENTE_ACTUAL.nombre),
  })
}
