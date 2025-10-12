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
import { CreateStaffSchema, createStaffSchema } from '@/schemas/staff.schema'
import useCreateStaff from '@/hooks/staff/use-staff-create'

interface StaffCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StaffCreate({ open, onOpenChange }: StaffCreateProps) {
  const createStaff = useCreateStaff()

  const form = useForm({
    resolver: zodResolver(createStaffSchema),
    defaultValues: {
      full_name: '',
      email: null,
      phone: null,
      license_number: null,
      specialty_ids: [],
      is_active: true,
    },
  })

  const onSubmit = async (data: CreateStaffSchema) => {
    try {
      await createStaff.mutateAsync({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        license_number: data.license_number,
        is_active: data.is_active,
        specialty_ids: data.specialty_ids,
      })
      form.reset()
      onOpenChange(false)
    } catch (error) {
      // Error ya manejado en el hook
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="!w-full !max-w-[600px]">
        <DrawerHeader>
          <DrawerTitle>Crear Miembro del Staff</DrawerTitle>
          <DrawerDescription>
            Completa la información para agregar un nuevo miembro al staff.
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
            disabled={createStaff.isPending}
          >
            {createStaff.isPending ? 'Creando...' : 'Crear Staff'}
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={createStaff.isPending}
          >
            Cancelar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
