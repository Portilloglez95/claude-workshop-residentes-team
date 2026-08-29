import type { Usuario } from '../types'

/**
 * Usuarios de demo. Sin backend de autenticación: el login compara el
 * email + contraseña contra esta lista. Cuando exista API, esto se
 * reemplaza por `apiClient.post('/auth/login', …)`.
 */
export const USUARIOS_DEMO: (Usuario & { password: string })[] = [
  {
    id: 'u1',
    nombre: 'Ana Torres',
    email: 'ana@condoo.mx',
    password: 'demo1234',
    rol: 'residente',
    unidad: 'C-305',
  },
  {
    id: 'u2',
    nombre: 'Juan Gómez',
    email: 'juan@condoo.mx',
    password: 'demo1234',
    rol: 'residente',
    unidad: 'B-204',
  },
  {
    id: 'u3',
    nombre: 'Administración',
    email: 'admin@condoo.mx',
    password: 'demo1234',
    rol: 'administrador',
    unidad: null,
  },
]

export const PASSWORD_DEMO = 'demo1234'
