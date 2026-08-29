import type { ComponentProps, ReactNode } from 'react'
import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { buildWhatsAppUrl, MENSAJE_POR_DEFECTO } from '../lib/wa-link'

type WhatsAppButtonProps = Omit<ComponentProps<typeof Button>, 'asChild' | 'children'> & {
  /** Mensaje pre-cargado en el chat. El residente puede editarlo antes de enviarlo. */
  mensaje?: string
  children?: ReactNode
}

/**
 * Botón reutilizable: abre WhatsApp (link wa.me, sin API ni cuenta de
 * negocio) en una pestaña nueva con el número de administración. Pensado
 * para reusarse desde otras pantallas cuando tenga sentido ofrecer una
 * salida rápida a un humano (no para difusión masiva — eso es Avisos).
 */
export function WhatsAppButton({
  mensaje = MENSAJE_POR_DEFECTO,
  children = 'Abrir chat de WhatsApp',
  ...buttonProps
}: WhatsAppButtonProps) {
  return (
    <Button asChild {...buttonProps}>
      <a href={buildWhatsAppUrl(mensaje)} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="size-4" />
        {children}
      </a>
    </Button>
  )
}
