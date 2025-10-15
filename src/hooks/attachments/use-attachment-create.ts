import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AttachmentUploadSchema } from '@/schemas/attachments.schema'

// Mock data para simular la creación de attachments
const mockCreateAttachment = async (data: AttachmentUploadSchema) => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Simular error ocasional para testing
  if (Math.random() < 0.1) {
    throw new Error('Error al subir el archivo')
  }

  // Generar mock attachment
  const mockAttachment = {
    id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    treatment_id: data.treatment_id,
    file_name: data.file.name,
    file_size: data.file.size,
    file_type: data.file.type,
    file_url: `https://mock-storage.example.com/attachments/${data.file.name}`,
    attachment_type: data.attachment_type,
    category: data.category,
    description: data.description || '',
    tags: data.tags || [],
    is_sensitive: data.is_sensitive,
    uploaded_by: 'mock-user-id',
    tenant_id: 'mock-tenant-id',
    created_at: new Date().toISOString(),
    created_by: 'mock-user-id',
    updated_at: new Date().toISOString(),
    updated_by: 'mock-user-id',
  }

  return mockAttachment
}

export function useAttachmentCreate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: mockCreateAttachment,
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({
        queryKey: ['mock-tenant-id', 'attachments', data.treatment_id],
      })
      queryClient.invalidateQueries({
        queryKey: [
          'mock-tenant-id',
          'treatments',
          data.treatment_id,
          'attachments',
        ],
      })

      toast.success('Archivo subido exitosamente')
    },
    onError: (error) => {
      toast.error(error.message || 'Error al subir el archivo')
    },
  })
}
