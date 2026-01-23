'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { usePetDetail } from '@/hooks/pets/use-pet-detail'

// Import modular components
import { PetProfileSidebar } from '@/components/pets/pet-profile-sidebar'
import { PetGeneralInfo } from '@/components/pets/pet-general-info'
import { AppointmentList } from '@/components/appointments/appointment-list'
import { AppointmentCreateButton } from '@/components/appointments/appointment-create-button'
import { OrderList } from '@/components/orders/order-list'
import { OrderCreateButton } from '@/components/orders/order-create-button'
import { PendingBillingItems } from '@/components/orders/pending-billing-items'
import { PetMedicalRecords } from '@/components/pets/pet-medical-records'
import { FilterConfig } from '@/components/ui/filters'
import { OrderByConfig } from '@/components/ui/order-by'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/multi-sidebar'
import { Separator } from '@/components/ui/separator'

export default function PetProfilePage() {
  const params = useParams()
  const petId = params.id as string
  const [activeTab, setActiveTab] = useState('general')

  const {
    data: pet,
    isLoading: petLoading,
    error: petError,
  } = usePetDetail(petId)



  const orderFilterConfig: FilterConfig[] = [
    {
      field: 'status',
      label: 'Estado',
      placeholder: 'Selecciona estado',
      operator: 'eq',
      options: [
        { value: 'pending', label: 'Pendiente' },
        { value: 'confirmed', label: 'Confirmada' },
        { value: 'in_progress', label: 'En Proceso' },
        { value: 'completed', label: 'Completada' },
        { value: 'cancelled', label: 'Cancelada' },
      ],
    },
  ]

  const orderOrderByConfig: OrderByConfig = {
    columns: [
      { field: 'order_number', label: 'Número de Orden', sortable: true },
      { field: 'total', label: 'Total', sortable: true },
      { field: 'created_at', label: 'Fecha de Creación', sortable: true },
    ],
  }

  if (petError) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Error al cargar la información de la mascota. Por favor, intenta de
            nuevo.
          </p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider id="pet-profile" className="items-start relative h-[calc(100vh-4rem)]">
      <PetProfileSidebar petId={petId} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <SidebarInset className="overflow-hidden">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="font-semibold">Perfil de Mascota</div>
        </header>
        
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 overflow-auto h-[calc(100vh-8rem)]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full space-y-6">
            {/* General Information */}
            <TabsContent value="general" className="space-y-4 md:space-y-6 m-0">
               {petLoading ? (
                  <div>Cargando información...</div>
               ) : !pet ? (
                  <div>No se encontró la mascota</div>
               ) : (
                  <PetGeneralInfo pet={pet} />
               )}
            </TabsContent>

            {/* Medical Records */}
            <TabsContent
              value="clinical-records"
              className="space-y-4 md:space-y-6 m-0"
            >
              <PetMedicalRecords petId={petId} />
            </TabsContent>

            {/* Appointments */}
            <TabsContent
              value="appointments"
              className="space-y-4 md:space-y-6 m-0"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold">Citas</h2>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Historial de citas de la mascota
                  </p>
                </div>
                <AppointmentCreateButton petId={petId} />
              </div>
              <AppointmentList
                filters={[{ field: 'pet_id', operator: 'eq', value: petId }]}
              />
            </TabsContent>

            {/* Orders */}
            <TabsContent value="orders" className="space-y-4 md:space-y-6 m-0">
              <PendingBillingItems petId={petId} />
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold">Ordenes</h2>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Historial de compras de la mascota
                  </p>
                </div>
                <OrderCreateButton />
              </div>
              <OrderList
                filterConfig={orderFilterConfig}
                orderByConfig={orderOrderByConfig}
                additionalFilters={[
                  { field: 'pet_id', operator: 'eq', value: petId },
                ]}
              />
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

