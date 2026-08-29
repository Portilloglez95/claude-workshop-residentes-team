import { useQuery } from '@tanstack/react-query'
import { fetchCuentasMorosas } from '../api/morosidad.api'
import { sortCuentas } from '../lib/sort-cuentas'

export function useCuentasMorosas() {
  return useQuery({
    queryKey: ['morosidad'],
    queryFn: fetchCuentasMorosas,
    select: sortCuentas,
  })
}
