import nodemailer from 'nodemailer'

export function createTransporter() {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 0)
  const secure = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true'
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !port || !user || !pass) {
    throw new Error('Configuración SMTP incompleta')
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  })
}

export async function sendEmail(options: {
  to: string[]
  subject: string
  html: string
  from?: string
  attachments?: Array<{
    filename: string
    content: string | Buffer
    contentType?: string
    contentDisposition?: 'attachment' | 'inline'
    headers?: Record<string, string>
  }>
}) {
  const transporter = createTransporter()
  const from = options.from || process.env.SMTP_FROM
  const result = await transporter.sendMail({
    from,
    to: options.to.join(','),
    subject: options.subject,
    html: options.html,
    attachments: options.attachments,
  })
  return result
}
