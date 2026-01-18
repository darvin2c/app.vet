'use client'

import { AgendaCalendar } from '@/components/agenda/agenda-calendar'
import CanAccess from '@/components/ui/can-access'

export default function AgendaPage() {
  return (
    <CanAccess resource="appointments" action="read">
      <div className="grid p-4 h-[calc(100vh-4rem)]">
        <AgendaCalendar className="h-full" />
      </div>
    </CanAccess>
  )
}
