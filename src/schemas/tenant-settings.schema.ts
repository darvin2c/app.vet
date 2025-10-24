import { z } from 'zod'

// General Settings Schema
export const TenantGeneralSettingsSchema = z.object({
  name: z.string().nonempty('El nombre es requerido'),
  legal_name: z.string().optional().or(z.literal('')),
  email: z.email('Formato de email inválido').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  tax_id: z.string().optional().or(z.literal('')),
  address: z
    .object({
      street: z.string().optional().or(z.literal('')),
      city: z.string().optional().or(z.literal('')),
      state: z.string().optional().or(z.literal('')),
      postal_code: z.string().optional().or(z.literal('')),
      country: z.string().optional().or(z.literal('')),
    })
    .optional(),
  logo_url: z.string().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
})

// Business Settings Schema
export const TenantBusinessSettingsSchema = z.object({
  timezone: z
    .enum([
      'America/Lima',
      'America/Mexico_City',
      'America/Bogota',
      'America/Santiago',
      'America/Buenos_Aires',
      'UTC',
    ])
    .default('America/Lima'),
  currency: z
    .enum(['USD', 'EUR', 'PEN', 'MXN', 'COP', 'ARS', 'CLP'])
    .default('PEN'),
  language: z.enum(['es', 'en', 'pt']).default('es'),
  business_hours: z
    .object({
      monday: z.object({
        enabled: z.boolean().default(true),
        start: z.string().default('08:00'),
        end: z.string().default('18:00'),
      }),
      tuesday: z.object({
        enabled: z.boolean().default(true),
        start: z.string().default('08:00'),
        end: z.string().default('18:00'),
      }),
      wednesday: z.object({
        enabled: z.boolean().default(true),
        start: z.string().default('08:00'),
        end: z.string().default('18:00'),
      }),
      thursday: z.object({
        enabled: z.boolean().default(true),
        start: z.string().default('08:00'),
        end: z.string().default('18:00'),
      }),
      friday: z.object({
        enabled: z.boolean().default(true),
        start: z.string().default('08:00'),
        end: z.string().default('18:00'),
      }),
      saturday: z.object({
        enabled: z.boolean().default(false),
        start: z.string().default('08:00'),
        end: z.string().default('14:00'),
      }),
      sunday: z.object({
        enabled: z.boolean().default(false),
        start: z.string().default('08:00'),
        end: z.string().default('14:00'),
      }),
    })
    .default({
      monday: { enabled: true, start: '08:00', end: '18:00' },
      tuesday: { enabled: true, start: '08:00', end: '18:00' },
      wednesday: { enabled: true, start: '08:00', end: '18:00' },
      thursday: { enabled: true, start: '08:00', end: '18:00' },
      friday: { enabled: true, start: '08:00', end: '18:00' },
      saturday: { enabled: false, start: '08:00', end: '14:00' },
      sunday: { enabled: false, start: '08:00', end: '14:00' },
    }),
})

// Operational Settings Schema
export const TenantOperationalSettingsSchema = z.object({
  data_retention: z
    .object({
      appointments_months: z.number().min(1).max(120).default(24),
      audit_logs_months: z.number().min(1).max(60).default(12),
    })
    .default({
      appointments_months: 24,
      audit_logs_months: 12,
    }),
  notifications: z
    .object({
      email_notifications: z.boolean().default(true),
      sms_notifications: z.boolean().default(false),
    })
    .default({
      email_notifications: true,
      sms_notifications: false,
    }),
  auto_backup: z
    .object({
      enabled: z.boolean().default(true),
      frequency: z.enum(['daily', 'weekly', 'monthly']).default('daily'),
      retention_days: z.number().min(7).max(365).default(30),
    })
    .default({
      enabled: true,
      frequency: 'daily',
      retention_days: 30,
    }),
  two_factor_auth: z.boolean().default(false),
  session_timeout: z
    .object({
      enabled: z.boolean().default(true),
      minutes: z.number().min(5).max(1440).default(60),
    })
    .default({
      enabled: true,
      minutes: 60,
    }),
  password_policy: z
    .object({
      min_length: z.number().min(6).max(50).default(8),
      require_special_chars: z.boolean().default(true),
    })
    .default({
      min_length: 8,
      require_special_chars: true,
    }),
})

// Branding Settings Schema
export const TenantBrandingSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('light'),
  logo_url: z.string().optional().or(z.literal('')),
  logo_position: z.enum(['left', 'center', 'right']).default('left'),
  show_logo_text: z.boolean().default(true),
  custom_css: z.string().optional().or(z.literal('')),
  favicon_url: z.string().optional().or(z.literal('')),
})

// Danger Zone Schema
export const TenantDeletionSchema = z.object({
  confirmation_text: z
    .string()
    .nonempty('Debes escribir el texto de confirmación'),
  understand_consequences: z.boolean().refine((val) => val === true, {
    message: 'Debes confirmar que entiendes las consecuencias',
  }),
})

// Combined Settings Schema
export const TenantSettingsSchema = z.object({
  general: TenantGeneralSettingsSchema,
  business: TenantBusinessSettingsSchema,
  operational: TenantOperationalSettingsSchema,
  branding: TenantBrandingSettingsSchema,
})

// Type exports
export type TenantGeneralSettings = z.infer<typeof TenantGeneralSettingsSchema>
export type TenantBusinessSettings = z.infer<
  typeof TenantBusinessSettingsSchema
>
export type TenantOperationalSettings = z.infer<
  typeof TenantOperationalSettingsSchema
>
export type TenantBrandingSettings = z.infer<
  typeof TenantBrandingSettingsSchema
>
export type TenantSettings = z.infer<typeof TenantSettingsSchema>
export type TenantDeletion = z.infer<typeof TenantDeletionSchema>

// Settings sections enum
export enum SettingsSection {
  GENERAL = 'general',
  BUSINESS = 'business',
  OPERATIONAL = 'operational',
  BRANDING = 'branding',
  DANGER_ZONE = 'danger_zone',
}

// Currency options
export const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'Dólar Estadounidense (USD)', symbol: '$' },
  { value: 'EUR', label: 'Euro (EUR)', symbol: '€' },
  { value: 'PEN', label: 'Sol Peruano (PEN)', symbol: 'S/' },
  { value: 'MXN', label: 'Peso Mexicano (MXN)', symbol: '$' },
  { value: 'COP', label: 'Peso Colombiano (COP)', symbol: '$' },
  { value: 'ARS', label: 'Peso Argentino (ARS)', symbol: '$' },
  { value: 'CLP', label: 'Peso Chileno (CLP)', symbol: '$' },
] as const

// Timezone options
export const TIMEZONE_OPTIONS = [
  { value: 'America/Lima', label: 'Lima (UTC-5)' },
  { value: 'America/Mexico_City', label: 'Ciudad de México (UTC-6)' },
  { value: 'America/Bogota', label: 'Bogotá (UTC-5)' },
  { value: 'America/Santiago', label: 'Santiago (UTC-3)' },
  { value: 'America/Buenos_Aires', label: 'Buenos Aires (UTC-3)' },
  { value: 'UTC', label: 'UTC (UTC+0)' },
] as const

// Language options
export const LANGUAGE_OPTIONS = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
  { value: 'pt', label: 'Português' },
] as const

// Theme options
export const THEME_OPTIONS = [
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Oscuro' },
  { value: 'auto', label: 'Automático' },
] as const
