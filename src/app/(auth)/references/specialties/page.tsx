import PageBase from '@/components/page-base'
import { SpecialtyList } from '@/components/specialties/specialty-list'
import { SpecialtyCreateButton } from '@/components/specialties/specialty-create-button'
import { SearchInput } from '@/components/ui/search-input'
import { Stethoscope } from 'lucide-react'

export default function SpecialtiesPage() {
  return (
    <PageBase
      title={
        <div className="flex items-center gap-2">
          <Stethoscope className="h-6 w-6" />
          Especialidades
        </div>
      }
      subtitle="Gestionar especialidades médicas del sistema"
      actions={<SpecialtyCreateButton />}
      search={<SearchInput placeholder="Buscar especialidades..." />}
    >
      <SpecialtyList />
    </PageBase>
  )
}
