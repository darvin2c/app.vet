'use client'

import {
  Phone,
  Mail,
  MapPin,
  X,
  Calendar,
  FileText,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer'
import { Tables } from '@/types/supabase.types'
import { formatDate } from '@/lib/pet-utils'
import { DateDisplay } from '@/components/ui/date-picker'
import Link from 'next/link'

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
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-lg">
              Información de {pet.name}
            </DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="px-4 py-6 space-y-6 overflow-y-auto">
          {/* Estadísticas */}
          <section className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Resumen
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-primary/5 border border-primary/10">
                <Calendar className="h-5 w-5 text-primary mb-1" />
                <div className="text-2xl font-bold text-primary">
                  {appointmentsCount}
                </div>
                <div className="text-xs text-muted-foreground">Citas</div>
              </div>
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-primary/5 border border-primary/10">
                <FileText className="h-5 w-5 text-primary mb-1" />
                <div className="text-2xl font-bold text-primary">
                  {medicalRecordsCount}
                </div>
                <div className="text-xs text-muted-foreground">Registros</div>
              </div>
            </div>
          </section>

          <Separator />

          {/* Propietario */}
          <section className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Propietario
            </h3>
            {customer ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarFallback className="text-sm bg-primary/10 text-primary">
                      {customer.first_name?.charAt(0)?.toUpperCase()}
                      {customer.last_name?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm">
                      {customer.first_name} {customer.last_name}
                    </p>
                    {customer.doc_id && (
                      <p className="text-xs text-muted-foreground">
                        Doc: {customer.doc_id}
                      </p>
                    )}
                    <Link
                      href={`/customers/${customer.id}`}
                      className="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-1"
                      onClick={onClose}
                    >
                      Ver perfil <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>

                <div className="space-y-2.5 pl-1">
                  {customer.phone && (
                    <a
                      href={`tel:${customer.phone}`}
                      className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Phone className="h-4 w-4 flex-shrink-0" />
                      <span>{customer.phone}</span>
                    </a>
                  )}

                  {customer.email && (
                    <a
                      href={`mailto:${customer.email}`}
                      className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Mail className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{customer.email}</span>
                    </a>
                  )}

                  {customer.address && (
                    <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed">
                        {customer.address}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  {customer.phone && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-10"
                      asChild
                    >
                      <a href={`tel:${customer.phone}`}>
                        <Phone className="h-4 w-4 mr-2" />
                        Llamar
                      </a>
                    </Button>
                  )}
                  {customer.email && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-10"
                      asChild
                    >
                      <a href={`mailto:${customer.email}`}>
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No hay información del propietario disponible
              </p>
            )}
          </section>

          <Separator />

          {/* Información adicional */}
          <section className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Detalles Adicionales
            </h3>
            <dl className="space-y-3">
              <div className="flex items-center justify-between py-1.5">
                <dt className="text-sm text-muted-foreground">Color</dt>
                <dd className="text-sm font-medium">
                  {pet.color || (
                    <span className="text-muted-foreground italic">—</span>
                  )}
                </dd>
              </div>
              <Separator className="!my-1" />
              <div className="flex items-center justify-between py-1.5">
                <dt className="text-sm text-muted-foreground">Peso</dt>
                <dd className="text-sm font-medium">
                  {pet.weight ? (
                    `${pet.weight} kg`
                  ) : (
                    <span className="text-muted-foreground italic">—</span>
                  )}
                </dd>
              </div>
              <Separator className="!my-1" />
              <div className="flex items-center justify-between py-1.5">
                <dt className="text-sm text-muted-foreground">Microchip</dt>
                <dd className="text-sm font-mono">
                  {pet.microchip || (
                    <span className="text-muted-foreground italic font-sans">
                      —
                    </span>
                  )}
                </dd>
              </div>
            </dl>

            {pet.notes && (
              <div className="mt-4 pt-4 border-t border-dashed">
                <dt className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                  Notas
                </dt>
                <dd className="text-sm text-muted-foreground leading-relaxed">
                  {pet.notes}
                </dd>
              </div>
            )}
          </section>

          <Separator />

          {/* Fechas */}
          <section className="space-y-2 text-xs text-muted-foreground pb-4">
            <div className="flex justify-between">
              <span>Registrado</span>
              <DateDisplay value={pet.created_at} />
            </div>
            <div className="flex justify-between">
              <span>Actualizado</span>
              <DateDisplay value={pet.updated_at} />
            </div>
          </section>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
