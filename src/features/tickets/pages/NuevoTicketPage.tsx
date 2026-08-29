import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useCrearTicket } from '../hooks/use-crear-ticket'
import { FotoTicketInput } from '../components/FotoTicketInput'
import { CATEGORIA_LABEL, URGENCIA_LABEL } from '../lib/opciones-ticket'
import { CATEGORIAS_TICKET, URGENCIAS_TICKET } from '../types'

const nuevoTicketSchema = z.object({
  titulo: z
    .string()
    .trim()
    .min(5, 'Escribe un título de al menos 5 caracteres')
    .max(80, 'El título es demasiado largo'),
  categoria: z.enum(CATEGORIAS_TICKET, { error: 'Selecciona una categoría' }),
  urgencia: z.enum(URGENCIAS_TICKET, { error: 'Selecciona una urgencia' }),
  descripcion: z
    .string()
    .trim()
    .min(20, 'Describe el problema con más detalle (mínimo 20 caracteres)')
    .max(1000, 'La descripción es demasiado larga'),
})

type NuevoTicketForm = z.infer<typeof nuevoTicketSchema>

export function NuevoTicketPage() {
  const navigate = useNavigate()
  const { mutate, isPending } = useCrearTicket()
  const [fotoUrl, setFotoUrl] = useState<string | undefined>(undefined)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<NuevoTicketForm>({ resolver: zodResolver(nuevoTicketSchema) })

  const onSubmit = handleSubmit((datos) => {
    mutate(
      { ...datos, fotoUrl },
      { onSuccess: (ticket) => navigate(`/tickets/${ticket.id}`) },
    )
  })

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-medium">Nuevo ticket</h1>
        <p className="text-muted-foreground text-sm">
          Reporta una falla o queja. Administración te responderá aquí mismo.
        </p>
      </div>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Detalle del reporte</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-2">
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                placeholder="Ej. Fuga de agua en el pasillo del 3er piso"
                {...register('titulo')}
              />
              {errors.titulo && (
                <p className="text-destructive text-sm">{errors.titulo.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="categoria">Categoría</Label>
                <Controller
                  name="categoria"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="categoria" className="w-full">
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIAS_TICKET.map((categoria) => (
                          <SelectItem key={categoria} value={categoria}>
                            {CATEGORIA_LABEL[categoria]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.categoria && (
                  <p className="text-destructive text-sm">{errors.categoria.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="urgencia">Urgencia</Label>
                <Controller
                  name="urgencia"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="urgencia" className="w-full">
                        <SelectValue placeholder="Selecciona la urgencia" />
                      </SelectTrigger>
                      <SelectContent>
                        {URGENCIAS_TICKET.map((urgencia) => (
                          <SelectItem key={urgencia} value={urgencia}>
                            {URGENCIA_LABEL[urgencia]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.urgencia && (
                  <p className="text-destructive text-sm">{errors.urgencia.message}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                rows={5}
                placeholder="Describe qué pasó, dónde y desde cuándo…"
                {...register('descripcion')}
              />
              {errors.descripcion && (
                <p className="text-destructive text-sm">{errors.descripcion.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Foto (opcional)</Label>
              <FotoTicketInput value={fotoUrl} onChange={setFotoUrl} />
            </div>

            <Button type="submit" disabled={isPending} className="mt-2 w-fit">
              {isPending ? 'Enviando…' : 'Enviar ticket'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
