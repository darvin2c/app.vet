'use client'

import { useParams } from 'next/navigation'
import { AppointmentList } from '@/components/appointments/appointment-list'
import { AppointmentCreateButton } from '@/components/appointments/appointment-create-button'
import PageBase from '@/components/page-base'
import { usePetDetail } from '@/hooks/pets/use-pet-detail'

export default function PetAppointmentsPage() {
  const params = useParams()
  const petId = params.id as string

  const { data: pet } = usePetDetail(petId)
  const petName = pet?.name || 'Mascota'

  return (
    <PageBase
      title="Citas"
      subtitle="Historial de citas de la mascota"
      breadcrumbs={[
        { label: 'Mascotas', href: '/pets' },
        { label: petName, href: `/pets/${petId}` },
        { label: 'Citas' },
      ]}
      actions={<AppointmentCreateButton petId={petId} />}
    >
      <AppointmentList
        filters={[{ field: 'pet_id', operator: 'eq', value: petId }]}
      />
    </PageBase>
  )
}
