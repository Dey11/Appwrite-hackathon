"use client"

import Link from "next/link"
import React, { useState } from "react"
import { Button } from "./ui/button"
import { Menu, X } from "lucide-react"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinks = [
    { href: "/components", label: "Components" },
    { href: "/library", label: "Library" },
    { href: "/community", label: "Community" },
    { href: "/customers", label: "Customers" },
  ]

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
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
          <Link href="/login">
            <Button className="h-7 rounded-3xl bg-[#2F2F2F] text-white hover:bg-[#FE8888]">
              Log In
            </Button>
          </Link>
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
          <Link
            href="/login"
            className="block text-sm"
            onClick={() => setIsMenuOpen(false)}
          >
            Log In
          </Link>
        </div>
      )}
    </nav>
  )
}

export default Navbar
