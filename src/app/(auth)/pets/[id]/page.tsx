'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { usePetDetail } from '@/hooks/pets/use-pet-detail'
import { usePetAppointments } from '@/hooks/pets/use-pet-appointments'

// Import modular components
import { PetProfileHeader } from '@/components/pets/pet-profile-header'
import { PetProfileSidebar } from '@/components/pets/pet-profile-sidebar'
import { PetProfileMobileSidebar } from '@/components/pets/pet-profile-mobile-sidebar'
import { PetProfileMobileTabs } from '@/components/pets/pet-profile-mobile-tabs'
import { PetGeneralInfo } from '@/components/pets/pet-general-info'
import { AppointmentList } from '@/components/appointments/appointment-list'
import { AppointmentCreateButton } from '@/components/appointments/appointment-create-button'
import { OrderList } from '@/components/orders/order-list'
import { OrderCreateButton } from '@/components/orders/order-create-button'
import { PendingBillingItems } from '@/components/orders/pending-billing-items'
import { PetMedicalRecords } from '@/components/pets/pet-medical-records'
import { FilterConfig } from '@/components/ui/filters'
import { OrderByConfig } from '@/components/ui/order-by'
import { useMedicalRecordList } from '@/hooks/medical-records/use-medical-record-list'

export default function PetProfilePage() {
  const params = useParams()
  const petId = params.id as string
  const [activeTab, setActiveTab] = useState('general')
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const {
    data: pet,
    isLoading: petLoading,
    error: petError,
  } = usePetDetail(petId)

  // Obtener citas de la mascota
  const {
    data: appointments = [],
    isLoading: appointmentsLoading,
    error: appointmentsError,
  } = usePetAppointments(petId)

  // Obtener registros médicos de la mascota
  const {
    data: medicalRecords = [],
    isLoading: medicalRecordsLoading,
    error: medicalRecordsError,
  } = useMedicalRecordList({
    petId,
  })

  // Configuración de filtros para parámetros clínicos
  const clinicalParameterFilters: FilterConfig[] = [
    {
      field: 'measured_at',
      label: 'Fecha de medición',
      placeholder: 'Selecciona rango de fechas',
      operator: 'gte',
    },
    {
      field: 'schema_version',
      label: 'Versión',
      placeholder: 'Selecciona versión',
      operator: 'eq',
      options: [
        { label: 'Versión 1', value: '1' },
        { label: 'Versión 2', value: '2' },
      ],
    },
  ]

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

  // tabs configuration
  const mobileTabs = [
    { value: 'general', label: 'General' },
    {
      value: 'clinical-records',
      label: 'Registros',
      count: medicalRecords.length,
    },
    { value: 'appointments', label: 'Citas', count: appointments.length },
    { value: 'orders', label: 'Ordenes' },
  ]

  if (petLoading || !pet) {
    return (
      <div className="container mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="h-32 bg-muted animate-pulse rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <div className="h-96 bg-muted animate-pulse rounded-lg" />
          </div>
          <div className="space-y-4 md:space-y-6">
            <div className="h-64 bg-muted animate-pulse rounded-lg" />
            <div className="h-48 bg-muted animate-pulse rounded-lg" />
          </div>
        </div>
      </div>
    )
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
    <div className="container mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <PetProfileHeader
        pet={pet}
        onMenuClick={() => setIsMobileSidebarOpen(true)}
      />

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Mobile Tabs - Only visible on mobile */}
          <PetProfileMobileTabs
            tabs={mobileTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Desktop Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4 md:space-y-6"
          >
            {/* General Information */}
            <TabsContent value="general" className="space-y-4 md:space-y-6">
              <PetGeneralInfo pet={pet} />
            </TabsContent>

            {/* Appointments */}
            <TabsContent
              value="appointments"
              className="space-y-4 md:space-y-6"
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
            <TabsContent value="orders" className="space-y-4 md:space-y-6">
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

            {/* All Medical Records - Now the main medical records view */}
            <TabsContent
              value="clinical-records"
              className="space-y-4 md:space-y-6"
            >
              <PetMedicalRecords petId={petId} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden lg:block">
          <PetProfileSidebar
            pet={pet}
            appointmentsCount={appointments.length}
            medicalRecordsCount={medicalRecords.length}
          />
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      <PetProfileMobileSidebar
        pet={pet}
        appointmentsCount={appointments.length}
        medicalRecordsCount={medicalRecords.length}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
    </div>
  )
}
