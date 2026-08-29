/**
 * Tipos de la sección Control de Acceso (Paquetería + Visitas).
 *
 * Demo sin backend real: los datos "de servidor" viven mockeados en
 * `api/control-acceso.api.ts` y todas las mutaciones (registrar paquete,
 * marcar entregado, pre-autorizar visita, entrada/salida…) viven en el
 * cliente — ver `store/use-control-acceso-store.ts`.
 */

/** Vista activa. No hay login real: es un switch de UI. */
export type Rol = 'porteria' | 'residente'

export type EstadoPaquete = 'pendiente' | 'entregado'

export type Paquete = {
  id: string
  /** Nombre del residente tal como lo anota portería. */
  residente: string
  /** Unidad / departamento destino — sirve para filtrar la vista del residente. */
  unidad: string
  /** Mensajería u origen (Amazon, DHL, FedEx…). */
  mensajeria: string
  /** Folio o número de guía, si la mensajería lo trae. */
  folio: string | null
  notas: string | null
  estado: EstadoPaquete
  /** ISO 8601 — cuándo portería recibió el paquete. */
  recibidoEn: string
  /** ISO 8601 — cuándo se entregó al residente, o `null` si sigue pendiente. */
  entregadoEn: string | null
}

export type MotivoVisita = 'personal' | 'servicio' | 'delivery' | 'proveedor' | 'otro'

export type EstadoVisita = 'esperada' | 'en_condominio' | 'finalizada' | 'cancelada'

export type Visita = {
  id: string
  /** Nombre del visitante. */
  nombre: string
  /** Unidad / departamento que recibe la visita. */
  unidadDestino: string
  /** Nombre del residente que recibe (para mostrar en portería). */
  residenteDestino: string
  motivo: MotivoVisita
  /** Número de identificación (INE, licencia…), si se capturó. */
  identificacion: string | null
  /** Foto del visitante como data URL, o `null`. */
  fotoVisitante: string | null
  /** Foto de la identificación como data URL, o `null`. */
  fotoId: string | null
  estado: EstadoVisita
  /** ISO 8601 — cuándo se creó el registro / la pre-autorización. */
  creadaEn: string
  /** ISO 8601 — entrada al condominio, o `null`. */
  entradaEn: string | null
  /** ISO 8601 — salida del condominio, o `null`. */
  salidaEn: string | null
  /** `true` si la pre-autorizó el residente desde la app (aún sin llegar). */
  preautorizada: boolean
}
