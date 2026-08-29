import { Card, CardContent } from '@/components/ui/card'

/** Placeholder con la silueta de una card real, para que el salto al cargar sea mínimo. */
export function EncuestaSkeleton() {
  return (
    <Card aria-hidden>
      <CardContent className="flex animate-pulse flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="bg-muted h-4 w-2/3 rounded" />
          <div className="bg-muted h-3 w-full rounded" />
          <div className="bg-muted h-3 w-4/5 rounded" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="bg-muted h-10 rounded-lg" />
          <div className="bg-muted h-10 rounded-lg" />
          <div className="bg-muted h-10 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  )
}
