'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AlertTriangle,
  CalendarDays,
  Mail,
  MapPin,
  Phone,
  User,
} from 'lucide-react'
import { Database } from '@/types/supabase.types'
import { differenceInYears, format } from 'date-fns'
import { es } from 'date-fns/locale'

type Patient = Database['public']['Tables']['patients']['Row'] & {
  avatar_url?: string | null
  emergency_contact?: string | null
  medical_notes?: string | null
}

interface PatientProfileHeaderProps {
  patient: Patient
}

export function PatientProfileHeader({ patient }: PatientProfileHeaderProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const formatAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--
    }

    return age
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar y datos básicos */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={patient.avatar_url || undefined} />
              <AvatarFallback className="text-lg">
                {getInitials(patient.first_name, patient.last_name)}
              </AvatarFallback>
            </Avatar>

            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold">
                {patient.first_name} {patient.last_name}
              </h1>
              <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                <Badge variant={patient.is_active ? 'default' : 'secondary'}>
                  {patient.is_active ? 'Activo' : 'Inactivo'}
                </Badge>
                {patient.date_of_birth && (
                  <Badge variant="outline">
                    {formatAge(patient.date_of_birth)} años
                  </Badge>
                )}
                {patient.sex && (
                  <Badge variant="outline">
                    {patient.sex === 'M'
                      ? 'Masculino'
                      : patient.sex === 'F'
                        ? 'Femenino'
                        : 'No especificado'}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Información de contacto */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              {patient.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{patient.email}</span>
                </div>
              )}

              {patient.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{patient.phone}</span>
                </div>
              )}

              {patient.date_of_birth && (
                <div className="flex items-center gap-2 text-sm">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {format(new Date(patient.date_of_birth), 'dd/MM/yyyy', {
                      locale: es,
                    })}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {patient.address && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="break-words">{patient.address}</span>
                </div>
              )}

              {patient.systemic_diseases && (
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Enfermedades sistémicas:
                  </span>
                  <span>{patient.systemic_diseases}</span>
                </div>
              )}

              {patient.allergies && (
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Alergias:
                  </span>
                  <span>{patient.allergies}</span>
                </div>
              )}
            </div>
          </div>

          {/* Alertas médicas */}
          {patient.medical_notes && (
            <div className="md:w-64">
              <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Notas Médicas
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    {patient.medical_notes}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
