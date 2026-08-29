import { useQuery } from '@tanstack/react-query'
import {
  fetchCuentaFinanzas,
  fetchGastosFinanzas,
  fetchMorosidadFinanzas,
  fetchTransparenciaFinanzas,
} from '../api/finanzas.api'

export function useCuentaFinanzas() {
  return useQuery({
    queryKey: ['finanzas', 'cuenta'],
    queryFn: fetchCuentaFinanzas,
  })
}

export function useGastosFinanzas() {
  return useQuery({
    queryKey: ['finanzas', 'gastos'],
    queryFn: fetchGastosFinanzas,
  })
}

export function useTransparenciaFinanzas() {
  return useQuery({
    queryKey: ['finanzas', 'transparencia'],
    queryFn: fetchTransparenciaFinanzas,
  })
}

export function useMorosidadFinanzas() {
  return useQuery({
    queryKey: ['finanzas', 'morosidad'],
    queryFn: fetchMorosidadFinanzas,
  })
}
