import type { CuentaMorosa, Cuota } from '../types'

function vencimiento(diasDesdeHoy: number): string {
  const fecha = new Date()
  fecha.setDate(fecha.getDate() - diasDesdeHoy)
  fecha.setHours(0, 0, 0, 0)
  return fecha.toISOString()
}

function periodoDe(fechaIso: string): string {
  const fecha = new Date(fechaIso)
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`
}

/** `diasDesdeVencimiento` negativo = cuota que todavía no vence. */
function cuota(
  id: string,
  concepto: string,
  monto: number,
  diasDesdeVencimiento: number,
  abonado = 0,
): Cuota {
  const fechaVencimiento = vencimiento(diasDesdeVencimiento)
  return {
    id,
    periodo: periodoDe(fechaVencimiento),
    concepto,
    monto,
    abonado,
    fechaVencimiento,
  }
}

function hace(dias: number): string {
  const fecha = new Date()
  fecha.setDate(fecha.getDate() - dias)
  return fecha.toISOString()
}

// TODO: reemplazar por `apiClient.get<CuentaMorosa[]>('/morosidad/cuentas')`
// cuando el backend esté disponible. Se deja mockeado para que la UI se pueda
// construir en paralelo sin depender de la API. Los recargos e intereses NO
// vienen del mock a propósito: se calculan en `lib/calcular-mora.ts` para que
// la regla de negocio quede en un solo lugar y sea verificable.
const MOCK_CUENTAS: CuentaMorosa[] = [
  {
    id: 'c1',
    unidad: 'A-101',
    residente: 'María Pérez',
    email: 'maria@example.com',
    telefono: '(555) 201-3344',
    cuotas: [cuota('q1', 'Cuota de mantenimiento', 85, -4)],
    estado: null,
    ultimaGestion: null,
  },
  {
    id: 'c2',
    unidad: 'B-204',
    residente: 'Juan Gómez',
    email: 'juan@example.com',
    telefono: '(555) 202-7788',
    cuotas: [cuota('q2', 'Cuota de mantenimiento', 85, 12)],
    estado: null,
    ultimaGestion: hace(3),
  },
  {
    id: 'c3',
    unidad: 'C-305',
    residente: 'Ana Torres',
    email: 'ana@example.com',
    telefono: '(555) 203-1122',
    cuotas: [
      cuota('q3', 'Cuota de mantenimiento', 85, 40, 40),
      cuota('q4', 'Cuota de mantenimiento', 85, 10),
    ],
    estado: null,
    ultimaGestion: hace(6),
  },
  {
    id: 'c4',
    unidad: 'D-402',
    residente: 'Luis Ramírez',
    email: 'luis@example.com',
    telefono: '(555) 204-9900',
    cuotas: [
      cuota('q5', 'Cuota de mantenimiento', 110, 75),
      cuota('q6', 'Cuota de mantenimiento', 110, 45),
      cuota('q7', 'Cuota de mantenimiento', 110, 15),
    ],
    estado: null,
    ultimaGestion: hace(9),
  },
  {
    id: 'c5',
    unidad: 'A-203',
    residente: 'Carla Méndez',
    email: 'carla@example.com',
    telefono: '(555) 205-4455',
    cuotas: [
      cuota('q8', 'Cuota extraordinaria — fachada', 250, 130),
      cuota('q9', 'Cuota de mantenimiento', 85, 100),
      cuota('q10', 'Cuota de mantenimiento', 85, 70),
      cuota('q11', 'Cuota de mantenimiento', 85, 40),
    ],
    estado: 'proceso_legal',
    ultimaGestion: hace(21),
  },
  {
    id: 'c6',
    unidad: 'B-101',
    residente: 'Diego Salas',
    email: 'diego@example.com',
    telefono: '(555) 206-6677',
    // Escalada por administración antes del umbral automático: incumplió el
    // convenio de pago firmado, así que el backend la manda en gestión aunque
    // el atraso todavía sea de 20 días.
    cuotas: [cuota('q12', 'Cuota de mantenimiento', 85, 20)],
    estado: 'en_gestion',
    ultimaGestion: hace(2),
  },
]

export async function fetchCuentasMorosas(): Promise<CuentaMorosa[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return MOCK_CUENTAS
}
