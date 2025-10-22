import { Enums } from '@/types/supabase.types'
import { useMemo } from 'react'
import { Stethoscope, Syringe, Activity } from 'lucide-react'

type RecordType = {
  value: Enums<'record_type'>
  label: string
  description?: string
  icon: React.ReactNode
}

export default function useRecordType() {
  const recordTypes = useMemo<RecordType[]>(
    () => [
      {
        value: 'consultation',
        label: 'Consulta Veterinaria',
        description: 'Consulta médica para diagnosticar y tratar enfermedades.',
        icon: <Stethoscope className="h-4 w-4" />,
      },
      {
        value: 'vaccination',
        label: 'Vacunación',
        description: 'Procedimiento para proteger contra enfermedades.',
        icon: <Syringe className="h-4 w-4" />,
      },
      {
        value: 'surgery',
        label: 'Cirugía',
        description: 'Procedimiento quirúrgico para tratar enfermedades.',
        icon: <Activity className="h-4 w-4" />,
      },
      {
        value: 'deworming',
        label: 'Control de Enfermedad',
        description: 'Procedimiento para controlar enfermedades en animales.',
        icon: <Activity className="h-4 w-4" />,
      },
    ],
    []
  )

  const getRecordType = (value?: Enums<'record_type'>) => {
    return recordTypes.find((item) => item.value === value)
  }

  return {
    recordTypes,
    getRecordType,
  }
}
