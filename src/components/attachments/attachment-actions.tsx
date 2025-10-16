'use client'

import { useState } from 'react'
import {
  MoreHorizontal,
  Eye,
  Download,
  Share2,
  Edit,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { AttachmentEdit } from './attachment-edit'
import { useAttachmentDelete } from '@/hooks/attachments/use-attachment-delete'
import {
  type AttachmentType,
  type AttachmentCategory,
} from '@/schemas/attachments.schema'

interface AttachmentActionsProps {
  attachment: {
    id: string
    file_name: string
    file_url: string
    file_type: string
    medical_record_id: string
    attachment_type: AttachmentType
    category?: AttachmentCategory
    description?: string
    tags: string[]
    is_sensitive: boolean
  }
  onSuccess?: () => void
}

export function AttachmentActions({
  attachment,
  onSuccess,
}: AttachmentActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const deleteMutation = useAttachmentDelete()

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(attachment.id)
      onSuccess?.()
    } catch (error) {
      // Error ya manejado en el hook
      console.error('Error deleting attachment:', error)
    }
  }

  const handleView = () => {
    window.open(attachment.file_url, '_blank')
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = attachment.file_url
    link.download = attachment.file_name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: attachment.file_name,
          text: attachment.description || 'Archivo médico compartido',
          url: attachment.file_url,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      // Fallback: copiar URL al clipboard
      try {
        await navigator.clipboard.writeText(attachment.file_url)
        // Aquí podrías mostrar un toast de éxito
        console.log('URL copiada al portapapeles')
      } catch (error) {
        console.error('Error copying to clipboard:', error)
      }
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleView}>
            <Eye className="h-4 w-4 mr-2" />
            Ver archivo
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Descargar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Compartir
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog de confirmación para eliminar */}
      <AlertConfirmation
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        title="Eliminar archivo"
        description={`¿Estás seguro de que deseas eliminar "${attachment.file_name}"? Esta acción no se puede deshacer.`}
        confirmText="ELIMINAR"
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />

      {/* Dialog de edición */}
      <AttachmentEdit
        attachment={attachment}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSuccess={() => {
          setShowEditDialog(false)
          onSuccess?.()
        }}
      />
    </>
  )
}
