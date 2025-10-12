import { useFormContext } from 'react-hook-form'
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field'
import { SupplierSelect } from '@/components/suppliers/supplier-select'
import { ProductBrandSelect } from '@/components/product-brands/product-brand-select'
import { CreateSupplierBrandSchema } from '@/schemas/supplier-brands.schema'

export function SupplierBrandForm() {
  const {
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<CreateSupplierBrandSchema>()

  const supplierId = watch('supplier_id')
  const brandId = watch('brand_id')

  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel htmlFor="supplier_id">Proveedor</FieldLabel>
        <FieldContent>
          <SupplierSelect
            value={supplierId}
            onValueChange={(value) => setValue('supplier_id', value)}
          />
          <FieldError errors={[errors.supplier_id]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="brand_id">Marca</FieldLabel>
        <FieldContent>
          <ProductBrandSelect
            value={brandId}
            onValueChange={(value) => setValue('brand_id', value)}
          />
          <FieldError errors={[errors.brand_id]} />
        </FieldContent>
      </Field>
    </div>
  )
}