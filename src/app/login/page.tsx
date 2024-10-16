"use client"

import { useState, useEffect } from "react"
import { account } from "@/lib/appWriter"
import { ID, OAuthProvider } from "appwrite"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { randomBytes } from "crypto"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AuthComponent() {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [userId, setUserId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState("email") // 'email' | 'otp' | 'success'
  const router = useRouter()

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await account.createEmailToken(ID.unique(), email)
      setUserId(response.userId)
      setStep("otp")
    } catch (err) {
      setError("Failed to send OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const session = await account.createSession(userId, otp)
      localStorage.setItem("appwriteSession", JSON.stringify(session))
      setStep("success")
      //   setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err) {
      setError("Invalid OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await account.deleteSession("current")
    } catch (e) {
      console.error(e)
    }
  }

  const handleOAuthLogin = (provider: OAuthProvider) => {
    account.createOAuth2Session(
      provider,
      "http://localhost:3000/dashboard", // Success URL
      "http://localhost:3000", // Failure URL
    )
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
          <CardDescription>Login or sign up to continue</CardDescription>
        </CardHeader>
        <CardContent>
          {step === "email" && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                required
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setOtp(e.target.value)
                }
                required
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>
            </form>
          )}

          {step === "success" && (
            <Alert>
              <AlertDescription>
                Login successful! Redirecting to dashboard...
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="mt-6 space-y-2">
            <Button
              onClick={() => handleOAuthLogin(OAuthProvider.Google)}
              className="w-full"
              variant="outline"
            >
              Continue with Google
            </Button>
            <Button
              onClick={() => handleOAuthLogin(OAuthProvider.Github)}
              className="w-full"
              variant="outline"
            >
              Continue with GitHub
            </Button>
            <Button
              onClick={() => handleLogout()}
              className="w-full"
              variant="outline"
            >
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
