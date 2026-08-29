import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function StatTile({
  label,
  value,
  hint,
  accent = false,
}: {
  label: string
  value: string
  hint?: string
  accent?: boolean
}) {
  return (
    <Card className={cn(accent && 'border-l-primary border-l-2')}>
      <CardContent>
        <div className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          {label}
        </div>
        <div className="font-heading mt-1.5 text-2xl font-medium">{value}</div>
        {hint && <div className="text-muted-foreground mt-1 text-xs">{hint}</div>}
      </CardContent>
    </Card>
  )
}
