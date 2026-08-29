import { useQuery } from '@tanstack/react-query'
import { fetchTicket } from '../api/tickets.api'

export function useTicket(id: string) {
  return useQuery({
    queryKey: ['tickets', id],
    queryFn: () => fetchTicket(id),
  })
}
