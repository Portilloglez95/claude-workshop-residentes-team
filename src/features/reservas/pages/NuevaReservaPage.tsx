import { useState } from 'react'
import { es } from 'date-fns/locale'
import { ArrowLeft } from '@phosphor-icons/react'
import { Link, useNavigate, useParams } from 'react-router'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAreasComunes } from '../hooks/use-areas-comunes'
import { useCrearReserva } from '../hooks/use-crear-reserva'
import { useReservas } from '../hooks/use-reservas'
import { calcularBloques, fechaAISO } from '../lib/disponibilidad'
import { SelectorHorario } from '../components/SelectorHorario'
import type { BloqueHorario } from '../types'

const HOY = new Date()
const LIMITE = new Date()
LIMITE.setDate(LIMITE.getDate() + 60)

export function NuevaReservaPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: areas, isLoading } = useAreasComunes()
  const { data: reservas } = useReservas()
  const { mutate: crear, isPending } = useCrearReserva()

  const [fecha, setFecha] = useState<Date | undefined>(undefined)
  const [bloque, setBloque] = useState<BloqueHorario | null>(null)
  const [notas, setNotas] = useState('')

  const area = areas?.find((a) => a.id === id)

  const reservasDelDia =
    fecha && reservas
      ? reservas.filter((r) => r.areaId === id && r.fecha === fechaAISO(fecha))
      : []
  const bloques = area && fecha ? calcularBloques(area, reservasDelDia) : []

  function elegirFecha(nuevaFecha: Date | undefined) {
    setFecha(nuevaFecha)
    setBloque(null)
  }

  function confirmar() {
    if (!area || !fecha || !bloque) return
    crear(
      {
        areaId: area.id,
        fecha: fechaAISO(fecha),
        horaInicio: bloque.horaInicio,
        horaFin: bloque.horaFin,
        notas: notas.trim() || undefined,
      },
      { onSuccess: () => navigate('/reservas') },
    )
  }

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <Button asChild variant="ghost" size="sm" className="w-fit">
        <Link to="/reservas">
          <ArrowLeft className="size-4" />
          Volver a reservas
        </Link>
      </Button>

      {isLoading && <p className="text-muted-foreground text-sm">Cargando…</p>}
      {!isLoading && !area && (
        <p className="text-muted-foreground text-sm">No encontramos esa área común.</p>
      )}

      {area && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>{area.nombre}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              <p className="text-muted-foreground text-sm">{area.descripcion}</p>
              <p className="text-muted-foreground text-xs">
                Hasta {area.capacidad} personas · {area.horarioApertura} –{' '}
                {area.horarioCierre} · bloques de {area.duracionBloqueHoras}h ·{' '}
                {area.costo === 0 ? 'sin costo' : `$${area.costo} por reserva`}
                {area.requiereAprobacion && ' · requiere aprobación de administración'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">1. Elige una fecha</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={fecha}
                onSelect={elegirFecha}
                disabled={{ before: HOY, after: LIMITE }}
                locale={es}
                className="w-fit rounded-md border p-0"
              />
            </CardContent>
          </Card>

          {fecha && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">2. Elige un horario</CardTitle>
              </CardHeader>
              <CardContent>
                <SelectorHorario
                  bloques={bloques}
                  seleccionado={bloque}
                  onSeleccionar={setBloque}
                />
              </CardContent>
            </Card>
          )}

          {bloque && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">3. Confirmar</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="notas">Notas para administración (opcional)</Label>
                  <Textarea
                    id="notas"
                    rows={3}
                    placeholder="Ej. cantidad de invitados, motivo del evento…"
                    value={notas}
                    onChange={(evento) => setNotas(evento.target.value)}
                  />
                </div>
                <Button onClick={confirmar} disabled={isPending} className="w-fit">
                  {isPending ? 'Enviando…' : 'Confirmar reserva'}
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
