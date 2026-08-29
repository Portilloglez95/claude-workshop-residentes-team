import { Building2, House } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Rol } from '../types'
import { useControlAccesoStore } from '../store/use-control-acceso-store'

const OPCIONES: { rol: Rol; label: string; icon: typeof Building2 }[] = [
  { rol: 'porteria', label: 'Portería', icon: Building2 },
  { rol: 'residente', label: 'Residente', icon: House },
]

/**
 * Switch de vista Portería / Residente. No hay login real: cambia qué datos
 * y qué acciones muestra la sección (portería ve y registra todo; el
 * residente solo ve lo de su unidad).
 */
export function RolToggle() {
  const rol = useControlAccesoStore((s) => s.rol)
  const setRol = useControlAccesoStore((s) => s.setRol)

  return (
    <div
      role="group"
      aria-label="Vista"
      className="bg-muted inline-flex items-center gap-1 rounded-lg p-[3px]"
    >
      {OPCIONES.map(({ rol: valor, label, icon: Icon }) => {
        const activo = rol === valor
        return (
          <button
            key={valor}
            type="button"
            onClick={() => setRol(valor)}
            aria-pressed={activo}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-medium transition-colors',
              'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
              activo
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="size-3.5" />
            {label}
          </button>
        )
      })}
    </div>
  )
}
