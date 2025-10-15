'use client'

import { useState } from 'react'
import { AttachmentCreate } from './attachment-create'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { Plus, Upload } from 'lucide-react'

interface AttachmentCreateButtonProps {
  treatmentId: string
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
  size?: 'sm' | 'default' | 'lg'
  showIcon?: boolean
  children?: React.ReactNode
}

export function AttachmentCreateButton({
  treatmentId,
  variant = 'default',
  size = 'default',
  showIcon = true,
  children,
}: AttachmentCreateButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ResponsiveButton
        variant={variant}
        size={size}
        onClick={() => setOpen(true)}
      >
        {showIcon && <Upload className="h-4 w-4 mr-2" />}
        {children || 'Subir archivo'}
      </ResponsiveButton>

      <AttachmentCreate
        treatmentId={treatmentId}
        open={open}
        onOpenChange={setOpen}
        onSuccess={() => setOpen(false)}
      />
    </>
  )
}

// Variante específica para agregar múltiples archivos
export function AttachmentCreateMultipleButton({
  treatmentId,
  variant = 'outline',
  size = 'default',
}: Omit<AttachmentCreateButtonProps, 'children'>) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ResponsiveButton
        variant={variant}
        size={size}
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4 mr-2" />
        Agregar archivos
      </ResponsiveButton>

      <AttachmentCreate
        treatmentId={treatmentId}
        open={open}
        onOpenChange={setOpen}
        onSuccess={() => setOpen(false)}
        allowMultiple
      />
    </>
  )
}
