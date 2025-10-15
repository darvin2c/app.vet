import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { UpdateAttachmentSchema } from '@/schemas/attachments.schema'

// Mock function para simular la actualización de attachments
const mockUpdateAttachment = async ({
  id,
  data,
}: {
  id: string
  data: UpdateAttachmentSchema
}) => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Simular error ocasional para testing
  if (Math.random() < 0.05) {
    throw new Error('Error al actualizar el archivo')
  }

  // Simular attachment actualizado
  const updatedAttachment = {
    id,
    treatment_id: 'treatment_001', // Mock treatment_id
    file_name: data.file_name || 'archivo_actualizado.pdf',
    file_size: 1024000, // Mock size
    file_type: 'application/pdf', // Mock type
    file_url:
      'https://mock-storage.example.com/attachments/archivo_actualizado.pdf',
    attachment_type: data.attachment_type || ('document' as const),
    category: data.category,
    description: data.description || '',
    tags: data.tags || [],
    is_sensitive: data.is_sensitive || false,
    uploaded_by: 'mock-user-id',
    tenant_id: 'mock-tenant-id',
    created_at: '2024-12-19T10:00:00Z', // Mock created date
    created_by: 'mock-user-id',
    updated_at: new Date().toISOString(),
    updated_by: 'mock-user-id',
  }

  return updatedAttachment
}

export function useAttachmentUpdate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: mockUpdateAttachment,
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({
        queryKey: ['mock-tenant-id', 'attachments'],
      })
      queryClient.invalidateQueries({
        queryKey: [
          'mock-tenant-id',
          'treatments',
          data.treatment_id,
          'attachments',
        ],
      })

      toast.success('Archivo actualizado exitosamente')
    },
    onError: (error) => {
      toast.error(error.message || 'Error al actualizar el archivo')
    },
  })
}
