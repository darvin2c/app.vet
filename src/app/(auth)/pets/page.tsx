import { PageBase } from '@/components/page-base'
import { PetList } from '@/components/pets/pet-list'
import { PetCreateButton } from '@/components/pets/pet-create-button'

export default function PetsPage() {
  return (
    <PageBase
      title="Mascotas"
      description="Gestiona las mascotas registradas en el sistema"
      actions={<PetCreateButton />}
    >
      <PetList />
    </PageBase>
  )
}