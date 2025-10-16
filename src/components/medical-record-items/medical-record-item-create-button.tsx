'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { MedicalRecordItemCreate } from './medical-record-item-create'

interface MedicalRecordItemCreateButtonProps {
  medicalRecordId: string
}

export function MedicalRecordItemCreateButton({
  medicalRecordId,
}: MedicalRecordItemCreateButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <ResponsiveButton
        size="sm"
        icon={Plus}
        tooltip="Nuevo Item"
        onClick={() => setOpen(true)}
      >
        Nuevo Item
      </ResponsiveButton>

      <MedicalRecordItemCreate
        open={open}
        onOpenChange={setOpen}
        medicalRecordId={medicalRecordId}
      />
    </>
  )
}
