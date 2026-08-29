import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useAgregarRespuesta } from '../hooks/use-agregar-respuesta'

const respuestaSchema = z.object({
  mensaje: z.string().trim().min(3, 'Escribe un mensaje antes de enviar'),
})

type RespuestaForm = z.infer<typeof respuestaSchema>

export function NuevaRespuestaForm({ ticketId }: { ticketId: string }) {
  const { mutate, isPending } = useAgregarRespuesta(ticketId)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RespuestaForm>({ resolver: zodResolver(respuestaSchema) })

  const onSubmit = handleSubmit(({ mensaje }) => {
    mutate(mensaje, { onSuccess: () => reset() })
  })

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <Textarea
        placeholder="Escribe una actualización o responde al hilo…"
        rows={3}
        {...register('mensaje')}
      />
      {errors.mensaje && (
        <p className="text-destructive text-sm">{errors.mensaje.message}</p>
      )}
      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? 'Enviando…' : 'Enviar respuesta'}
      </Button>
    </form>
  )
}
