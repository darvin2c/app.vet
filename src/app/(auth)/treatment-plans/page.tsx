'use client'

import { useState } from 'react'
import { TreatmentPlanList } from '@/components/treatment_plans/treatment-plan-list'
import { TreatmentPlanCreate } from '@/components/treatment_plans/treatment-plan-create'
import { SearchInput } from '@/components/ui/search-input'
import PageBase from '@/components/page-base'
import { Filters } from '@/components/ui/filters'
import { ButtonGroup } from '@/components/ui/button-group'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import useTreatmentPlans from '@/hooks/treatment-plans/use-treatment-plans'

export default function TreatmentPlansPage() {
  const [showCreatePlan, setShowCreatePlan] = useState(false)

  // Obtener los planes de tratamiento usando el hook
  const { data: treatmentPlans = [], isLoading, error } = useTreatmentPlans()

  return (
    <>
      <PageBase
        title="Planes de Tratamiento"
        subtitle="Gestiona los planes de tratamiento de tus pacientes"
        actions={<div className="flex items-center gap-2"></div>}
        search={
          <SearchInput
            hasSidebarTrigger
            placeholder="Buscar plan de tratamiento"
            size="lg"
            suffix={
              <ButtonGroup>
                <Filters filters={[]} />
                <Button onClick={() => setShowCreatePlan(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Plan
                </Button>
              </ButtonGroup>
            }
          />
        }
      >
        <TreatmentPlanList
          treatmentPlans={treatmentPlans}
          isLoading={isLoading}
          error={error}
        />
      </PageBase>

      <TreatmentPlanCreate
        open={showCreatePlan}
        onOpenChange={setShowCreatePlan}
        onSuccess={() => setShowCreatePlan(false)}
      />
    </>
  )
}
