import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { EstadoVisita, MotivoVisita, Paquete, Rol, Visita } from '../types'

/**
 * Estado de cliente de Control de Acceso. Mientras no exista backend, aquí
 * vive todo lo que en producción serían mutaciones contra `apiClient`:
 *
 *   - el rol activo (portería / residente) — simulación de UI, sin login;
 *   - los paquetes y visitas creados en esta sesión (o una anterior, vía
 *     localStorage);
 *   - los "overrides" sobre los registros que trae el mock del backend
 *     (marcar entregado, registrar entrada/salida, cancelar), que no se
 *     pueden mutar in-place porque `fetch*` siempre devuelve la lista base.
 *
 * `lib/merge.ts` combina la lista base del mock con este estado para
 * producir lo que ve la UI.
 */

export type NuevoPaqueteInput = {
  residente: string
  unidad: string
  mensajeria: string
  folio: string
  notas: string
}

export type NuevaVisitaInput = {
  nombre: string
  unidadDestino: string
  residenteDestino: string
  motivo: MotivoVisita
  identificacion: string
  fotoVisitante: string | null
  fotoId: string | null
}

/** Cambios aplicados sobre una visita que vino del mock del backend. */
export type VisitaOverride = {
  estado: EstadoVisita
  entradaEn?: string
  salidaEn?: string
}

type ControlAccesoStore = {
  rol: Rol
  /** Paquetes registrados por portería en el cliente. */
  paquetesRegistrados: Paquete[]
  /** `paqueteId` -> ISO de entrega, para paquetes marcados como entregados. */
  entregas: Record<string, string>
  /** `paqueteId` -> `true` cuando el residente ya vio la notificación. */
  notifsLeidas: Record<string, true>
  /** Visitas creadas en el cliente (pre-autorizadas o registradas en portería). */
  visitasCreadas: Visita[]
  /** `visitaId` -> cambios de estado sobre visitas que vinieron del backend. */
  visitaOverrides: Record<string, VisitaOverride>

  setRol: (rol: Rol) => void
  registrarPaquete: (input: NuevoPaqueteInput) => void
  marcarEntregado: (id: string) => void
  marcarNotifsLeidas: (ids: string[]) => void
  crearVisita: (input: NuevaVisitaInput, modo: Rol) => void
  registrarEntrada: (visita: Visita) => void
  registrarSalida: (visita: Visita) => void
  cancelarVisita: (visita: Visita) => void
}

function ahoraIso(): string {
  return new Date().toISOString()
}

/** Aplica un cambio de estado a una visita: si es del backend va a `visitaOverrides`, si es local se muta en `visitasCreadas`. */
function aplicarCambioVisita(
  state: ControlAccesoStore,
  visita: Visita,
  cambio: VisitaOverride,
): Partial<ControlAccesoStore> {
  const esLocal = state.visitasCreadas.some((v) => v.id === visita.id)
  if (esLocal) {
    return {
      visitasCreadas: state.visitasCreadas.map((v) =>
        v.id === visita.id ? { ...v, ...cambio } : v,
      ),
    }
  }
  return {
    visitaOverrides: { ...state.visitaOverrides, [visita.id]: cambio },
  }
}

export const useControlAccesoStore = create<ControlAccesoStore>()(
  persist(
    (set) => ({
      rol: 'porteria',
      paquetesRegistrados: [],
      entregas: {},
      notifsLeidas: {},
      visitasCreadas: [],
      visitaOverrides: {},

      setRol: (rol) => set({ rol }),

      registrarPaquete: (input) =>
        set((state) => ({
          paquetesRegistrados: [
            {
              id: crypto.randomUUID(),
              residente: input.residente,
              unidad: input.unidad,
              mensajeria: input.mensajeria,
              folio: input.folio.trim() || null,
              notas: input.notas.trim() || null,
              estado: 'pendiente',
              recibidoEn: ahoraIso(),
              entregadoEn: null,
            },
            ...state.paquetesRegistrados,
          ],
        })),

      marcarEntregado: (id) =>
        set((state) => {
          const esLocal = state.paquetesRegistrados.some((p) => p.id === id)
          if (esLocal) {
            return {
              paquetesRegistrados: state.paquetesRegistrados.map((p) =>
                p.id === id ? { ...p, estado: 'entregado', entregadoEn: ahoraIso() } : p,
              ),
            }
          }
          return { entregas: { ...state.entregas, [id]: ahoraIso() } }
        }),

      marcarNotifsLeidas: (ids) =>
        set((state) => {
          const leidas = { ...state.notifsLeidas }
          for (const id of ids) leidas[id] = true
          return { notifsLeidas: leidas }
        }),

      crearVisita: (input, modo) =>
        set((state) => {
          const ahora = ahoraIso()
          const preautorizada = modo === 'residente'
          return {
            visitasCreadas: [
              {
                id: crypto.randomUUID(),
                nombre: input.nombre,
                unidadDestino: input.unidadDestino,
                residenteDestino: input.residenteDestino,
                motivo: input.motivo,
                identificacion: input.identificacion.trim() || null,
                fotoVisitante: input.fotoVisitante,
                fotoId: input.fotoId,
                estado: preautorizada ? 'esperada' : 'en_condominio',
                creadaEn: ahora,
                entradaEn: preautorizada ? null : ahora,
                salidaEn: null,
                preautorizada,
              },
              ...state.visitasCreadas,
            ],
          }
        }),

      registrarEntrada: (visita) =>
        set((state) =>
          aplicarCambioVisita(state, visita, {
            estado: 'en_condominio',
            entradaEn: ahoraIso(),
          }),
        ),

      registrarSalida: (visita) =>
        set((state) =>
          aplicarCambioVisita(state, visita, {
            estado: 'finalizada',
            salidaEn: ahoraIso(),
          }),
        ),

      cancelarVisita: (visita) =>
        set((state) => aplicarCambioVisita(state, visita, { estado: 'cancelada' })),
    }),
    { name: 'condoo.control-acceso' },
  ),
)
