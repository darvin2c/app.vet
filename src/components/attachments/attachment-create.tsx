'use client'

import { useState } from 'react'
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { AttachmentForm } from './attachment-form'
import {
  attachmentUploadSchema,
  type AttachmentUploadSchema,
} from '@/schemas/attachments.schema'

interface AttachmentCreateProps {
  medicalRecordId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  allowMultiple?: boolean
}

export function AttachmentCreate({
  medicalRecordId,
  open,
  onOpenChange,
  onSuccess,
  allowMultiple = false,
}: AttachmentCreateProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<AttachmentUploadSchema>({
    resolver: zodResolver(attachmentUploadSchema),
    defaultValues: {
      medical_record_id: medicalRecordId,
      file: null,
      attachment_type: 'image',
      category: 'other',
      description: '',
      tags: [],
      is_sensitive: false,
    },
  })

  const onSubmit: SubmitHandler<AttachmentUploadSchema> = async (data) => {
    setIsLoading(true)
    try {
      // Mock upload - en producción aquí iría la lógica de subida
      console.log('Uploading attachment:', data)

      // Simular delay de subida
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success('Archivo subido exitosamente')
      onSuccess?.()
      handleCancel()
    } catch (error) {
      console.error('Error uploading attachment:', error)
      toast.error('Error al subir el archivo')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    form.reset({
      medical_record_id: medicalRecordId,
      file: null,
      attachment_type: 'image',
      category: 'other',
      description: '',
      tags: [],
      is_sensitive: false,
    })
    onOpenChange(false)
  }

  const handleSubmit = () => {
    form.handleSubmit(onSubmit)()
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle>
            {allowMultiple ? 'Subir Archivos' : 'Subir Archivo'}
          </DrawerTitle>
          <DrawerDescription>
            {allowMultiple
              ? 'Selecciona múltiples archivos para subir al tratamiento'
              : 'Selecciona un archivo para subir al tratamiento'}
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 overflow-y-auto">
          <FormProvider {...form}>
            <AttachmentForm allowMultiple={allowMultiple} />
          </FormProvider>
        </div>

        <DrawerFooter>
          <ResponsiveButton
            type="button"
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={isLoading}
          >
            {allowMultiple ? 'Subir Archivos' : 'Subir Archivo'}
          </ResponsiveButton>
          <ResponsiveButton
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancelar
          </ResponsiveButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
