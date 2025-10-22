'use client'

import { useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'
import { Timeline, TimelineItemData } from '@/components/ui/timeline'
import { FileText } from 'lucide-react'
import { useMedicalRecordList } from '@/hooks/medical-records/use-medical-record-list'
import { MedicalRecordActions } from './medical-record-actions'
import { getStaffFullName } from '@/lib/staff-utils'
import { Tables } from '@/types/supabase.types'
import { FilterConfig } from '@/types/filters.types'
import { OrderByConfig } from '@/types/order-by.types'
import { useFilters } from '@/hooks/use-filters'
import { useOrderBy } from '@/hooks/use-order-by'
import { useSearch } from '@/hooks/use-search'
import useRecordType from '@/hooks/medical-records/use-record-type'

type MedicalRecord = Tables<'clinical_records'> & {
  pets: {
    id: string
    name: string
    microchip: string | null
  } | null
  staff: {
    id: string
    first_name: string
    last_name: string | null
  } | null
  appointments: {
    id: string
    scheduled_start: string
    reason: string | null
  } | null
}

interface MedicalRecordListProps {
  filterConfig: FilterConfig[]
  orderByConfig: OrderByConfig
  petId: string
}

export function MedicalRecordList({
  filterConfig,
  orderByConfig,
  petId,
}: MedicalRecordListProps) {
  const { appliedFilters } = useFilters(filterConfig)
  const orderByHook = useOrderBy(orderByConfig)
  const { appliedSearch } = useSearch()
  const { getRecordType } = useRecordType()

  const {
    data: medicalRecords = [],
    isPending,
    error,
  } = useMedicalRecordList({
    petId,
    filters: appliedFilters,
    search: appliedSearch,
    orders: orderByHook.appliedSorts,
  })

  // Transformar los registros médicos a TimelineItemData
  const timelineItems: TimelineItemData[] = useMemo(() => {
    return medicalRecords.map((record) => {
      const recordType = getRecordType(record.record_type)

      // Determinar el variant basado en si tiene diagnóstico (como indicador de completitud)
      let variant: TimelineItemData['variant'] = 'default'
      if (record.diagnosis) {
        variant = 'success' // Registro con diagnóstico = completado
      } else if (record.notes) {
        variant = 'warning' // Registro con notas pero sin diagnóstico = en progreso
      } else {
        variant = 'default' // Registro básico
      }

      // Crear la descripción con tipo de registro y veterinario
      const description = [
        recordType?.label || record.record_type,
        record.staff ? getStaffFullName(record.staff) : 'Sin asignar',
      ].join(' • ')

      // Contenido personalizado con información del registro y acciones
      const content = (
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            {record.diagnosis && (
              <Badge variant="default">Con diagnóstico</Badge>
            )}
            {record.notes && <Badge variant="secondary">Con notas</Badge>}
            {record.reason && (
              <span className="text-xs text-muted-foreground">
                Motivo: {record.reason}
              </span>
            )}
          </div>
          <MedicalRecordActions medicalRecord={record} />
        </div>
      )

      return {
        id: record.id,
        timestamp: record.record_date
          ? new Date(record.record_date)
          : new Date(record.created_at),
        title: record.pets?.name || 'Sin mascota',
        description,
        content,
        icon: recordType?.icon,
        variant,
      }
    })
  }, [medicalRecords, getRecordType])

  if (isPending) {
    return <TableSkeleton />
  }

  if (error) {
    return (
      <div>
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Error al cargar registros médicos</EmptyTitle>
            <EmptyDescription>
              Ocurrió un error al cargar los registros médicos. Por favor,
              intenta nuevamente.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  if (medicalRecords.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <FileText className="h-12 w-12 text-muted-foreground" />
          <EmptyTitle>No hay registros médicos</EmptyTitle>
          <EmptyDescription>
            No se encontraron registros médicos. Crea el primer registro para
            comenzar.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="space-y-4">
      <Timeline
        items={timelineItems}
        orientation="vertical"
        size="md"
        showConnector={true}
        dateFormat="dd/MM/yyyy"
      />
    </div>
  )
}
