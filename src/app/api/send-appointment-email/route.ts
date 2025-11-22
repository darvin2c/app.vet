import { NextResponse } from 'next/server'
import { sendAppointmentEmailAction } from '@/lib/actions/email/send-appointment-email'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = await sendAppointmentEmailAction({
      to: body.to,
      subject: body.subject,
      html: body.html,
      start: body.start,
      end: body.end,
      title: body.title,
      description: body.description,
      location: body.location,
      organizerEmail: body.organizerEmail,
      uid: body.uid,
    })
    return NextResponse.json(result)
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || 'error' },
      { status: 500 }
    )
  }
}
export const runtime = 'nodejs'
