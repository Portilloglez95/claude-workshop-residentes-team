import { Package, Users } from '@phosphor-icons/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RESIDENTE_ACTUAL } from '../lib/residente-actual'
import { PaqueteriaTab } from '../components/PaqueteriaTab'
import { VisitasTab } from '../components/VisitasTab'

export function ControlAccesoPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-medium">Control de acceso</h1>
        <p className="text-muted-foreground text-sm">
          Tus paquetes y visitas en portería — {RESIDENTE_ACTUAL.nombre},{' '}
          {RESIDENTE_ACTUAL.unidad}. La operación de portería tendrá un acceso de
          administrador aparte.
        </p>
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
