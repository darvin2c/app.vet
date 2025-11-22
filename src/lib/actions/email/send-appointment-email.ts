'use server'

import { sendEmail } from '@/lib/smtp'
import { renderAppointmentEmailWrapper } from '@/lib/render-email'
import { uuidV4 } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function toIcsDate(iso: string) {
  const d = new Date(iso)
  const year = d.getUTCFullYear()
  const month = pad(d.getUTCMonth() + 1)
  const day = pad(d.getUTCDate())
  const hours = pad(d.getUTCHours())
  const minutes = pad(d.getUTCMinutes())
  const seconds = pad(d.getUTCSeconds())
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`
}

function escapeText(s: string) {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
}

export async function sendAppointmentEmailAction(params: {
  appointmentId: string
  to?: string
  subject?: string
  html?: string
  from?: string
}) {
  const supabase = await createClient()
  const { data: apptRaw, error } = await supabase
    .from('appointments')
    .select(
      `id, scheduled_start, scheduled_end,
       appointment_types(name),
       pets(name, customers(email)),
       staff(first_name,last_name)`
    )
    .eq('id', params.appointmentId)
    .single()

  const appt = apptRaw as any
  if (error || !appt) {
    throw new Error('No se encontró la cita')
  }

  const uid = appt.id || uuidV4()
  const dtstamp = toIcsDate(new Date().toISOString())
  const dtstart = toIcsDate(appt.scheduled_start)
  const dtend = toIcsDate(appt.scheduled_end)
  const typeName = (appt as any)?.appointment_types?.name || 'Cita'
  const petName = (appt as any)?.pets?.name || ''
  const summary = escapeText(
    `Cita: ${typeName}${petName ? ` - ${petName}` : ''}`
  )
  const staff = (appt as any)?.staff
    ? `${(appt as any).staff.first_name || ''} ${(appt as any).staff.last_name || ''}`.trim()
    : ''
  const descriptionDefault = `Detalles de cita para ${petName || 'paciente'}`
  const description = escapeText(descriptionDefault)
  const location = ''
  const fromAddress = params.from || process.env.SMTP_FROM
  const organizerEmail = fromAddress || undefined
  const toEmail = params.to || (appt as any)?.pets?.customers?.email
  if (!toEmail) {
    throw new Error('Destinatario no disponible')
  }
  const organizer = organizerEmail ? `ORGANIZER:mailto:${organizerEmail}` : ''
  const attendee = `ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${toEmail}`

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//App Vet//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${dtstart}`,
    `DTEND:${dtend}`,
    `SUMMARY:${summary}`,
    description ? `DESCRIPTION:${description}` : 'DESCRIPTION:',
    location ? `LOCATION:${location}` : undefined,
    organizer || undefined,
    attendee,
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean) as string[]
  const icsContent = icsLines.join('\r\n') + '\r\n'

  const defaultHtml = `
    <p>Hola,</p>
    <p>Te compartimos los detalles de la cita de <strong>${petName || ''}</strong>:</p>
    <ul>
      <li><strong>Fecha:</strong> ${new Date(appt.scheduled_start).toLocaleDateString('es-PE')}</li>
      <li><strong>Hora:</strong> ${new Date(appt.scheduled_start).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })} - ${new Date(appt.scheduled_end).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}</li>
      <li><strong>Tipo:</strong> ${typeName}</li>
      ${staff ? `<li><strong>Personal:</strong> ${staff}</li>` : ''}
      
    </ul>
    <p>Gracias.</p>
  `

  const wrappedHtml = await renderAppointmentEmailWrapper({
    title: 'Detalles de Cita',
    contentHtml: params.html || defaultHtml,
  })

  const result = await sendEmail({
    to: [toEmail],
    subject: params.subject || 'Detalles de Cita Médica',
    html: wrappedHtml,
    attachments: [
      {
        filename: 'cita.ics',
        content: icsContent,
        contentType: 'text/calendar; charset=utf-8; method=REQUEST',
        contentDisposition: 'attachment',
        headers: {
          'Content-Class': 'urn:content-classes:calendarmessage',
          'Content-Transfer-Encoding': '7bit',
          'X-MS-OLK-FORCEINSPECTOROPEN': 'TRUE',
        },
      },
    ],
  })

  return { ok: true, messageId: (result as any).messageId }
}
