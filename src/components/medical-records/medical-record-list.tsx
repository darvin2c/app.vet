'use client'

import { useState, useMemo, useCallback } from 'react'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import { Empty } from '@/components/ui/empty'
import { ItemGroup } from '@/components/ui/item'
import { useMedicalRecordList } from '@/hooks/medical-records/use-medical-record-list'
import { useFilters } from '@/hooks/use-filters'
import { useOrderBy } from '@/hooks/use-order-by'
import type { FilterConfig } from '@/types/filters.types'
import type { OrderByConfig } from '@/types/order-by.types'
import ClinicalRecordItem from './records/clinical-record-item'

export function MedicalRecordList({
  filterConfig,
  orderByConfig,
  petId,
}: {
  filterConfig: FilterConfig[]
  orderByConfig: OrderByConfig
  petId?: string
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const { appliedFilters } = useFilters(filterConfig)
  const orderByHook = useOrderBy(orderByConfig)

  const {
    data: medicalRecords = [],
    isPending,
    error,
  } = useMedicalRecordList({
    petId: petId || '',
    filters: appliedFilters,
    orders: orderByHook.appliedSorts,
  })

  const toggleExpanded = useCallback((recordId: string) => {
    setExpanded((prev) => {
      const newExpanded = new Set(prev)
      if (newExpanded.has(recordId)) {
        newExpanded.delete(recordId)
      } else {
        newExpanded.add(recordId)
      }
      return newExpanded
    })
  }, [])

  const sortedMedicalRecords = useMemo(() => {
    return [...medicalRecords].sort(
      (a, b) =>
        new Date(b.record_date).getTime() - new Date(a.record_date).getTime()
    )
  }, [medicalRecords])

  if (isPending) {
    return <TableSkeleton variant="list" />
  }

  if (error) {
    return (
      <Empty>
        <div className="text-center">
          <p className="text-destructive">
            Error al cargar los registros médicos
          </p>
        </div>
      </Empty>
    )
  }

  if (sortedMedicalRecords.length === 0) {
    return (
      <Empty>
        <div className="text-center">
          <p>No hay registros médicos disponibles</p>
        </div>
      </Empty>
    )
  }

  return (
    <ItemGroup>
      {sortedMedicalRecords.map((record) => (
        <ClinicalRecordItem key={record.id} clinicalRecord={record} />
      ))}
    </ItemGroup>
  )
}
