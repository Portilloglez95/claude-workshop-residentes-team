// TODO: configurar VITE_WHATSAPP_ADMIN_NUMBER (ver .env.example) con el
// número real de administración antes de producción. Este es un número
// de ejemplo para que el módulo se pueda probar sin esa variable.
const NUMERO_POR_DEFECTO = '525512345678'

const numeroCrudo = import.meta.env.VITE_WHATSAPP_ADMIN_NUMBER ?? NUMERO_POR_DEFECTO
const numeroLimpio = numeroCrudo.replace(/\D/g, '')

export const MENSAJE_POR_DEFECTO =
  'Hola, necesito ayuda urgente con un tema del condominio.'

/**
 * Arma un link de tipo wa.me (sin cuenta de negocio ni API de por medio)
 * hacia el número de administración, con un mensaje opcional pre-cargado
 * que el residente todavía puede editar dentro de WhatsApp antes de enviar.
 */
export function buildWhatsAppUrl(mensaje?: string): string {
  const base = `https://wa.me/${numeroLimpio}`
  const texto = mensaje?.trim()
  return texto ? `${base}?text=${encodeURIComponent(texto)}` : base
}

/** Número formateado para mostrarlo en pantalla (por si prefieren escribirlo a mano). */
export function numeroAdministracionVisible(): string {
  return `+${numeroLimpio}`
}
