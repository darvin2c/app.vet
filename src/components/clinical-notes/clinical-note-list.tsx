'use client'

import { useState, useCallback } from 'react'
import { ColumnDef, Row } from '@tanstack/react-table'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { FileText, Calendar, User, Stethoscope, Building2 } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ViewModeToggle, ViewMode } from '@/components/ui/view-mode-toggle'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'
import { OrderByTableHeader } from '@/components/ui/order-by'
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemGroup,
} from '@/components/ui/item'

import { useFilters } from '@/hooks/use-filters'
import { useOrderBy } from '@/hooks/use-order-by'
import { useSearch } from '@/hooks/use-search'
import { useClinicalNoteList } from '@/hooks/clinical-notes/use-clinical-note-list'
import { usePetClinicalNotes } from '@/hooks/clinical-notes/use-pet-clinical-notes'

import { ClinicalNoteActions } from './clinical-note-actions'
import { Tables } from '@/types/supabase.types'
import { FilterConfig } from '@/types/filters.types'
import { OrderByConfig } from '@/types/order-by.types'

type ClinicalNote = Tables<'clinical_notes'> & {
  clinical_records: Tables<'clinical_records'> | null
  hospitalizations: Tables<'hospitalizations'> | null
}

export function ClinicalNoteList({
  filterConfig,
  orderByConfig,
  petId,
}: {
  filterConfig?: FilterConfig[]
  orderByConfig?: OrderByConfig
  petId?: string
}) {
  const [viewMode, setViewMode] = useState<ViewMode>('table')

  const { appliedFilters } = useFilters(filterConfig || [])
  const orderByHook = useOrderBy(orderByConfig || { columns: [] })
  const { appliedSearch } = useSearch()

  // Use pet-specific hook if petId is provided, otherwise use general list
  const {
    data: clinicalNotes = [],
    isPending,
    error,
  } = petId
    ? usePetClinicalNotes(petId)
    : useClinicalNoteList({
        filters: appliedFilters,
        orders: orderByHook.appliedSorts,
        search: appliedSearch,
      })

  const handleClinicalNoteSelect = useCallback((clinicalNote: ClinicalNote) => {
    console.log('Clinical note selected:', clinicalNote)
  }, [])

  const columns: ColumnDef<ClinicalNote>[] = [
    {
      accessorKey: 'content',
      header: () => (
        <OrderByTableHeader field="content" orderByHook={orderByHook}>
          Contenido
        </OrderByTableHeader>
      ),
      cell: ({ row }) => {
        const content = row.getValue('content') as string
        return (
          <div className="max-w-md">
            <p className="text-sm line-clamp-2">{content}</p>
          </div>
        )
      },
    },
    {
      accessorKey: 'clinical_records.record_type',
      header: 'Registro Médico',
      cell: ({ row }) => {
        const clinicalRecord = row.original.clinical_records
        return clinicalRecord ? (
          <Badge variant="secondary" className="text-xs">
            <Stethoscope className="h-3 w-3 mr-1" />
            {clinicalRecord.record_type}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-sm">-</span>
        )
      },
    },
    {
      accessorKey: 'hospitalizations.admission_at',
      header: 'Hospitalización',
      cell: ({ row }) => {
        const hospitalization = row.original.hospitalizations
        return hospitalization ? (
          <Badge variant="outline" className="text-xs">
            <Building2 className="h-3 w-3 mr-1" />
            {format(new Date(hospitalization.admission_at), 'dd/MM/yyyy', {
              locale: es,
            })}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-sm">-</span>
        )
      },
    },
    {
      accessorKey: 'created_at',
      header: () => (
        <OrderByTableHeader field="created_at" orderByHook={orderByHook}>
          Fecha
        </OrderByTableHeader>
      ),
      cell: ({ row }) => {
        const date = row.getValue('created_at') as string
        return (
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: es })}
            </span>
          </div>
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => <ClinicalNoteActions clinicalNote={row.original} />,
    },
  ]

  if (isPending) {
    return <TableSkeleton />
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error al cargar las notas clínicas</p>
      </div>
    )
  }

  if (clinicalNotes.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No hay notas clínicas</EmptyTitle>
          <EmptyDescription>
            No se encontraron notas clínicas que coincidan con los criterios de
            búsqueda.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ViewModeToggle onValueChange={setViewMode} resource="clinical-notes" />
      </div>

      {viewMode === 'table' && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column, index) => (
                  <TableHead key={index}>
                    {typeof column.header === 'function'
                      ? column.header({} as any)
                      : column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {clinicalNotes.map((clinicalNote) => (
                <TableRow
                  key={clinicalNote.id}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  {columns.map((column, index) => (
                    <TableCell key={index}>
                      {column.cell && typeof column.cell === 'function'
                        ? column.cell({
                            row: { original: clinicalNote },
                          } as any)
                        : column.cell || ''}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clinicalNotes.map((clinicalNote) => (
            <Card
              key={clinicalNote.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Nota Clínica
                  </CardTitle>
                  <ClinicalNoteActions clinicalNote={clinicalNote} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3 line-clamp-3">
                  {clinicalNote.content}
                </p>

                <div className="flex flex-wrap gap-2 mb-3">
                  {clinicalNote.clinical_records && (
                    <Badge variant="secondary" className="text-xs">
                      <Stethoscope className="h-3 w-3 mr-1" />
                      {clinicalNote.clinical_records.record_type}
                    </Badge>
                  )}
                  {clinicalNote.hospitalizations && (
                    <Badge variant="outline" className="text-xs">
                      <Building2 className="h-3 w-3 mr-1" />
                      Hospitalización
                    </Badge>
                  )}
                </div>

                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  {format(
                    new Date(clinicalNote.created_at),
                    'dd/MM/yyyy HH:mm',
                    {
                      locale: es,
                    }
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {viewMode === 'list' && (
        <ItemGroup>
          {clinicalNotes.map((clinicalNote) => (
            <Item key={clinicalNote.id}>
              <ItemContent>
                <ItemTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Nota Clínica
                </ItemTitle>
                <ItemDescription>
                  <div className="space-y-1">
                    <p className="line-clamp-2">{clinicalNote.content}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <Calendar className="h-3 w-3" />
                      {format(
                        new Date(clinicalNote.created_at),
                        'dd/MM/yyyy HH:mm',
                        {
                          locale: es,
                        }
                      )}
                    </div>
                  </div>
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <ClinicalNoteActions clinicalNote={clinicalNote} />
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      )}
    </div>
  )
}
