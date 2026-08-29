import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { agregarRespuesta } from '../api/tickets.api'

export function useAgregarRespuesta(ticketId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (mensaje: string) => agregarRespuesta(ticketId, mensaje),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      toast.success('Respuesta enviada')
    },
    onError: () => {
      toast.error('No se pudo enviar la respuesta. Intenta de nuevo.')
    },
  })
}
