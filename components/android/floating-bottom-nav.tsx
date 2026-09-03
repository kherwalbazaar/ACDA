"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen } from "lucide-react"
import { useHideOnScroll } from "@/hooks/use-hide-on-scroll"
import { subscribeNavbarForcedHidden, isNavbarForcedHidden } from "@/hooks/navbar-store"

export function FloatingBottomNav() {
  const pathname = usePathname()
  const scrollVisible = useHideOnScroll()
  const [inputFocused, setInputFocused] = useState(false)
  const [forcedHidden, setForcedHidden] = useState(isNavbarForcedHidden())

  useEffect(() => subscribeNavbarForcedHidden(setForcedHidden), [])
  useEffect(() => {
    const isEditable = (el: Element | null) =>
      !!el &&
      (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || (el as HTMLElement).isContentEditable)
    const onFocusIn = (e: FocusEvent) => setInputFocused(isEditable(e.target as Element))
    document.addEventListener("focusin", onFocusIn)
    return () => document.removeEventListener("focusin", onFocusIn)
  }, [])

  const isHomeOrCashBook = pathname === "/" || pathname.startsWith("/cash-book")
  const isVisible =
    (isHomeOrCashBook || scrollVisible) &&
    !inputFocused &&
    !forcedHidden &&
    !pathname.startsWith("/chat") &&
    !pathname.startsWith("/profile/member")

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: Home,
      exact: true,
    },
    {
      label: "Cash Book",
      href: "/cash-book",
      icon: BookOpen,
    },
  ]

  const isItemActive = (item: typeof navItems[0]) => {
    if (item.exact) return pathname === "/"
    return pathname === item.href || pathname.startsWith(item.href + "/")
  }
  const activeIndex = navItems.findIndex(isItemActive)

  return (
    <div
      className={`fixed bottom-4 left-0 right-0 z-50 px-4 pointer-events-none transition-all duration-300 ease-out ${
        isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-24 opacity-0 scale-95"
      }`}
    >
      <nav className="relative max-w-sm mx-auto bg-whatsapp border border-whatsapp-dark/60 rounded-full p-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.45)] flex items-center justify-between pointer-events-auto">
        {activeIndex >= 0 && (
          <div
            className="absolute inset-y-1.5 left-1.5 w-[calc(50%-0.375rem)] rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 shadow-md transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(${activeIndex * 100}%)` }}
            aria-hidden="true"
          />
        )}
        {navItems.map((item) => {
          const active = isItemActive(item)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center justify-center gap-2 flex-1 py-2.5 px-3 rounded-full text-xs font-medium transition-all duration-300 active:scale-95 ${
                active
                  ? "text-white font-bold"
                  : "text-emerald-100/80 hover:text-white"
              }`}
            >
              <Icon className={`w-4 h-4 z-10 transition-transform duration-200 ${active ? "scale-110" : ""}`} />
              <span className="z-10 tracking-tight">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
