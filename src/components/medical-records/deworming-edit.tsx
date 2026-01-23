'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormSheet } from '@/components/ui/form-sheet'
import { DewormingForm } from './deworming-form'
import { DewormingSchema, DewormingFormData } from '@/schemas/deworming.schema'
import { useDewormingUpdate } from '@/hooks/dewormings/use-deworming-update'
import { Tables } from '@/types/supabase.types'

interface DewormingEditProps {
  deworming: Tables<'pet_dewormings'>
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function DewormingEdit({
  deworming,
  trigger,
  open,
  onOpenChange,
}: DewormingEditProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const updateDeworming = useDewormingUpdate()

  const isOpen = open ?? internalOpen
  const setOpen = onOpenChange ?? setInternalOpen

  const form = useForm<DewormingFormData>({
    resolver: zodResolver(DewormingSchema) as any,
    defaultValues: {
      clinical_record_id: deworming.clinical_record_id,
      product: deworming.product || '',
      dose: deworming.dose || '',
      route: deworming.route || '',
      next_due_at: deworming.next_due_at || undefined,
      adverse_event: deworming.adverse_event || '',
    },
  })

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      form.reset({
        clinical_record_id: deworming.clinical_record_id,
        product: deworming.product || '',
        dose: deworming.dose || '',
        route: deworming.route || '',
        next_due_at: deworming.next_due_at || undefined,
        adverse_event: deworming.adverse_event || '',
      })
    }
  }

  const onSubmit = async (data: DewormingFormData) => {
    try {
      const { items, ...dewormingData } = data
      await updateDeworming.mutateAsync({
        id: deworming.id,
        data: dewormingData,
      })
      handleOpenChange(false)
    } catch (error) {
      // Error is handled in the hook
    }
  }

  useEffect(() => {
    if (isOpen) {
      form.reset({
        clinical_record_id: deworming.clinical_record_id,
        product: deworming.product || '',
        dose: deworming.dose || '',
        route: deworming.route || '',
        next_due_at: deworming.next_due_at || undefined,
        adverse_event: deworming.adverse_event || '',
      })
    }
  }, [isOpen, deworming, form])

  return (
    <>
      {trigger && <div onClick={() => setOpen(true)}>{trigger}</div>}

      <FormSheet
        open={isOpen}
        onOpenChange={handleOpenChange}
        title="Editar Desparasitación"
        description="Modifica los detalles de la desparasitación"
        form={form}
        onSubmit={onSubmit}
        isPending={updateDeworming.isPending}
        submitLabel="Actualizar Desparasitación"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-2xl"
      >
        <DewormingForm />
      </FormSheet>
    </>
  )
}
