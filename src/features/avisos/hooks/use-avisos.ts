import { useQuery } from '@tanstack/react-query'
import { fetchAvisos } from '../api/avisos.api'
import { sortAvisos } from '../lib/sort-avisos'

export function useAvisos() {
  return useQuery({
    queryKey: ['avisos'],
    queryFn: fetchAvisos,
    select: sortAvisos,
  })
}
