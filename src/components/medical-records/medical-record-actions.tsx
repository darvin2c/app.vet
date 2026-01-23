import { useState } from 'react'
import { MoreHorizontal, Edit, Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MedicalRecordEdit } from './medical-record-edit'
import { MedicalRecordDelete } from './medical-record-delete'
import { ClinicalNoteCreate } from '@/components/clinical-notes/clinical-note-create'
import { Tables } from '@/types/supabase.types'
import { ClinicalParameterCreate } from '../clinical-parameters/clinical-parameter-create'
import { VaccinationCreate } from './vaccination-create'
import { DewormingCreate } from './deworming-create'
import { MedicalRecordItemCreate } from '../medical-record-items/medical-record-item-create'

interface MedicalRecordActionsProps {
  medicalRecord: Tables<'clinical_records'>
}

export function MedicalRecordActions({
  medicalRecord,
}: MedicalRecordActionsProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [clinicalNoteOpen, setClinicalNoteOpen] = useState(false)
  const [clinicalParamsOpen, setClinicalParamsOpen] = useState(false)
  const [vaccinationOpen, setVaccinationOpen] = useState(false)
  const [dewormingOpen, setDewormingOpen] = useState(false)
  const [itemOpen, setItemOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setClinicalParamsOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Parametros clinicos
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setClinicalNoteOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nota Clínica
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setVaccinationOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Vacunación
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setDewormingOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Desparasitación
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setItemOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Producto/Servicio
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <MedicalRecordEdit
        medicalRecord={medicalRecord}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <MedicalRecordDelete
        medicalRecordId={medicalRecord.id}
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => setDeleteOpen(false)}
      />

      <ClinicalNoteCreate
        open={clinicalNoteOpen}
        onOpenChange={setClinicalNoteOpen}
        medicalRecordId={medicalRecord.id}
        petId={medicalRecord.pet_id}
      />
      <ClinicalParameterCreate
        open={clinicalParamsOpen}
        onOpenChange={setClinicalParamsOpen}
        clinicalRecordId={medicalRecord.id}
        petId={medicalRecord.pet_id}
      />
      <VaccinationCreate
        open={vaccinationOpen}
        onOpenChange={setVaccinationOpen}
        medicalRecordId={medicalRecord.id}
        petId={medicalRecord.pet_id}
      />
      <DewormingCreate
        open={dewormingOpen}
        onOpenChange={setDewormingOpen}
        medicalRecordId={medicalRecord.id}
        petId={medicalRecord.pet_id}
      />
      <MedicalRecordItemCreate
        open={itemOpen}
        onOpenChange={setItemOpen}
        medicalRecordId={medicalRecord.id}
      />
    </>
  )
}
