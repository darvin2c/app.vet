'use client'

import { toast } from 'sonner'
import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { useClinicalNoteDelete } from '@/hooks/clinical-notes/use-clinical-note-delete'
import { Tables } from '@/types/supabase.types'

interface ClinicalNoteDeleteProps {
  clinicalNote: Tables<'clinical_notes'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ClinicalNoteDelete({
  clinicalNote,
  open,
  onOpenChange,
}: ClinicalNoteDeleteProps) {
  const deleteClinicalNote = useClinicalNoteDelete()

  const handleDelete = async () => {
    try {
      await deleteClinicalNote.mutateAsync(clinicalNote.id)
      toast.success('Nota clínica eliminada exitosamente')
      onOpenChange(false)
    } catch (error) {
      console.error('Error al eliminar nota clínica:', error)
      toast.error('Error al eliminar la nota clínica')
    }
  }

  return (
    <AlertConfirmation
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Eliminar Nota Clínica"
      description="¿Está seguro de que desea eliminar esta nota clínica? Esta acción no se puede deshacer."
      confirmText="ELIMINAR"
      onConfirm={handleDelete}
      isLoading={deleteClinicalNote.isPending}
    />
  )
}
