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
import { useClinicalNoteCreate } from '@/hooks/clinical-notes/use-clinical-note-create'
import CanAccess from '@/components/ui/can-access'

interface ClinicalNoteCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  medicalRecordId?: string
  petId: string
  hospitalizationId?: string
}

export function ClinicalNoteCreate({
  open,
  onOpenChange,
  medicalRecordId,
  petId,
  hospitalizationId,
}: ClinicalNoteCreateProps) {
  const createClinicalNote = useClinicalNoteCreate()

  const form = useForm<ClinicalNoteFormData>({
    resolver: zodResolver(ClinicalNoteSchema),
    defaultValues: {
      note: '',
      clinical_record_id: medicalRecordId || '',
      pet_id: petId || '',
      vet_id: '',
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
      await createClinicalNote.mutateAsync(data)
      toast.success('Nota clínica creada exitosamente')
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Error al crear nota clínica:', error)
      toast.error('Error al crear la nota clínica')
    }
  }

  return (
    <CanAccess resource="products" action="create">
      <FormSheet
        open={open}
        onOpenChange={onOpenChange}
        title="Crear Nota Clínica"
        description="Agregue una nueva nota clínica para la mascota"
        form={form as any}
        onSubmit={onSubmit as any}
        isPending={createClinicalNote.isPending}
        submitLabel="Crear Nota Clínica"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-2xl"
      >
        <div className="px-4 pb-4">
          <ClinicalNoteForm petId={petId} />
          <ResponsiveButton type="submit" className="sr-only">
            Crear Nota Clínica
          </ResponsiveButton>
        </div>
      </FormSheet>
    </CanAccess>
  )
}
