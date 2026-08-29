import { QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { queryClient } from '@/shared/lib/query-client'
import { ThemeProvider } from '@/shared/components/theme-provider'

/**
 * Todos los providers globales de la app viven aquí. Si tu feature necesita
 * un provider nuevo (auth context, i18n, etc.), agrégalo en este único
 * lugar en vez de envolver <App /> en main.tsx.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    </ThemeProvider>
  )
}
