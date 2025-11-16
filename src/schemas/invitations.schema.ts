import { z } from 'zod'

export const invitationSendFormSchema = z.object({
  email: z.email('Formato de email inválido'),
  role_id: z.string().nonempty('El rol es requerido'),
})

export type invitationSendFormSchemaType = z.infer<
  typeof invitationSendFormSchema
>
