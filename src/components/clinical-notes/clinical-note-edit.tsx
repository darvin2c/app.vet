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
} from '@/components/ui/drawer'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { ClinicalNoteForm } from './clinical-note-form'
import {
  ClinicalNoteSchema,
  type ClinicalNoteFormData,
} from '@/schemas/clinical-notes.schema'
import { useClinicalNoteUpdate } from '@/hooks/clinical-notes/use-clinical-note-update'
import { Tables } from '@/types/supabase.types'

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
      content: clinicalNote.content,
      treatment_id: clinicalNote.treatment_id,
      hospitalization_id: clinicalNote.hospitalization_id || undefined,
    },
  })

  const onSubmit = async (formData: ClinicalNoteFormData) => {
    try {
      const data = {
        content: formData.content,
        treatment_id: formData.treatment_id,
        hospitalization_id: formData.hospitalization_id,
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
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Editar Nota Clínica</DrawerTitle>
          <DrawerDescription>
            Modifique los datos de la nota clínica
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 pb-4">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <ClinicalNoteForm />
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
      </DrawerContent>
    </Drawer>
  )
}
