import { useQuery } from '@tanstack/react-query'
import { fetchVisitas } from '../api/control-acceso.api'

/** Lista base de visitas (mock del backend). Las mutaciones locales se aplican en la página con `mergeVisitas`. */
export function useVisitas() {
  return useQuery({
    queryKey: ['control-acceso', 'visitas'],
    queryFn: fetchVisitas,
  })
}
