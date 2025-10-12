import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Remueve todas las propiedades con valor `undefined` de un objeto
 * Mantiene propiedades con valores `null`, `0`, `false`, `""` (solo remueve `undefined`)
 * @param obj - El objeto del cual remover las propiedades undefined
 * @returns Un nuevo objeto sin las propiedades undefined
 */
export function removeUndefined<T extends Record<string, any>>(
  obj: T
): Partial<T> {
  const result: Partial<T> = {}

  for (const key in obj) {
    if (obj[key] !== undefined) {
      result[key] = obj[key]
    }
  }

  return result
}

/**
 * Formatea un número como moneda
 * @param amount - El monto a formatear
 * @param currency - La moneda (por defecto 'PEN')
 * @returns El monto formateado como string
 */
export function formatCurrency(
  amount: number,
  currency: string = 'PEN'
): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}
