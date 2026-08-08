"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LoginDropdown } from "@/components/login-dropdown"

export function AndroidTopBar() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900 text-white shadow-md border-b border-slate-800">
      {/* Android Native Status Bar SafeArea Spacer */}
      <div className="h-2 sm:h-3 bg-slate-950 w-full" />

      <div className="px-3 py-2 flex items-center justify-between gap-2">
        {/* Left: Brand Logo & Title */}
        <Link href="/" className="flex items-center gap-2.5 active:scale-98 transition-transform">
          <div className="w-9 h-9 rounded-full bg-white p-0.5 shadow-sm overflow-hidden flex-shrink-0 border border-emerald-500">
            <Image
              src="/mandawa-logo.jpg"
              alt="ADIM LAKCHAR CHIRGAL GAONTA"
              width={36}
              height={36}
              className="object-cover w-full h-full rounded-full"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-extrabold text-sm sm:text-base tracking-wide bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
              ALCGG
            </span>
            <span className="text-[10px] text-slate-300 font-medium tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-2.5 h-2.5 text-emerald-400 inline" />
              ALCGG ORG
            </span>
          </div>
        </Link>

        {/* Right: Quick Android Actions */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(!searchOpen)}
            className="w-9 h-9 rounded-full text-slate-200 hover:text-white hover:bg-slate-800 active:bg-slate-700"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </Button>

          <LoginDropdown />
        </div>
      </div>

      {/* Expandable Mobile Search Bar */}
      {searchOpen && (
        <div className="px-3 pb-2.5 pt-1 bg-slate-900 border-t border-slate-800/60 animate-in slide-in-from-top-2 duration-200">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search members, events, reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-800 text-slate-100 placeholder-slate-400 rounded-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-slate-700"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  )
}
