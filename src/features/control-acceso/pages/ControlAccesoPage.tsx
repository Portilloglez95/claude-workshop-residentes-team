import { Package, Users } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RESIDENTE_ACTUAL } from '../lib/residente-actual'
import { useControlAccesoStore } from '../store/use-control-acceso-store'
import { PaqueteriaTab } from '../components/PaqueteriaTab'
import { RolToggle } from '../components/RolToggle'
import { VisitasTab } from '../components/VisitasTab'

export function ControlAccesoPage() {
  const rol = useControlAccesoStore((s) => s.rol)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Control de acceso</h1>
          <p className="text-muted-foreground text-sm">
            Paquetería y visitas en portería.{' '}
            {rol === 'porteria'
              ? 'Vista de portería: registras y ves todo el condominio.'
              : `Vista de residente: solo lo de ${RESIDENTE_ACTUAL.nombre} (${RESIDENTE_ACTUAL.unidad}).`}
          </p>
        </div>
        <RolToggle />
      </div>

      <Tabs defaultValue="paqueteria" className="gap-4">
        <TabsList>
          <TabsTrigger value="paqueteria">
            <Package />
            Paquetería
          </TabsTrigger>
          <TabsTrigger value="visitas">
            <Users />
            Visitas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="paqueteria">
          <PaqueteriaTab />
        </TabsContent>
        <TabsContent value="visitas">
          <VisitasTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
