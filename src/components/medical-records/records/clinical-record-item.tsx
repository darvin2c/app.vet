'use client'
import { Tables, TablesUpdate } from '@/types/supabase.types'
import { useEffect, useState } from 'react'
import { Item, ItemActions, ItemContent, ItemTitle } from '@/components/ui/item'
import {
  Stethoscope,
  ChevronDown,
  ChevronRight,
  FileText,
  Activity,
} from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MedicalRecordActions } from '../medical-record-actions'
import { es } from 'date-fns/locale'
import ClinicalParameterItem from './clinical-parameter-item'
import ClinicalNoteItem from './clinical-note-item'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

type ClinicalRecord = Tables<'clinical_records'> & {
  clinical_parameters?: TablesUpdate<'clinical_parameters'>[]
  clinical_notes?: TablesUpdate<'clinical_notes'>[] | null
  pets?: TablesUpdate<'pets'> | null
}

// Tipo para los registros combinados
type CombinedRecord =
  | (TablesUpdate<'clinical_parameters'> & { type?: 'clinical_parameters' })
  | (TablesUpdate<'clinical_notes'> & { type?: 'clinical_notes' })

export default function ClinicalRecordItem({
  clinicalRecord,
}: {
  clinicalRecord: ClinicalRecord
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [records, setRecords] = useState<CombinedRecord[]>([])

  useEffect(() => {
    const combined: CombinedRecord[] = []

    // Agregar parámetros clínicos
    if (clinicalRecord.clinical_parameters) {
      const parametersWithType = clinicalRecord.clinical_parameters.map(
        (param) => ({
          ...param,
          type: 'clinical_parameters' as const,
        })
      )
      combined.push(...parametersWithType)
    }

    // Agregar notas clínicas
    if (clinicalRecord.clinical_notes) {
      const notesWithType = clinicalRecord.clinical_notes.map((note) => ({
        ...note,
        type: 'clinical_notes' as const,
      }))
      combined.push(...notesWithType)
    }

    // Ordenar por fecha de creación ascendente
    combined.sort(
      (a, b) =>
        new Date(a.created_at || 0).getTime() -
        new Date(b.created_at || 0).getTime()
    )

    setRecords(combined)
  }, [
    clinicalRecord.clinical_parameters,
    clinicalRecord.clinical_notes,
    // Removido 'records' para evitar bucle infinito
  ])

  return (
    <Collapsible open={isExpanded}>
      <Item variant="default" className="mb-2">
        <ItemContent>
          <ItemTitle className="flex items-center gap-2">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-6 w-6 p-0"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <Stethoscope className="h-4 w-4" />
            <span className="font-medium">
              {clinicalRecord.pets?.name || 'Mascota'} -{' '}
              {clinicalRecord.record_type}
            </span>
            <Badge variant="secondary" className="text-xs">
              {format(
                new Date(clinicalRecord.record_date),
                'dd/MM/yyyy HH:mm',
                {
                  locale: es,
                }
              )}
            </Badge>
          </ItemTitle>
          <div className="mt-2 space-y-1">
            {clinicalRecord.diagnosis && (
              <div className="text-sm">
                <span className="font-medium text-foreground">
                  Diagnóstico:
                </span>{' '}
                {clinicalRecord.diagnosis}
              </div>
            )}
            {clinicalRecord.notes && (
              <div className="text-sm">
                <span className="font-medium text-foreground">Notas:</span>{' '}
                {clinicalRecord.notes}
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {clinicalRecord?.clinical_parameters &&
                clinicalRecord.clinical_parameters.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    {clinicalRecord?.clinical_parameters?.length} parámetros
                  </span>
                )}
              {clinicalRecord?.clinical_notes &&
                clinicalRecord.clinical_notes.length > 0 && (
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {clinicalRecord?.clinical_notes?.length} notas
                  </span>
                )}
            </div>
          </div>
        </ItemContent>
        <ItemActions>
          <MedicalRecordActions medicalRecord={clinicalRecord} />
        </ItemActions>
      </Item>
      {/* Aquí se podría agregar la vista expandida si es necesario */}
      <CollapsibleContent className="ml-10 border-l border-muted-foreground">
        {records.map((record) => (
          <div key={record.id}>
            {record.type === 'clinical_parameters' ? (
              <ClinicalParameterItem
                clinicalParameter={record as Tables<'clinical_parameters'>}
              />
            ) : (
              <ClinicalNoteItem
                clinicalNote={record as Tables<'clinical_notes'>}
              />
            )}
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}
