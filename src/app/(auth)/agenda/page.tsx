'use client'

import { AgendaCalendar } from '@/components/agenda/agenda-calendar'
import CanAccess from '@/components/ui/can-access'

export default function AgendaPage() {
  return (
    <CanAccess resource="agenda" action="read">
      <div className="p-4 h-screen">
        <AgendaCalendar className="h-full" />
      </div>
    </CanAccess>
  )
}
