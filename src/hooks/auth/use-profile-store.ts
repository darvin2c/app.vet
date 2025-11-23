import { create } from 'zustand'
import { Profile } from './use-user'

type ProfileStore = {
  profile: Profile | null
  setProfile: (profile: Profile | null) => void
}

const useProfileStore = create<ProfileStore>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
}))

export default useProfileStore
