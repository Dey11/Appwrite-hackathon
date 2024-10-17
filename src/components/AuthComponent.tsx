"use client"
import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import authService from "@/appwrite/auth"
import { OAuthProvider } from "appwrite"
import Link from "next/link"

const AuthComponent = ({ path }: { path: string }) => {
  return (
    <div className="min-h-screen w-full bg-[#2F2F2F] md:flex md:bg-gradient-to-r md:from-[#FE8888] md:to-[#FE8888]/80">
      <div className="bg-[#FE8888] px-6 py-8 md:flex md:flex-1 md:flex-col md:justify-center md:px-4 lg:px-8">
        <div className="mx-auto max-w-md text-center md:text-left">
          <h1 className="mb-2 text-3xl font-bold text-black md:text-4xl">
            Rroist
          </h1>
          <p className="text-lg text-black md:text-xl">
            Hey there, Welcome to Rroist.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-8 md:bg-[#2F2F2F] md:px-6 lg:px-8">
        <Card className="w-full max-w-md border-none bg-transparent shadow-none">
          <CardHeader>
            <CardTitle className="mb-6 text-center text-xl font-semibold text-[#FE8888] md:mb-8 md:text-left md:text-2xl">
              {path == "/login" ? "login in to Rroist" : "Sign up to Rroist"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* OAuth Buttons */}
              <Button
                variant="outline"
                className="h-11 w-full border border-zinc-700 bg-transparent text-white hover:bg-zinc-800"
                onClick={() => {
                  authService.OAuthLogin(OAuthProvider.Google)
                }}
              >
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="mr-2 h-5 w-5"
                />
                <span className="text-sm md:text-base">
                  Login in with Google
                </span>
              </Button>

              <Button
                variant="outline"
                className="h-11 w-full border border-zinc-700 bg-transparent text-white hover:bg-zinc-800"
                onClick={() => {
                  authService.OAuthLogin(OAuthProvider.Github)
                }}
              >
                <Github className="mr-2 h-5 w-5" />
                <span className="text-sm md:text-base">
                  Login in with Github
                </span>
              </Button>

              {/* Separator */}
              <div className="relative my-6">
                <Separator className="bg-zinc-700" />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform bg-[#2F2F2F] px-2 text-sm text-zinc-400">
                  OR
                </span>
              </div>

              {/* Email/Password Form */}
              <form className="space-y-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="h-11 border border-zinc-700 bg-transparent text-white placeholder:text-sm focus:border-[#FE8888] focus:ring-[#FE8888] md:placeholder:text-base"
                />
                <Input
                  type="password"
                  placeholder="Enter a password"
                  className="h-11 border border-zinc-700 bg-transparent text-white placeholder:text-sm focus:border-[#FE8888] focus:ring-[#FE8888] md:placeholder:text-base"
                />
                <Button
                  type="button"
                  className="h-11 w-full bg-white text-black hover:bg-gray-100"
                  onClick={() => {
                    path == "/login"
                      ? authService.loginWithEmail(
                          "test@gmail.com",
                          "test123456",
                        )
                      : authService.signUpWithEmail(
                          "test@gmail.com",
                          "test123456",
                        )
                  }}
                >
                  <span className="text-sm md:text-base">
                    {path == "/login" ? "Log in" : "Sign up"}
                  </span>
                </Button>
              </form>

              {/* Forgot Password Link */}
              {path == "/login" ? (
                <Button
                  variant="link"
                  className="mt-2 w-full text-sm text-zinc-400 hover:text-[#FE8888] md:text-base"
                >
                  Forgot Password?
                </Button>
              ) : null}

              <p className="w-full text-center text-sm text-zinc-400 hover:text-[#FE8888] md:text-base">
                {path == "/login"
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <Link
                  href={path == "/login" ? "/signup" : "/login"}
                  className="hover:underline"
                >
                  {path == "/login" ? "sign up" : "login"}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AuthComponent
