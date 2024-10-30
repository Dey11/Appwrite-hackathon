"use client"

import Link from "next/link"
import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Menu,
  X,
  User,
  LogOut,
  FolderOpen,
  Github,
  MailCheck,
} from "lucide-react"
import authService from "@/appwrite/auth"
import { usePathname, useRouter } from "next/navigation"
import { useStore } from "@/lib/store"

export default function Navbar() {
  const path = usePathname()
  const router = useRouter()
  if (path == "/login" || path == "/signup" || path.includes("/preview")) {
    return null
  }
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<{
    $id: string
    imageUrl: string
    name: string
    email: string
  } | null>(null)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const { authState, updateAuthState } = useStore()

  useEffect(() => {
    async function getUser() {
      const session = await authService.getSession()
      if (!session.success) {
        updateAuthState(null)
        setUser(null)
      } else {
        updateAuthState(session.payload.$id)
        setUser({
          $id: session.payload.$id,
          imageUrl: session.payload.name || "",
          name: session.payload.name || "",
          email: session.payload.email || "",
        })
      }
    }
    getUser()
    console.log(authState, "authState in navbar")
  }, [updateAuthState, authState])

  if (path == "/login" || path == "/signup" || path.includes("/preview")) {
    return null
  }

  const handleLogout = () => {
    authService.logout()
    router.push("/")
    setUser(null)
  }

  return (
    <nav className="fixed z-50 w-full">
      <div className="relative mx-auto flex h-16 w-full items-center justify-between border-b border-zinc-800/50 bg-zinc-700/10 px-4 backdrop-blur-xl md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <h1 className="text-3xl font-bold text-[#FE8888]">Rroist.</h1>
          <div className="hidden rounded-full bg-zinc-800 px-2 py-1 text-xs text-zinc-400 md:block">
            Beta
          </div>
        </Link>

        <div className="hidden md:flex md:items-center md:gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex cursor-pointer items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 transition-colors hover:border-zinc-700">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user.imageUrl} alt="User avatar" />
                      <AvatarFallback className="bg-[#FE8888] text-white">
                        {user.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-zinc-400">
                      {user.name || "Account"}
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="border-zinc-800 bg-zinc-900"
                >
                  <DropdownMenuItem className="text-zinc-300">
                    <User className="mr-2 h-4 w-4 text-[#FE8888]" />
                    <span>{user.name || "Account"}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-zinc-300">
                    <MailCheck className="mr-2 h-4 w-4 text-[#FE8888]" />
                    <span>{user.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-zinc-300">
                    <Link href="/projects" className="flex w-full items-center">
                      <FolderOpen className="mr-2 h-4 w-4 text-[#FE8888]" />
                      <span>Projects</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-zinc-300"
                  >
                    <LogOut className="mr-2 h-4 w-4 text-[#FE8888]" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link
                href={"https://github.com/Dey11/Appwrite-hackathon"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 transition-colors hover:border-zinc-700"
              >
                <Github className="h-4 w-4 text-zinc-400" />
              </Link>
            </div>
          ) : (
            <Link href="/login">
              <Button className="rounded-full bg-[#FE8888] px-6 text-white hover:bg-[#FF555F]">
                Log In
              </Button>
            </Link>
          )}
        </div>

        <button
          className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 md:hidden"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="absolute right-0 z-40 mr-4 mt-2 w-64 space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/95 p-4 shadow-xl backdrop-blur-xl md:hidden">
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3 border-b border-zinc-800 pb-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.imageUrl} alt="User avatar" />
                  <AvatarFallback className="bg-[#FE8888] text-white">
                    {user.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm text-zinc-300">{user.name}</span>
                  <span className="text-xs text-zinc-500">{user.email}</span>
                </div>
              </div>
              <Link
                href="/projects"
                className="flex items-center space-x-2 rounded-lg px-2 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-800"
                onClick={() => setIsMenuOpen(false)}
              >
                <FolderOpen className="h-4 w-4 text-[#FE8888]" />
                <span>Projects</span>
              </Link>
              <Link
                href={"https://github.com/Dey11/Appwrite-hackathon"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 rounded-lg px-2 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-800"
                onClick={() => setIsMenuOpen(false)}
              >
                <Github className="h-4 w-4 text-[#FE8888]" />
                <span>GitHub</span>
              </Link>
              <Button
                className="mt-2 w-full rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                onClick={() => {
                  handleLogout()
                  setIsMenuOpen(false)
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </Button>
            </div>
          ) : (
            <Link href="/login" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full rounded-lg bg-[#FE8888] text-white hover:bg-[#FF555F]">
                Log In
              </Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
