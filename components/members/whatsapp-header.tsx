"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  Menu,
  Search,
  Bell,
  MoreVertical,
  X,
  Home,
  User,
  Users,
  Phone,
  FileText,
  ClipboardList,
  RefreshCw,
  Download,
  UserPlus,
  ChevronRight,
} from "lucide-react"
import { enrichedMembers } from "@/data/members"
import { AddMemberModal } from "@/components/members/add-member-modal"

const SITE_LINKS = [
  { href: "/", label: "Website Home", icon: Home },
  { href: "/members", label: "Members", icon: Users },
  { href: "/events", label: "Events / Programs", icon: ClipboardList },
  { href: "/cash-book", label: "Cash Book", icon: FileText },
  { href: "/contact", label: "Contact Us", icon: Phone },
]

export function WhatsAppHeader({
  title,
  subtitle,
  onSearchFocus,
  onOpenMember,
  onExport,
}: {
  title: string
  subtitle: string
  onSearchFocus: () => void
  onOpenMember: (id: string) => void
  onExport: () => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const pending = enrichedMembers.filter((m) => m.status === "pending")

  return (
    <>
      <header className="bg-whatsapp text-white px-3 py-2.5 shadow-md sticky top-0 z-40 flex items-center gap-1">
        <button
          onClick={() => setMenuOpen(true)}
          className="p-2 rounded-full hover:bg-whatsapp-dark transition"
          aria-label="Menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold leading-tight truncate">{title}</h1>
          <p className="text-xs text-emerald-100 opacity-90 truncate">{subtitle}</p>
        </div>

        <button
          onClick={onSearchFocus}
          className="p-2 rounded-full hover:bg-whatsapp-dark transition"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>

        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen((v) => !v)
              setMoreOpen(false)
            }}
            className="p-2 rounded-full hover:bg-whatsapp-dark transition relative"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {pending.length > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#25D366]" />
            )}
          </button>
          {notifOpen && (
            <Popup onClose={() => setNotifOpen(false)} align="right">
              <div className="w-72">
                <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wide border-b">
                  Payment Reminders
                </div>
                <div className="max-h-72 overflow-auto">
                  {pending.length === 0 && (
                    <div className="px-3 py-4 text-center text-xs text-slate-400">No pending payments 🎉</div>
                  )}
                  {pending.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        onOpenMember(m.id)
                        setNotifOpen(false)
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 text-left"
                    >
                      <img src={m.image} alt="" className="h-8 w-8 rounded-full object-cover" />
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm font-medium text-slate-800 truncate">{m.name}</span>
                        <span className="block text-xs text-amber-600">Fee pending · ₹{m.due.toLocaleString("en-IN")}</span>
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-300" />
                    </button>
                  ))}
                </div>
              </div>
            </Popup>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setMoreOpen((v) => !v)
              setNotifOpen(false)
            }}
            className="p-2 rounded-full hover:bg-whatsapp-dark transition"
            aria-label="More Options"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
          {moreOpen && (
            <Popup onClose={() => setMoreOpen(false)} align="right">
              <div className="w-48 py-1">
                <MenuItem icon={UserPlus} label="Add Member" onClick={() => { setAddOpen(true); setMoreOpen(false) }} />
                <MenuItem icon={Download} label="Export List" onClick={onExport} />
                <MenuItem icon={RefreshCw} label="Refresh" onClick={() => setMoreOpen(false)} />
              </div>
            </Popup>
          )}
        </div>
      </header>

      {/* Left drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl flex flex-col">
            <div className="px-4 py-5 bg-whatsapp text-white">
              <div className="flex items-center justify-between">
                <span className="font-bold">ADIM LAHAH MANDAWA</span>
                <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="p-1 rounded-full hover:bg-whatsapp-dark">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-xs text-emerald-100 mt-1">Community Member Management</p>
            </div>
            <nav className="flex-1 overflow-auto py-2">
              {SITE_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-700 text-sm font-medium"
                >
                  <l.icon className="h-5 w-5 text-whatsapp-dark" />
                  {l.label}
                </Link>
              ))}
              <button
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-700 text-sm font-medium"
              >
                <User className="h-5 w-5 text-whatsapp-dark" />
                My Profile
              </button>
            </nav>
            <div className="px-4 py-3 border-t text-xs text-slate-400">ADIM LAHAH MANDAWA © 2026</div>
          </aside>
        </div>
      )}

      <AddMemberModal open={addOpen} onOpenChange={setAddOpen} />
    </>
  )
}

function Popup({ children, onClose, align }: { children: React.ReactNode; onClose: () => void; align: "right" }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [onClose])

  return (
    <div
      ref={ref}
      className={`absolute top-full mt-1 ${align === "right" ? "right-0" : "left-0"} bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-100 z-50 overflow-hidden`}
    >
      {children}
    </div>
  )
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Menu
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50 text-sm text-slate-700"
    >
      <Icon className="h-4 w-4 text-whatsapp-dark" />
      {label}
    </button>
  )
}