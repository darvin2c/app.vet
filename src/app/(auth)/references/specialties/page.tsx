import { ReferencePageLayout } from '@/components/references/reference-page-layout'
import { StaffSpecialtyList } from '@/components/staff-specialties/staff-specialty-list'
import { SearchInput } from '@/components/ui/search-input'
import { Stethoscope } from 'lucide-react'

export default function SpecialtiesPage() {
  return (
    <ReferencePageLayout
      title="Especialidades"
      subtitle="Gestiona y configura las especialidades médicas disponibles en tu clínica"
      icon={Stethoscope}
      search={<SearchInput placeholder="Buscar especialidades..." />}
    >
      <StaffSpecialtyList />
    </ReferencePageLayout>
  )
}
