'use client'

import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Drawer } from '@/components/ui/drawer-form'
import { DrawerFooter } from '@/components/ui/drawer'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { SupplierForm } from './supplier-form'
import {
  CreateSupplierSchema,
  createSupplierSchema,
} from '@/schemas/suppliers.schema'
import useSupplierCreate from '@/hooks/suppliers/use-supplier-create'
import { Plus } from 'lucide-react'

interface SupplierCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SupplierCreate({ open, onOpenChange }: SupplierCreateProps) {
  const { mutate: createSupplier, isPending } = useSupplierCreate()

  const form = useForm<CreateSupplierSchema>({
    resolver: zodResolver(createSupplierSchema),
    defaultValues: {
      name: '',
      contact_person: '',
      email: '',
      phone: '',
      address: '',
      document_number: '',
      website: '',
      notes: '',
    },
  })

  const onSubmit = (data: CreateSupplierSchema) => {
    createSupplier(data, {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
    })
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <SupplierForm />

          <DrawerFooter>
            <ResponsiveButton
              type="submit"
              isLoading={isPending}
              disabled={isPending}
              icon={Plus}
            >
              Crear Proveedor
            </ResponsiveButton>
            <ResponsiveButton
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </ResponsiveButton>
          </DrawerFooter>
        </form>
      </FormProvider>
    </Drawer>
  )
}
