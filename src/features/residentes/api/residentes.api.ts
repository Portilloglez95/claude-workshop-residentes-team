import { RESIDENTE_ACTUAL } from '@/shared/lib/residente-actual'
import type { Residente } from '../types'

// TODO: reemplazar por `apiClient.get<Residente[]>('/residentes')` cuando el
// backend esté disponible. Se deja mockeado para que la UI se pueda construir
// en paralelo sin depender de la API.
//
// Condoo administra varios condominios en la misma base de datos, y dentro
// de cada condominio hay varias unidades con más de un residente (familia,
// roommates). Este mock incluye a propósito personas de OTRA unidad ("B-204",
// "C-305") y de OTRO condominio ("Torres del Bosque") junto a las de la
// propia unidad para poder probar que el filtro de abajo realmente las
// excluye.
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
    id: '1b',
    nombre: 'Pedro Pérez',
    unidad: 'A-101',
    email: 'pedro@example.com',
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

  // Esto simula lo que un backend real debe hacer: acotar por condominio Y
  // por unidad en el propio query (vía el tenant y la unidad del token de
  // sesión) — nunca traer a todo el condominio y filtrar en el cliente. Es
  // la vista de un residente, no la de administración: solo debe ver a
  // quienes viven en su misma unidad.
  return MOCK_RESIDENTES.filter(
    (residente) =>
      residente.condominioId === RESIDENTE_ACTUAL.condominioId &&
      residente.unidad === RESIDENTE_ACTUAL.unidad,
  )
}
