import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ThemeToggle } from '@/shared/components/theme-toggle'

export function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b px-4">
      <div />
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Avatar className="size-8">
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
