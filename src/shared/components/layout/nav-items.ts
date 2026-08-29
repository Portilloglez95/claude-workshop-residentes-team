import { Bell, CalendarClock, LayoutDashboard, Users, Wallet } from 'lucide-react'

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
] as const
