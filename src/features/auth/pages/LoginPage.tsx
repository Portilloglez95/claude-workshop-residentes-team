import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Buildings } from '@phosphor-icons/react'
import { useForm } from 'react-hook-form'
import { Navigate, useLocation, useNavigate } from 'react-router'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PASSWORD_DEMO, USUARIOS_DEMO } from '../data/usuarios-demo'
import { useAuthStore } from '../store/use-auth-store'

const loginSchema = z.object({
  email: z.email('Ingresa un email válido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
})

type LoginForm = z.infer<typeof loginSchema>

export function LoginPage() {
  const usuario = useAuthStore((s) => s.usuario)
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const location = useLocation()
  const [errorCredenciales, setErrorCredenciales] = useState<string | null>(null)

  const destino = (location.state as { from?: string } | null)?.from ?? '/'

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  if (usuario) return <Navigate to={destino} replace />

  const onSubmit = handleSubmit((data) => {
    if (!login(data.email, data.password)) {
      setErrorCredenciales('Email o contraseña incorrectos.')
      return
    }
    navigate(destino, { replace: true })
  })

  function usarDemo(email: string) {
    setValue('email', email)
    setValue('password', PASSWORD_DEMO)
    setErrorCredenciales(null)
  }

  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Buildings className="size-5" />
            <CardTitle>Condoo</CardTitle>
          </div>
          <CardDescription>Portal del residente</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-destructive text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-destructive text-sm">{errors.password.message}</p>
              )}
            </div>

            {errorCredenciales && (
              <p className="text-destructive text-sm">{errorCredenciales}</p>
            )}

            <Button type="submit" disabled={isSubmitting} className="mt-2">
              Entrar
            </Button>
          </form>

          <div className="mt-6 border-t pt-4">
            <p className="text-muted-foreground mb-2 text-xs font-medium">
              Usuarios de demo · contraseña{' '}
              <span className="font-mono">{PASSWORD_DEMO}</span>
            </p>
            <ul className="flex flex-col gap-1">
              {USUARIOS_DEMO.map((u) => (
                <li key={u.id}>
                  <button
                    type="button"
                    onClick={() => usarDemo(u.email)}
                    className="text-muted-foreground hover:text-foreground text-left text-xs"
                  >
                    <span className="font-mono">{u.email}</span> — {u.nombre}
                    {u.unidad ? ` · ${u.unidad}` : ' · administración'}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
