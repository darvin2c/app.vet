import PageBase from '@/components/page-base'
import { StaffSpecialtyList } from '@/components/staff-specialties/staff-specialty-list'
import { SearchInput } from '@/components/ui/search-input'

export default function SpecialtiesPage() {
  return (
    <PageBase
      title="Especialidades"
      subtitle="Gestiona y configura las especialidades médicas disponibles en tu clínica"
      search={<SearchInput placeholder="Buscar especialidades..." />}
    >
      <StaffSpecialtyList />
    </PageBase>
  )
}
