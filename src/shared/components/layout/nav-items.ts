import {
  Bell,
  CalendarClock,
  LayoutDashboard,
  LifeBuoy,
  MessageCircle,
  ShieldCheck,
  TriangleAlert,
  Users,
  Vote,
  Wallet,
} from 'lucide-react'

/**
 * Navegación principal del panel. Cada feature nueva agrega su propia
 * entrada aquí (una línea) en vez de tocar el layout.
 */
export const navItems = [
  { to: '/', label: 'Panel', icon: LayoutDashboard, end: true },
  { to: '/residentes', label: 'Residentes', icon: Users, end: false },
  { to: '/finanzas', label: 'Finanzas', icon: Wallet, end: false },
  { to: '/reservas', label: 'Reservas', icon: CalendarClock, end: false },
  { to: '/avisos', label: 'Avisos', icon: Bell, end: false },
  { to: '/encuestas', label: 'Encuestas', icon: Vote, end: false },
  { to: '/tickets', label: 'Tickets', icon: LifeBuoy, end: false },
  { to: '/whatsapp', label: 'WhatsApp', icon: MessageCircle, end: false },
  { to: '/control-acceso', label: 'Control de acceso', icon: ShieldCheck, end: false },
] as const
