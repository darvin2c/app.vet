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
  CreateProcedureSchema,
  createProcedureSchema,
} from '@/schemas/procedures.schema'
import useCreateProcedure from '@/hooks/procedures/use-create-procedure'

interface ProcedureCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProcedureCreate({ open, onOpenChange }: ProcedureCreateProps) {
  const createProcedure = useCreateProcedure()

  const form = useForm({
    resolver: zodResolver(createProcedureSchema),
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

  const onSubmit = async (data: CreateProcedureSchema) => {
    try {
      await createProcedure.mutateAsync({
        name: data.name,
        code: data.code,
        description: data.description,
        base_price: data.base_price,
        cdt_code: data.cdt_code,
        snomed_code: data.snomed_code,
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
      <DrawerContent className="!w-full !max-w-[600px]">
        <DrawerHeader>
          <DrawerTitle>Crear Nuevo Procedimiento</DrawerTitle>
          <DrawerDescription>
            Complete los datos del procedimiento médico. Los campos marcados con
            * son obligatorios.
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
            disabled={createProcedure.isPending}
          >
            {createProcedure.isPending ? 'Creando...' : 'Crear Procedimiento'}
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={createProcedure.isPending}
          >
            Cancelar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
