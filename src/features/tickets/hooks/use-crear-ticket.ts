import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { crearTicket } from '../api/tickets.api'

export function useCrearTicket() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: crearTicket,
    onSuccess: (ticket) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      toast.success('Ticket enviado', {
        description: `Le avisaremos apenas administración responda a "${ticket.titulo}".`,
      })
    },
    onError: () => {
      toast.error('No se pudo enviar el ticket. Intenta de nuevo.')
    },
  })
}
