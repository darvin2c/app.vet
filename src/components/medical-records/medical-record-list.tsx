'use client'

import { useState, useMemo, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import { Empty } from '@/components/ui/empty'
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemGroup,
  ItemSeparator,
} from '@/components/ui/item'
import {
  ChevronRight,
  ChevronDown,
  Stethoscope,
  FileText,
  Activity,
} from 'lucide-react'
import { useMedicalRecordList } from '@/hooks/medical-records/use-medical-record-list'
import { useClinicalParameterList } from '@/hooks/clinical-parameters/use-clinical-parameter-list'
import { useClinicalNoteList } from '@/hooks/clinical-notes/use-clinical-note-list'
import { useFilters } from '@/hooks/use-filters'
import { useSearch } from '@/hooks/use-search'
import { useOrderBy } from '@/hooks/use-order-by'
import { MedicalRecordActions } from './medical-record-actions'
import { ClinicalParameterActions } from '@/components/clinical-parameters/clinical-parameter-actions'
import { ClinicalNoteActions } from '@/components/clinical-notes/clinical-note-actions'
import type { Tables } from '@/types/supabase.types'
import type { FilterConfig } from '@/types/filters.types'
import type { OrderByConfig } from '@/types/order-by.types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

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
}: {
  filterConfig: FilterConfig[]
  orderByConfig: OrderByConfig
  petId?: string
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const { appliedFilters } = useFilters(filterConfig)
  const orderByHook = useOrderBy(orderByConfig)
  const { appliedSearch } = useSearch()

  const {
    data: medicalRecords = [],
    isPending: isLoadingRecords,
    error: recordsError,
  } = useMedicalRecordList({
    petId: petId || '',
    filters: appliedFilters,
    search: appliedSearch,
    orders: orderByHook.appliedSorts,
  })

  const { data: clinicalParameters = [], isPending: isLoadingParameters } =
    useClinicalParameterList({
      petId,
      filters: [],
      search: '',
      orders: [{ field: 'measured_at', ascending: false, direction: 'desc' }],
    })

  const { data: clinicalNotes = [], isPending: isLoadingNotes } =
    useClinicalNoteList({
      filters: [],
      search: '',
      orders: [{ field: 'created_at', ascending: false, direction: 'desc' }],
    })

  const toggleExpanded = (recordId: string) => {
    setExpanded((prev) => {
      const newExpanded = new Set(prev)
      if (newExpanded.has(recordId)) {
        newExpanded.delete(recordId)
      } else {
        newExpanded.add(recordId)
      }
      return newExpanded
    })
  }

  // Auto-expand all records when search is active
  useEffect(() => {
    if (appliedSearch) {
      setExpanded(new Set(medicalRecords.map((record) => record.id)))
    } else {
      setExpanded(new Set())
    }
  }, [appliedSearch, medicalRecords])

  const sortedMedicalRecords = useMemo(() => {
    return [...medicalRecords].sort(
      (a, b) =>
        new Date(b.record_date).getTime() - new Date(a.record_date).getTime()
    )
  }, [medicalRecords])

  // Helper function to format clinical parameters for end users
  const formatClinicalParameters = (params: any) => {
    if (!params) return []

    try {
      const parsedParams =
        typeof params === 'string' ? JSON.parse(params) : params
      return Object.entries(parsedParams).map(([key, value]) => ({
        key: key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        value: value,
        unit: getParameterUnit(key),
      }))
    } catch {
      return []
    }
  }

  // Helper function to get parameter units
  const getParameterUnit = (key: string) => {
    const units: Record<string, string> = {
      temperature: '°C',
      weight: 'kg',
      heart_rate: 'bpm',
      respiratory_rate: '/min',
      blood_pressure_systolic: 'mmHg',
      blood_pressure_diastolic: 'mmHg',
      glucose: 'mg/dL',
      // Add more units as needed
    }
    return units[key] || ''
  }

  // Helper function to get variant for parameter values
  const getParameterVariant = (key: string, value: any) => {
    // Define normal ranges for common parameters
    const normalRanges: Record<string, { min: number; max: number }> = {
      temperature: { min: 38, max: 39.5 },
      heart_rate: { min: 60, max: 120 },
      respiratory_rate: { min: 10, max: 30 },
      // Add more ranges as needed
    }

    const range = normalRanges[key]
    if (!range || typeof value !== 'number') return 'secondary'

    if (value < range.min || value > range.max) return 'destructive'
    return 'default'
  }

  const isLoading = isLoadingRecords || isLoadingParameters || isLoadingNotes

  if (isLoading) {
    return <TableSkeleton variant="list" />
  }

  if (recordsError) {
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
      {sortedMedicalRecords.map((record, index) => {
        const isExpanded = expanded.has(record.id)
        const recordParameters = clinicalParameters.filter(
          (param) => param.record_id === record.id
        )
        const recordNotes = clinicalNotes.filter(
          (note) => note.clinical_record_id === record.id
        )

        return (
          <div key={record.id}>
            <Item variant="default" className="mb-2">
              <ItemContent>
                <ItemTitle className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpanded(record.id)}
                    className="h-6 w-6 p-0"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                  <Stethoscope className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">
                    {record.pets?.name || 'Mascota'} - {record.record_type}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {format(new Date(record.record_date), 'dd/MM/yyyy HH:mm', {
                      locale: es,
                    })}
                  </Badge>
                </ItemTitle>
                <ItemDescription className="mt-2 space-y-1">
                  {record.diagnosis && (
                    <div className="text-sm">
                      <span className="font-medium text-foreground">
                        Diagnóstico:
                      </span>{' '}
                      {record.diagnosis}
                    </div>
                  )}
                  {record.notes && (
                    <div className="text-sm">
                      <span className="font-medium text-foreground">
                        Notas:
                      </span>{' '}
                      {record.notes}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {recordParameters.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        {recordParameters.length} parámetros
                      </span>
                    )}
                    {recordNotes.length > 0 && (
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {recordNotes.length} notas
                      </span>
                    )}
                  </div>
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <MedicalRecordActions medicalRecord={record} />
              </ItemActions>
            </Item>

            {isExpanded && (
              <div className="ml-8 space-y-2 mb-4">
                {/* Clinical Parameters */}
                {recordParameters.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Parámetros Clínicos
                    </h4>
                    {recordParameters.map((parameter) => {
                      const formattedParams = formatClinicalParameters(
                        parameter.params
                      )
                      return (
                        <Item key={parameter.id} variant="muted" size="sm">
                          <ItemContent>
                            <ItemTitle className="text-sm flex items-center gap-2">
                              <Activity className="h-3 w-3 text-green-500" />
                              <span>
                                {format(
                                  new Date(parameter.measured_at),
                                  'dd/MM/yyyy HH:mm',
                                  { locale: es }
                                )}
                              </span>
                              {parameter.schema_version && (
                                <Badge variant="outline" className="text-xs">
                                  v{parameter.schema_version}
                                </Badge>
                              )}
                            </ItemTitle>
                            <ItemDescription className="mt-2">
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {formattedParams.map(({ key, value, unit }) => (
                                  <div
                                    key={key}
                                    className="flex items-center justify-between p-2 bg-background rounded border"
                                  >
                                    <span className="text-xs font-medium text-muted-foreground">
                                      {key}:
                                    </span>
                                    <Badge
                                      variant={getParameterVariant(
                                        key.toLowerCase().replace(/ /g, '_'),
                                        value
                                      )}
                                      className="text-xs"
                                    >
                                      {String(value)} {unit}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </ItemDescription>
                          </ItemContent>
                          <ItemActions>
                            <ClinicalParameterActions
                              clinicalParameter={parameter}
                            />
                          </ItemActions>
                        </Item>
                      )
                    })}
                  </div>
                )}

                {/* Clinical Notes */}
                {recordNotes.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Notas Clínicas
                    </h4>
                    {recordNotes.map((note) => (
                      <Item key={note.id} variant="muted" size="sm">
                        <ItemContent>
                          <ItemTitle className="text-sm flex items-center gap-2">
                            <FileText className="h-3 w-3 text-blue-500" />
                            <span>Nota Clínica</span>
                            <Badge variant="outline" className="text-xs">
                              {format(
                                new Date(note.created_at),
                                'dd/MM/yyyy HH:mm',
                                { locale: es }
                              )}
                            </Badge>
                          </ItemTitle>
                          <ItemDescription className="mt-2">
                            <p className="text-sm">{note.note}</p>
                          </ItemDescription>
                        </ItemContent>
                        <ItemActions>
                          <ClinicalNoteActions clinicalNote={note} />
                        </ItemActions>
                      </Item>
                    ))}
                  </div>
                )}
              </div>
            )}

            {index !== sortedMedicalRecords.length - 1 && <ItemSeparator />}
          </div>
        )
      })}
    </ItemGroup>
  )
}
