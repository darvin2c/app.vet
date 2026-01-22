'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { FormSheet } from '@/components/ui/form-sheet'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { ClinicalNoteForm } from './clinical-note-form'
import {
  ClinicalNoteSchema,
  type ClinicalNoteFormData,
} from '@/schemas/clinical-notes.schema'
import { useClinicalNoteUpdate } from '@/hooks/clinical-notes/use-clinical-note-update'
import { Tables } from '@/types/supabase.types'
import CanAccess from '@/components/ui/can-access'

interface ClinicalNoteEditProps {
  clinicalNote: Tables<'clinical_notes'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ClinicalNoteEdit({
  clinicalNote,
  open,
  onOpenChange,
}: ClinicalNoteEditProps) {
  const updateClinicalNote = useClinicalNoteUpdate()

  const form = useForm<ClinicalNoteFormData>({
    resolver: zodResolver(ClinicalNoteSchema),
    defaultValues: {
      note: clinicalNote.note,
      clinical_record_id: clinicalNote.clinical_record_id || '',
      pet_id: clinicalNote.pet_id,
      vet_id: clinicalNote.vet_id || '',
    },
  })

  const onSubmit = async (formData: ClinicalNoteFormData) => {
    try {
      const data = {
        note: formData.note,
        clinical_record_id: formData.clinical_record_id,
        pet_id: formData.pet_id,
        vet_id: formData.vet_id,
      }
      await updateClinicalNote.mutateAsync({
        id: clinicalNote.id,
        data,
      })
      toast.success('Nota clínica actualizada exitosamente')
      onOpenChange(false)
    } catch (error) {
      console.error('Error al actualizar nota clínica:', error)
      toast.error('Error al actualizar la nota clínica')
    }
  }

  return (
    <CanAccess resource="products" action="update">
      <FormSheet
        open={open}
        onOpenChange={onOpenChange}
        title="Editar Nota Clínica"
        description="Modifique los datos de la nota clínica"
        form={form as any}
        onSubmit={onSubmit as any}
        isPending={updateClinicalNote.isPending}
        submitLabel="Actualizar Nota Clínica"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-2xl"
      >
        <div className="px-4 pb-4">
          <ClinicalNoteForm petId={clinicalNote.pet_id} />
          <ResponsiveButton type="submit" className="sr-only">
            Actualizar Nota Clínica
          </ResponsiveButton>
        </div>
      </FormSheet>
    </CanAccess>
  )
}
