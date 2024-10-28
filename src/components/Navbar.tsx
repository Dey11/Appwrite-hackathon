"use client"

import Link from "next/link"
import React, { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Menu, X } from "lucide-react"
import authService from "@/appwrite/auth"
import { usePathname } from "next/navigation"
import { useStore } from "@/lib/store"

const Navbar = () => {
  const path = usePathname()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  // const [user, setUser] = useState<string | null>(null)
  const { authState, updateAuthState } = useStore()

  const navLinks = [
    { href: "/get-started", label: "Get Started" },
    { href: "/projects", label: "Projects" },
    { href: "/support", label: "Support" },
    { href: "/about-us", label: "About Us" },
  ]

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    async function getUser() {
      const session = await authService.getSession()
      if (!session.success) {
        updateAuthState(null)
        // setUser(null)
      } else {
        updateAuthState(session.payload.$id)
        // setUser(session.payload.$id)
      }
    }
    getUser()
    console.log(authState, "authState in navbar")
  }, [updateAuthState, authState])

  if (path == "/login" || path == "/signup" || path.includes("/preview")) {
    return null
  }

  return (
    <nav className="fixed z-50 mt-5 w-full px-4 py-2 md:px-0">
      <div className="relative mx-auto flex h-[40px] w-full max-w-[660px] items-center justify-between rounded-2xl border-[1px] border-zinc-400 p-2 shadow-[4px_-1px_25.6px_0px_rgba(76,76,76,0.5)] backdrop-blur-lg">
        <Link href="/">
          <h1 className="mb-1 ml-2 text-3xl font-bold text-[#FE8888]">r.</h1>
        </Link>
        <div className="hidden gap-8 md:flex">
          {navLinks.map((link) => (
            <div key={link.href} className="relative">
              <Link href={link.href} className="relative inline-block text-sm">
                {link.label}
              </Link>
            </div>
          ))}
        </div>
        <div className="hidden md:block">
          {authState != null ? (
            <Button
              className="h-7 rounded-3xl bg-[#2F2F2F] text-white hover:bg-[#FE8888]"
              onClick={() => {
                authService.logout()
                updateAuthState(null)
                // setUser(null)
              }}
            >
              Log Out
            </Button>
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
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {authState != null ? (
            <Button
              className="h-7 rounded-3xl bg-[#2F2F2F] text-white hover:bg-[#FE8888]"
              onClick={() => {
                authService.logout()
              }}
            >
              Log Out
            </Button>
          ) : (
            <Link href="/login">
              <Button className="h-7 rounded-3xl bg-[#2F2F2F] text-white hover:bg-[#FE8888]">
                Log In
              </Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
