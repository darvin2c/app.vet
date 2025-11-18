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
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/drawer'
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
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <CanAccess resource="products" action="update">
          <DrawerHeader>
            <DrawerTitle>Editar archivo</DrawerTitle>
            <DrawerDescription>
              Modificar información de "{attachment.file_name}"
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4">
            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <AttachmentForm hideFileInput />
              </form>
            </FormProvider>
          </div>

          <DrawerFooter>
            <ResponsiveButton
              type="submit"
              isLoading={updateMutation.isPending}
              disabled={!form.formState.isDirty}
              onClick={form.handleSubmit(onSubmit)}
            >
              Guardar cambios
            </ResponsiveButton>
            <ResponsiveButton
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={updateMutation.isPending}
            >
              Cancelar
            </ResponsiveButton>
          </DrawerFooter>
        </CanAccess>
      </DrawerContent>
    </Drawer>
  )
}
