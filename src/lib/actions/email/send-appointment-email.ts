'use server'

import { sendEmail } from '@/lib/smtp'
import { uuidV4 } from '@/lib/utils'

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
  to: string
  subject: string
  html: string
  start: string
  end: string
  title: string
  description?: string
  location?: string
  organizerEmail?: string
  uid?: string
}) {
  const uid = params.uid || uuidV4()
  const dtstamp = toIcsDate(new Date().toISOString())
  const dtstart = toIcsDate(params.start)
  const dtend = toIcsDate(params.end)
  const summary = escapeText(params.title)
  const description = escapeText(params.description || '')
  const location = escapeText(params.location || '')
  const fromAddress = process.env.SMTP_FROM
  const organizerEmail = params.organizerEmail || fromAddress || undefined
  const organizer = organizerEmail ? `ORGANIZER:mailto:${organizerEmail}` : ''
  const attendee = `ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${params.to}`

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

  const result = await sendEmail({
    to: [params.to],
    subject: params.subject,
    html: params.html,
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
