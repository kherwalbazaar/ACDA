"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { formatINR, type EnrichedMember } from "@/data/members"
import { Search, ShieldCheck, CheckCircle2, AlertCircle, UserCheck, ChevronRight, X } from "lucide-react"
import { MemberAvatar } from "@/components/members/member-avatar"
import { useMembers } from "@/lib/firebase-data"

const lastPaidLabel = (m: EnrichedMember) => {
  const raw = m.lastPayment?.date || m.paidDate
  if (!raw) return "—"
  return new Date(raw).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
}

export function WhatsAppContactList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<"all" | "executive" | "paid" | "pending">("all")
  const { members: enrichedMembers } = useMembers()

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return enrichedMembers.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.designation.toLowerCase().includes(searchQuery.toLowerCase())

      if (!matchesSearch) return false

      if (activeFilter === "executive") {
        return m.designation === "President" || m.designation === "Secretary" || m.designation.includes("Executive")
      }
      if (activeFilter === "paid") return m.status === "paid"
      if (activeFilter === "pending") return m.status === "pending"

      return true
    })
  }, [enrichedMembers, searchQuery, activeFilter])

  const totalCollection = enrichedMembers.reduce((s, m) => s + m.totalPaid, 0)

  return (
    <div className="w-full min-h-screen bg-slate-100 text-slate-900">
      {/* WhatsApp Header Banner */}
      <div className="bg-emerald-800 text-white px-4 pt-4 pb-3 shadow-md">
        <div className="flex items-center justify-center mb-3">
          <h2 className="text-lg font-extrabold leading-tight tracking-wide uppercase text-center">
            ADIM CULTURE AND DEVELOPMENT ASSOCIATION
          </h2>
        </div>

        {/* Search Bar Input */}
        <div className="relative flex items-center mb-3">
          <Search className="w-4 h-4 absolute left-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search contact by name or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-white text-slate-900 placeholder-slate-400 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* WhatsApp Filter Tabs + Total Collection (horizontal) */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-1 min-w-0 justify-center">
            {[
              { id: "all", label: `All (${enrichedMembers.length})` },
              { id: "executive", label: "Executive" },
              { id: "paid", label: "Paid" },
              { id: "pending", label: "Pending" },
            ].map((tab) => {
              const active = activeFilter === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${
                    active
                      ? "bg-white text-emerald-800 shadow-xs"
                      : "bg-emerald-700/60 text-emerald-100 hover:bg-emerald-700"
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Total Collection */}
          <div className="shrink-0 pt-0.5">
            <div className="bg-white rounded-xl border-2 border-emerald-300 px-3 py-1.5 shadow-sm text-center">
              <p className="text-[10px] text-emerald-700 font-bold leading-tight uppercase tracking-wide">
Collection
              </p>
              <p className="text-lg font-black text-emerald-800 leading-tight">{formatINR(totalCollection)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact List */}
      <div className="space-y-0.5 bg-white shadow-xs">
        {filteredMembers.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <UserCheck className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-medium">No contacts match your search.</p>
          </div>
        ) : (
          filteredMembers.map((m) => (
            <Link
              key={m.id}
              href={`/profile/member/${m.id}?src=home`}
              className="flex items-center justify-between p-3.5 hover:bg-slate-50 active:bg-slate-100/80 cursor-pointer transition-colors group border-b-2 border-emerald-200"
            >
              {/* Left: Avatar with Online Dot */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="relative flex-shrink-0">
                  <MemberAvatar
                    name={m.name}
                    image={m.image}
                    className="w-12 h-12 rounded-full border border-slate-200 shadow-2xs"
                  />
                  {/* Status green dot */}
                  <span
                    className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                      m.status === "paid" ? "bg-emerald-500" : "bg-amber-400"
                    }`}
                  />
                </div>

                {/* Contact Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-slate-900 truncate leading-snug group-hover:text-emerald-700 transition-colors">
                      {m.name}
                    </span>
                    {m.designation === "President" && (
                      <span className="bg-amber-100 text-amber-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border border-amber-200">
                        PRESIDENT
                      </span>
                    )}
                    {m.designation === "Secretary" && (
                      <span className="bg-blue-100 text-blue-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border border-blue-200">
                        SECRETARY
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5 font-medium flex items-center gap-1">
                    <span>{m.designation}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[11px] text-slate-400">
                      {m.status === "paid" ? `Last Paid: ${lastPaidLabel(m)}` : "Pending"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Right: Payment Badge & Chevron Arrow */}
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <div className="text-right hidden sm:block">
                  <div className={`text-xs font-bold ${m.status === "paid" ? "text-emerald-700" : "text-amber-700"}`}>
                    {m.totalPaid > 0 ? formatINR(m.totalPaid) : "₹0"}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {m.status === "paid" ? "Contrib. Paid" : "Unpaid"}
                  </span>
                </div>

                {m.status === "paid" ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                )}

                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
