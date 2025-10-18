'use client'

import { useState } from 'react'
import { MoreHorizontalIcon, Plus } from 'lucide-react'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { MedicalRecordCreate } from './medical-record-create'
import { ButtonGroup } from '../ui/button-group'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import useRecordType from '@/hooks/medical-records/use-record-type'

interface MedicalRecordCreateButtonProps {
  petId: string
}

export function MedicalRecordCreateButton({
  petId,
}: MedicalRecordCreateButtonProps) {
  const [open, setOpen] = useState(false)
  const { recordTypes } = useRecordType()

  return (
    <>
      <ButtonGroup>
        <ResponsiveButton
          icon={Plus}
          tooltip="Nuevo Registro Médico"
          onClick={() => setOpen(true)}
        >
          Nuevo Registro Médico
        </ResponsiveButton>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <MoreHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {recordTypes.map((item) => (
              <DropdownMenuItem key={item.value}>
                {item.icon}
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
      <MedicalRecordCreate open={open} onOpenChange={setOpen} petId={petId} />
    </>
  )
}
