'use client'

import { useFormContext } from 'react-hook-form'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  FieldGroup,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Stethoscope, Activity, Scale } from 'lucide-react'

interface ConsultationFormProps {
  className?: string
}

export function ConsultationForm({ className }: ConsultationFormProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Formulario de Consulta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Síntomas */}
          <Field>
            <FieldLabel htmlFor="symptoms">Síntomas</FieldLabel>
            <FieldContent>
              <Textarea
                id="symptoms"
                {...register('symptoms')}
                placeholder="Describe los síntomas observados..."
                rows={3}
              />
              <FieldError errors={[errors.symptoms]} />
            </FieldContent>
          </Field>

          {/* Signos Vitales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="h-4 w-4" />
                Signos Vitales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="temperature">
                      Temperatura (°C)
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        id="temperature"
                        type="number"
                        step="0.1"
                        min="35"
                        max="45"
                        {...register('temperature', { valueAsNumber: true })}
                        placeholder="38.5"
                      />
                      <FieldError errors={[errors.temperature]} />
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="weight">Peso (kg)</FieldLabel>
                    <FieldContent>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        min="0.1"
                        max="200"
                        {...register('weight', { valueAsNumber: true })}
                        placeholder="25.5"
                      />
                      <FieldError errors={[errors.weight]} />
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="heart_rate">
                      Frecuencia Cardíaca (bpm)
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        id="heart_rate"
                        type="number"
                        min="40"
                        max="300"
                        {...register('heart_rate', { valueAsNumber: true })}
                        placeholder="120"
                      />
                      <FieldError errors={[errors.heart_rate]} />
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="respiratory_rate">
                      Frecuencia Respiratoria (rpm)
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        id="respiratory_rate"
                        type="number"
                        min="5"
                        max="100"
                        {...register('respiratory_rate', {
                          valueAsNumber: true,
                        })}
                        placeholder="30"
                      />
                      <FieldError errors={[errors.respiratory_rate]} />
                    </FieldContent>
                  </Field>
                </div>

                {/* Presión Arterial */}
                <div className="mt-4">
                  <FieldLabel>Presión Arterial (mmHg)</FieldLabel>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <Field>
                      <FieldLabel htmlFor="blood_pressure_systolic">
                        Sistólica
                      </FieldLabel>
                      <FieldContent>
                        <Input
                          id="blood_pressure_systolic"
                          type="number"
                          min="50"
                          max="300"
                          {...register('blood_pressure_systolic', {
                            valueAsNumber: true,
                          })}
                          placeholder="120"
                        />
                        <FieldError errors={[errors.blood_pressure_systolic]} />
                      </FieldContent>
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="blood_pressure_diastolic">
                        Diastólica
                      </FieldLabel>
                      <FieldContent>
                        <Input
                          id="blood_pressure_diastolic"
                          type="number"
                          min="30"
                          max="200"
                          {...register('blood_pressure_diastolic', {
                            valueAsNumber: true,
                          })}
                          placeholder="80"
                        />
                        <FieldError errors={[errors.blood_pressure_diastolic]} />
                      </FieldContent>
                    </Field>
                  </div>
                </div>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Examen Físico */}
          <Field>
            <FieldLabel htmlFor="physical_examination">Examen Físico</FieldLabel>
            <FieldContent>
              <Textarea
                id="physical_examination"
                {...register('physical_examination')}
                placeholder="Describe los hallazgos del examen físico..."
                rows={4}
              />
              <FieldError errors={[errors.physical_examination]} />
            </FieldContent>
          </Field>

          {/* Plan de Tratamiento */}
          <Field>
            <FieldLabel htmlFor="treatment_plan">Plan de Tratamiento</FieldLabel>
            <FieldContent>
              <Textarea
                id="treatment_plan"
                {...register('treatment_plan')}
                placeholder="Describe el plan de tratamiento recomendado..."
                rows={4}
              />
              <FieldError errors={[errors.treatment_plan]} />
            </FieldContent>
          </Field>

          {/* Notas de Consulta */}
          <Field>
            <FieldLabel htmlFor="consultation_notes">
              Notas de Consulta
            </FieldLabel>
            <FieldContent>
              <Textarea
                id="consultation_notes"
                {...register('consultation_notes')}
                placeholder="Notas adicionales sobre la consulta..."
                rows={3}
              />
              <FieldError errors={[errors.consultation_notes]} />
            </FieldContent>
          </Field>
        </CardContent>
      </Card>
    </div>
  )
}