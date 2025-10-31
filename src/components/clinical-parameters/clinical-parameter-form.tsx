'use client'

import { useFormContext } from 'react-hook-form'
import { useEffect } from 'react'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { DatePicker } from '@/components/ui/date-picker'
import { type ClinicalParameterFormData } from '@/schemas/clinical-parameters.schema'
import { MedicalRecordSelect } from '@/components/medical-records/medical-record-select'

interface ClinicalParameterFormProps {
  petId?: string
}

export function ClinicalParameterForm({ petId }: ClinicalParameterFormProps) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<ClinicalParameterFormData>()

  const handleParameterChange = (key: string, value: string) => {
    const currentParams = watch('params') || {}
    const numericValue = parseFloat(value)

    setValue('params', {
      ...currentParams,
      [key]: isNaN(numericValue) ? value : numericValue,
    })
  }

  // watcher para validar el campo record_id
  const recordId = watch('record_id')
  useEffect(() => {
    // en caso se requiera
  }, [recordId])

  return (
    <div className="space-y-6">
      <Field>
        <FieldLabel htmlFor="measured_at">Fecha y Hora de Medición</FieldLabel>
        <FieldContent>
          <DatePicker
            id="measured_at"
            name="measured_at"
            value={watch('measured_at')}
            onChange={(value) =>
              setValue('measured_at', value?.toISOString() || '')
            }
          />
          <FieldError errors={[errors.measured_at]} />
        </FieldContent>
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="temperature">Temperatura (°C)</FieldLabel>
          <FieldContent>
            <Input
              id="temperature"
              type="number"
              step="0.1"
              placeholder="38.5"
              onChange={(e) =>
                handleParameterChange('temperature', e.target.value)
              }
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="weight">Peso (kg)</FieldLabel>
          <FieldContent>
            <Input
              id="weight"
              type="number"
              step="0.1"
              placeholder="15.5"
              onChange={(e) => handleParameterChange('weight', e.target.value)}
            />
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
              placeholder="120"
              onChange={(e) =>
                handleParameterChange('heart_rate', e.target.value)
              }
            />
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
              placeholder="20"
              onChange={(e) =>
                handleParameterChange('respiratory_rate', e.target.value)
              }
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="blood_pressure_systolic">
            Presión Sistólica (mmHg)
          </FieldLabel>
          <FieldContent>
            <Input
              id="blood_pressure_systolic"
              type="number"
              placeholder="130"
              onChange={(e) =>
                handleParameterChange('blood_pressure_systolic', e.target.value)
              }
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="blood_pressure_diastolic">
            Presión Diastólica (mmHg)
          </FieldLabel>
          <FieldContent>
            <Input
              id="blood_pressure_diastolic"
              type="number"
              placeholder="80"
              onChange={(e) =>
                handleParameterChange(
                  'blood_pressure_diastolic',
                  e.target.value
                )
              }
            />
          </FieldContent>
        </Field>
      </div>
    </div>
  )
}
