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
import { Menu, X, User, LogOut, FolderOpen, Mail, Github } from "lucide-react"
import authService from "@/appwrite/auth"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const path = usePathname()
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

  useEffect(() => {
    async function getUser() {
      const session = await authService.getSession()
      if (!session.success) {
        setUser(null)
      } else {
        setUser({
          $id: session.payload.$id,
          imageUrl: session.payload.name || "",
          name: session.payload.name || "",
          email: session.payload.email || "",
        })
      }
    }
    getUser()
  }, [])

  const handleLogout = () => {
    authService.logout()
    setUser(null)
  }

  return (
    <nav className="fixed z-50 w-full px-4 md:px-0">
      <div className="relative mx-auto flex h-[40px] w-full items-center justify-between border-b p-2 backdrop-blur-xl">
        <Link href="/">
          <h1 className="mb-1 ml-2 text-3xl font-bold text-[#FE8888]">r.</h1>
        </Link>
        <div className="hidden md:flex md:items-center md:space-x-4">
          {user ? (
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage src={user.imageUrl} alt="User avatar" />
                    <AvatarFallback>
                      {user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>{user.name}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Mail className="mr-2 h-4 w-4" />
                    <span>{user.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/projects" className="flex w-full items-center">
                      <FolderOpen className="mr-2 h-4 w-4" />
                      <span>Projects</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link
                href={"https://github.com/Dey11/Appwrite-hackathon"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full border"
              >
                <Github className="cursor-pointer p-[1px]" />
              </Link>
            </div>
          ) : (
            <Link href="/login">
              <Button className="h-7 rounded-3xl bg-[#2F2F2F] text-white hover:bg-[#FE8888]">
                Log In
              </Button>
            </Link>
          )}
        </div>
        <button
          className="md:hidden"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {isMenuOpen && (
        <div className="absolute right-0 z-40 mr-4 mt-2 space-y-4 rounded-lg border-[1px] border-zinc-400 p-4 shadow-lg backdrop-blur-xl md:hidden">
          {user ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.imageUrl} alt="User avatar" />
                  <AvatarFallback>
                    {user.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">{user.email}</span>
                </div>
              </div>
              <Link
                href="/projects"
                className="flex items-center space-x-2 text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                <FolderOpen className="h-4 w-4" />
                <span>Projects</span>
              </Link>
              <Button
                className="h-7 w-full rounded-3xl bg-[#2F2F2F] text-white hover:bg-[#FE8888]"
                onClick={() => {
                  handleLogout()
                  setIsMenuOpen(false)
                }}
              >
                Log Out
              </Button>
            </div>
          ) : (
            <Link href="/login" onClick={() => setIsMenuOpen(false)}>
              <Button className="h-7 w-full rounded-3xl bg-[#2F2F2F] text-white hover:bg-[#FE8888]">
                Log In
              </Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
