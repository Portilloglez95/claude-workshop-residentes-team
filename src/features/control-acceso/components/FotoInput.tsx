import { useRef } from 'react'
import { ImageBroken, Upload } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

/**
 * Input de foto para la pre-autorización de visitas. Lee el archivo como
 * data URL (sin backend: la imagen se guarda en el cliente) y muestra una
 * vista previa. `capture="environment"` abre la cámara trasera en móvil.
 */
export function FotoInput({
  id,
  label,
  value,
  onChange,
}: {
  id: string
  label: string
  value: string | null
  onChange: (dataUrl: string | null) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  function onFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) {
      onChange(null)
      return
    }
    const reader = new FileReader()
    reader.onload = () =>
      onChange(typeof reader.result === 'string' ? reader.result : null)
    reader.readAsDataURL(file)
  }

  function limpiar() {
    onChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-3">
        <div className="bg-muted flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-md border">
          {value ? (
            <img src={value} alt="Vista previa" className="size-full object-cover" />
          ) : (
            <ImageBroken className="text-muted-foreground size-5" />
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <input
            ref={inputRef}
            id={id}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={onFile}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
          >
            <Upload />
            {value ? 'Cambiar foto' : 'Subir foto'}
          </Button>
          {value && (
            <Button type="button" variant="ghost" size="sm" onClick={limpiar}>
              Quitar
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
