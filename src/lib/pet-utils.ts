import { format } from 'date-fns'
import { es } from 'date-fns/locale'

/**
 * Calcula la edad de una mascota basada en su fecha de nacimiento
 */
export function calculateAge(birthDate: string | null): string {
  if (!birthDate) return 'Edad desconocida'

  const birth = new Date(birthDate)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - birth.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 30) {
    return `${diffDays} días`
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `${months} ${months === 1 ? 'mes' : 'meses'}`
  } else {
    const years = Math.floor(diffDays / 365)
    const remainingMonths = Math.floor((diffDays % 365) / 30)
    if (remainingMonths === 0) {
      return `${years} ${years === 1 ? 'año' : 'años'}`
    }
    return `${years} ${years === 1 ? 'año' : 'años'} y ${remainingMonths} ${remainingMonths === 1 ? 'mes' : 'meses'}`
  }
}

/**
 * Formatea el sexo de una mascota
 */
export function formatSex(sex: string | null): string {
  switch (sex?.toLowerCase()) {
    case 'male':
    case 'macho':
    case 'm':
      return 'Macho'
    case 'female':
    case 'hembra':
    case 'f':
      return 'Hembra'
    default:
      return 'No especificado'
  }
}

/**
 * Obtiene el icono para el sexo de una mascota
 */
export function getSexIcon(sex: string | null): string {
  switch (sex?.toLowerCase()) {
    case 'male':
    case 'macho':
    case 'm':
      return '♂'
    case 'female':
    case 'hembra':
    case 'f':
      return '♀'
    default:
      return '?'
  }
}

/**
 * Obtiene el color para el sexo de una mascota
 */
export function getSexColor(sex: string | null): string {
  switch (sex?.toLowerCase()) {
    case 'male':
    case 'macho':
    case 'm':
      return 'text-blue-600'
    case 'female':
    case 'hembra':
    case 'f':
      return 'text-pink-600'
    default:
      return 'text-gray-500'
  }
}

/**
 * Formatea una fecha para mostrar en la interfaz
 */
export function formatDate(
  date: string | null,
  formatStr: string = 'dd/MM/yyyy'
): string | undefined {
  if (!date) return undefined
  return format(new Date(date), formatStr, { locale: es })
}

/**
 * Formatea el peso de una mascota
 */
export function formatWeight(weight: number | null): string | undefined {
  if (!weight) return undefined
  return `${weight} kg`
}
