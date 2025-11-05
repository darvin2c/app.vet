'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Form } from '@/components/ui/form'

import { StaffForm } from './staff-form'
import {
  updateStaffSchema,
  type UpdateStaffSchema,
} from '@/schemas/staff.schema'
import useStaffUpdate from '@/hooks/staff/use-staff-update'
import { Tables } from '@/types/supabase.types'

interface StaffEditProps {
  staff: Tables<'staff'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StaffEdit({ staff, open, onOpenChange }: StaffEditProps) {
  const mutation = useStaffUpdate()

  const form = useForm<UpdateStaffSchema>({
    resolver: zodResolver(updateStaffSchema),
    defaultValues: {
      first_name: staff.first_name,
      last_name: staff.last_name,
      email: staff.email || undefined,
      phone: staff.phone,
      license_number: staff.license_number,
      user_id: staff.user_id,
      is_active: staff.is_active,
    },
  })

  useEffect(() => {
    if (staff) {
      form.reset({
        first_name: staff.first_name,
        last_name: staff.last_name,
        email: staff.email || undefined,
        phone: staff.phone,
        license_number: staff.license_number,
        user_id: staff.user_id,
        is_active: staff.is_active,
      })
    }
  }, [staff, form])

  const onSubmit = async (data: UpdateStaffSchema) => {
    await mutation.mutateAsync({
      id: staff.id,
      data,
    })
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="!w-full !max-w-4xl">
        <SheetHeader>
          <SheetTitle>Editar Personal</SheetTitle>
          <SheetDescription>
            Modifica los datos del miembro del personal.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="px-4 overflow-y-auto">
              <StaffForm />
            </div>
            <SheetFooter>
              <Button
                type="submit"
                disabled={mutation.isPending}
              >
                Actualizar Personal
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={mutation.isPending}
              >
                Cancelar
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
