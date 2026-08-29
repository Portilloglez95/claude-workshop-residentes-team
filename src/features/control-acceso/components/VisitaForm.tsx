import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { MotivoVisita } from '../types'
import { MOTIVOS_VISITA } from '../lib/motivo-visita'
import { RESIDENTE_ACTUAL } from '../lib/residente-actual'
import { useControlAccesoStore } from '../store/use-control-acceso-store'
import { FotoInput } from './FotoInput'

const schema = z.object({
  nombre: z.string().min(1, 'Nombre del visitante'),
  identificacion: z.string(),
})

type FormValues = z.infer<typeof schema>

/**
 * Pre-autorización de visita por el residente. Adjunta foto del visitante
 * y/o de su identificación para que portería lo identifique al llegar sin
 * pedirle la ID física.
 */
export function VisitaForm() {
  const preautorizarVisita = useControlAccesoStore((s) => s.preautorizarVisita)

  const [motivo, setMotivo] = useState<MotivoVisita>('personal')
  const [fotoVisitante, setFotoVisitante] = useState<string | null>(null)
  const [fotoId, setFotoId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { nombre: '', identificacion: '' },
  })

  const onSubmit = handleSubmit((data) => {
    preautorizarVisita({
      nombre: data.nombre,
      motivo,
      identificacion: data.identificacion,
      fotoVisitante,
      fotoId,
    })
    toast.success(`Visita de ${data.nombre} pre-autorizada. Portería la verá al llegar.`)
    reset()
    setMotivo('personal')
    setFotoVisitante(null)
    setFotoId(null)
  })

  return (
    <form className="flex flex-col gap-3" onSubmit={onSubmit} noValidate>
      <div className="flex flex-col gap-2">
        <Label htmlFor="vis-nombre">Nombre del visitante</Label>
        <Input
          id="vis-nombre"
          placeholder="Ej. Carlos Hernández"
          {...register('nombre')}
        />
        {errors.nombre && (
          <p className="text-destructive text-xs">{errors.nombre.message}</p>
        )}
      </div>

      <p className="text-muted-foreground text-xs">
        Visita para tu unidad: {RESIDENTE_ACTUAL.nombre} · {RESIDENTE_ACTUAL.unidad}
      </p>

      <div className="flex flex-col gap-2">
        <Label htmlFor="vis-motivo">Motivo</Label>
        <Select value={motivo} onValueChange={(v) => setMotivo(v as MotivoVisita)}>
          <SelectTrigger id="vis-motivo" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MOTIVOS_VISITA.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="vis-identificacion">No. de identificación (opcional)</Label>
        <Input
          id="vis-identificacion"
          placeholder="Ej. INE 1234"
          {...register('identificacion')}
        />
      </div>

      <p className="text-muted-foreground text-xs">
        Agrega una foto del visitante o de su identificación para que portería lo
        reconozca sin pedirle la ID física.
      </p>

      <FotoInput
        id="vis-foto-visitante"
        label="Foto del visitante (opcional)"
        value={fotoVisitante}
        onChange={setFotoVisitante}
      />
      <FotoInput
        id="vis-foto-id"
        label="Foto de identificación (opcional)"
        value={fotoId}
        onChange={setFotoId}
      />

      <Button type="submit" disabled={isSubmitting} className="mt-1 self-start">
        Pre-autorizar visita
      </Button>
    </form>
  )
}
