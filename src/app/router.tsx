import { createBrowserRouter } from 'react-router'
import { AppLayout } from '@/shared/components/layout/AppLayout'
import { RequireAuth } from '@/features/auth/components/RequireAuth'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { AvisosPage } from '@/features/avisos/pages/AvisosPage'
import { ControlAccesoPage } from '@/features/control-acceso/pages/ControlAccesoPage'
import { EncuestasPage } from '@/features/encuestas/pages/EncuestasPage'
import { FinanzasPage } from '@/features/finanzas/pages/FinanzasPage'
import { MorosidadPage } from '@/features/morosidad/pages/MorosidadPage'
import { NuevaReservaPage } from '@/features/reservas/pages/NuevaReservaPage'
import { ReservasPage } from '@/features/reservas/pages/ReservasPage'
import { ResidentesPage } from '@/features/residentes/pages/ResidentesPage'
import { NuevoTicketPage } from '@/features/tickets/pages/NuevoTicketPage'
import { TicketDetallePage } from '@/features/tickets/pages/TicketDetallePage'
import { TicketsPage } from '@/features/tickets/pages/TicketsPage'
import { WhatsAppPage } from '@/features/whatsapp/pages/WhatsAppPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'residentes', element: <ResidentesPage /> },
          { path: 'finanzas', element: <FinanzasPage /> },
          { path: 'reservas', element: <ReservasPage /> },
          { path: 'reservas/:id', element: <NuevaReservaPage /> },
          { path: 'avisos', element: <AvisosPage /> },
          { path: 'encuestas', element: <EncuestasPage /> },
          { path: 'morosidad', element: <MorosidadPage /> },
          { path: 'tickets', element: <TicketsPage /> },
          { path: 'tickets/nuevo', element: <NuevoTicketPage /> },
          { path: 'tickets/:id', element: <TicketDetallePage /> },
          { path: 'whatsapp', element: <WhatsAppPage /> },
          { path: 'control-acceso', element: <ControlAccesoPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
])
