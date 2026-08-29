import { useEffect, useRef, useState, type FormEvent } from 'react'
import { SendHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MensajeBubble } from '../components/MensajeBubble'
import { useConversacion } from '../hooks/use-conversacion'
import { useEnviarMensaje } from '../hooks/use-enviar-mensaje'

export function WhatsAppPage() {
  const { mensajes, isLoading, isError } = useConversacion()
  const enviarMensaje = useEnviarMensaje()
  const [texto, setTexto] = useState('')
  const finRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    finRef.current?.scrollIntoView({ block: 'end' })
  }, [mensajes.length])

  function handleSubmit(evento: FormEvent) {
    evento.preventDefault()
    const valor = texto.trim()
    if (!valor) return
    enviarMensaje.mutate(valor)
    setTexto('')
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">WhatsApp</h1>
        <p className="text-muted-foreground text-sm">
          Chat directo con administración, integrado al portal. Por dentro la conversación
          viaja por WhatsApp — no necesitas salir de la app.
        </p>
      </div>

      <div className="border-border bg-card flex max-w-xl flex-col overflow-hidden rounded-xl border">
        <header className="flex items-center gap-3 border-b px-4 py-3">
          <div className="bg-primary text-primary-foreground flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-medium">
            AD
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Administración</span>
            <span className="text-muted-foreground text-xs">
              Horario de atención: lun a vie, 9:00 a 18:00 h
            </span>
          </div>
        </header>

        <div className="flex h-[420px] flex-col gap-3 overflow-y-auto p-4">
          {isLoading && (
            <p className="text-muted-foreground text-sm">Cargando conversación…</p>
          )}
          {isError && (
            <p className="text-destructive text-sm">No se pudo cargar la conversación.</p>
          )}
          {mensajes.map((mensaje) => (
            <MensajeBubble key={mensaje.id} mensaje={mensaje} />
          ))}
          <div ref={finRef} />
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 border-t p-3">
          <Input
            value={texto}
            onChange={(evento) => setTexto(evento.target.value)}
            placeholder="Escribe un mensaje"
            disabled={enviarMensaje.isPending}
            aria-label="Mensaje"
          />
          <Button type="submit" disabled={!texto.trim() || enviarMensaje.isPending}>
            <SendHorizontal className="size-4" />
            Enviar
          </Button>
        </form>
      </div>
    </div>
  )
}
