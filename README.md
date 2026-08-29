# Condoo — Administración de condominios

Panel de administración de condominios. Frontend base para que el equipo
trabaje en paralelo en distintas features sin pisarse.

## Stack

- [React 19](https://react.dev) + [Vite](https://vite.dev) + TypeScript
- [React Router](https://reactrouter.com) para el ruteo
- [TanStack Query](https://tanstack.com/query) para estado de servidor (fetch/caché)
- [Zustand](https://zustand-demo.pmnd.rs) para estado de cliente compartido
- [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) para estilos/componentes
- [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) para formularios
- [oxlint](https://oxc.rs) para linting, [Prettier](https://prettier.io) para formato
- [Husky](https://typicode.github.io/husky) + [lint-staged](https://github.com/okonet/lint-staged) para checks en pre-commit

## Requisitos

- Node.js (versión pineada en [`.tool-versions`](.tool-versions), gestionable con [asdf](https://asdf-vm.com))
- [pnpm](https://pnpm.io) (versión pineada en `package.json` → `packageManager`)

```bash
asdf install   # instala la versión de Node del .tool-versions
corepack enable # o: npm install -g pnpm
```

## Empezar

```bash
pnpm install
cp .env.example .env.local   # y ajusta VITE_API_URL cuando haya backend
pnpm dev
```

## Scripts

| Script              | Qué hace                                |
| ------------------- | --------------------------------------- |
| `pnpm dev`          | Servidor de desarrollo                  |
| `pnpm build`        | Typecheck + build de producción         |
| `pnpm preview`      | Sirve el build de producción localmente |
| `pnpm lint`         | Corre oxlint                            |
| `pnpm typecheck`    | Solo typecheck (sin build)              |
| `pnpm format`       | Formatea todo el repo con Prettier      |
| `pnpm format:check` | Verifica formato sin escribir           |

Antes de cada commit, Husky corre `lint-staged` automáticamente (lint +
formato solo sobre los archivos modificados).

## Estructura del proyecto

El código está organizado **por feature** (dominio de negocio), no por tipo
de archivo. El objetivo es que cada persona/equipo pueda trabajar dentro de
su carpeta de feature con la menor cantidad de conflictos de merge posible.

```
src/
  app/                 # bootstrap de la app: providers globales y router
    App.tsx
    providers.tsx
    router.tsx

  pages/               # páginas que no pertenecen a ninguna feature (Dashboard, 404)

  features/            # una carpeta por dominio de negocio
    residentes/         # ejemplo de feature completa, usa esta como referencia
      api/               # llamadas a la API de la feature
      components/        # componentes propios de la feature
      hooks/              # hooks propios (ej. useResidentes con TanStack Query)
      pages/              # páginas/rutas de la feature
      types/              # tipos TS de la feature
    pagos/
    reservas/
    avisos/
    auth/

  shared/              # todo lo compartido entre features
    components/          # componentes UI reutilizables (layout, theme-toggle...)
    hooks/                # hooks genéricos
    lib/                  # api-client, query-client, utils
    types/                # tipos compartidos

  components/ui/        # componentes de shadcn/ui (generados, no editar a mano salvo necesidad)
```

### Regla simple para evitar conflictos

- Si el cambio es específico de un dominio de negocio (residentes, pagos,
  reservas, avisos...), va dentro de `src/features/<esa-feature>/`.
- Si el cambio afecta a más de una feature (un componente de UI genérico, el
  layout, el cliente HTTP, utilidades), va en `src/shared/`.
- Cambios al router, providers globales o shell de la app van en `src/app/`
  — coordinar con el equipo antes de tocar estos archivos, son el punto de
  mayor probabilidad de conflicto.

### Agregar una feature nueva

1. Crea `src/features/<nombre>/` con subcarpetas `api/`, `components/`,
   `hooks/`, `pages/`, `types/` según lo que necesites (mira `residentes/`
   como ejemplo completo).
2. Agrega la ruta en [`src/app/router.tsx`](src/app/router.tsx).
3. Si la feature aparece en el menú, agrega una línea en
   [`src/shared/components/layout/nav-items.ts`](src/shared/components/layout/nav-items.ts).

### Alias de importación

Usa `@/` en vez de rutas relativas largas — apunta a `src/`:

```ts
import { Button } from '@/components/ui/button'
import { useResidentes } from '@/features/residentes/hooks/use-residentes'
```

### Agregar componentes de shadcn/ui

```bash
pnpm dlx shadcn@latest add <componente>
```

> Nota: en este registro, el componente `form` no trae archivos generables
> (`shadcn add form` no crea nada). Para formularios usa el patrón de
> `src/features/auth/pages/LoginPage.tsx`: `react-hook-form` + `zod` +
> los componentes `Input`/`Label` directamente.

## Flujo de trabajo con git

- Una rama por feature/tarea: `feature/<nombre-corto>` o `fix/<nombre-corto>`.
- PRs pequeños y acotados a una carpeta de `features/` cuando sea posible.
- Antes de abrir el PR: `pnpm typecheck && pnpm lint`.
