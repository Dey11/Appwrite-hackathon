import { useEffect, useState } from "react"
import auth from "@/appwrite/auth"
import { useStore } from "@/lib/store"

export function useCheckSession() {
  const [user, setUser] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { authState, updateAuthState } = useStore()

  useEffect(() => {
    async function checkSession() {
      try {
        setLoading(true)

        if (authState != null) {
          setUser(authState)
          updateAuthState(authState)
          setLoading(false)
          return
        }
        const response = await auth.getSession()
        if (response.success) {
          setUser(response.payload.$id)
          updateAuthState(response.payload.$id)
        } else {
          setUser(null)
          updateAuthState(null)
        }
      } catch (err) {
        console.error(err)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [user])

  return { user, loading }
}
