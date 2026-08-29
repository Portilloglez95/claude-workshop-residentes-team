import { RESIDENTE_ACTUAL } from '@/shared/lib/residente-actual'
import type { Residente } from '../types'

// TODO: reemplazar por `apiClient.get<Residente[]>('/residentes')` cuando el
// backend esté disponible. Se deja mockeado para que la UI se pueda construir
// en paralelo sin depender de la API.
//
// Condoo administra varios condominios en la misma base de datos, así que
// este mock incluye a propósito residentes de OTRO condominio ("Torres del
// Bosque") junto a los del propio ("Las Palmas") para poder probar que el
// filtro de abajo realmente los excluye.
const MOCK_RESIDENTES: Residente[] = [
  {
    id: '1',
    nombre: 'María Pérez',
    unidad: 'A-101',
    email: 'maria@example.com',
    estado: 'al_dia',
    condominioId: 'las-palmas',
  },
  {
    id: '2',
    nombre: 'Juan Gómez',
    unidad: 'B-204',
    email: 'juan@example.com',
    estado: 'moroso',
    condominioId: 'las-palmas',
  },
  {
    id: '3',
    nombre: 'Ana Torres',
    unidad: 'C-305',
    email: 'ana@example.com',
    estado: 'al_dia',
    condominioId: 'las-palmas',
  },
  {
    id: '4',
    nombre: 'Carlos Ramírez',
    unidad: 'A-102',
    email: 'carlos@example.com',
    estado: 'al_dia',
    condominioId: 'torres-del-bosque',
  },
  {
    id: '5',
    nombre: 'Sofía Herrera',
    unidad: 'B-201',
    email: 'sofia@example.com',
    estado: 'moroso',
    condominioId: 'torres-del-bosque',
  },
]

export async function fetchResidentes(): Promise<Residente[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Esto simula lo que un backend real debe hacer: acotar por
  // condominio en el propio query, usando el tenant del token de
  // sesión — nunca traer todos los residentes y filtrar en el
  // cliente. Filtrar aquí es solo para que el mock se comporte igual
  // que esa API ya acotada mientras no existe.
  return MOCK_RESIDENTES.filter(
    (residente) => residente.condominioId === RESIDENTE_ACTUAL.condominioId,
  )
}
