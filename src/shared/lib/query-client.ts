import { QueryClient } from '@tanstack/react-query'

/**
 * Cliente único de TanStack Query para toda la app.
 * Ajusta los defaults aquí (no en cada feature) si el comportamiento
 * de caching/reintentos necesita cambiar globalmente.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
