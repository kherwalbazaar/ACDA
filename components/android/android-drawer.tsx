"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  X,
  Home,
  Users,
  Calendar,
  BookOpen,
  Ticket,
  HeartHandshake,
  FileText,
  PhoneCall,
  DollarSign,
  Music,
  GraduationCap,
  Trophy,
  Share2,
  ChevronRight,
  ShieldCheck,
  Building2,
} from "lucide-react"

interface AndroidDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function AndroidDrawer({ isOpen, onClose }: AndroidDrawerProps) {
  const pathname = usePathname()

  if (!isOpen) return null

  const mainLinks = [
    { label: "Home", href: "/", icon: Home, color: "text-emerald-500 bg-emerald-50" },
    { label: "Members", href: "/members", icon: Users, color: "text-blue-500 bg-blue-50" },
    { label: "Cash Book", href: "/cash-book", icon: BookOpen, color: "text-amber-500 bg-amber-50" },
    { label: "Events & Programs", href: "/events", icon: Calendar, color: "text-purple-500 bg-purple-50" },
    { label: "Event Tickets", href: "/event-ticket", icon: Ticket, color: "text-rose-500 bg-rose-50" },
    { label: "Donations & Support", href: "/donations", icon: HeartHandshake, color: "text-pink-500 bg-pink-50" },
    { label: "Expenses", href: "/expens", icon: DollarSign, color: "text-indigo-500 bg-indigo-50" },
    { label: "Reports & Docs", href: "/reports", icon: FileText, color: "text-cyan-500 bg-cyan-50" },
    { label: "Contact Us", href: "/contact", icon: PhoneCall, color: "text-teal-500 bg-teal-50" },
  ]

  const categoryLinks = [
    { label: "Cultural Wing", href: "/cultural", icon: Music },
    { label: "Education Wing", href: "/education", icon: GraduationCap },
    { label: "Sports Wing", href: "/sport", icon: Trophy },
    { label: "Social Outreach", href: "/social", icon: Share2 },
  ]

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Android Slide-up Sheet */}
      <div className="absolute inset-x-0 bottom-0 max-h-[85vh] bg-white rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Android Sheet Drag Handle */}
        <div className="w-full pt-3 pb-1 flex justify-center items-center cursor-pointer" onClick={onClose}>
          <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
        </div>

        {/* Header inside Sheet */}
        <div className="px-5 py-3 border-b flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-emerald-500 overflow-hidden shadow-xs flex-shrink-0">
              <Image src="/mandawa-logo.jpg" alt="Logo" width={40} height={40} className="object-cover w-full h-full" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 leading-tight">ADIM LAHAH MANDAWA</h3>
              <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600 inline" />
                Adivasi Development Org
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 pb-12">
          {/* Main Quick Grid */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
              Main App Modules
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              {mainLinks.map((item) => {
                const Icon = item.icon
                const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-all active:scale-97 ${
                      active
                        ? "border-emerald-500 bg-emerald-50/70 shadow-xs"
                        : "border-slate-100 bg-slate-50/50 hover:bg-slate-100/80"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-800 line-clamp-1">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Wings & Programs */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
              Wings & Programs
            </h4>
            <div className="bg-slate-50 rounded-2xl border border-slate-100 divide-y divide-slate-100 overflow-hidden">
              {categoryLinks.map((item) => {
                const Icon = item.icon
                const active = pathname === item.href || pathname.startsWith(item.href)

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center justify-between p-3.5 transition-colors active:bg-slate-200/50 ${
                      active ? "bg-emerald-50 text-emerald-700 font-semibold" : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-medium">{item.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Info Card */}
          <div className="p-3.5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
              <Building2 className="w-3.5 h-3.5" />
              Regd. No. :- MBJ-3088-27 of 1992-93
            </div>
            <p className="text-[11px] text-slate-300">Bahanada, Simagadia, Khunta, Mayurbhanj, Odisha-757104</p>
          </div>
        </div>
      </div>
    </div>
  )
}
