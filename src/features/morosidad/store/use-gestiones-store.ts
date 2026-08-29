import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TipoGestion } from '../lib/escalamiento'

type GestionRegistrada = {
  tipo: TipoGestion
  /** ISO 8601 */
  fecha: string
}

type GestionesStore = {
  /** `cuentaId` -> última gestión registrada desde el panel en esta sesión (o una anterior, vía localStorage). */
  gestiones: Record<string, GestionRegistrada>
  registrar: (cuentaId: string, tipo: TipoGestion) => void
}

/**
 * Gestiones de cobranza registradas desde el panel mientras no hay backend.
 * Es un stand-in deliberadamente temporal: una gestión de cobranza es un
 * hecho auditable (soporta el aviso formal y un eventual cobro judicial), así
 * que cuando exista API esto se reemplaza por una mutación de TanStack Query
 * contra `apiClient` y el envío real del correo/SMS/WhatsApp queda del lado
 * del servidor, nunca del navegador del administrador.
 */
export const useGestionesStore = create<GestionesStore>()(
  persist(
    (set) => ({
      gestiones: {},
      registrar: (cuentaId, tipo) =>
        set((state) => ({
          gestiones: {
            ...state.gestiones,
            [cuentaId]: { tipo, fecha: new Date().toISOString() },
          },
        })),
    }),
    { name: 'condoo.morosidad.gestiones' },
  ),
)
