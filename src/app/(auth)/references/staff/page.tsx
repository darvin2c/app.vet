'use client'

import { StaffList } from '@/components/staff/staff-list'
import { StaffCreateButton } from '@/components/staff/staff-create-button'
import { SearchInput } from '@/components/ui/search-input'
import PageBase from '@/components/page-base'
import { Filters, useFilters, FilterConfig } from '@/components/ui/filters'
import { ButtonGroup } from '@/components/ui/button-group'
import { useMemo } from 'react'
import { useSpecialtyList } from '@/hooks/specialties/use-specialty-list'
import { Tables } from '@/types/supabase.types'

type Specialty = Tables<'specialties'>

export default function StaffPage() {
  // Obtener especialidades para el filtro
  const { data: specialties = [] } = useSpecialtyList()

  // Configuración de filtros
  const filtersConfig = useMemo(
    () => ({
      filters: [
        {
          key: 'search',
          field: 'search',
          type: 'search' as const,
          label: 'Buscar staff',
          placeholder: 'Buscar por nombre, email...',
          operator: 'ilike' as const,
        },
        {
          key: 'is_active',
          field: 'is_active',
          type: 'boolean' as const,
          label: 'Estado',
          placeholder: 'Selecciona estado',
          operator: 'eq' as const,
        },
        {
          key: 'specialty_id',
          field: 'specialty_id',
          type: 'select' as const,
          label: 'Especialidad',
          placeholder: 'Selecciona especialidad',
          operator: 'eq' as const,
          options: specialties.map((specialty: Specialty) => ({
            value: specialty.id,
            label: specialty.name,
          })),
        },
        {
          key: 'created_range',
          field: 'created_at',
          type: 'dateRange' as const,
          label: 'Fecha de registro',
          placeholder: 'Selecciona rango de fechas',
          operator: 'gte' as const,
        },
      ] as FilterConfig[],
      onFiltersChange: (appliedFilters: any) => {
        // Manejar cambios de filtros si es necesario
        console.log('Filters changed:', appliedFilters)
      },
    }),
    [specialties]
  )

  // Usar el hook useFilters para obtener los filtros aplicados
  const { appliedFilters } = useFilters(filtersConfig.filters)

  return (
    <PageBase
      title="Staff"
      subtitle="Gestiona la información de tu equipo de trabajo"
      search={
        <SearchInput
          hasSidebarTriggerLeft
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
      <StaffList filters={appliedFilters} />
    </PageBase>
  )
}
