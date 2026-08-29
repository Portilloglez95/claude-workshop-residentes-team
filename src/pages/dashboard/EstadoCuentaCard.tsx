import { ArrowRight, Building2, Clock, Download, Landmark, Repeat } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { PagarCuotaDialog } from '@/features/finanzas/components/PagarCuotaDialog'
import { useCuentaFinanzas } from '@/features/finanzas/hooks/use-finanzas'
import type { MetodoPago, ResumenPanel } from '@/features/finanzas/types'
import { Meter } from '@/shared/components/charts/Meter'
import { COLOR_ICONO_ESTADO } from '@/shared/lib/estado-visual'
import { formatMoneda } from '@/shared/lib/format-moneda'

const ICONO_METODO = {
  tarjeta: Building2,
  spei: Landmark,
  domiciliacion: Repeat,
} as const

/** Cuenta receptora del condominio. Coincide con la del `PagarCuotaDialog`. */
const CLABE_CONDOMINIO = '002180012345678901'

/**
 * La card con la que abre el panel: cuánto debe el residente, cuándo vence,
 * cómo va el año y por dónde pagar.
 *
 * El monto por pagar es la **hero figure** de la vista — la única ≥48px. Todo
 * lo demás baja a tamaño de tile para que la jerarquía diga qué importa.
 */
export function EstadoCuentaCard({ panel }: { panel: ResumenPanel }) {
  const { data: cuenta } = useCuentaFinanzas()

  const alDia = panel.porPagar === 0
  const vencido = panel.diasParaVencer < 0

  return (
    <Card className="lg:col-span-2">
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Por pagar · Depto. {panel.unidad}
            </div>
            {/* Hero: figuras proporcionales, misma sans que el resto. */}
            <div className="font-heading mt-1 text-5xl leading-none font-medium">
              {formatMoneda(panel.porPagar)}
            </div>

            {!alDia && (
              <div className="mt-3 flex items-center gap-1.5">
                <Clock
                  className={cn(
                    'size-3.5',
                    vencido ? COLOR_ICONO_ESTADO.critico : COLOR_ICONO_ESTADO.advertencia,
                  )}
                  aria-hidden
                />
                <span className="text-sm">
                  {vencido
                    ? `Vencido hace ${Math.abs(panel.diasParaVencer)} días`
                    : `Vence en ${panel.diasParaVencer} días`}
                </span>
                <span className="text-muted-foreground text-sm">· {panel.vencePago}</span>
              </div>
            )}
          </div>

          {cuenta && <PagarCuotaDialog cuenta={cuenta} />}
        </div>

        <div className="grid items-end gap-4 sm:grid-cols-2">
          <Meter
            label={`Meses cubiertos en ${panel.anioEnCurso}`}
            valor={panel.mesesPagados}
            maximo={panel.mesesTotales}
            textoValor={`${panel.mesesPagados} de ${panel.mesesTotales}`}
            nivel={panel.mesesPagados === panel.mesesTotales ? 'bueno' : 'advertencia'}
          />
          {/* Cuota e indiviso son datos, no una razón contra un límite: un
              meter al 1.42% no se vería y no diría nada. */}
          <dl className="flex gap-6">
            <div>
              <dt className="text-muted-foreground text-xs">Cuota mensual</dt>
              <dd className="text-sm font-medium">{formatMoneda(panel.cuotaMensual)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs">Indiviso</dt>
              <dd className="text-sm font-medium tabular-nums">{panel.indiviso}%</dd>
            </div>
          </dl>
        </div>

        <Separator />

        {/* Accesos directos para pagar. */}
        <div className="flex flex-col gap-2">
          <div className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Formas de pago
          </div>
          <ul className="grid gap-2 sm:grid-cols-3">
            {panel.metodosPago.map((metodo) => (
              <li key={metodo.id}>
                <AccesoPago metodo={metodo} monto={panel.porPagar} />
              </li>
            ))}
          </ul>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground w-fit gap-1.5 px-2"
            onClick={() =>
              toast.success('Estado de cuenta generado', {
                description: `Depto. ${panel.unidad} · ${panel.anioEnCurso}`,
              })
            }
          >
            <Download className="size-3.5" aria-hidden />
            Descargar estado de cuenta
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function AccesoPago({ metodo, monto }: { metodo: MetodoPago; monto: number }) {
  const Icono = ICONO_METODO[metodo.tipo]

  function handleClick() {
    if (metodo.tipo === 'spei') {
      void navigator.clipboard?.writeText(CLABE_CONDOMINIO)
      toast.success('CLABE copiada', {
        description: `${CLABE_CONDOMINIO} · Condoo Administración`,
      })
      return
    }
    if (metodo.activo) {
      toast.success(`Pago iniciado · ${metodo.etiqueta}`, {
        description: formatMoneda(monto),
      })
      return
    }
    toast.success('Domiciliación activada', {
      description: 'El cargo se aplicará el día 3 de cada mes.',
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="hover:bg-accent focus-visible:ring-ring flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none"
    >
      <Icono className="text-muted-foreground size-4 shrink-0" aria-hidden />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{metodo.etiqueta}</span>
        <span className="text-muted-foreground block truncate text-xs">
          {metodo.detalle}
        </span>
      </span>
      <ArrowRight className="text-muted-foreground size-3.5 shrink-0" aria-hidden />
    </button>
  )
}
