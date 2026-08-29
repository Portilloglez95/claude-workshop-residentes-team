import * as React from 'react'
import { Separator as SeparatorPrimitive } from 'radix-ui'

import { cn } from '@/lib/utils'

function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        // Nocturne: una regla libre se desvanece en los dos extremos en
        // vez de cortar en seco (`.hr`) — 48px por lado, tomado del mismo
        // color que --border.
        'data-vertical:bg-border shrink-0 data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch',
        'data-horizontal:bg-[linear-gradient(to_right,transparent,var(--border)_48px,var(--border)_calc(100%-48px),transparent)]',
        className,
      )}
      {...props}
    />
  )
}

export { Separator }
