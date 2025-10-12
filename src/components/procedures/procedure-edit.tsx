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
import { ProcedureForm } from './procedure-form'
import {
  UpdateProcedureSchema,
  updateProcedureSchema,
} from '@/schemas/procedures.schema'
import useUpdateProcedure from '@/hooks/procedures/use-update-procedure'
import { Database } from '@/types/supabase.types'
import { useEffect } from 'react'

type Procedure = Database['public']['Tables']['procedures']['Row']

interface ProcedureEditProps {
  procedure: Procedure
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProcedureEdit({
  procedure,
  open,
  onOpenChange,
}: ProcedureEditProps) {
  const updateProcedure = useUpdateProcedure()

  const form = useForm({
    resolver: zodResolver(updateProcedureSchema),
    defaultValues: {
      name: '',
      code: '',
      description: null,
      base_price: null,
      cdt_code: null,
      snomed_code: null,
      is_active: true,
    },
  })

  // Cargar datos del procedimiento cuando se abre el drawer
  useEffect(() => {
    if (open && procedure) {
      form.reset({
        name: procedure.name || '',
        code: procedure.code || '',
        description: procedure.description || null,
        base_price: procedure.base_price || null,
        cdt_code: procedure.cdt_code || null,
        snomed_code: procedure.snomed_code || null,
        is_active: procedure.is_active ?? true,
      })
    }
  }, [open, procedure, form])

  const onSubmit = async (data: UpdateProcedureSchema) => {
    try {
      await updateProcedure.mutateAsync({
        id: procedure.id,
        name: data.name,
        code: data.code,
        description: data.description,
        base_price: data.base_price,
        cdt_code: data.cdt_code,
        snomed_code: data.snomed_code,
        is_active: data.is_active,
      })
      onOpenChange(false)
    } catch (error) {
      // Error is handled by the mutation
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Editar Procedimiento</DrawerTitle>
          <DrawerDescription>
            Modifique los datos del procedimiento médico. Los campos marcados
            con * son obligatorios.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 overflow-y-auto">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit as any)}
              className="space-y-4"
            >
              <ProcedureForm />
            </form>
          </Form>
        </div>

        <DrawerFooter>
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit as any)}
            disabled={updateProcedure.isPending}
          >
            {updateProcedure.isPending
              ? 'Actualizando...'
              : 'Actualizar Procedimiento'}
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={updateProcedure.isPending}
          >
            Cancelar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
