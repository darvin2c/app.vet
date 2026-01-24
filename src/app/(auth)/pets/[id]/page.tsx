'use client'

import { useParams } from 'next/navigation'
import { usePetDetail } from '@/hooks/pets/use-pet-detail'
import { PetGeneralInfo } from '@/components/pets/pet-general-info'
import PageBase from '@/components/page-base'

export default function PetProfilePage() {
  const params = useParams()
  const petId = params.id as string

  const {
    data: pet,
    isLoading: petLoading,
    error: petError,
  } = usePetDetail(petId)

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
    <PageBase
      title="Información General"
      subtitle="Detalles principales y configuración de la mascota"
    >
       {petLoading ? (
          <div>Cargando información...</div>
       ) : !pet ? (
          <div>No se encontró la mascota</div>
       ) : (
          <PetGeneralInfo pet={pet} />
       )}
    </PageBase>
  )
}
