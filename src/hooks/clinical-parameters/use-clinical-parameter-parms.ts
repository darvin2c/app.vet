import { useMemo } from 'react'

type ParamType = {
  name: string
  label: string
  description?: string
  unit?: string
}

export default function useClinicalParameterParams() {
  const params: ParamType[] = useMemo(
    () => [
      {
        name: 'temperature',
        label: 'Temperatura (°C)',
        description: 'Temperatura corporal del animal',
        unit: '°C',
      },
      {
        name: 'weight',
        label: 'Peso (kg)',
        description: 'Peso corporal del animal',
        unit: 'kg',
      },
      {
        name: 'heart_rate',
        label: 'Frecuencia Cardíaca (bpm)',
        description: 'Frecuencia cardíaca en latidos por minuto',
        unit: 'bpm',
      },
      {
        name: 'respiratory_rate',
        label: 'Frecuencia Respiratoria (rpm)',
        description: 'Frecuencia respiratoria en respiraciones por minuto',
        unit: 'rpm',
      },
      {
        name: 'systolic_pressure',
        label: 'Presión Sistólica (mmHg)',
        description: 'Presión arterial sistólica',
        unit: 'mmHg',
      },
      {
        name: 'diastolic_pressure',
        label: 'Presión Diastólica (mmHg)',
        description: 'Presión arterial diastólica',
        unit: 'mmHg',
      },
    ],
    []
  )

  const getParam = (name: string) =>
    params.find((param) => param.name === name) || {}

  return {
    getParam,
    params,
  }
}
