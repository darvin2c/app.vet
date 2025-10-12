'use client'

import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from '@/components/ui/drawer'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { StaffSpecialtyForm } from './staff-specialty-form'
import { CreateStaffSpecialtySchema, createStaffSpecialtySchema } from '@/schemas/staff-specialties.schema'
import useStaffSpecialtyCreate from '@/hooks/staff-specialties/use-staff-specialty-create'
import { Plus } from 'lucide-react'

interface StaffSpecialtyCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  staffId?: string
  specialtyId?: string
}

export function StaffSpecialtyCreate({ 
  open, 
  onOpenChange, 
  staffId, 
  specialtyId 
}: StaffSpecialtyCreateProps) {
  const { mutate: createStaffSpecialty, isPending } = useStaffSpecialtyCreate()
  
  const form = useForm<CreateStaffSpecialtySchema>({
    resolver: zodResolver(createStaffSpecialtySchema),
    defaultValues: {
      staff_id: staffId || '',
      specialty_id: specialtyId || '',
    },
  })

  const onSubmit = (data: CreateStaffSpecialtySchema) => {
    createStaffSpecialty(data, {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
    })
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Asignar Especialidad</DrawerTitle>
          <DrawerDescription>
            Asigna una especialidad a un miembro del staff
          </DrawerDescription>
        </DrawerHeader>
        
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-4">
            <StaffSpecialtyForm />
            
            <DrawerFooter>
              <ResponsiveButton
                type="submit"
                isLoading={isPending}
                disabled={isPending}
                icon={Plus}
              >
                Asignar Especialidad
              </ResponsiveButton>
              <ResponsiveButton
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
                icon={Plus}
              >
                Cancelar
              </ResponsiveButton>
            </DrawerFooter>
          </form>
        </FormProvider>
      </DrawerContent>
    </Drawer>
  )
}