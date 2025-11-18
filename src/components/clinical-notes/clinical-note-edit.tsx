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
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="!max-w-2xl">
        <CanAccess resource="products" action="update">
          <DrawerHeader>
            <DrawerTitle>Editar Nota Clínica</DrawerTitle>
            <DrawerDescription>
              Modifique los datos de la nota clínica
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-4">
            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <ClinicalNoteForm petId={clinicalNote.pet_id} />
              </form>
            </FormProvider>
          </div>

          <DrawerFooter>
            <ResponsiveButton
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
              isLoading={updateClinicalNote.isPending}
              disabled={updateClinicalNote.isPending}
            >
              Actualizar Nota Clínica
            </ResponsiveButton>
            <ResponsiveButton
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateClinicalNote.isPending}
            >
              Cancelar
            </ResponsiveButton>
          </DrawerFooter>
        </CanAccess>
      </DrawerContent>
    </Drawer>
  )
}
