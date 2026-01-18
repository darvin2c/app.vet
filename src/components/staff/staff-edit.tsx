'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { FormSheet } from '@/components/ui/form-sheet'

import { StaffForm } from './staff-form'
import useStaffUpdate from '@/hooks/staff/use-staff-update'
import { Tables } from '@/types/supabase.types'
import { Separator } from '../ui/separator'
import { staffUpdateSchema } from '@/schemas/staff.schema'

interface StaffEditProps {
  staff: Tables<'staff'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StaffEdit({ staff, open, onOpenChange }: StaffEditProps) {
  const mutation = useStaffUpdate()

  const form = useForm({
    resolver: zodResolver(staffUpdateSchema),
    defaultValues: {
      first_name: staff.first_name || '',
      last_name: staff.last_name || '',
      email: staff.email || undefined,
      phone: staff.phone || undefined,
      license_number: staff.license_number || undefined,
      user_id: staff.user_id || undefined,
      is_active: staff.is_active,
    },
  })

  useEffect(() => {
    if (staff) {
      form.reset({
        first_name: staff.first_name || '',
        last_name: staff.last_name || '',
        email: staff.email || undefined,
        phone: staff.phone || undefined,
        license_number: staff.license_number || undefined,
        user_id: staff.user_id || undefined,
        is_active: staff.is_active,
      })
    }
  }, [staff, form])

  const { handleSubmit, reset } = form

  const onSubmit = handleSubmit(async (data) => {
    await mutation.mutateAsync({
      id: staff.id,
      data: data,
    })
    onOpenChange(false)
    reset()
  })

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Editar Personal"
      description="Modifica los datos del miembro del personal."
      form={form as any}
      onSubmit={onSubmit as any}
      isPending={mutation.isPending}
      submitLabel="Actualizar Personal"
      cancelLabel="Cancelar"
      side="right"
      className="!max-w-2xl"
    >
      <div className="px-4 ">
        <StaffForm />
      </div>
      <Separator className="mt-4" />
    </FormSheet>
  )
}
