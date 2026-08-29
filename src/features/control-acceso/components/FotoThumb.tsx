import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

/**
 * Miniatura de una foto (visitante o identificación) que se amplía en un
 * diálogo al hacer clic. Las fotos son data URLs guardadas en el cliente.
 */
export function FotoThumb({ src, alt }: { src: string; alt: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="focus-visible:ring-ring size-14 shrink-0 overflow-hidden rounded-md border focus-visible:ring-2 focus-visible:outline-none"
        >
          <img src={src} alt={alt} className="size-full object-cover" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogTitle className="text-sm">{alt}</DialogTitle>
        <img src={src} alt={alt} className="w-full rounded-md" />
      </DialogContent>
    </Dialog>
  )
}
