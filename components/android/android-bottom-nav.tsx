"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, Calendar, BookOpen, HeartHandshake, FileText, PhoneCall } from "lucide-react"

export function AndroidBottomNav() {
  const pathname = usePathname()

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: Home,
      exact: true,
    },
    {
      label: "Members",
      href: "/members",
      icon: Users,
    },
    {
      label: "Events",
      href: "/events",
      icon: Calendar,
    },
    {
      label: "Cash Book",
      href: "/cash-book",
      icon: BookOpen,
    },
    {
      label: "Donations",
      href: "/donations",
      icon: HeartHandshake,
    },
    {
      label: "Contact",
      href: "/contact",
      icon: PhoneCall,
    },
  ]

  const isItemActive = (item: typeof navItems[0]) => {
    if (item.exact) return pathname === "/"
    return pathname === item.href || pathname.startsWith(item.href + "/")
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.25)]">
      <div className="max-w-md mx-auto flex items-center justify-between h-16 px-1">
        {navItems.map((item) => {
          const active = isItemActive(item)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full px-0.5 py-1 transition-all duration-200 active:scale-95 group ${
                active ? "text-emerald-400 font-semibold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {/* Android M3 Active Indicator Pill */}
              <div
                className={`relative flex items-center justify-center px-3 py-1 rounded-full transition-all duration-200 ${
                  active ? "bg-emerald-500/20 text-emerald-400 shadow-inner" : "group-hover:bg-slate-800/60"
                }`}
              >
                <Icon className={`w-4 sm:w-5 h-4 sm:h-5 transition-transform duration-200 ${active ? "scale-110" : ""}`} />
              </div>
              <span className="text-[10px] sm:text-[11px] mt-0.5 tracking-tight font-medium line-clamp-1">{item.label}</span>
            </Link>
          )
        })}
      </div>

      {/* Android Native Home Indicator Spacer */}
      <div className="h-1 bg-slate-900 w-full" />
    </nav>
  )
}
