import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RESIDENTE_ACTUAL } from '../lib/residente-actual'
import { useControlAccesoStore } from '../store/use-control-acceso-store'

const schema = z.object({
  residente: z.string().min(1, 'Indica el residente'),
  unidad: z.string().min(1, 'Indica la unidad / depto'),
  mensajeria: z.string().min(1, 'Indica la mensajería u origen'),
  folio: z.string(),
  notas: z.string(),
})

type FormValues = z.infer<typeof schema>

export function RegistrarPaqueteForm() {
  const registrarPaquete = useControlAccesoStore((s) => s.registrarPaquete)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { residente: '', unidad: '', mensajeria: '', folio: '', notas: '' },
  })

  const onSubmit = handleSubmit((data) => {
    registrarPaquete(data)
    const paraResidenteActual =
      data.unidad.trim().toLowerCase() === RESIDENTE_ACTUAL.unidad.toLowerCase()
    toast.success(
      paraResidenteActual
        ? `Paquete registrado. Se notificó a ${RESIDENTE_ACTUAL.nombre} (${RESIDENTE_ACTUAL.unidad}).`
        : `Paquete registrado. Se notificó a la unidad ${data.unidad.trim()}.`,
    )
    reset()
  })

  return (
    <form className="flex flex-col gap-3" onSubmit={onSubmit} noValidate>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="paq-residente">Residente</Label>
          <Input
            id="paq-residente"
            placeholder="Ej. Ana Torres"
            {...register('residente')}
          />
          {errors.residente && (
            <p className="text-destructive text-xs">{errors.residente.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="paq-unidad">Unidad / Depto</Label>
          <Input id="paq-unidad" placeholder="Ej. C-305" {...register('unidad')} />
          {errors.unidad && (
            <p className="text-destructive text-xs">{errors.unidad.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="paq-mensajeria">Mensajería / Origen</Label>
        <Input
          id="paq-mensajeria"
          placeholder="Ej. Amazon, DHL, FedEx"
          {...register('mensajeria')}
        />
        {errors.mensajeria && (
          <p className="text-destructive text-xs">{errors.mensajeria.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="paq-folio">Folio / Guía (opcional)</Label>
        <Input id="paq-folio" placeholder="Ej. MX123456789" {...register('folio')} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="paq-notas">Notas (opcional)</Label>
        <Input
          id="paq-notas"
          placeholder="Ej. Caja grande, requiere firma"
          {...register('notas')}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-1 self-start">
        Registrar paquete
      </Button>
    </form>
  )
}
