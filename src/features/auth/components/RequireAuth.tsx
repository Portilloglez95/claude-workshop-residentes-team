import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuthStore } from '../store/use-auth-store'

/**
 * Portón de las rutas privadas: si no hay sesión, manda a `/login` y
 * recuerda a dónde iba para volver ahí después de entrar.
 */
export function RequireAuth() {
  const usuario = useAuthStore((s) => s.usuario)
  const location = useLocation()

  if (!usuario) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return <Outlet />
}
