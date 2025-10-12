'use client'

import { PatientList } from '@/components/patients/patient-list'
import { PatientCreateButton } from '@/components/patients/patient-create-button'
import { SearchInput } from '@/components/ui/search-input'
import PageBase from '@/components/page-base'
import { Filters } from '@/components/ui/filters'
import { ButtonGroup } from '@/components/ui/button-group'

export default function PatientsPage() {
  return (
    <PageBase
      title="Pacientes"
      subtitle="Gestiona la información de tus pacientes"
      actions={<div className="flex items-center gap-2"></div>}
      search={
        <SearchInput
          hasSidebarTrigger
          placeholder="Buscar paciente"
          size="lg"
          suffix={
            <ButtonGroup>
              <Filters filters={[]} />
              <PatientCreateButton />
            </ButtonGroup>
          }
        />
      }
    >
      <PatientList />
    </PageBase>
  )
}
