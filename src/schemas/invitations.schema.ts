import { z } from 'zod'

export const invitationCreateSchema = z.object({
  emails: z
    .array(z.string().email('Formato de email inválido'))
    .min(1, 'Debes ingresar al menos un email'),
  role_id: z.string().nonempty('El rol es requerido'),
  expires_at: z.string().nonempty('La fecha de expiración es requerida'),
  message: z.string().optional(),
})

export type InvitationCreateSchema = z.infer<typeof invitationCreateSchema>

export const invitationSendFormSchema = z.object({
  emailsText: z.string().nonempty('Debes ingresar al menos un email'),
  role_id: z.string().nonempty('El rol es requerido'),
  expires_at: z.string().nonempty('La fecha de expiración es requerida'),
  message: z.string().optional(),
})
