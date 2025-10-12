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
import { PatientForm } from './patient-form'
import {
  CreatePatientSchema,
  createPatientSchema,
} from '@/schemas/patients.schema'
import useCreatePatient from '@/hooks/patients/use-create-patient'

interface PatientCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PatientCreate({ open, onOpenChange }: PatientCreateProps) {
  const createPatient = useCreatePatient()

  const form = useForm({
    resolver: zodResolver(createPatientSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: null,
      phone: null,
      date_of_birth: null,
      sex: null,
      address: null,
      allergies: null,
      systemic_diseases: null,
      is_active: true,
    },
  })

  const onSubmit = async (data: CreatePatientSchema) => {
    try {
      await createPatient.mutateAsync({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        date_of_birth: data.date_of_birth,
        sex: data.sex,
        address: data.address,
        allergies: data.allergies,
        systemic_diseases: data.systemic_diseases,
        is_active: data.is_active,
      })
      form.reset()
      onOpenChange(false)
    } catch (error) {
      // Error is handled by the mutation
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="!w-full !max-w-2lx">
        <DrawerHeader>
          <DrawerTitle>Crear Nuevo Paciente</DrawerTitle>
          <DrawerDescription>
            Complete los datos del paciente. Los campos marcados con * son
            obligatorios.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 overflow-y-auto">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit as any)}
              className="space-y-4"
            >
              <PatientForm />
            </form>
          </Form>
        </div>

        <DrawerFooter>
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit as any)}
            disabled={createPatient.isPending}
          >
            {createPatient.isPending ? 'Creando...' : 'Crear Paciente'}
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={createPatient.isPending}
          >
            Cancelar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
