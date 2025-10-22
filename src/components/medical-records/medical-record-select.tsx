'use client'

import { useEffect, useState } from 'react'
import { Check, ChevronsUpDown, X, FileText, Plus, Edit } from 'lucide-react'
import { cn } from '@/lib/utils'
import { InputGroup, InputGroupButton } from '@/components/ui/input-group'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useMedicalRecordList } from '@/hooks/medical-records/use-medical-record-list'
import { Tables } from '@/types/supabase.types'
import { MedicalRecordCreate } from './medical-record-create'
import { MedicalRecordEdit } from './medical-record-edit'

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

interface MedicalRecordSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  petId?: string
}

export function MedicalRecordSelect({
  value,
  onValueChange,
  placeholder = 'Seleccionar tratamiento...',
  disabled = false,
  className,
  petId,
}: MedicalRecordSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const { data: medicalRecords = [], isLoading } = useMedicalRecordList({
    filters: petId
      ? [
          {
            field: 'pet_id',
            operator: 'eq',
            value: petId,
          },
        ]
      : [],
    search: searchTerm,
  })

  const selectedMedicalRecord = medicalRecords.find(
    (medicalRecord: MedicalRecord) => medicalRecord.id === value
  )

  const handleSelect = (medicalRecordId: string) => {
    onValueChange?.(medicalRecordId)
    setOpen(false)
  }

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'j' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <>
      <InputGroup className={className}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <InputGroupButton
              variant="ghost"
              role="combobox"
              aria-expanded={open}
              className="flex-1 justify-between h-full px-3 py-2 text-left font-normal"
              disabled={disabled}
            >
              {selectedMedicalRecord ? (
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <div className="flex items-center gap-1">
                    <span>
                      {selectedMedicalRecord?.reason || 'Registro médico'}
                    </span>
                    {selectedMedicalRecord?.record_date && (
                      <span className="text-xs text-muted-foreground">
                        (
                        {new Date(
                          selectedMedicalRecord.record_date
                        ).toLocaleDateString()}
                        )
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </InputGroupButton>
          </PopoverTrigger>
          <PopoverContent
            className="w-[--radix-popover-trigger-width] p-0"
            align="start"
          >
            <Command>
              <CommandInput
                placeholder="Buscar registro médico..."
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
              <CommandEmpty>
                {isLoading
                  ? 'Cargando...'
                  : 'No se encontraron registros médicos.'}
              </CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {medicalRecords.map((medicalRecord: MedicalRecord) => (
                  <CommandItem
                    key={medicalRecord.id}
                    value={medicalRecord.reason || 'Registro médico'}
                    onSelect={() => handleSelect(medicalRecord.id)}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {medicalRecord.reason || 'Registro médico'}
                        </span>
                        {medicalRecord.record_date && (
                          <span className="text-sm text-muted-foreground">
                            Fecha:{' '}
                            {new Date(
                              medicalRecord.record_date
                            ).toLocaleDateString()}
                          </span>
                        )}
                        {medicalRecord.pets?.name && (
                          <span className="text-sm text-muted-foreground">
                            Mascota: {medicalRecord.pets.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <Check
                      className={cn(
                        'h-4 w-4',
                        value === medicalRecord.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        {selectedMedicalRecord && (
          <InputGroupButton
            variant="ghost"
            onClick={() => onValueChange?.('')}
            disabled={disabled}
            aria-label="Limpiar selección"
            className="h-full"
          >
            <X className="h-4 w-4" />
          </InputGroupButton>
        )}

        <InputGroupButton
          variant="ghost"
          onClick={() => setCreateOpen(true)}
          disabled={disabled}
          aria-label="Crear nuevo registro médico"
          className="h-full"
        >
          <Plus className="h-4 w-4" />
        </InputGroupButton>

        {selectedMedicalRecord && (
          <InputGroupButton
            variant="ghost"
            onClick={() => setEditOpen(true)}
            disabled={disabled}
            aria-label="Editar registro médico seleccionado"
            className="h-full"
          >
            <Edit className="h-4 w-4" />
          </InputGroupButton>
        )}
      </InputGroup>

      {petId && (
        <MedicalRecordCreate
          open={createOpen}
          onOpenChange={setCreateOpen}
          petId={petId}
        />
      )}

      {selectedMedicalRecord && (
        <MedicalRecordEdit
          open={editOpen}
          onOpenChange={setEditOpen}
          medicalRecord={selectedMedicalRecord}
        />
      )}
    </>
  )
}
