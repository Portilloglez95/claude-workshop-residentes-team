/**
 * Tipos de la sección Control de Acceso (Paquetería + Visitas).
 *
 * Esta sección es **solo para residentes**: cada residente ve únicamente lo
 * de su unidad. La operación de portería (registrar paquetes, marcar
 * entregas, entrada/salida de visitantes) vivirá en un acceso de
 * administrador aparte, que se construye después.
 *
 * Demo sin backend real: los datos "de servidor" viven mockeados en
 * `api/control-acceso.api.ts`; lo que el residente hace desde la app
 * (pre-autorizar / cancelar una visita, marcar notificaciones leídas) vive
 * en el cliente — ver `store/use-control-acceso-store.ts`.
 */

export type EstadoPaquete = 'pendiente' | 'entregado'

export type Paquete = {
  id: string
  /** Nombre del residente al que va dirigido. */
  residente: string
  /** Unidad / departamento destino — la vista del residente filtra por esto. */
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
  /** Nombre del residente que recibe. */
  residenteDestino: string
  motivo: MotivoVisita
  /** Número de identificación (INE, licencia…), si se capturó. */
  identificacion: string | null
  /** Foto del visitante como data URL, o `null`. */
  fotoVisitante: string | null
  /** Foto de la identificación como data URL, o `null`. */
  fotoId: string | null
  estado: EstadoVisita
  /** ISO 8601 — cuándo se creó la pre-autorización. */
  creadaEn: string
  /** ISO 8601 — entrada al condominio (la registra portería), o `null`. */
  entradaEn: string | null
  /** ISO 8601 — salida del condominio (la registra portería), o `null`. */
  salidaEn: string | null
  /** `true` si la pre-autorizó el residente desde la app (aún sin llegar). */
  preautorizada: boolean
}
