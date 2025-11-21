'use client'

import { create } from 'zustand'

type AgendaInteractionStore = {
  dragBlocked: boolean
  setDragBlocked: (blocked: boolean) => void
}

const useAgendaInteractionStore = create<AgendaInteractionStore>((set) => ({
  dragBlocked: false,
  setDragBlocked: (blocked) => set({ dragBlocked: blocked }),
}))

export default useAgendaInteractionStore
