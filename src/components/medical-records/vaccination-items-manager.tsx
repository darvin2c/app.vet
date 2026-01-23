'use client'

import { useState } from 'react'
import {
  useFieldArray,
  useFormContext,
  useForm,
  FormProvider,
} from 'react-hook-form'
import { Plus, Trash2, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { MedicalRecordItemForm } from '@/components/medical-record-items/medical-record-item-form'
import {
  MedicalRecordItemSchema,
  MedicalRecordItemFormData,
} from '@/schemas/medical-record-items.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import useProduct from '@/hooks/products/use-product'

export function VaccinationItemsManager() {
  const [isOpen, setIsOpen] = useState(false)
  const { control } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  // Formulario local para agregar nuevos items
  const itemForm = useForm<Omit<MedicalRecordItemFormData, 'record_id'>>({
    resolver: zodResolver(MedicalRecordItemSchema.omit({ record_id: true })),
    defaultValues: {
      qty: 1,
      product_id: '',
      unit_price: 0,
      discount: 0,
      notes: '',
    },
  })

  // Necesitamos el nombre del producto para mostrarlo en la tabla
  // ya que MedicalRecordItemForm solo maneja el ID
  const productId = itemForm.watch('product_id')
  const { data: product } = useProduct(productId)

  const onAddItem = (data: any) => {
    append({
      product_id: data.product_id,
      qty: data.qty,
      unit_price: data.unit_price,
      discount: data.discount,
      notes: data.notes,
      product_name: product?.name || 'Desconocido', // Guardamos el nombre para UI
    })

    // Reset fields
    itemForm.reset({
      qty: 1,
      product_id: '',
      unit_price: 0,
      discount: 0,
      notes: '',
    })
    setIsOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-medium">
          <Package className="h-4 w-4" />
          Consumibles / Items
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Agregar Consumible</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <FormProvider {...itemForm}>
                <div className="space-y-4">
                  <MedicalRecordItemForm />
                </div>
              </FormProvider>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="button" onClick={itemForm.handleSubmit(onAddItem)}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {fields.length > 0 && (
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead className="w-24 text-center">Cant.</TableHead>
                <TableHead className="w-32 text-right">Precio U.</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field: any, index) => (
                <TableRow key={field.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{field.product_name}</span>
                      {field.notes && (
                        <span className="text-xs text-muted-foreground">
                          {field.notes}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{field.qty}</TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat('es-PE', {
                      style: 'currency',
                      currency: 'PEN',
                    }).format(field.unit_price)}
                    {field.discount > 0 && (
                      <div className="text-xs text-destructive">
                        -
                        {new Intl.NumberFormat('es-PE', {
                          style: 'currency',
                          currency: 'PEN',
                        }).format(field.discount)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-end pr-4 text-sm font-medium">
            <span>
              Total:{' '}
              {new Intl.NumberFormat('es-PE', {
                style: 'currency',
                currency: 'PEN',
              }).format(
                fields.reduce(
                  (acc, item: any) =>
                    acc + item.qty * item.unit_price - (item.discount || 0),
                  0
                )
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
