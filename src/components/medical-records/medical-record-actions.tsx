import { useState } from 'react'
import { MoreHorizontal, Edit, Trash2, FileText, Plus } from 'lucide-react'
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
          <DropdownMenuItem>
            <Plus className="mr-2 h-4 w-4" />
            Parametros clinicos
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setClinicalNoteOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nota Clínica
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
    </>
  )
}
