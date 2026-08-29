import { useQuery } from '@tanstack/react-query'
import { fetchTickets } from '../api/tickets.api'
import { sortTickets } from '../lib/sort-tickets'

export function useTickets() {
  return useQuery({
    queryKey: ['tickets'],
    queryFn: fetchTickets,
    select: sortTickets,
  })
}
