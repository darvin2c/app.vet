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

export function uuidV4() {
  const g: any = globalThis as any
  if (g?.crypto?.randomUUID) {
    return g.crypto.randomUUID()
  }
  const bytes = new Uint8Array(16)
  if (g?.crypto?.getRandomValues) {
    g.crypto.getRandomValues(bytes)
  } else {
    for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256)
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'))
  return `${hex[0]}${hex[1]}${hex[2]}${hex[3]}-${hex[4]}${hex[5]}-${hex[6]}${hex[7]}-${hex[8]}${hex[9]}-${hex[10]}${hex[11]}${hex[12]}${hex[13]}${hex[14]}${hex[15]}`
}
