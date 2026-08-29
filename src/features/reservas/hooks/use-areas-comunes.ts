import { useQuery } from '@tanstack/react-query'
import { fetchAreasComunes } from '../api/reservas.api'

export function useAreasComunes() {
  return useQuery({
    queryKey: ['areas-comunes'],
    queryFn: fetchAreasComunes,
  })
}
