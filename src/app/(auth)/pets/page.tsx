import PageBase from '@/components/page-base'
import { PetList } from '@/components/pets/pet-list'

export default function PetsPage() {
  return (
    <PageBase
      title="Mascotas"
      subtitle="Gestiona las mascotas registradas en el sistema"
    >
      <PetList />
    </PageBase>
  )
}
