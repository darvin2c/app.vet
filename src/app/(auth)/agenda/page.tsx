'use client'

import { AgendaCalendar } from '@/components/agenda/agenda-calendar'

export default function AgendaPage() {
  return (
    <div className="p-4 h-screen">
      <AgendaCalendar className="h-full" />
    </div>
  )
}
