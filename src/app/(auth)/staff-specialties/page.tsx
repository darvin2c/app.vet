import { PageBase } from '@/components/ui/page-base'
import { StaffSpecialtyList } from '@/components/staff-specialties/staff-specialty-list'
import { StaffSpecialtyCreateButton } from '@/components/staff-specialties/staff-specialty-create-button'

export default function StaffSpecialtiesPage() {
  return (
    <PageBase
      title="Especialidades del Staff"
      subtitle="Gestiona las asignaciones de especialidades del personal"
      actions={<StaffSpecialtyCreateButton />}
    >
      <StaffSpecialtyList />
    </PageBase>
  )
}