import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatCurrency } from '../lib/format'
import type { CuentaFinanzas } from '../types'

type Metodo = 'tarjeta' | 'spei'

export function PagarCuotaDialog({ cuenta }: { cuenta: CuentaFinanzas }) {
  const [open, setOpen] = useState(false)
  const [metodo, setMetodo] = useState<Metodo>('tarjeta')

  function handlePagar(event: FormEvent) {
    event.preventDefault()
    toast.success('Pago procesado', {
      description: `Depto. ${cuenta.unidad} · ${formatCurrency(cuenta.porPagar)}`,
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Pagar cuota</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pagar cuota</DialogTitle>
          <DialogDescription>
            Depto. {cuenta.unidad} · cuota de mantenimiento
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted flex items-center justify-between rounded-lg px-4 py-3">
          <span className="text-muted-foreground text-sm">Total a pagar</span>
          <span className="font-heading text-xl font-medium">
            {formatCurrency(cuenta.porPagar)}
          </span>
        </div>

        <form onSubmit={handlePagar} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={metodo === 'tarjeta' ? 'default' : 'outline'}
              onClick={() => setMetodo('tarjeta')}
            >
              Tarjeta
            </Button>
            <Button
              type="button"
              variant={metodo === 'spei' ? 'default' : 'outline'}
              onClick={() => setMetodo('spei')}
            >
              SPEI
            </Button>
          </div>

          {metodo === 'tarjeta' ? (
            <>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="numero-tarjeta">Número de tarjeta</Label>
                <Input id="numero-tarjeta" placeholder="4218 •••• •••• ••••" required />
              </div>
              <div className="flex gap-3">
                <div className="flex flex-1 flex-col gap-1.5">
                  <Label htmlFor="vencimiento">Vencimiento</Label>
                  <Input id="vencimiento" placeholder="MM/AA" required />
                </div>
                <div className="flex w-24 flex-col gap-1.5">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="•••" required />
                </div>
              </div>
            </>
          ) : (
            <p className="text-muted-foreground text-sm">
              Transfiere a la CLABE 002180012345678901 a nombre de Condoo Administración.
              El pago se concilia automáticamente en un plazo de hasta 24 horas.
            </p>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit">Pagar {formatCurrency(cuenta.porPagar)}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
