import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { cancelarReserva } from '../api/reservas.api'

export function useCancelarReserva() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: cancelarReserva,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservas'] })
      toast.success('Reserva cancelada')
    },
    onError: () => {
      toast.error('No se pudo cancelar la reserva. Intenta de nuevo.')
    },
  })
}
