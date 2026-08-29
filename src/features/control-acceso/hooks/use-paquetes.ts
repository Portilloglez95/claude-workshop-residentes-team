import { useQuery } from '@tanstack/react-query'
import { fetchPaquetes } from '../api/control-acceso.api'

/** Lista base de paquetes (mock del backend). Las mutaciones locales se aplican en la página con `mergePaquetes`. */
export function usePaquetes() {
  return useQuery({
    queryKey: ['control-acceso', 'paquetes'],
    queryFn: fetchPaquetes,
  })
}
