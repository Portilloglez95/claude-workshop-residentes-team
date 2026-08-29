import { Outlet } from 'react-router'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

/**
 * Shell de la app: sidebar + header fijos, el contenido de cada ruta
 * se renderiza en <Outlet />. No agregues lógica de negocio aquí;
 * eso va dentro de cada feature.
 */
export function AppLayout() {
  return (
    <div className="flex h-svh w-full">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
