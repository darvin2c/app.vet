import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

// Mock function para simular la eliminación de attachments
const mockDeleteAttachment = async (id: string) => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 600))

  // Simular error ocasional para testing
  if (Math.random() < 0.05) {
    throw new Error('Error al eliminar el archivo')
  }

  // Simular eliminación exitosa
  return { id, deleted: true }
}

export function useAttachmentDelete() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: mockDeleteAttachment,
    onSuccess: (data) => {
      // Invalidar todas las queries de attachments
      queryClient.invalidateQueries({
        queryKey: ['mock-tenant-id', 'attachments'],
      })
      queryClient.invalidateQueries({
        queryKey: ['mock-tenant-id', 'treatments'],
      })

      toast.success('Archivo eliminado exitosamente')
    },
    onError: (error) => {
      toast.error(error.message || 'Error al eliminar el archivo')
    },
  })
}
