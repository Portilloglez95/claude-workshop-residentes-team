import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { crearReserva } from '../api/reservas.api'

export function useCrearReserva() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: crearReserva,
    onSuccess: (reserva) => {
      queryClient.invalidateQueries({ queryKey: ['reservas'] })
      if (reserva.estado === 'pendiente') {
        toast.success('Reserva enviada', {
          description: 'Queda pendiente de aprobación de administración.',
        })
      } else {
        toast.success('Reserva confirmada')
      }
    },
    onError: () => {
      toast.error('No se pudo crear la reserva. Intenta de nuevo.')
    },
  })
}
