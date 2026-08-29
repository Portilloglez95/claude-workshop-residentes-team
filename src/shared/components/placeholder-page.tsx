import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * Punto de partida para una página de feature que todavía no se ha
 * construido. Bórrala y reemplázala por tu propio contenido apenas
 * empieces a trabajar en la feature.
 */
export function PlaceholderPage({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Por construir</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Esta sección todavía no tiene funcionalidad. Es el punto de partida para la
            feature "{title}".
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
