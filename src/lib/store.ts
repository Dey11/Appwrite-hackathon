import { create } from "zustand"
import auth from "@/appwrite/auth"

interface SessionState {
  user: string | null
  loading: boolean
  setUser: (user: string | null) => void
  checkSession: () => Promise<void>
}

export const useSession = create<SessionState>((set) => ({
  user: null,
  loading: false,
  setUser: (user) => set({ user }),
  checkSession: async () => {
    set({ loading: true })
    try {
      const response = await auth.getSession()
      if (response.success) {
        set({ user: response.payload.$id })
      } else {
        set({ user: null })
      }
    } catch (err) {
      console.error(err)
      set({ user: null })
    } finally {
      set({ loading: false })
    }
  },
}))