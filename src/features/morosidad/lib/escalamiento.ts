import type { EstadoCobranza } from '../types'

export type TipoGestion = 'recordatorio' | 'aviso_formal' | 'escalamiento_comite'

type Gestion = {
  tipo: TipoGestion
  /** Texto del botón de acción en el listado. */
  accion: string
  /** Confirmación que se muestra al registrar la gestión. */
  confirmacion: string
}

/**
 * Siguiente paso de cobranza según el estado de la cuenta. El escalamiento
 * es progresivo a propósito: primero un recordatorio informal, luego el
 * aviso formal (que es el que deja constancia para un eventual cobro
 * judicial) y solo después la elevación al comité.
 */
const GESTION_POR_ESTADO: Record<EstadoCobranza, Gestion | null> = {
  al_dia: null,
  en_mora: {
    tipo: 'recordatorio',
    accion: 'Enviar recordatorio',
    confirmacion: 'Recordatorio de pago registrado',
  },
  en_gestion: {
    tipo: 'aviso_formal',
    accion: 'Enviar aviso formal',
    confirmacion: 'Aviso formal de cobro registrado',
  },
  proceso_legal: {
    tipo: 'escalamiento_comite',
    accion: 'Escalar al comité',
    confirmacion: 'Caso elevado al comité de cobranza',
  },
}

export function siguienteGestion(estado: EstadoCobranza): Gestion | null {
  return GESTION_POR_ESTADO[estado]
}
