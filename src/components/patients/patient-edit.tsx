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
  UpdatePatientSchema,
  updatePatientSchema,
} from '@/schemas/patients.schema'
import useUpdatePatient from '@/hooks/patients/use-update-patient'
import { Database } from '@/types/supabase.types'
import { useEffect } from 'react'

type Patient = Database['public']['Tables']['patients']['Row']

interface PatientEditProps {
  patient: Patient
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PatientEdit({ patient, open, onOpenChange }: PatientEditProps) {
  const updatePatient = useUpdatePatient()

  const form = useForm({
    resolver: zodResolver(updatePatientSchema),
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

  // Cargar datos del paciente cuando se abre el drawer
  useEffect(() => {
    if (open && patient) {
      form.reset({
        first_name: patient.first_name || '',
        last_name: patient.last_name || '',
        email: patient.email || null,
        phone: patient.phone || null,
        date_of_birth: patient.date_of_birth || null,
        sex: patient.sex || null,
        address: patient.address || null,
        allergies: patient.allergies || null,
        systemic_diseases: patient.systemic_diseases || null,
        is_active: patient.is_active ?? true,
      })
    }
  }, [open, patient, form])

  const onSubmit = async (data: UpdatePatientSchema) => {
    try {
      await updatePatient.mutateAsync({
        id: patient.id,
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
      onOpenChange(false)
    } catch (error) {
      // Error is handled by the mutation
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="!w-full !max-w-3xl">
        <DrawerHeader>
          <DrawerTitle>Editar Paciente</DrawerTitle>
          <DrawerDescription>
            Modifique los datos del paciente. Los campos marcados con * son
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
            disabled={updatePatient.isPending}
          >
            {updatePatient.isPending
              ? 'Actualizando...'
              : 'Actualizar Paciente'}
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={updatePatient.isPending}
          >
            Cancelar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
