import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Usuario } from '../types'
import { USUARIOS_DEMO } from '../data/usuarios-demo'

type AuthStore = {
  /** Usuario con sesión iniciada, o `null`. Persistido en localStorage. */
  usuario: Usuario | null
  /** Devuelve `true` si las credenciales coinciden con un usuario de demo. */
  login: (email: string, password: string) => boolean
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      usuario: null,

      login: (email, password) => {
        const match = USUARIOS_DEMO.find(
          (u) =>
            u.email.toLowerCase() === email.trim().toLowerCase() &&
            u.password === password,
        )
        if (!match) return false
        set({
          usuario: {
            id: match.id,
            nombre: match.nombre,
            email: match.email,
            rol: match.rol,
            unidad: match.unidad,
          },
        })
        return true
      },

      logout: () => set({ usuario: null }),
    }),
    { name: 'condoo.auth' },
  ),
)
