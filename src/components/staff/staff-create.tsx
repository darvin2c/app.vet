'use client'

import { useState } from 'react'
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
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Form } from '@/components/ui/form'

import { StaffForm } from './staff-form'
import { StaffSchema, type StaffSchemaType } from '@/schemas/staff.schema'
import { useStaffCreate } from '@/hooks/staff/use-staff-create'

interface StaffCreateProps {
  children?: React.ReactNode
}

export function StaffCreate({ children }: StaffCreateProps) {
  const [open, setOpen] = useState(false)
  const mutation = useStaffCreate()

  const form = useForm<StaffSchemaType>({
    resolver: zodResolver(StaffSchema),
  })

  const onSubmit = async (data: StaffSchemaType) => {
    await mutation.mutateAsync(data)
    form.reset()
    setOpen(false)
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="!max-w-4xl">
        <DrawerHeader>
          <DrawerTitle>Crear Personal</DrawerTitle>
          <DrawerDescription>
            Completa los datos para crear un nuevo miembro del personal.
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4">
            <div className="px-4">
              <StaffForm />
            </div>
            <DrawerFooter>
              <Button
                type="submit"
                onClick={form.handleSubmit(onSubmit as any)}
                disabled={mutation.isPending}
              >
                Crear Personal
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
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
