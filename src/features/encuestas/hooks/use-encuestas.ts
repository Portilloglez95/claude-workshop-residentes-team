import { useQuery } from '@tanstack/react-query'
import { fetchEncuestas } from '../api/encuestas.api'
import { sortEncuestas } from '../lib/sort-encuestas'

export function useEncuestas() {
  return useQuery({
    queryKey: ['encuestas'],
    queryFn: fetchEncuestas,
    select: sortEncuestas,
  })
}
