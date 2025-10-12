'use client'

import { StaffList } from '@/components/staff/staff-list'
import { StaffCreateButton } from '@/components/staff/staff-create-button'
import { SearchInput } from '@/components/ui/search-input'
import PageBase from '@/components/page-base'
import { Filters } from '@/components/ui/filters'
import { ButtonGroup } from '@/components/ui/button-group'
import { useState, useCallback, useMemo } from 'react'
import { StaffFilters } from '@/schemas/staff.schema'
// import { useSpecialties } from '@/hooks/specialties/use-specialties'
import type { FiltersConfig, AppliedFilter } from '@/types/filters.types'

export default function StaffPage() {
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([])
  const [filters, setFilters] = useState<StaffFilters>({})

  // Obtener especialidades para el filtro (temporalmente comentado)
  // const { data: specialties = [] } = useSpecialties({ is_active: true })
  const specialties: any[] = []

  // Función para manejar cambios en los filtros
  const handleFiltersChange = useCallback((appliedFilters: AppliedFilter[]) => {
    const newFilters: StaffFilters = {}

    appliedFilters.forEach((filter) => {
      if (filter.field === 'search') {
        newFilters.search = filter.value
      } else if (filter.field === 'is_active') {
        newFilters.is_active = filter.value === 'true'
      } else if (filter.field === 'specialty_id') {
        newFilters.specialty_id = filter.value
      } else if (filter.field === 'created_at' && filter.operator === 'gte') {
        newFilters.created_from = filter.value
      } else if (filter.field === 'created_at' && filter.operator === 'lte') {
        newFilters.created_to = filter.value
      }
    })

    setFilters(newFilters)
    setAppliedFilters(appliedFilters)
  }, [])

  // Configuración de filtros
  const filtersConfig: FiltersConfig = useMemo(
    () => ({
      filters: [
        {
          key: 'search',
          field: 'search',
          type: 'search',
          label: 'Buscar staff',
          placeholder: 'Buscar por nombre, email...',
          operator: 'ilike',
        },
        {
          key: 'is_active',
          field: 'is_active',
          type: 'boolean',
          label: 'Estado',
          placeholder: 'Selecciona estado',
          operator: 'eq',
        },
        {
          key: 'specialty_id',
          field: 'specialty_id',
          type: 'select',
          label: 'Especialidad',
          placeholder: 'Selecciona especialidad',
          operator: 'eq',
          options: specialties.map((specialty) => ({
            value: specialty.id,
            label: specialty.name,
          })),
        },
        {
          key: 'created_range',
          field: 'created_at',
          type: 'dateRange',
          label: 'Fecha de registro',
          placeholder: 'Selecciona rango de fechas',
          operator: 'gte',
        },
      ],
      onFiltersChange: handleFiltersChange,
    }),
    [specialties, handleFiltersChange]
  )

  return (
    <PageBase
      title="Staff"
      subtitle="Gestiona la información de tu equipo de trabajo"
      actions={<div className="flex items-center gap-2"></div>}
      search={
        <SearchInput
          hasSidebarTrigger
          placeholder="Buscar miembro del staff"
          size="lg"
          suffix={
            <ButtonGroup>
              <Filters {...filtersConfig} />
              <StaffCreateButton />
            </ButtonGroup>
          }
        />
      }
    >
      <StaffList filters={filters} />
    </PageBase>
  )
}
