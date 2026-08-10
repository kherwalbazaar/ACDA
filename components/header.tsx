"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { LoginDropdown } from "@/components/login-dropdown"

export function Header() {
  const [fontScale, setFontScale] = useState<number>(100)
  const [navOpen, setNavOpen] = useState<boolean>(false)
  const pathname = usePathname()

  const navLinkClass = (href: string) => {
    const active = pathname === href || pathname?.startsWith(href + "/")
    return (
      "px-3 py-2 transition-colors rounded-md " +
      (active ? "bg-white/20 text-white font-semibold" : "text-white/90 hover:text-white")
    )
  }

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("fontScale") : null
    if (saved) {
      const val = parseInt(saved, 10)
      if (!Number.isNaN(val)) {
        setFontScale(val)
        document.documentElement.style.fontSize = `${val}%`
      }
    }
  }, [])

  const applyScale = (next: number) => {
    const clamped = Math.max(80, Math.min(140, next))
    setFontScale(clamped)
    if (typeof window !== "undefined") {
      window.localStorage.setItem("fontScale", String(clamped))
    }
    document.documentElement.style.fontSize = `${clamped}%`
  }

  return (
    <header className="bg-white border-b">
      {/* Top bar with accessibility options */}
      <div className="bg-yellow-400 pl-4 pr-0 py-2 relative z-40">
        <div className="w-full flex justify-end items-center pr-0">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-7 w-7 text-xs"
              onClick={() => applyScale(fontScale - 10)}
              aria-label="Decrease Font Size"
              title="A- Decrease Font Size"
            >
              A-
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-7 w-7 text-xs"
              onClick={() => applyScale(100)}
              aria-label="Reset Font Size"
              title="A Reset Font Size"
            >
              A
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-7 w-7 text-xs"
              onClick={() => applyScale(fontScale + 10)}
              aria-label="Increase Font Size"
              title="A+ Increase Font Size"
            >
              A+
            </Button>

            <LoginDropdown />
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center">
              <Image
                src="/mandawa-logo.jpg"
                alt="ADIM LAHAH MANDAWA Logo"
                width={96}
                height={96}
                className="object-contain"
              />
            </div>
          </div>

          {/* Center Title */}
          <div className="text-center flex-1 mx-1 sm:mx-3 md:mx-8">
            <h1 className="mb-1 font-extrabold tracking-tight text-2xl sm:text-3xl md:text-4xl lg:text-5xl bg-gradient-to-r from-teal-600 via-purple-600 to-pink-600 bg-clip-text text-transparent whitespace-nowrap">
              ADIM LAHAH MANDAWA
            </h1>
            <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-green-800 whitespace-nowrap">ADIM LAHAH MANDAWA</p>
            <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-blue-800 whitespace-nowrap">Regd. No. :- MBJ-3088-27 of 1992-93, Under Societies Act XXI of 1860</p>
            <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-red-800 whitespace-nowrap">Bahanada, Simagadia, Khunta, Mayurbhanj, Odisha-757104</p>
          </div>

          <div className="flex items-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 flex items-center justify-center">
              <Image
                src="/mandawa-logo.jpg"
                alt="ADIM LAHAH MANDAWA Logo"
                width={96}
                height={96}
                className="object-contain"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Navigation moved below header (hidden on small screens) */}
      <div className="bg-green-600 border-t hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center justify-center overflow-x-auto">
            <div className="flex items-center space-x-6 py-2 text-sm whitespace-nowrap">
              <Link href="/" className={navLinkClass("/")}>
                Home
              </Link>
              <Link href="/members" className={navLinkClass("/members")}>
                Members
              </Link>
              <Link href="/cash-book" className={navLinkClass("/cash-book")}>
                Cash Book
              </Link>
              <Link href="/events" className={navLinkClass("/events")}>
                Events / Programs
              </Link>
              <Link href="/event-ticket" className={navLinkClass("/event-ticket")}>
                Event Ticket
              </Link>
              <Link href="/donations" className={navLinkClass("/donations")}>
                Donations / Support
              </Link>
              <Link href="/expens" className={navLinkClass("/expens")}>
                Expens
              </Link>
              <Link href="/reports" className={navLinkClass("/reports")}>
                Reports
              </Link>
              <Link href="/contact" className={navLinkClass("/contact")}>
                Contact Us
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
