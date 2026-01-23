'use client'

import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  ExternalLink,
  Plus,
  FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Tables } from '@/types/supabase.types'
import Link from 'next/link'
import { AppointmentCreateButton } from '@/components/appointments/appointment-create-button'

type PetDetail = Tables<'pets'> & {
  customers: Tables<'customers'> | null
  breeds:
    | (Tables<'breeds'> & {
        species: Tables<'species'> | null
      })
    | null
  species: Tables<'species'> | null
}

interface PetProfileSidebarProps {
  pet: PetDetail
  appointmentsCount?: number
  medicalRecordsCount?: number
}

export function PetProfileSidebar({
  pet,
  appointmentsCount = 0,
  medicalRecordsCount = 0,
}: PetProfileSidebarProps) {
  const customer = pet.customers

  return (
    <div className="space-y-6 bg-muted p-6 rounded-lg">
      {/* Estadísticas */}
      <section className="space-y-4">
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
            {/* Info del propietario */}
            <div className="flex items-start gap-3">
              <Avatar className="h-12 w-12 flex-shrink-0">
                <AvatarFallback className="text-sm bg-primary/10 text-primary">
                  {customer.first_name?.charAt(0)?.toUpperCase()}
                  {customer.last_name?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm truncate">
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
                >
                  Ver perfil <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Datos de contacto */}
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
                  <span className="leading-relaxed">{customer.address}</span>
                </div>
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex gap-2 pt-2">
              {customer.phone && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-9"
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
                  className="flex-1 h-9"
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

      {/* Próximas Citas */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Próximas Citas
          </h3>
          <AppointmentCreateButton
            petId={pet.id}
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Nueva
          </AppointmentCreateButton>
        </div>
        <div className="text-center py-4 text-muted-foreground">
          <Calendar className="h-6 w-6 mx-auto mb-2 opacity-50" />
          <p className="text-xs">Ver pestaña de citas</p>
        </div>
      </section>
    </div>
  )
}
