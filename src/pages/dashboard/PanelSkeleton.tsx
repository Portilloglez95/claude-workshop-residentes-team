import { Card, CardContent } from '@/components/ui/card'

/** Silueta de la vista real, para que el salto al cargar sea mínimo. */
export function PanelSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-4" aria-hidden>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="flex flex-col gap-5">
            <div className="bg-muted h-3 w-40 rounded" />
            <div className="bg-muted h-12 w-56 rounded" />
            <div className="bg-muted h-1.5 w-full rounded-full" />
            <div className="grid gap-2 sm:grid-cols-3">
              <div className="bg-muted h-14 rounded-lg" />
              <div className="bg-muted h-14 rounded-lg" />
              <div className="bg-muted h-14 rounded-lg" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-3">
            <div className="bg-muted h-4 w-32 rounded" />
            <div className="bg-muted h-10 rounded" />
            <div className="bg-muted h-10 rounded" />
            <div className="bg-muted h-10 rounded" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="flex flex-col gap-2">
              <div className="bg-muted h-3 w-24 rounded" />
              <div className="bg-muted h-7 w-32 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
