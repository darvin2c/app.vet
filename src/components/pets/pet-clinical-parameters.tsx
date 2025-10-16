import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tables } from '@/types/supabase.types'
import { PetEmptyState } from './pet-empty-state'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ClinicalParameterCreateButton } from '@/components/clinical-parameters/clinical-parameter-create-button'
import { ClinicalParameterActions } from '@/components/clinical-parameters/clinical-parameter-actions'

interface PetClinicalParametersProps {
  parameters: Tables<'clinical_parameters'>[]
  isLoading?: boolean
  petId: string
}

export function PetClinicalParameters({
  parameters,
  isLoading,
  petId,
}: PetClinicalParametersProps) {
  const getParameterValue = (params: any, key: string) => {
    try {
      if (typeof params === 'string') {
        const parsed = JSON.parse(params)
        return parsed[key]
      }
      return params?.[key]
    } catch {
      return null
    }
  }

  const getParameterTrend = (current: number, previous: number) => {
    if (!previous || !current) return null

    const diff = current - previous
    const percentage = Math.abs((diff / previous) * 100)

    if (percentage < 5)
      return {
        icon: Minus,
        color: 'text-muted-foreground',
        text: 'Sin cambios',
      }
    if (diff > 0)
      return {
        icon: TrendingUp,
        color: 'text-green-600',
        text: `+${percentage.toFixed(1)}%`,
      }
    return {
      icon: TrendingDown,
      color: 'text-red-600',
      text: `-${percentage.toFixed(1)}%`,
    }
  }

  const getParameterStatus = (
    value: number,
    normal: { min: number; max: number }
  ) => {
    if (value < normal.min)
      return { variant: 'destructive' as const, text: 'Bajo' }
    if (value > normal.max)
      return { variant: 'destructive' as const, text: 'Alto' }
    return { variant: 'secondary' as const, text: 'Normal' }
  }

  // Rangos normales típicos para mascotas
  const normalRanges = {
    temperature: { min: 38, max: 39.5, unit: '°C' },
    heart_rate: { min: 60, max: 140, unit: 'bpm' },
    respiratory_rate: { min: 10, max: 30, unit: 'rpm' },
    weight: { min: 0, max: 100, unit: 'kg' },
    blood_pressure_systolic: { min: 110, max: 160, unit: 'mmHg' },
    blood_pressure_diastolic: { min: 60, max: 100, unit: 'mmHg' },
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Parámetros Clínicos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (parameters.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Parámetros Clínicos
            </CardTitle>
            <ClinicalParameterCreateButton petId={petId} />
          </div>
        </CardHeader>
        <CardContent>
          <PetEmptyState
            icon={<Activity className="h-12 w-12" />}
            title="No hay parámetros clínicos registrados"
            description="Esta mascota aún no tiene parámetros clínicos registrados como temperatura, peso, frecuencia cardíaca, etc."
          />
        </CardContent>
      </Card>
    )
  }

  // Función auxiliar para validar y formatear fechas
  const formatSafeDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'Sin fecha'

    try {
      const date = new Date(dateString)
      // Verificar si la fecha es válida
      if (isNaN(date.getTime())) {
        return 'Sin fecha'
      }
      return format(date, 'yyyy-MM-dd', { locale: es })
    } catch (error) {
      return 'Sin fecha'
    }
  }

  // Agrupar parámetros por fecha para mostrar el historial
  const parametersByDate = parameters.reduce(
    (acc, param) => {
      const date = formatSafeDate(param.measured_at)
      if (!acc[date]) acc[date] = []
      acc[date].push(param)
      return acc
    },
    {} as Record<string, Tables<'clinical_parameters'>[]>
  )

  const sortedDates = Object.keys(parametersByDate).sort((a, b) => {
    // Manejar el caso especial de "Sin fecha"
    if (a === 'Sin fecha' && b === 'Sin fecha') return 0
    if (a === 'Sin fecha') return 1 // "Sin fecha" va al final
    if (b === 'Sin fecha') return -1 // "Sin fecha" va al final

    // Para fechas válidas, ordenar de más reciente a más antigua
    try {
      const dateA = new Date(a)
      const dateB = new Date(b)

      // Verificar si las fechas son válidas
      if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0
      if (isNaN(dateA.getTime())) return 1
      if (isNaN(dateB.getTime())) return -1

      return dateB.getTime() - dateA.getTime()
    } catch (error) {
      return 0
    }
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Parámetros Clínicos ({parameters.length} registros)
          </CardTitle>
          <ClinicalParameterCreateButton petId={petId} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sortedDates.map((date) => (
            <div key={date} className="space-y-4">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">
                  {date === 'Sin fecha'
                    ? 'Sin fecha'
                    : (() => {
                        try {
                          const displayDate = new Date(date)
                          if (isNaN(displayDate.getTime())) {
                            return 'Fecha no válida'
                          }
                          return format(displayDate, 'dd/MM/yyyy', {
                            locale: es,
                          })
                        } catch (error) {
                          return 'Fecha no válida'
                        }
                      })()}
                </h4>
                <Badge variant="outline" className="text-xs">
                  {parametersByDate[date].length} mediciones
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {parametersByDate[date].map((param) => {
                  const params = param.params
                  const commonParameters = [
                    {
                      key: 'temperature',
                      label: 'Temperatura',
                      range: normalRanges.temperature,
                    },
                    {
                      key: 'heart_rate',
                      label: 'Frecuencia Cardíaca',
                      range: normalRanges.heart_rate,
                    },
                    {
                      key: 'respiratory_rate',
                      label: 'Frecuencia Respiratoria',
                      range: normalRanges.respiratory_rate,
                    },
                    {
                      key: 'weight',
                      label: 'Peso',
                      range: normalRanges.weight,
                    },
                    {
                      key: 'blood_pressure_systolic',
                      label: 'Presión Sistólica',
                      range: normalRanges.blood_pressure_systolic,
                    },
                    {
                      key: 'blood_pressure_diastolic',
                      label: 'Presión Diastólica',
                      range: normalRanges.blood_pressure_diastolic,
                    },
                  ]

                  return (
                    <div key={param.id} className="space-y-4">
                      {commonParameters
                        .map((paramConfig) => {
                          const value = getParameterValue(
                            params,
                            paramConfig.key
                          )
                          if (!value) return null

                          const status = getParameterStatus(
                            value,
                            paramConfig.range
                          )

                          return (
                            <div
                              key={`${param.id}-${paramConfig.key}`}
                              className="border rounded-lg p-4 relative"
                            >
                              <div className="absolute top-2 right-2">
                                <ClinicalParameterActions
                                  clinicalParameter={param}
                                />
                              </div>

                              <div className="flex items-center justify-between mb-2 pr-8">
                                <h5 className="text-sm font-medium">
                                  {paramConfig.label}
                                </h5>
                                <Badge
                                  variant={status.variant}
                                  className="text-xs"
                                >
                                  {status.text}
                                </Badge>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold">
                                  {value}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {paramConfig.range.unit}
                                </span>
                              </div>

                              <div className="text-xs text-muted-foreground mt-1">
                                Rango normal: {paramConfig.range.min} -{' '}
                                {paramConfig.range.max} {paramConfig.range.unit}
                              </div>

                              {param.measured_at && (
                                <div className="text-xs text-muted-foreground mt-2">
                                  {(() => {
                                    try {
                                      const date = new Date(param.measured_at)
                                      if (isNaN(date.getTime())) {
                                        return 'Hora no válida'
                                      }
                                      return format(date, 'HH:mm', {
                                        locale: es,
                                      })
                                    } catch (error) {
                                      return 'Hora no válida'
                                    }
                                  })()}
                                </div>
                              )}
                            </div>
                          )
                        })
                        .filter(Boolean)}
                    </div>
                  )
                })}
              </div>

              {/* Mostrar parámetros adicionales que no están en la lista común */}
              {parametersByDate[date].map((param) => {
                const params = param.params
                let additionalParams: any = {}

                try {
                  const parsedParams =
                    typeof params === 'string' ? JSON.parse(params) : params
                  const commonKeys = [
                    'temperature',
                    'heart_rate',
                    'respiratory_rate',
                    'weight',
                    'blood_pressure_systolic',
                    'blood_pressure_diastolic',
                  ]
                  additionalParams = Object.keys(parsedParams || {})
                    .filter((key) => !commonKeys.includes(key))
                    .reduce((acc, key) => {
                      acc[key] = parsedParams[key]
                      return acc
                    }, {} as any)
                } catch {
                  // Si no se puede parsear, ignorar
                }

                if (Object.keys(additionalParams).length > 0) {
                  return (
                    <div
                      key={`${param.id}-additional`}
                      className="border rounded-lg p-4 bg-muted/30"
                    >
                      <h5 className="text-sm font-medium mb-2">
                        Parámetros Adicionales
                      </h5>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(additionalParams).map(
                          ([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="capitalize">
                                {key.replace(/_/g, ' ')}:
                              </span>
                              <span className="font-medium">
                                {String(value)}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )
                }
                return null
              })}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
