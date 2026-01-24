'use client'

import { useParams } from 'next/navigation'
import { PetMedicalRecords } from '@/components/pets/pet-medical-records'
import { MedicalRecordCreateButton } from '@/components/medical-records/medical-record-create-button'
import PageBase from '@/components/page-base'
import { usePetDetail } from '@/hooks/pets/use-pet-detail'

export default function PetMedicalHistoryPage() {
  const params = useParams()
  const petId = params.id as string

  const { data: pet } = usePetDetail(petId)
  const petName = pet?.name || 'Mascota'

  return (
    <PageBase
      title="Registros Médicos"
      subtitle="Historial completo de tratamientos y procedimientos médicos"
      breadcrumbs={[
        { label: 'Mascotas', href: '/pets' },
        { label: petName, href: `/pets/${petId}` },
        { label: 'Registros Médicos' },
      ]}
      actions={<MedicalRecordCreateButton petId={petId} />}
    >
      <PetMedicalRecords petId={petId} />
    </PageBase>
  )
}
