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
import { Timeline, TimelineItem } from '@/components/ui/timeline'
import { FileText, Activity, MessageSquare } from 'lucide-react'
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
  clinical_parameters: {
    id: string
    params: any
    schema_version: string | null
    measured_at: string
  }[]
  clinical_notes: {
    id: string
    note: string
  }[]
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

  // Crear items combinados de registros médicos, parámetros clínicos y notas clínicas
  const combinedTimelineItems = useMemo(() => {
    const allItems: Array<{
      id: string
      timestamp: Date
      title: string
      description: string
      content: React.ReactNode
      icon: React.ReactNode
      variant: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'muted'
      type: 'medical_record' | 'clinical_parameter' | 'clinical_note'
      actions?: React.ReactNode
    }> = []

    // Agregar registros médicos
    medicalRecords.forEach((record) => {
      const recordType = getRecordType(record.record_type)

      // Determinar el variant basado en si tiene diagnóstico
      let variant:
        | 'default'
        | 'primary'
        | 'success'
        | 'warning'
        | 'error'
        | 'muted' = 'default'
      if (record.diagnosis) {
        variant = 'success'
      } else if (record.notes) {
        variant = 'warning'
      }

      const description = [
        recordType?.label || record.record_type,
        record.staff ? getStaffFullName(record.staff) : 'Sin asignar',
      ].join(' • ')

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

      allItems.push({
        id: `medical_record_${record.id}`,
        timestamp: record.record_date
          ? new Date(record.record_date)
          : new Date(record.created_at),
        title: record.pets?.name || 'Sin mascota',
        description,
        content,
        icon: recordType?.icon,
        variant,
        type: 'medical_record',
        actions: <MedicalRecordActions medicalRecord={record} />,
      })

      // Agregar parámetros clínicos del registro
      record.clinical_parameters?.forEach((param) => {
        const paramContent = (
          <div className="mt-2">
            <div className="text-sm text-muted-foreground">
              Parámetros clínicos
            </div>
            <div className="mt-1 p-2 bg-muted/50 rounded text-xs">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(param.params, null, 2)}
              </pre>
            </div>
            {param.schema_version && (
              <div className="text-xs text-muted-foreground mt-1">
                Versión del esquema: {param.schema_version}
              </div>
            )}
          </div>
        )

        allItems.push({
          id: `clinical_parameter_${param.id}`,
          timestamp: new Date(param.measured_at),
          title: 'Parámetros Clínicos',
          description: `Medición • ${record.pets?.name || 'Sin mascota'}`,
          content: paramContent,
          icon: <Activity className="h-4 w-4" />,
          variant: 'primary',
          type: 'clinical_parameter',
        })
      })

      // Agregar notas clínicas del registro
      record.clinical_notes?.forEach((note) => {
        const noteContent = (
          <div className="mt-2">
            <div className="text-sm">{note.note}</div>
          </div>
        )

        allItems.push({
          id: `clinical_note_${note.id}`,
          timestamp: new Date(record.created_at), // Las notas usan el timestamp del registro
          title: 'Nota Clínica',
          description: `Observación • ${record.pets?.name || 'Sin mascota'}`,
          content: noteContent,
          icon: <MessageSquare className="h-4 w-4" />,
          variant: 'muted',
          type: 'clinical_note',
        })
      })
    })

    // Ordenar todos los items cronológicamente (más reciente primero)
    return allItems.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    )
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
      <Timeline orientation="vertical" size="md" showConnector={true}>
        {combinedTimelineItems.map((item) => (
          <TimelineItem
            key={item.id}
            timestamp={item.timestamp}
            title={item.title}
            description={item.description}
            icon={item.icon}
            variant={item.variant}
            actions={item.actions}
          >
            {item.content}
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  )
}
