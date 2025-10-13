'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Form } from '@/components/ui/form'

import { StaffForm } from './staff-form'
import { StaffSchema, type StaffSchemaType } from '@/schemas/staff.schema'
import { useStaffUpdate } from '@/hooks/staff/use-staff-update'
import { Tables } from '@/types/supabase.types'

interface StaffEditProps {
  staff: Tables<'staff'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StaffEdit({ staff, open, onOpenChange }: StaffEditProps) {
  const mutation = useStaffUpdate()

  const form = useForm<StaffSchemaType>({
    resolver: zodResolver(StaffSchema),
    defaultValues: {
      full_name: staff.full_name,
      email: staff.email,
      phone: staff.phone,
      license_number: staff.license_number,
      is_active: staff.is_active,
    },
  })

  useEffect(() => {
    if (staff) {
      form.reset({
        full_name: staff.full_name,
        email: staff.email,
        phone: staff.phone,
        license_number: staff.license_number,
        is_active: staff.is_active,
      })
    }
  }, [staff, form])

  const onSubmit = async (data: StaffSchemaType) => {
    await mutation.mutateAsync({
      id: staff.id,
      data,
    })
    onOpenChange(false)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="!w-full !max-w-4xl">
        <DrawerHeader>
          <DrawerTitle>Editar Personal</DrawerTitle>
          <DrawerDescription>
            Modifica los datos del miembro del personal.
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4">
            <div className="px-4 overflow-y-auto">
              <StaffForm />
            </div>
            <DrawerFooter>
              <Button
                type="submit"
                onClick={form.handleSubmit(onSubmit as any)}
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
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  )
}
