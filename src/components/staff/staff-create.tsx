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
import useCreateStaff from '@/hooks/staff/use-staff-create'
import { Separator } from '../ui/separator'
import { ScrollArea } from '../ui/scroll-area'
import { staffCreateSchema } from '@/schemas/staff.schema'

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
    <Sheet open={open} onOpenChange={setOpen}>
      {children && <SheetTrigger asChild>{children}</SheetTrigger>}
      <SheetContent className="!w-full !max-w-2xl">
        <ScrollArea className="!h-full">
          <SheetHeader>
            <SheetTitle>Crear Personal</SheetTitle>
            <SheetDescription>
              Completa los datos para crear un nuevo miembro del personal.
            </SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <div className="px-4">
                <StaffForm />
              </div>
              <Separator className="mt-4" />
              <SheetFooter>
                <Button type="submit" disabled={mutation.isPending}>
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
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
