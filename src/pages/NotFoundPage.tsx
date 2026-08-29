import { Link } from 'react-router'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
      <p className="text-muted-foreground text-sm">404</p>
      <h1 className="text-2xl font-semibold">Página no encontrada</h1>
      <Button asChild className="mt-2">
        <Link to="/">Volver al panel</Link>
      </Button>
    </div>
  )
}
