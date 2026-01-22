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
  Syringe,
  Package,
} from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MedicalRecordActions } from '../medical-record-actions'
import { es } from 'date-fns/locale'
import ClinicalParameterItem from './clinical-parameter-item'
import ClinicalNoteItem from './clinical-note-item'
import VaccinationItem from './vaccination-item'
import RecordItemItem, {
  MedicalRecordItemWithProduct,
} from './record-item-item'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

type ClinicalRecord = Tables<'clinical_records'> & {
  clinical_parameters?: TablesUpdate<'clinical_parameters'>[]
  clinical_notes?: TablesUpdate<'clinical_notes'>[] | null
  vaccinations?: TablesUpdate<'vaccinations'>[] | null
  record_items?: MedicalRecordItemWithProduct[] | null
  pets?: TablesUpdate<'pets'> | null
}

// Tipo para los registros combinados
type CombinedRecord =
  | (TablesUpdate<'clinical_parameters'> & { type?: 'clinical_parameters' })
  | (TablesUpdate<'clinical_notes'> & { type?: 'clinical_notes' })
  | (TablesUpdate<'vaccinations'> & { type?: 'vaccinations' })
  | (MedicalRecordItemWithProduct & { type?: 'record_items' })

export default function ClinicalRecordItem({
  clinicalRecord,
}: {
  clinicalRecord: ClinicalRecord
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [clinicalEntries, setClinicalEntries] = useState<CombinedRecord[]>([])
  const [billingItems, setBillingItems] = useState<CombinedRecord[]>([])

  // Filter states
  const [activeFilters, setActiveFilters] = useState<{
    parameters: boolean
    notes: boolean
    vaccinations: boolean
    items: boolean
  }>({
    parameters: true,
    notes: true,
    vaccinations: true,
    items: true,
  })

  const toggleFilter = (
    key: 'parameters' | 'notes' | 'vaccinations' | 'items'
  ) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
    if (!isExpanded) {
      setIsExpanded(true)
    }
  }

  useEffect(() => {
    const clinical: CombinedRecord[] = []
    const billing: CombinedRecord[] = []

    // Agregar parámetros clínicos
    if (clinicalRecord.clinical_parameters && activeFilters.parameters) {
      const parametersWithType = clinicalRecord.clinical_parameters.map(
        (param) => ({
          ...param,
          type: 'clinical_parameters' as const,
        })
      )
      clinical.push(...parametersWithType)
    }

    // Agregar notas clínicas
    if (clinicalRecord.clinical_notes && activeFilters.notes) {
      const notesWithType = clinicalRecord.clinical_notes.map((note) => ({
        ...note,
        type: 'clinical_notes' as const,
      }))
      clinical.push(...notesWithType)
    }

    // Agregar vacunaciones
    if (clinicalRecord.vaccinations && activeFilters.vaccinations) {
      const vaccinationsWithType = clinicalRecord.vaccinations.map((vac) => ({
        ...vac,
        type: 'vaccinations' as const,
      }))
      clinical.push(...vaccinationsWithType)
    }

    // Agregar items
    if (clinicalRecord.record_items && activeFilters.items) {
      const itemsWithType = clinicalRecord.record_items.map((item) => ({
        ...item,
        type: 'record_items' as const,
      }))
      billing.push(...itemsWithType)
    }

    // Ordenar por fecha de creación ascendente
    const sortByDate = (a: CombinedRecord, b: CombinedRecord) =>
      new Date(a.created_at || 0).getTime() -
      new Date(b.created_at || 0).getTime()

    clinical.sort(sortByDate)
    billing.sort(sortByDate)

    setClinicalEntries(clinical)
    setBillingItems(billing)
  }, [
    clinicalRecord.clinical_parameters,
    clinicalRecord.clinical_notes,
    clinicalRecord.vaccinations,
    clinicalRecord.record_items,
    activeFilters,
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
            {clinicalRecord.objective && (
              <div className="text-sm">
                <span className="font-medium text-foreground">Objetivo:</span>{' '}
                {clinicalRecord.objective}
              </div>
            )}
            {clinicalRecord.diagnosis && (
              <div className="text-sm">
                <span className="font-medium text-foreground">
                  Diagnóstico:
                </span>{' '}
                {clinicalRecord.diagnosis}
              </div>
            )}
            {clinicalRecord.plan && (
              <div className="text-sm">
                <span className="font-medium text-foreground">Plan:</span>{' '}
                {clinicalRecord.plan}
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
              {clinicalRecord?.clinical_parameters &&
                clinicalRecord.clinical_parameters.length > 0 && (
                  <Badge
                    variant={activeFilters.parameters ? 'secondary' : 'outline'}
                    className="cursor-pointer hover:bg-secondary/80 transition-colors flex items-center gap-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFilter('parameters')
                    }}
                  >
                    <Activity className="h-3 w-3" />
                    {clinicalRecord?.clinical_parameters?.length} parámetros
                  </Badge>
                )}
              {clinicalRecord?.clinical_notes &&
                clinicalRecord.clinical_notes.length > 0 && (
                  <Badge
                    variant={activeFilters.notes ? 'secondary' : 'outline'}
                    className="cursor-pointer hover:bg-secondary/80 transition-colors flex items-center gap-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFilter('notes')
                    }}
                  >
                    <FileText className="h-3 w-3" />
                    {clinicalRecord?.clinical_notes?.length} notas
                  </Badge>
                )}
              {clinicalRecord?.vaccinations &&
                clinicalRecord.vaccinations.length > 0 && (
                  <Badge
                    variant={
                      activeFilters.vaccinations ? 'secondary' : 'outline'
                    }
                    className="cursor-pointer hover:bg-secondary/80 transition-colors flex items-center gap-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFilter('vaccinations')
                    }}
                  >
                    <Syringe className="h-3 w-3" />
                    {clinicalRecord?.vaccinations?.length} vacunas
                  </Badge>
                )}
              {clinicalRecord?.record_items &&
                clinicalRecord.record_items.length > 0 && (
                  <Badge
                    variant={activeFilters.items ? 'secondary' : 'outline'}
                    className="cursor-pointer hover:bg-secondary/80 transition-colors flex items-center gap-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFilter('items')
                    }}
                  >
                    <Package className="h-3 w-3" />
                    {clinicalRecord?.record_items?.length} items
                  </Badge>
                )}
            </div>
          </div>
        </ItemContent>
        <ItemActions>
          <MedicalRecordActions medicalRecord={clinicalRecord} />
        </ItemActions>
      </Item>

      <CollapsibleContent className="ml-10 space-y-4">
        {/* Clinical Section */}
        {clinicalEntries.length > 0 && (
          <div className="space-y-2 border-l border-blue-200 pl-4">
            <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2 flex items-center gap-2">
              <Activity className="h-3 w-3" />
              Historial Clínico
            </h4>
            {clinicalEntries.map((record) => (
              <div key={record.id}>
                {record.type === 'clinical_parameters' ? (
                  <ClinicalParameterItem
                    clinicalParameter={record as Tables<'clinical_parameters'>}
                  />
                ) : record.type === 'clinical_notes' ? (
                  <ClinicalNoteItem
                    clinicalNote={record as Tables<'clinical_notes'>}
                  />
                ) : (
                  <VaccinationItem
                    vaccination={record as Tables<'vaccinations'>}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Billing/Items Section */}
        {billingItems.length > 0 && (
          <div className="space-y-2 border-l border-purple-200 pl-4">
            <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2 flex items-center gap-2">
              <Package className="h-3 w-3" />
              Items / Facturación
            </h4>
            {billingItems.map((record) => (
              <RecordItemItem
                key={record.id}
                recordItem={record as MedicalRecordItemWithProduct}
              />
            ))}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}
