'use client'

import { useState } from 'react'
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
  SheetTrigger,
} from '@/components/ui/sheet'
import { Form } from '@/components/ui/form'

import { StaffForm } from './staff-form'
import {
  createStaffSchema,
  type CreateStaffSchema,
} from '@/schemas/staff.schema'
import useCreateStaff from '@/hooks/staff/use-staff-create'

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

  const form = useForm<CreateStaffSchema>({
    resolver: zodResolver(createStaffSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      license_number: '',
      user_id: null,
      is_active: true,
    },
  })

  const onSubmit = async (data: CreateStaffSchema) => {
    await mutation.mutateAsync(data)
    form.reset()
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="!max-w-4xl">
        <SheetHeader>
          <SheetTitle>Crear Personal</SheetTitle>
          <SheetDescription>
            Completa los datos para crear un nuevo miembro del personal.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="px-4">
              <StaffForm />
            </div>
            <SheetFooter>
              <Button
                type="submit"
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
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
