'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePetDetail } from '@/hooks/pets/use-pet-detail'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'

// Import modular components
import { PetProfileHeader } from '@/components/pets/pet-profile-header'
import { PetProfileSidebar } from '@/components/pets/pet-profile-sidebar'
import { PetGeneralInfo } from '@/components/pets/pet-general-info'
import { PetAppointmentsList } from '@/components/pets/pet-appointments-list'
import { PetTreatmentsList } from '@/components/pets/pet-treatments-list'
import { PetClinicalParameters } from '@/components/pets/pet-clinical-parameters'
import { PetSurgeries } from '@/components/pets/pet-surgeries'
import { PetTrainings } from '@/components/pets/pet-trainings'
import { PetTreatmentItems } from '@/components/pets/pet-treatment-items'
import { PetVaccinations } from '@/components/pets/pet-vaccinations'

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
            Error al cargar la información de la mascota. Por favor, intenta de nuevo.
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-9 text-xs">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="appointments">Citas</TabsTrigger>
              <TabsTrigger value="treatments">Tratamientos</TabsTrigger>
              <TabsTrigger value="clinical">Clínico</TabsTrigger>
              <TabsTrigger value="surgeries">Cirugías</TabsTrigger>
              <TabsTrigger value="trainings">Entrenamientos</TabsTrigger>
              <TabsTrigger value="items">Medicamentos</TabsTrigger>
              <TabsTrigger value="vaccinations">Vacunas</TabsTrigger>
              <TabsTrigger value="hospitalization">Hospitalización</TabsTrigger>
            </TabsList>

            {/* General Information */}
            <TabsContent value="general" className="space-y-6">
              <PetGeneralInfo pet={pet} />
            </TabsContent>

            {/* Appointments */}
            <TabsContent value="appointments" className="space-y-6">
              <PetAppointmentsList appointments={[]} isLoading={false} />
            </TabsContent>

            {/* Treatments */}
            <TabsContent value="treatments" className="space-y-6">
              <PetTreatmentsList petId={petId} />
            </TabsContent>

            {/* Clinical Parameters */}
            <TabsContent value="clinical" className="space-y-6">
              <PetClinicalParameters parameters={[]} isLoading={false} />
            </TabsContent>

            {/* Surgeries */}
            <TabsContent value="surgeries" className="space-y-6">
              <PetSurgeries petId={petId} />
            </TabsContent>

            {/* Trainings */}
            <TabsContent value="trainings" className="space-y-6">
              <PetTrainings petId={petId} />
            </TabsContent>

            {/* Treatment Items */}
            <TabsContent value="items" className="space-y-6">
              <PetTreatmentItems petId={petId} />
            </TabsContent>

            {/* Vaccinations */}
            <TabsContent value="vaccinations" className="space-y-6">
              <PetVaccinations petId={petId} />
            </TabsContent>

            {/* Hospitalization - Keep existing boarding content for now */}
            <TabsContent value="hospitalization" className="space-y-6">
              <div className="text-center py-8 text-muted-foreground">
                <p>Funcionalidad de hospitalización y pensión en desarrollo</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <PetProfileSidebar pet={pet} />
      </div>
    </div>
  )
}
