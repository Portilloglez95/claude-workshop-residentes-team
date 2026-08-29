import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { enviarMensaje } from '../api/whatsapp.api'

export function useEnviarMensaje() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: enviarMensaje,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp', 'mensajes'] })
    },
    onError: () => {
      toast.error('No se pudo enviar el mensaje. Intenta de nuevo.')
    },
  })
}
