import { useQuery } from '@tanstack/react-query'
import { fetchResidentes } from '../api/residentes.api'

export function useResidentes() {
  return useQuery({
    queryKey: ['residentes'],
    queryFn: fetchResidentes,
  })
}
