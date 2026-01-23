'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { FormSheet } from '@/components/ui/form-sheet'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { VaccinationForm } from './vaccination-form'
import {
  VaccinationSchema,
  VaccinationFormData,
} from '@/schemas/vaccinations.schema'
import { useVaccinationUpdate } from '@/hooks/vaccinations/use-vaccination-update'
import { Tables } from '@/types/supabase.types'
import { Form } from '@/components/ui/form'

interface VaccinationEditProps {
  vaccination: Tables<'pet_vaccinations'>
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function VaccinationEdit({
  vaccination,
  trigger,
  open,
  onOpenChange,
}: VaccinationEditProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const updateVaccination = useVaccinationUpdate()

  const isOpen = open ?? internalOpen
  const setOpen = onOpenChange ?? setInternalOpen

  const form = useForm<VaccinationFormData>({
    resolver: zodResolver(VaccinationSchema),
    defaultValues: {
      clinical_record_id: vaccination.clinical_record_id,
      dose: vaccination.dose || '',
      route: vaccination.route || '',
      site: vaccination.site || '',
      next_due_at: vaccination.next_due_at || undefined,
      adverse_event: vaccination.adverse_event || '',
    },
  })

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      form.reset({
        clinical_record_id: vaccination.clinical_record_id,
        dose: vaccination.dose || '',
        route: vaccination.route || '',
        site: vaccination.site || '',
        next_due_at: vaccination.next_due_at || undefined,
        adverse_event: vaccination.adverse_event || '',
      })
    }
  }

  const onSubmit = async (data: VaccinationFormData) => {
    try {
      await updateVaccination.mutateAsync({
        id: vaccination.id,
        data,
      })
      handleOpenChange(false)
    } catch (error) {
      // Error is handled in the hook
    }
  }

  useEffect(() => {
    if (isOpen) {
      form.reset({
        clinical_record_id: vaccination.clinical_record_id,
        dose: vaccination.dose || '',
        route: vaccination.route || '',
        site: vaccination.site || '',
        next_due_at: vaccination.next_due_at || undefined,
        adverse_event: vaccination.adverse_event || '',
      })
    }
  }, [isOpen, vaccination, form])

  return (
    <>
      {trigger && <div onClick={() => setOpen(true)}>{trigger}</div>}

      <FormSheet
        open={isOpen}
        onOpenChange={handleOpenChange}
        title="Editar Vacunación"
        description="Modifica los detalles de la vacunación"
        form={form as any}
        onSubmit={onSubmit as any}
        isPending={updateVaccination.isPending}
        submitLabel="Actualizar Vacunación"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-2xl"
      >
        <div className="px-4 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <VaccinationForm />
              <ResponsiveButton type="submit" className="sr-only">
                Actualizar Vacunación
              </ResponsiveButton>
            </form>
          </Form>
        </div>
      </FormSheet>
    </>
  )
}
