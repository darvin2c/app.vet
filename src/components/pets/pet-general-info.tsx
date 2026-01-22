'use client'

import { Separator } from '@/components/ui/separator'
import { Tables } from '@/types/supabase.types'
import { PetStatusBadge } from './pet-status-badge'
import { formatSex, formatDate } from '@/lib/pet-utils'
import { Dog, Tag, FileText, Clock } from 'lucide-react'
import { DateDisplay } from '@/components/ui/date-picker'

type PetDetail = Tables<'pets'> & {
  customers: Tables<'customers'> | null
  breeds:
    | (Tables<'breeds'> & {
        species: Tables<'species'> | null
      })
    | null
  species: Tables<'species'> | null
}

interface PetGeneralInfoProps {
  pet: PetDetail
}

// Componente mejorado para campo de información
function InfoItem({
  label,
  value,
  children,
  className = '',
}: {
  label: string
  value?: string | number | null
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </dt>
      <dd className="text-sm font-medium">
        {children || (
          <span
            className={
              value ? 'text-foreground' : 'text-muted-foreground italic'
            }
          >
            {value || 'No especificado'}
          </span>
        )}
      </dd>
    </div>
  )
}

export function PetGeneralInfo({ pet }: PetGeneralInfoProps) {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* Información Principal */}
      <section className="space-y-4">
        <header className="flex items-center gap-2">
          <Dog className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Información Principal
          </h3>
        </header>

        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
          <InfoItem label="Nombre" value={pet.name} />
          <InfoItem label="Estado">
            <PetStatusBadge status="active" />
          </InfoItem>
          <InfoItem label="Especie" value={pet.species?.name} />
          <InfoItem label="Raza" value={pet.breeds?.name} />
          <InfoItem label="Sexo" value={formatSex(pet.sex)} />
          <InfoItem label="Color" value={pet.color} />
          <InfoItem
            label="Peso"
            value={pet.weight ? `${pet.weight} kg` : undefined}
          />
          <InfoItem label="Fecha de nacimiento">
            <DateDisplay value={pet.birth_date} />
          </InfoItem>
        </dl>
      </section>

      <Separator className="my-6 md:my-8" />

      {/* Identificación */}
      <section className="space-y-4">
        <header className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Identificación
          </h3>
        </header>

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6">
          <InfoItem label="Microchip">
            <span className="font-mono text-sm">
              {pet.microchip || (
                <span className="text-muted-foreground italic font-sans">
                  No registrado
                </span>
              )}
            </span>
          </InfoItem>
          <InfoItem label="Número de registro">
            <span className="font-mono text-xs break-all">{pet.id}</span>
          </InfoItem>
        </dl>
      </section>

      {/* Notas - solo si existen */}
      {pet.notes && (
        <>
          <Separator className="my-6 md:my-8" />

          <section className="space-y-4">
            <header className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Notas</h3>
            </header>

            <p className="text-sm text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-lg">
              {pet.notes}
            </p>
          </section>
        </>
      )}

      <Separator className="my-6 md:my-8" />

      {/* Fechas de Registro */}
      <section className="space-y-4">
        <header className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Historial
          </h3>
        </header>

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="font-medium">Registrado:</span>
            {formatDate(pet.created_at, 'dd/MM/yyyy HH:mm')}
          </span>
          <span className="hidden sm:inline text-muted-foreground/50">•</span>
          <span className="flex items-center gap-1.5">
            <span className="font-medium">Última actualización:</span>
            {formatDate(pet.updated_at, 'dd/MM/yyyy HH:mm')}
          </span>
        </div>
      </section>
    </div>
  )
}
