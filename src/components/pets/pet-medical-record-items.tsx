import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Package, DollarSign, Hash } from 'lucide-react'
import { useMedicalRecordItemListByPet } from '@/hooks/medical-record-items/use-medical-record-item-list-by-pet'
import { Tables } from '@/types/supabase.types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { MedicalRecordItemActions } from '@/components/medical-record-items/medical-record-item-actions'

interface PetMedicalRecordItemsProps {
  petId: string
}

export function PetMedicalRecordItems({ petId }: PetMedicalRecordItemsProps) {
  const { data: medicalRecordItems = [], isLoading } =
    useMedicalRecordItemListByPet(petId)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Medicamentos</h3>
          <Skeleton className="h-9 w-36" />
        </div>
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (medicalRecordItems.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Medicamentos</h3>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              No hay productos de registro médico registrados
            </h3>
            <p className="text-sm text-muted-foreground">
              Este paciente no tiene productos de registro médico en su
              historial médico.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Medicamentos</h3>
      </div>
      {medicalRecordItems.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">
                  {item.products?.name || 'Producto'}
                </CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">Producto</Badge>
                </div>
              </div>
              <MedicalRecordItemActions medicalRecordItem={item} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Cantidad:</strong> {item.qty}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Precio unitario:</strong> ${item.unit_price}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Total:</strong> $
                  {(item.qty * item.unit_price).toFixed(2)}
                </span>
              </div>
            </div>

            {item.products && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Información del Producto</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                    {item.products.sku && (
                      <div>
                        <strong>SKU:</strong> {item.products.sku}
                      </div>
                    )}
                    {item.products.barcode && (
                      <div>
                        <strong>Código de barras:</strong>{' '}
                        {item.products.barcode}
                      </div>
                    )}
                    {item.products.batch_number && (
                      <div>
                        <strong>Lote:</strong> {item.products.batch_number}
                      </div>
                    )}
                    {item.products.expiry_date && (
                      <div>
                        <strong>Fecha de vencimiento:</strong>{' '}
                        {format(new Date(item.products.expiry_date), 'PPP', {
                          locale: es,
                        })}
                      </div>
                    )}
                    <div>
                      <strong>Stock:</strong> {item.products.stock}
                    </div>
                    <div>
                      <strong>Precio:</strong> ${item.products.price}
                    </div>
                  </div>
                  {item.products.notes && (
                    <div className="mt-2">
                      <strong>Notas:</strong>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.products.notes}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            {item.notes && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Notas del Item</h4>
                  <p className="text-sm text-muted-foreground">{item.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
