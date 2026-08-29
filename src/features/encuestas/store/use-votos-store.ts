import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type VotosStore = {
  /** `encuestaId` -> `opcionId` votada durante esta sesión (o una anterior, vía localStorage). */
  votos: Record<string, string>
  votar: (encuestaId: string, opcionId: string) => void
}

/**
 * Voto emitido desde el cliente. Mientras no exista backend, el voto se
 * guarda aquí para que la UI pueda mostrar resultados y recordar qué eligió
 * el residente. Se permite sobrescribirlo: la encuesta sigue abierta y
 * cambiar de opinión antes del cierre es válido — la card solo lo expone
 * detrás de un "Cambiar voto" explícito.
 *
 * Cuando haya API, esto se reemplaza por una mutación de TanStack Query
 * contra `apiClient`; el voto es un dato de servidor, no una preferencia
 * local, y debe ser auditable desde administración.
 */
export const useVotosStore = create<VotosStore>()(
  persist(
    (set) => ({
      votos: {},
      votar: (encuestaId, opcionId) =>
        set((state) => ({ votos: { ...state.votos, [encuestaId]: opcionId } })),
    }),
    { name: 'condoo.encuestas.votos' },
  ),
)
