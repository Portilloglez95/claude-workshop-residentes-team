import { useRef } from 'react'
import { ImagePlus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * Selector de foto opcional para el reporte. Sin backend de archivos
 * todavía, así que solo genera un object URL local para previsualizar
 * — se pierde al recargar. Cuando exista un endpoint de subida (o se
 * conecte con el futuro módulo de Documentos), esto sube el archivo real
 * y guarda la URL que devuelva el servidor en vez del object URL.
 */
export function FotoTicketInput({
  value,
  onChange,
}: {
  value: string | undefined
  onChange: (url: string | undefined) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  function alSeleccionar(event: React.ChangeEvent<HTMLInputElement>) {
    const archivo = event.target.files?.[0]
    if (!archivo) return
    if (value) URL.revokeObjectURL(value)
    onChange(URL.createObjectURL(archivo))
  }

  function quitar() {
    if (value) URL.revokeObjectURL(value)
    onChange(undefined)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="flex flex-col gap-2">
      {value ? (
        <div className="relative w-fit">
          <img
            src={value}
            alt="Foto adjunta al ticket"
            className="h-32 w-32 rounded-md object-cover"
          />
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute -top-2 -right-2 size-6"
            onClick={quitar}
            aria-label="Quitar foto"
          >
            <X className="size-3.5" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="w-fit"
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus className="size-4" />
          Agregar foto
        </Button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={alSeleccionar}
      />
    </div>
  )
}
