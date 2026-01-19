'use client'

import { EntitySelect } from '@/components/ui/entity-select'
import { useMedicalRecordList } from '@/hooks/medical-records/use-medical-record-list'
import { Tables } from '@/types/supabase.types'
import { MedicalRecordCreate } from './medical-record-create'
import { MedicalRecordEdit } from './medical-record-edit'
import { FileText } from 'lucide-react'
import { useState } from 'react'

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
  clinical_notes: {
    id: string
    note: string
  }[]
  clinical_parameters: {
    id: string
    params: any
    schema_version: number
    measured_at: string
  }[]
}

interface MedicalRecordSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  petId: string
}

export function MedicalRecordSelect({
  value,
  onValueChange,
  placeholder = 'Seleccionar tratamiento...',
  disabled = false,
  className,
  petId,
}: MedicalRecordSelectProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: medicalRecords = [], isPending: isLoading } =
    useMedicalRecordList({
      petId: petId,
      search: searchTerm,
    })

  return (
    <EntitySelect<MedicalRecord>
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      className={className}
      placeholder={placeholder}
      items={medicalRecords}
      isPending={isLoading}
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
      renderCreate={(props) => <MedicalRecordCreate {...props} petId={petId} />}
      renderEdit={(props) => {
        const record = medicalRecords.find((r) => r.id === props.id)
        if (!record) return null
        return <MedicalRecordEdit {...props} medicalRecord={record} />
      }}
      renderItem={(record) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="font-medium">
              {record.reason || 'Registro médico'}
            </span>
            {record.record_date && (
              <span className="text-sm text-muted-foreground">
                Fecha: {new Date(record.record_date).toLocaleDateString()}
              </span>
            )}
            {record.pets?.name && (
              <span className="text-sm text-muted-foreground">
                Mascota: {record.pets.name}
              </span>
            )}
          </div>
        </div>
      )}
      renderSelected={(record) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <div className="flex items-center gap-1">
            <span>{record.reason || 'Registro médico'}</span>
            {record.record_date && (
              <span className="text-xs text-muted-foreground">
                ({new Date(record.record_date).toLocaleDateString()})
              </span>
            )}
          </div>
        </div>
      )}
    />
  )
}
