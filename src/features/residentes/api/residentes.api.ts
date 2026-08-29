import type { Residente } from '../types'

// TODO: reemplazar por `apiClient.get<Residente[]>('/residentes')` cuando el
// backend esté disponible. Se deja mockeado para que la UI se pueda construir
// en paralelo sin depender de la API.
const MOCK_RESIDENTES: Residente[] = [
  {
    id: '1',
    nombre: 'María Pérez',
    unidad: 'A-101',
    email: 'maria@example.com',
    estado: 'al_dia',
  },
  {
    id: '2',
    nombre: 'Juan Gómez',
    unidad: 'B-204',
    email: 'juan@example.com',
    estado: 'moroso',
  },
  {
    id: '3',
    nombre: 'Ana Torres',
    unidad: 'C-305',
    email: 'ana@example.com',
    estado: 'al_dia',
  },
]

export async function fetchResidentes(): Promise<Residente[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return MOCK_RESIDENTES
}
