import type { MotivoVisita } from '../types'

export const MOTIVOS_VISITA: { value: MotivoVisita; label: string }[] = [
  { value: 'personal', label: 'Visita personal' },
  { value: 'servicio', label: 'Servicio / Mantenimiento' },
  { value: 'delivery', label: 'Repartidor' },
  { value: 'proveedor', label: 'Proveedor' },
  { value: 'otro', label: 'Otro' },
]

const LABELS = Object.fromEntries(
  MOTIVOS_VISITA.map((m) => [m.value, m.label]),
) as Record<MotivoVisita, string>

export function labelMotivo(motivo: MotivoVisita): string {
  return LABELS[motivo]
}
