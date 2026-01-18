'use client'

import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAttachmentUpdate } from '@/hooks/attachments/use-attachment-update'
import {
  updateAttachmentSchema,
  type UpdateAttachmentSchema,
  type AttachmentType,
  type AttachmentCategory,
} from '@/schemas/attachments.schema'
import { AttachmentForm } from './attachment-form'
import { FormSheet } from '@/components/ui/form-sheet'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import CanAccess from '@/components/ui/can-access'

interface AttachmentEditProps {
  attachment: {
    id: string
    file_name: string
    clinical_record_id: string
    attachment_type: AttachmentType
    category?: AttachmentCategory
    description?: string
    tags: string[]
    is_sensitive: boolean
  }
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: () => void
}

export function AttachmentEdit({
  attachment,
  open = false,
  onOpenChange = () => {},
  onSuccess,
}: AttachmentEditProps) {
  const updateMutation = useAttachmentUpdate()

  const form = useForm<UpdateAttachmentSchema>({
    resolver: zodResolver(updateAttachmentSchema),
    defaultValues: {
      attachment_type: attachment.attachment_type,
      category: attachment.category,
      description: attachment.description || '',
      tags: attachment.tags,
      is_sensitive: attachment.is_sensitive,
    },
  })

  const onSubmit = async (data: UpdateAttachmentSchema) => {
    try {
      await updateMutation.mutateAsync({
        id: attachment.id,
        data,
      })
      onSuccess?.()
    } catch (error) {
      // Error ya manejado en el hook
      console.error('Error updating attachment:', error)
    }
  }

  const handleCancel = () => {
    form.reset()
    onOpenChange(false)
  }

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Editar archivo"
      description={`Modificar información de "${attachment.file_name}"`}
      form={form as any}
      onSubmit={onSubmit as any}
      isPending={updateMutation.isPending}
      submitLabel="Guardar cambios"
      cancelLabel="Cancelar"
      side="right"
      className="!max-w-2xl"
    >
      <div className="px-4">
        <AttachmentForm hideFileInput />
        <ResponsiveButton type="submit" className="sr-only">
          Guardar cambios
        </ResponsiveButton>
      </div>
    </FormSheet>
  )
}
