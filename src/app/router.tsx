import { createBrowserRouter } from 'react-router'
import { AppLayout } from '@/shared/components/layout/AppLayout'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { AvisosPage } from '@/features/avisos/pages/AvisosPage'
import { FinanzasPage } from '@/features/finanzas/pages/FinanzasPage'
import { ReservasPage } from '@/features/reservas/pages/ReservasPage'
import { ResidentesPage } from '@/features/residentes/pages/ResidentesPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'residentes', element: <ResidentesPage /> },
      { path: 'finanzas', element: <FinanzasPage /> },
      { path: 'reservas', element: <ReservasPage /> },
      { path: 'avisos', element: <AvisosPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
