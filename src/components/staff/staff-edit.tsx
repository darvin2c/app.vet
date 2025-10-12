'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer-form'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { StaffForm } from './staff-form'
import { UpdateStaffSchema, updateStaffSchema } from '@/schemas/staff.schema'
import useUpdateStaff from '@/hooks/staff/use-staff-update'
import { Tables } from '@/types/supabase.types'
import useStaffSpecialties from '@/hooks/staff-specialties/use-staff-specialty-list'
import { useEffect } from 'react'

interface StaffEditProps {
  staff: Tables<'staff'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StaffEdit({ staff, open, onOpenChange }: StaffEditProps) {
  const updateStaff = useUpdateStaff()
  const { data: staffSpecialties } = useStaffSpecialties(staff.id)

  const form = useForm({
    resolver: zodResolver(updateStaffSchema),
    defaultValues: {
      full_name: staff.full_name,
      email: staff.email,
      phone: staff.phone,
      license_number: staff.license_number,
      specialty_ids: [],
      is_active: staff.is_active,
    },
  })

  // Actualizar specialty_ids cuando se cargan las especialidades
  useEffect(() => {
    if (staffSpecialties) {
      form.setValue(
        'specialty_ids',
        staffSpecialties.map((s) => s.id)
      )
    }
  }, [staffSpecialties, form])

  const onSubmit = async (data: UpdateStaffSchema) => {
    try {
      await updateStaff.mutateAsync({
        id: staff.id,
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        license_number: data.license_number,
        is_active: data.is_active,
        specialty_ids: data.specialty_ids,
      })
      onOpenChange(false)
    } catch (error) {
      // Error ya manejado en el hook
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="!w-full !max-w-[600px]">
        <DrawerHeader>
          <DrawerTitle>Editar Miembro del Staff</DrawerTitle>
          <DrawerDescription>
            Modifica la información del miembro del staff.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 overflow-y-auto">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit as any)}
              className="space-y-4"
            >
              <StaffForm />
            </form>
          </Form>
        </div>

        <DrawerFooter>
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit as any)}
            disabled={updateStaff.isPending}
          >
            {updateStaff.isPending ? 'Actualizando...' : 'Actualizar Staff'}
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={updateStaff.isPending}
          >
            Cancelar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
