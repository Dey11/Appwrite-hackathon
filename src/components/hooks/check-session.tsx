import { useEffect, useState } from "react"
import auth from "@/appwrite/auth"

export function useCheckSession() {
  const [user, setUser] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkSession() {
      try {
        setLoading(true)
        const response = await auth.getSession()
        if (response.success) {
          setUser(response.payload.$id)
        } else {
          setUser(null)
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
