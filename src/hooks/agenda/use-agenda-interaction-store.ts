'use client'

import { create } from 'zustand'

type AgendaInteractionStore = {
  dragBlocked: boolean
  setDragBlocked: (blocked: boolean) => void
  editAppointment: any | null
  shareAppointment: any | null
  deleteAppointment: any | null
  setEditAppointment: (appointment: any | null) => void
  setShareAppointment: (appointment: any | null) => void
  setDeleteAppointment: (appointment: any | null) => void
}

const useAgendaInteractionStore = create<AgendaInteractionStore>((set) => ({
  dragBlocked: false,
  setDragBlocked: (blocked) => set({ dragBlocked: blocked }),
  editAppointment: null,
  shareAppointment: null,
  deleteAppointment: null,
  setEditAppointment: (appointment) =>
    set({ editAppointment: appointment, dragBlocked: !!appointment }),
  setShareAppointment: (appointment) =>
    set({ shareAppointment: appointment, dragBlocked: !!appointment }),
  setDeleteAppointment: (appointment) =>
    set({ deleteAppointment: appointment, dragBlocked: !!appointment }),
}))

export default useAgendaInteractionStore
