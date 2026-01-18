'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { FormSheet } from '@/components/ui/form-sheet'

import { StaffForm } from './staff-form'
import useCreateStaff from '@/hooks/staff/use-staff-create'
import { Separator } from '../ui/separator'
import { staffCreateSchema } from '@/schemas/staff.schema'
import CanAccess from '@/components/ui/can-access'

interface StaffCreateProps {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function StaffCreate({
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: StaffCreateProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen ?? internalOpen
  const setOpen = controlledOnOpenChange ?? setInternalOpen
  const mutation = useCreateStaff()

  const form = useForm({
    resolver: zodResolver(staffCreateSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      address: '',
      license_number: '',
      user_id: undefined,
      is_active: true,
    },
  })
  const { reset, handleSubmit } = form
  const onSubmit = handleSubmit(async (data) => {
    await mutation.mutateAsync(data)
    reset()
    setOpen(false)
  })

  return (
    <CanAccess resource="products" action="create">
      <FormSheet
        open={open as boolean}
        onOpenChange={setOpen as any}
        trigger={children as any}
        title="Crear Personal"
        description="Completa los datos para crear un nuevo miembro del personal."
        form={form as any}
        onSubmit={onSubmit as any}
        isPending={mutation.isPending}
        submitLabel="Crear Personal"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-2xl"
      >
        <div className="px-4">
          <StaffForm />
        </div>
        <Separator className="mt-4" />
      </FormSheet>
    </CanAccess>
  )
}
