import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { MotivoVisita, Visita } from '../types'
import { RESIDENTE_ACTUAL } from '../lib/residente-actual'

/**
 * Estado de cliente de Control de Acceso (vista de residente).
 *
 * Sin backend todavía: aquí vive lo que el residente hace desde la app y
 * que en producción serían mutaciones contra `apiClient`:
 *
 *   - qué notificaciones de paquete ya vio;
 *   - las visitas que pre-autorizó en esta sesión (o una anterior, vía
 *     localStorage);
 *   - qué visitas canceló (incluye las que vinieron del mock del backend,
 *     que no se pueden mutar in-place).
 *
 * `lib/merge.ts` combina la lista base del mock con este estado.
 */

export type NuevaVisitaInput = {
  nombre: string
  motivo: MotivoVisita
  identificacion: string
  fotoVisitante: string | null
  fotoId: string | null
}

type ControlAccesoStore = {
  /** `paqueteId` -> `true` cuando el residente ya vio la notificación. */
  notifsLeidas: Record<string, true>
  /** Visitas pre-autorizadas por el residente desde la app. */
  visitasCreadas: Visita[]
  /** `visitaId` -> `true` para visitas canceladas por el residente. */
  visitasCanceladas: Record<string, true>

  marcarNotifsLeidas: (ids: string[]) => void
  preautorizarVisita: (input: NuevaVisitaInput) => void
  cancelarVisita: (id: string) => void
}

function ahoraIso(): string {
  return new Date().toISOString()
}

export const useControlAccesoStore = create<ControlAccesoStore>()(
  persist(
    (set) => ({
      notifsLeidas: {},
      visitasCreadas: [],
      visitasCanceladas: {},

      marcarNotifsLeidas: (ids) =>
        set((state) => {
          const leidas = { ...state.notifsLeidas }
          for (const id of ids) leidas[id] = true
          return { notifsLeidas: leidas }
        }),

      preautorizarVisita: (input) =>
        set((state) => ({
          visitasCreadas: [
            {
              id: crypto.randomUUID(),
              nombre: input.nombre,
              unidadDestino: RESIDENTE_ACTUAL.unidad,
              residenteDestino: RESIDENTE_ACTUAL.nombre,
              motivo: input.motivo,
              identificacion: input.identificacion.trim() || null,
              fotoVisitante: input.fotoVisitante,
              fotoId: input.fotoId,
              estado: 'esperada',
              creadaEn: ahoraIso(),
              entradaEn: null,
              salidaEn: null,
              preautorizada: true,
            },
            ...state.visitasCreadas,
          ],
        })),

      cancelarVisita: (id) =>
        set((state) => ({
          visitasCanceladas: { ...state.visitasCanceladas, [id]: true },
        })),
    }),
    { name: 'condoo.control-acceso' },
  ),
)
