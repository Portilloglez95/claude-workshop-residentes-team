import { useQuery } from '@tanstack/react-query'
import { fetchPaquetes } from '../api/control-acceso.api'

/** Paquetes del mock del backend. La vista filtra a la unidad del residente. */
export function usePaquetes() {
  return useQuery({
    queryKey: ['control-acceso', 'paquetes'],
    queryFn: fetchPaquetes,
  })
}
