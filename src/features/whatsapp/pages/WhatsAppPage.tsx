import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { WhatsAppButton } from '../components/WhatsAppButton'
import { MENSAJE_POR_DEFECTO, numeroAdministracionVisible } from '../lib/wa-link'

export function WhatsAppPage() {
  const [mensaje, setMensaje] = useState(MENSAJE_POR_DEFECTO)

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">WhatsApp</h1>
        <p className="text-muted-foreground text-sm">
          Línea directa con administración para temas urgentes que necesitan atención
          humana.
        </p>
      </div>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Contactar a administración</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-muted-foreground text-sm">
            Úsalo para emergencias o situaciones que necesitan respuesta inmediata de una
            persona — por ejemplo, una fuga activa o un problema de seguridad ahora mismo.
            Para reportar fallas o quejas con seguimiento usa <strong>Tickets</strong>;
            para comunicados generales del condominio revisa <strong>Avisos</strong>.
          </p>

          <div className="flex flex-col gap-2">
            <Label htmlFor="mensaje">Mensaje (opcional)</Label>
            <Textarea
              id="mensaje"
              rows={3}
              value={mensaje}
              onChange={(evento) => setMensaje(evento.target.value)}
            />
            <p className="text-muted-foreground text-xs">
              Se abrirá WhatsApp con este mensaje ya escrito — puedes editarlo ahí mismo
              antes de enviarlo.
            </p>
          </div>

          <WhatsAppButton mensaje={mensaje} className="w-fit" />

          <p className="text-muted-foreground text-xs">
            También puedes escribirnos directamente al {numeroAdministracionVisible()}.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
