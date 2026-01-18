'use client'

import { useState } from 'react'
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { FormSheet } from '@/components/ui/form-sheet'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { AttachmentForm } from './attachment-form'
import {
  attachmentUploadSchema,
  type AttachmentUploadSchema,
} from '@/schemas/attachments.schema'
import CanAccess from '@/components/ui/can-access'

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
      clinical_record_id: medicalRecordId,
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
      clinical_record_id: medicalRecordId,
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
    <CanAccess resource="products" action="create">
      <FormSheet
        open={open}
        onOpenChange={onOpenChange}
        title={allowMultiple ? 'Subir Archivos' : 'Subir Archivo'}
        description={
          allowMultiple
            ? 'Selecciona múltiples archivos para subir al registro médico'
            : 'Selecciona un archivo para subir al registro médico'
        }
        form={form as any}
        onSubmit={onSubmit as any}
        isPending={isLoading}
        submitLabel={allowMultiple ? 'Subir Archivos' : 'Subir Archivo'}
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-2xl"
      >
        <div className="px-4 overflow-y-auto">
          <AttachmentForm allowMultiple={allowMultiple} />
          <ResponsiveButton type="submit" className="sr-only">
            {allowMultiple ? 'Subir Archivos' : 'Subir Archivo'}
          </ResponsiveButton>
        </div>
      </FormSheet>
    </CanAccess>
  )
}
