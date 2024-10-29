"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import authService from "@/appwrite/auth"
import { OAuthProvider } from "appwrite"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useCheckSession } from "./hooks/check-session"
import Loading from "./Loading"

const AuthComponent = ({ path }: { path: string }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)

  const router = useRouter()
  const { user, loading } = useCheckSession()

  useEffect(() => {
    if (user && !loading) {
      setIsRedirecting(true)
      router.push("/")
    }
  }, [user, loading, router])

  if (loading || isRedirecting) {
    return <Loading />
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    if (email == "" || password == "") {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      setIsLoading(false)
      return
    }

    try {
      if (path == "/login") {
        const response = await authService.loginWithEmail(email, password)
        if (!response.success) {
          setError(response.message)
          return
        }
        router.push("/projects")
        return
      } else {
        const response = await authService.signUpWithEmail(email, password)
        if (!response.success) {
          setError(response.message)
          return
        }
        setSuccess("Account created successfully. Please login.")
        return
      }
    } catch (err) {
      setError("Some error occurred. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-zinc-950">
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4">
        <div className="relative w-full max-w-md">
          <div className="absolute -left-8 -top-8 h-72 w-72 rounded-full bg-[#FE8888]/20 blur-3xl" />
          <div className="absolute -bottom-8 -right-8 h-72 w-72 rounded-full bg-[#FF555F]/20 blur-3xl" />

          <Card className="relative z-10 border-zinc-800 bg-zinc-900/50 shadow-2xl">
            <CardHeader className="space-y-3">
              <CardTitle className="text-center text-2xl font-bold text-white">
                {path === "/login" ? "Welcome back" : "Create an account"}
              </CardTitle>
              <p className="text-center text-sm text-zinc-400">
                {path === "/login"
                  ? "Sign in to continue building amazing forms"
                  : "Start creating stunning feedback forms today"}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* OAuth Buttons */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="h-11 w-full border-zinc-700 bg-zinc-900/50 text-white hover:bg-zinc-800"
                  onClick={() => authService.OAuthLogin(OAuthProvider.Google)}
                >
                  <img
                    src="https://www.google.com/favicon.ico"
                    alt="Google"
                    className="mr-2 h-5 w-5"
                  />
                  Continue with Google
                </Button>
                <Button
                  variant="outline"
                  className="h-11 w-full border-zinc-700 bg-zinc-900/50 text-white hover:bg-zinc-800"
                  onClick={() => authService.OAuthLogin(OAuthProvider.Github)}
                >
                  <Github className="mr-2 h-5 w-5" />
                  Continue with GitHub
                </Button>
              </div>

              <div className="relative">
                <Separator className="bg-zinc-800" />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900 px-2 text-sm text-zinc-500">
                  or
                </span>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 border-zinc-700 bg-zinc-900/50 text-white placeholder:text-zinc-500 focus:border-[#FE8888] focus:ring-[#FE8888]"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 border-zinc-700 bg-zinc-900/50 text-white placeholder:text-zinc-500 focus:border-[#FE8888] focus:ring-[#FE8888]"
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-11 w-full bg-gradient-to-r from-[#FF555F] to-[#FE8888] text-white hover:from-[#FF555F]/90 hover:to-[#FE8888]/90"
                >
                  {isLoading
                    ? "Processing..."
                    : path === "/login"
                      ? "Sign in"
                      : "Create account"}
                </Button>

                {error && (
                  <p className="text-center text-sm text-red-500">{error}</p>
                )}
                {success && (
                  <p className="text-center text-sm text-green-500">
                    {success}
                  </p>
                )}
              </form>

              {path === "/login" && (
                <Button
                  variant="link"
                  className="w-full text-sm text-zinc-400 hover:text-[#FE8888]"
                >
                  Forgot your password?
                </Button>
              )}

              <p className="text-center text-sm text-zinc-400">
                {path === "/login"
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <Link
                  href={path === "/login" ? "/signup" : "/login"}
                  className="text-[#FE8888] hover:underline"
                >
                  {path === "/login" ? "Sign up" : "Sign in"}
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AuthComponent
