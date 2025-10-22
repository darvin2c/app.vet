'use client'

import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/drawer-form'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { ClinicalNoteForm } from './clinical-note-form'
import {
  ClinicalNoteSchema,
  type ClinicalNoteFormData,
} from '@/schemas/clinical-notes.schema'
import { useClinicalNoteCreate } from '@/hooks/clinical-notes/use-clinical-note-create'

interface ClinicalNoteCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  medicalRecordId?: string
  petId?: string
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
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="!max-w-2xl">
        <DrawerHeader>
          <DrawerTitle>Crear Nota Clínica</DrawerTitle>
          <DrawerDescription>
            Agregue una nueva nota clínica para la mascota
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 pb-4">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <ClinicalNoteForm petId={petId} />
            </form>
          </FormProvider>
        </div>

        <DrawerFooter>
          <ResponsiveButton
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            isLoading={createClinicalNote.isPending}
            disabled={createClinicalNote.isPending}
          >
            Crear Nota Clínica
          </ResponsiveButton>
          <ResponsiveButton
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={createClinicalNote.isPending}
          >
            Cancelar
          </ResponsiveButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
