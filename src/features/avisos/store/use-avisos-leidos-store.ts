import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AvisosLeidosStore = {
  /** IDs de avisos marcados como leídos durante esta sesión (o una anterior, vía localStorage). */
  leidos: Record<string, true>
  marcarLeido: (id: string) => void
}

/**
 * Estado de cliente puro: qué avisos abrió este residente. No hay flujo de
 * seguimiento ni backend involucrado (los avisos son solo difusión), así
 * que esto vive en Zustand + localStorage en vez de una mutación de
 * TanStack Query. Si en el futuro se necesita un recibo de lectura real
 * (auditable desde administración), esto se reemplaza por una mutación
 * contra `apiClient`.
 */
export const useAvisosLeidosStore = create<AvisosLeidosStore>()(
  persist(
    (set) => ({
      leidos: {},
      marcarLeido: (id) =>
        set((state) =>
          state.leidos[id] ? state : { leidos: { ...state.leidos, [id]: true } },
        ),
    }),
    { name: 'condoo.avisos.leidos' },
  ),
)
