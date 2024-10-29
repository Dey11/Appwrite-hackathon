import { create } from "zustand"

type Store = {
  authState: string | null
  updateAuthState: (newUser: string | null) => void
}

export const useStore = create<Store>()((set) => ({
  authState: null,
  updateAuthState: (newUser: string | null) => set({ authState: newUser }),
}))
