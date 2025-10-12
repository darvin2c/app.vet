'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { StaffSpecialtyCreate } from './staff-specialty-create'

interface StaffSpecialtyCreateButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  staffId?: string
  specialtyId?: string
}

export function StaffSpecialtyCreateButton({ 
  variant = 'default', 
  size = 'default',
  staffId,
  specialtyId
}: StaffSpecialtyCreateButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ResponsiveButton
        variant={variant}
        size={size}
        onClick={() => setOpen(true)}
        icon={Plus}
      >
        Asignar Especialidad
      </ResponsiveButton>
      
      <StaffSpecialtyCreate
        open={open}
        onOpenChange={setOpen}
        staffId={staffId}
        specialtyId={specialtyId}
      />
    </>
  )
}