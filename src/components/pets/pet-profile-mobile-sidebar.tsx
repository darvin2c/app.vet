import { Phone, Mail, MapPin, User, Calendar, Heart, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer'
import { Tables } from '@/types/supabase.types'
import { PetInfoField } from './pet-info-field'
import { formatDate } from '@/lib/pet-utils'

type PetDetail = Tables<'pets'> & {
  customers: Tables<'customers'> | null
  breeds:
    | (Tables<'breeds'> & {
        species: Tables<'species'> | null
      })
    | null
  species: Tables<'species'> | null
}

interface PetProfileMobileSidebarProps {
  pet: PetDetail
  appointmentsCount?: number
  medicalRecordsCount?: number
  isOpen: boolean
  onClose: () => void
}

export function PetProfileMobileSidebar({
  pet,
  appointmentsCount = 0,
  medicalRecordsCount = 0,
  isOpen,
  onClose,
}: PetProfileMobileSidebarProps) {
  const customer = pet.customers

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DrawerTitle>Información de {pet.name}</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="px-4 pb-6 space-y-6 overflow-y-auto">
          {/* Estadísticas Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Heart className="h-5 w-5" />
                Resumen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {appointmentsCount}
                  </div>
                  <div className="text-xs text-muted-foreground">Citas</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {medicalRecordsCount}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Registros Médicos
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <PetInfoField
                  label="Registrado"
                  value={formatDate(pet.created_at)}
                />
                <PetInfoField
                  label="Última actualización"
                  value={formatDate(pet.updated_at)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Información del Propietario */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                Propietario
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {customer ? (
                <>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {customer.first_name?.charAt(0)?.toUpperCase()}
                        {customer.last_name?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {customer.first_name} {customer.last_name}
                      </p>
                      {customer.doc_id && (
                        <p className="text-sm text-muted-foreground">
                          ID: {customer.doc_id}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {customer.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{customer.phone}</span>
                      </div>
                    )}

                    {customer.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{customer.email}</span>
                      </div>
                    )}

                    {customer.address && (
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span className="text-sm">{customer.address}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Phone className="h-4 w-4 mr-2" />
                      Llamar
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No hay información del propietario disponible
                </p>
              )}
            </CardContent>
          </Card>

          {/* Información Adicional */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información Adicional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <PetInfoField label="Color" value={pet.color} />
              <PetInfoField
                label="Peso"
                value={pet.weight ? `${pet.weight} kg` : undefined}
              />
              <PetInfoField label="Microchip" value={pet.microchip} />
              {pet.notes && <PetInfoField label="Notas" value={pet.notes} />}
            </CardContent>
          </Card>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
