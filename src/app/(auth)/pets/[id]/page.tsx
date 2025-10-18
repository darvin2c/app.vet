'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePetDetail } from '@/hooks/pets/use-pet-detail'
import { usePetAppointments } from '@/hooks/pets/use-pet-appointments'
import { usePetMedicalRecords } from '@/hooks/pets/use-pet-medical-records'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'

// Import modular components
import { PetProfileHeader } from '@/components/pets/pet-profile-header'
import { PetProfileSidebar } from '@/components/pets/pet-profile-sidebar'
import { PetGeneralInfo } from '@/components/pets/pet-general-info'
import { PetAppointmentsList } from '@/components/pets/pet-appointments-list'
import { PetAllTreatments } from '@/components/pets/pet-all-treatments'
import { HospitalizationList } from '@/components/hospitalizations/hospitalization-list'
import { HospitalizationCreateButton } from '@/components/hospitalizations/hospitalization-create-button'
import { ClinicalNoteList } from '@/components/clinical-notes/clinical-note-list'
import { ClinicalNoteCreateButton } from '@/components/clinical-notes/clinical-note-create-button'
import { ClinicalParameterList } from '@/components/clinical-parameters/clinical-parameter-list'
import { ClinicalParameterCreateButton } from '@/components/clinical-parameters/clinical-parameter-create-button'
import { FilterConfig } from '@/types/filters.types'
import { OrderByConfig } from '@/types/order-by.types'

export default function PetProfilePage() {
  const params = useParams()
  const petId = params.id as string
  const { currentTenant } = useCurrentTenantStore()
  const [activeTab, setActiveTab] = useState('general')

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
  } = usePetMedicalRecords(petId)

  // Configuración de filtros para parámetros clínicos
  const clinicalParameterFilters: FilterConfig[] = [
    {
      key: 'measured_at_range',
      field: 'measured_at',
      type: 'dateRange',
      label: 'Fecha de medición',
      placeholder: 'Selecciona rango de fechas',
      operator: 'gte',
    },
    {
      key: 'schema_version',
      field: 'schema_version',
      type: 'select',
      label: 'Versión',
      placeholder: 'Selecciona versión',
      operator: 'eq',
      options: [
        { label: 'Versión 1', value: '1' },
        { label: 'Versión 2', value: '2' },
      ],
    },
  ]

  const clinicalParameterOrderByConfig: OrderByConfig = {
    columns: [
      { field: 'measured_at', label: 'Fecha de medición' },
      { field: 'schema_version', label: 'Versión' },
      { field: 'created_at', label: 'Fecha de creación' },
    ],
  }

  if (petLoading || !pet) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="h-32 bg-muted animate-pulse rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-96 bg-muted animate-pulse rounded-lg" />
          </div>
          <div className="space-y-6">
            <div className="h-64 bg-muted animate-pulse rounded-lg" />
            <div className="h-48 bg-muted animate-pulse rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (petError) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Error al cargar la información de la mascota. Por favor, intenta de
            nuevo.
          </p>
        </div>
      </div>
    )
  }

  const getAgeString = (birthDate: string | null) => {
    if (!birthDate) return 'Edad no registrada'

    const birth = new Date(birthDate)
    const now = new Date()
    const years = now.getFullYear() - birth.getFullYear()
    const months = now.getMonth() - birth.getMonth()

    if (years > 0) {
      return `${years} año${years > 1 ? 's' : ''}`
    } else if (months > 0) {
      return `${months} mes${months > 1 ? 'es' : ''}`
    } else {
      return 'Menos de 1 mes'
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <PetProfileHeader pet={pet} />

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-6 text-xs">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="clinical-parameters">
                Parámetros Clínicos
              </TabsTrigger>
              <TabsTrigger value="treatments">
                Registros Médicos ({medicalRecords.length})
              </TabsTrigger>
              <TabsTrigger value="appointments">
                Citas ({appointments.length})
              </TabsTrigger>
              <TabsTrigger value="hospitalizations">
                Hospitalizaciones
              </TabsTrigger>
              <TabsTrigger value="clinical-notes">Notas Clínicas</TabsTrigger>
            </TabsList>

            {/* General Information */}
            <TabsContent value="general" className="space-y-6">
              <PetGeneralInfo pet={pet} />
            </TabsContent>

            {/* Appointments */}
            <TabsContent value="appointments" className="space-y-6">
              <PetAppointmentsList
                appointments={appointments}
                isLoading={appointmentsLoading}
                petId={petId}
              />
            </TabsContent>

            {/* All Medical Records - Now the main medical records view */}
            <TabsContent value="treatments" className="space-y-6">
              <PetAllTreatments petId={petId} />
            </TabsContent>

            {/* Clinical Parameters */}
            <TabsContent value="clinical-parameters" className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Parámetros Clínicos</h2>
                  <p className="text-muted-foreground">
                    Mediciones y parámetros vitales de la mascota
                  </p>
                </div>
                <ClinicalParameterCreateButton petId={petId} />
              </div>
              <ClinicalParameterList
                filterConfig={clinicalParameterFilters}
                orderByConfig={clinicalParameterOrderByConfig}
                petId={petId}
              />
            </TabsContent>

            {/* Hospitalizations */}
            <TabsContent value="hospitalizations" className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Hospitalizaciones</h2>
                  <p className="text-muted-foreground">
                    Historial de hospitalizaciones de la mascota
                  </p>
                </div>
                <HospitalizationCreateButton petId={petId} />
              </div>
              <HospitalizationList petId={petId} />
            </TabsContent>

            {/* Clinical Notes */}
            <TabsContent value="clinical-notes" className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Notas Clínicas</h2>
                  <p className="text-muted-foreground">
                    Historial médico y observaciones de la mascota
                  </p>
                </div>
                <ClinicalNoteCreateButton petId={petId} />
              </div>
              <ClinicalNoteList petId={petId} compact />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <PetProfileSidebar 
          pet={pet} 
          appointmentsCount={appointments.length}
          medicalRecordsCount={medicalRecords.length}
        />
      </div>
    </div>
  )
}
