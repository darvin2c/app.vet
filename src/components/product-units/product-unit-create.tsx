'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import {
  CreateProductUnitSchema,
  createProductUnitSchema,
} from '@/schemas/product-units.schema'
import { Form } from '@/components/ui/form'
import { ProductUnitForm } from './product-unit-form'
import useCreateProductUnit from '@/hooks/product-units/use-create-product-unit'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerDescription,
} from '@/components/ui/drawer-form'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { Tables } from '@/types/supabase.types'
import { Plus } from 'lucide-react'

interface ProductUnitCreateProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onUnitCreated?: (unit: Tables<'product_units'>) => void
}

export function ProductUnitCreate({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onUnitCreated,
}: ProductUnitCreateProps) {
  const [internalOpen, setInternalOpen] = useState(false)

  // Use controlled props if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = controlledOnOpenChange || setInternalOpen
  const createProductUnit = useCreateProductUnit()

  const form = useForm<CreateProductUnitSchema>({
    resolver: zodResolver(createProductUnitSchema),
    defaultValues: {
      name: '',
      abbreviation: '',
      is_active: true,
    },
  })

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      form.reset()
    }
  }

  const onSubmit = async (data: CreateProductUnitSchema) => {
    try {
      const result = await createProductUnit.mutateAsync({
        name: data.name,
        abbreviation: data.abbreviation,
        is_active: data.is_active,
      })
      form.reset()
      handleOpenChange(false)
      if (onUnitCreated && result) {
        onUnitCreated(result)
      }
    } catch (error) {
      // Error ya manejado en el hook
    }
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      {/* Only show the trigger button if not controlled */}
      {controlledOpen === undefined && (
        <ResponsiveButton
          icon={Plus}
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          className="h-8 w-8 p-0"
          tooltip="Crear nueva unidad"
        />
      )}

      <DrawerContent className="!w-full !max-w-[600px]">
        <DrawerHeader>
          <DrawerTitle>Crear Unidad de Producto</DrawerTitle>
          <DrawerDescription>
            Completa la información para agregar una nueva unidad de producto.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 overflow-y-auto">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit as any)}
              className="space-y-4"
            >
              <ProductUnitForm />
            </form>
          </Form>
        </div>

        <DrawerFooter>
          <ResponsiveButton
            icon={Plus}
            type="submit"
            onClick={form.handleSubmit(onSubmit as any)}
            disabled={createProductUnit.isPending}
            isLoading={createProductUnit.isPending}
          >
            Crear Unidad
          </ResponsiveButton>
          <ResponsiveButton
            icon={Plus}
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={createProductUnit.isPending}
          >
            Cancelar
          </ResponsiveButton>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
