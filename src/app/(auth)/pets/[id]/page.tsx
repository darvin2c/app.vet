'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  Edit,
  Heart,
  Calendar,
  FileText,
  Activity,
  Building,
  Home,
} from 'lucide-react'
import Link from 'next/link'
import { usePetDetail } from '@/hooks/pets/use-pet-detail'
import { usePetAppointments } from '@/hooks/pets/use-pet-appointments'
import { usePetTreatments } from '@/hooks/pets/use-pet-treatments'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function PetProfilePage() {
  const params = useParams()
  const petId = params.id as string
  const [activeTab, setActiveTab] = useState('general')

  const {
    data: pet,
    isLoading: petLoading,
    error: petError,
  } = usePetDetail(petId)
  const { data: appointments, isLoading: appointmentsLoading } =
    usePetAppointments(petId)
  const { data: treatments, isLoading: treatmentsLoading } =
    usePetTreatments(petId)

  if (petLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-96" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    )
  }

  if (petError || !pet) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Error al cargar la información de la mascota. Por favor, intenta
            nuevamente.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const getAgeString = (birthDate: string | null) => {
    if (!birthDate) return 'Edad no registrada'

    const birth = new Date(birthDate)
    const now = new Date()
    const years = now.getFullYear() - birth.getFullYear()
    const months = now.getMonth() - birth.getMonth()

    if (years > 0) {
      return `${years} año${years > 1 ? 's' : ''}`
    } else if (months > 0) {
      return `${months} mes${months > 1 ? 'es' : ''}`
    } else {
      return 'Menos de 1 mes'
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/pets">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/10 text-primary">
                <Heart className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{pet.name}</h1>
              <p className="text-muted-foreground">
                {pet.species?.name} {pet.breeds?.name && `• ${pet.breeds.name}`}
              </p>
            </div>
          </div>
        </div>
        <Button>
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                General
              </TabsTrigger>
              <TabsTrigger value="medical" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Historial
              </TabsTrigger>
              <TabsTrigger value="clinical" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Clínico
              </TabsTrigger>
              <TabsTrigger
                value="hospitalization"
                className="flex items-center gap-2"
              >
                <Building className="h-4 w-4" />
                Hospital
              </TabsTrigger>
              <TabsTrigger value="boarding" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Pensión
              </TabsTrigger>
            </TabsList>

            {/* Información General */}
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información de la Mascota</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Nombre
                      </label>
                      <p className="font-medium">{pet.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Sexo
                      </label>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={pet.sex === 'M' ? 'default' : 'secondary'}
                        >
                          {pet.sex === 'M' ? 'Macho' : 'Hembra'}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Especie
                      </label>
                      <p className="font-medium">
                        {pet.species?.name || 'No especificada'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Raza
                      </label>
                      <p className="font-medium">
                        {pet.breeds?.name || 'No especificada'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Fecha de Nacimiento
                      </label>
                      <p className="font-medium">
                        {pet.birth_date
                          ? format(new Date(pet.birth_date), 'dd/MM/yyyy', {
                              locale: es,
                            })
                          : 'No registrada'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Edad
                      </label>
                      <p className="font-medium">
                        {getAgeString(pet.birth_date)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Peso
                      </label>
                      <p className="font-medium">
                        {pet.weight ? `${pet.weight} kg` : 'No registrado'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Color
                      </label>
                      <p className="font-medium">
                        {pet.color || 'No especificado'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Microchip
                      </label>
                      <p className="font-medium">
                        {pet.microchip || 'No registrado'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Estado
                      </label>
                      <Badge variant={pet.is_active ? 'default' : 'secondary'}>
                        {pet.is_active ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                  </div>
                  {pet.notes && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Notas
                      </label>
                      <p className="mt-1 text-sm bg-muted p-3 rounded-md">
                        {pet.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Historial Médico */}
            <TabsContent value="medical" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Historial de Citas</CardTitle>
                  <CardDescription>
                    Registro de todas las citas médicas de {pet.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {appointmentsLoading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : appointments && appointments.length > 0 ? (
                    <div className="space-y-4">
                      {appointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge
                                  style={{
                                    backgroundColor:
                                      appointment.appointment_types?.color ||
                                      '#6b7280',
                                    color: 'white',
                                  }}
                                >
                                  {appointment.appointment_types?.name ||
                                    'Sin tipo'}
                                </Badge>
                                <Badge variant="outline">
                                  {appointment.status}
                                </Badge>
                              </div>
                              <p className="font-medium">
                                {appointment.reason ||
                                  'Sin motivo especificado'}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {format(
                                  new Date(appointment.scheduled_start),
                                  'dd/MM/yyyy HH:mm',
                                  { locale: es }
                                )}
                              </p>
                              {appointment.staff && (
                                <p className="text-sm text-muted-foreground">
                                  Dr. {appointment.staff.full_name}
                                </p>
                              )}
                            </div>
                          </div>
                          {appointment.notes && (
                            <div className="mt-3 pt-3 border-t">
                              <p className="text-sm">{appointment.notes}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No hay citas registradas para {pet.name}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Parámetros Clínicos */}
            <TabsContent value="clinical" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Parámetros Clínicos</CardTitle>
                  <CardDescription>
                    Registros de parámetros médicos y notas clínicas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {treatmentsLoading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                      ))}
                    </div>
                  ) : treatments && treatments.length > 0 ? (
                    <div className="space-y-6">
                      {treatments.map((treatment) => (
                        <div
                          key={treatment.id}
                          className="border rounded-lg p-4 space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">
                              Tratamiento -{' '}
                              {format(
                                new Date(treatment.created_at),
                                'dd/MM/yyyy',
                                { locale: es }
                              )}
                            </h4>
                            {treatment.appointments?.appointment_types && (
                              <Badge
                                style={{
                                  backgroundColor:
                                    treatment.appointments.appointment_types
                                      .color || '#6b7280',
                                  color: 'white',
                                }}
                              >
                                {treatment.appointments.appointment_types.name}
                              </Badge>
                            )}
                          </div>

                          {/* Notas Clínicas */}
                          {treatment.clinical_notes &&
                            treatment.clinical_notes.length > 0 && (
                              <div>
                                <h5 className="text-sm font-medium mb-2">
                                  Notas Clínicas
                                </h5>
                                <div className="space-y-2">
                                  {treatment.clinical_notes.map((note) => (
                                    <div
                                      key={note.id}
                                      className="bg-muted p-3 rounded-md"
                                    >
                                      <p className="text-sm">{note.content}</p>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {format(
                                          new Date(note.created_at),
                                          'dd/MM/yyyy HH:mm',
                                          { locale: es }
                                        )}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                          {/* Parámetros Clínicos */}
                          {treatment.clinical_parameters &&
                            treatment.clinical_parameters.length > 0 && (
                              <div>
                                <h5 className="text-sm font-medium mb-2">
                                  Parámetros Registrados
                                </h5>
                                <div className="space-y-2">
                                  {treatment.clinical_parameters.map(
                                    (param) => (
                                      <div
                                        key={param.id}
                                        className="bg-muted p-3 rounded-md"
                                      >
                                        <pre className="text-sm whitespace-pre-wrap">
                                          {JSON.stringify(
                                            param.params,
                                            null,
                                            2
                                          )}
                                        </pre>
                                        <p className="text-xs text-muted-foreground mt-1">
                                          Medido:{' '}
                                          {format(
                                            new Date(param.measured_at),
                                            'dd/MM/yyyy HH:mm',
                                            { locale: es }
                                          )}
                                        </p>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>
                        No hay parámetros clínicos registrados para {pet.name}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Hospitalizaciones */}
            <TabsContent value="hospitalization" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Historial de Hospitalizaciones</CardTitle>
                  <CardDescription>
                    Registros de internaciones y hospitalizaciones
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {treatmentsLoading ? (
                    <div className="space-y-3">
                      {[...Array(2)].map((_, i) => (
                        <Skeleton key={i} className="h-24 w-full" />
                      ))}
                    </div>
                  ) : treatments &&
                    treatments.some((t) => t.hospitalizations.length > 0) ? (
                    <div className="space-y-4">
                      {treatments
                        .filter((t) => t.hospitalizations.length > 0)
                        .map((treatment) =>
                          treatment.hospitalizations.map((hospitalization) => (
                            <div
                              key={hospitalization.id}
                              className="border rounded-lg p-4"
                            >
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium">
                                    Hospitalización
                                  </h4>
                                  <Badge
                                    variant={
                                      hospitalization.discharge_at
                                        ? 'secondary'
                                        : 'default'
                                    }
                                  >
                                    {hospitalization.discharge_at
                                      ? 'Finalizada'
                                      : 'En curso'}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <label className="font-medium text-muted-foreground">
                                      Ingreso
                                    </label>
                                    <p>
                                      {format(
                                        new Date(hospitalization.admission_at),
                                        'dd/MM/yyyy HH:mm',
                                        { locale: es }
                                      )}
                                    </p>
                                  </div>
                                  {hospitalization.discharge_at && (
                                    <div>
                                      <label className="font-medium text-muted-foreground">
                                        Alta
                                      </label>
                                      <p>
                                        {format(
                                          new Date(
                                            hospitalization.discharge_at
                                          ),
                                          'dd/MM/yyyy HH:mm',
                                          { locale: es }
                                        )}
                                      </p>
                                    </div>
                                  )}
                                  {hospitalization.daily_rate && (
                                    <div>
                                      <label className="font-medium text-muted-foreground">
                                        Tarifa Diaria
                                      </label>
                                      <p>S/ {hospitalization.daily_rate}</p>
                                    </div>
                                  )}
                                  {hospitalization.bed_id && (
                                    <div>
                                      <label className="font-medium text-muted-foreground">
                                        Cama
                                      </label>
                                      <p>{hospitalization.bed_id}</p>
                                    </div>
                                  )}
                                </div>
                                {hospitalization.notes && (
                                  <div>
                                    <label className="font-medium text-muted-foreground">
                                      Notas
                                    </label>
                                    <p className="mt-1 text-sm bg-muted p-3 rounded-md">
                                      {hospitalization.notes}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>
                        No hay hospitalizaciones registradas para {pet.name}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Pensión */}
            <TabsContent value="boarding" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Historial de Pensión</CardTitle>
                  <CardDescription>
                    Registros de estadías en pensión
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {treatmentsLoading ? (
                    <div className="space-y-3">
                      {[...Array(2)].map((_, i) => (
                        <Skeleton key={i} className="h-24 w-full" />
                      ))}
                    </div>
                  ) : treatments &&
                    treatments.some((t) => t.boardings.length > 0) ? (
                    <div className="space-y-4">
                      {treatments
                        .filter((t) => t.boardings.length > 0)
                        .map((treatment) =>
                          treatment.boardings.map((boarding) => (
                            <div
                              key={boarding.id}
                              className="border rounded-lg p-4"
                            >
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium">
                                    Estadía en Pensión
                                  </h4>
                                  <Badge
                                    variant={
                                      boarding.check_out_at
                                        ? 'secondary'
                                        : 'default'
                                    }
                                  >
                                    {boarding.check_out_at
                                      ? 'Finalizada'
                                      : 'En curso'}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <label className="font-medium text-muted-foreground">
                                      Check-in
                                    </label>
                                    <p>
                                      {format(
                                        new Date(boarding.check_in_at),
                                        'dd/MM/yyyy HH:mm',
                                        { locale: es }
                                      )}
                                    </p>
                                  </div>
                                  {boarding.check_out_at && (
                                    <div>
                                      <label className="font-medium text-muted-foreground">
                                        Check-out
                                      </label>
                                      <p>
                                        {format(
                                          new Date(boarding.check_out_at),
                                          'dd/MM/yyyy HH:mm',
                                          { locale: es }
                                        )}
                                      </p>
                                    </div>
                                  )}
                                  {boarding.daily_rate && (
                                    <div>
                                      <label className="font-medium text-muted-foreground">
                                        Tarifa Diaria
                                      </label>
                                      <p>S/ {boarding.daily_rate}</p>
                                    </div>
                                  )}
                                  {boarding.kennel_id && (
                                    <div>
                                      <label className="font-medium text-muted-foreground">
                                        Kennel
                                      </label>
                                      <p>{boarding.kennel_id}</p>
                                    </div>
                                  )}
                                </div>
                                {boarding.feeding_notes && (
                                  <div>
                                    <label className="font-medium text-muted-foreground">
                                      Notas de Alimentación
                                    </label>
                                    <p className="mt-1 text-sm bg-muted p-3 rounded-md">
                                      {boarding.feeding_notes}
                                    </p>
                                  </div>
                                )}
                                {boarding.observations && (
                                  <div>
                                    <label className="font-medium text-muted-foreground">
                                      Observaciones
                                    </label>
                                    <p className="mt-1 text-sm bg-muted p-3 rounded-md">
                                      {boarding.observations}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Home className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No hay registros de pensión para {pet.name}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Información del Propietario */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Propietario</CardTitle>
            </CardHeader>
            <CardContent>
              {pet.customers ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {pet.customers.first_name[0]}
                        {pet.customers.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {pet.customers.first_name} {pet.customers.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {pet.customers.doc_id}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2 text-sm">
                    {pet.customers.email && (
                      <div>
                        <label className="font-medium text-muted-foreground">
                          Email
                        </label>
                        <p>{pet.customers.email}</p>
                      </div>
                    )}
                    {pet.customers.phone && (
                      <div>
                        <label className="font-medium text-muted-foreground">
                          Teléfono
                        </label>
                        <p>{pet.customers.phone}</p>
                      </div>
                    )}
                    {pet.customers.address && (
                      <div>
                        <label className="font-medium text-muted-foreground">
                          Dirección
                        </label>
                        <p>{pet.customers.address}</p>
                      </div>
                    )}
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Ver Perfil del Cliente
                  </Button>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No hay propietario asignado
                </p>
              )}
            </CardContent>
          </Card>

          {/* Estadísticas Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estadísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Total de Citas
                </span>
                <Badge variant="secondary">{appointments?.length || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Tratamientos
                </span>
                <Badge variant="secondary">{treatments?.length || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Hospitalizaciones
                </span>
                <Badge variant="secondary">
                  {treatments?.reduce(
                    (acc, t) => acc + t.hospitalizations.length,
                    0
                  ) || 0}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Estadías en Pensión
                </span>
                <Badge variant="secondary">
                  {treatments?.reduce(
                    (acc, t) => acc + t.boardings.length,
                    0
                  ) || 0}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
