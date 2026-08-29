import { Link } from 'react-router'
import { Clock, ShieldCheck, Users } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { AreaComun } from '../types'

export function AreaCard({ area }: { area: AreaComun }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2 text-base">
          {area.nombre}
          {area.requiereAprobacion && (
            <Badge variant="secondary" className="shrink-0">
              <ShieldCheck className="size-3" />
              Requiere aprobación
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <p className="text-muted-foreground text-sm">{area.descripcion}</p>
        <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
          <span className="flex items-center gap-1">
            <Users className="size-3.5" />
            Hasta {area.capacidad} personas
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {area.horarioApertura} – {area.horarioCierre}, bloques de{' '}
            {area.duracionBloqueHoras}h
          </span>
          <span>{area.costo === 0 ? 'Sin costo' : `$${area.costo} por reserva`}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild size="sm">
          <Link to={`/reservas/${area.id}`}>Reservar</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
