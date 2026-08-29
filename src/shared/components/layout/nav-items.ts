import {
  Bell,
  Calendar,
  ChartBar,
  ChatCircle,
  Lifebuoy,
  ShieldCheck,
  SquaresFour,
  Users,
  Wallet,
  Warning,
} from '@phosphor-icons/react'

/**
 * Navegación principal del panel. Cada feature nueva agrega su propia
 * entrada aquí (una línea) en vez de tocar el layout.
 */
export const navItems = [
  { to: '/', label: 'Panel', icon: SquaresFour, end: true },
  { to: '/residentes', label: 'Residentes', icon: Users, end: false },
  { to: '/finanzas', label: 'Finanzas', icon: Wallet, end: false },
  { to: '/reservas', label: 'Reservas', icon: Calendar, end: false },
  { to: '/avisos', label: 'Avisos', icon: Bell, end: false },
  { to: '/encuestas', label: 'Encuestas', icon: ChartBar, end: false },
  { to: '/morosidad', label: 'Morosidad', icon: Warning, end: false },
  { to: '/tickets', label: 'Tickets', icon: Lifebuoy, end: false },
  { to: '/whatsapp', label: 'WhatsApp', icon: ChatCircle, end: false },
  { to: '/control-acceso', label: 'Control de acceso', icon: ShieldCheck, end: false },
] as const
