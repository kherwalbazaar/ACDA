/**
 * @file whatsapp-contact-list.tsx
 * @description Provides a WhatsApp-styled contact list for ACDA members,
 * including search, filtering by payment status, and collection summary.
 */

"use client"

import React, { useState, useMemo } from "react"
import { formatDate, formatINR } from "@/data/members"
import { Search, CheckCircle2, AlertCircle, UserCheck, ChevronDown, X } from "lucide-react"
import { MemberAvatar } from "@/components/members/member-avatar"
import { useMembers } from "@/lib/firebase-data"

/**
 * WhatsAppContactList Component
 *
 * This component renders a list of members in a style similar to WhatsApp's contact list.
 * It includes a search bar, filtering options (All, Paid, Pending), and displays member
 * information such as name, designation, last payment date, and total amount paid.
 *
 * Features:
 * - Search by name or designation.
 * - Filter by payment status.
 * - Visual indicators for payment status (green/amber dots and badges).
 * - Displays total collection amount in the header.
 *
 * @returns A React component representing the member contact list.
 */
export function WhatsAppContactList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<"all" | "paid" | "pending">("all")
  const [expandedMemberId, setExpandedMemberId] = useState<string | null>(null)
  const { members: enrichedMembers } = useMembers()

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return enrichedMembers.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.designation.toLowerCase().includes(searchQuery.toLowerCase())

      if (!matchesSearch) return false
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
            ADIM LAHAH MANDAWA
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
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            {([
              { id: "all", label: `All (${enrichedMembers.length})` },
              { id: "paid", label: "Paid" },
              { id: "pending", label: "Pending" },
            ] as const).map((tab) => {
              const active = activeFilter === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`flex-1 min-w-0 px-2 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap truncate text-center transition-all active:scale-95 sm:px-3 ${
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
            <div className="bg-white rounded-xl border-2 border-emerald-300 px-3 py-1.5 shadow-sm text-center min-w-0">
              <p className="text-[10px] text-emerald-700 font-bold leading-tight uppercase tracking-wide">
Collection
              </p>
              <p className="text-lg font-black text-emerald-800 leading-tight truncate">{formatINR(totalCollection)}</p>
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
          filteredMembers.map((m) => {
            const expanded = expandedMemberId === m.id
            const paymentHistory = m.paymentHistory || []
            const paymentTotal = paymentHistory.reduce((sum, payment) => sum + (payment.amount || 0), 0)

            return (
            <article
              key={m.id}
              onClick={() => setExpandedMemberId(expanded ? null : m.id)}
              className={`${expanded ? "bg-emerald-100 border-emerald-300" : "bg-white border-emerald-200"} hover:bg-emerald-200 active:bg-emerald-300 cursor-pointer transition-colors group border-b-2`}
            >
              <div className="flex items-center justify-between p-2">
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
                  <div className="flex items-center gap-2">
                    <span className={`min-w-0 truncate font-bold text-sm leading-snug transition-colors ${expanded ? "text-emerald-950" : "text-slate-900 group-hover:text-emerald-700"}`}>
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
                  <p className={`text-xs truncate mt-0.5 font-medium ${expanded ? "text-emerald-800" : "text-slate-500"}`}>
                    {m.designation}
                  </p>
                </div>
              </div>

              {/* Right: Payment Status & Chevron Arrow */}
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${
                    m.totalPaid <= 0
                      ? "bg-red-100 text-red-700"
                      : m.totalPaid < 2000
                        ? "bg-yellow-100 text-yellow-700"
                        : m.totalPaid === 2000
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {formatINR(m.totalPaid)}
                </span>
                {m.status === "paid" ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                )}

                <ChevronDown className={`w-5 h-5 transition-transform ${expanded ? "rotate-180 text-emerald-700" : "text-slate-400"}`} aria-hidden="true" />
              </div>
              </div>

              {expanded && (
                <div className="border-t border-emerald-200 bg-emerald-50 px-5 py-4" onClick={(event) => event.stopPropagation()}>
                  <div className="grid grid-cols-2 gap-x-5 gap-y-4 text-sm">
                    {m.phone && <div className="col-span-2 flex items-end justify-between gap-3">
                      <div>
                        <span className="block text-xs font-semibold uppercase tracking-wide text-emerald-700">Phone</span>
                        <span className="text-sm font-medium text-slate-700">{m.phone}</span>
                      </div>
                      <div className="shrink-0 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-right shadow-sm">
                        <span className="block text-xs font-semibold uppercase tracking-wide text-emerald-700">Total Paid</span>
                        <span className="text-sm font-bold text-emerald-700">{formatINR(paymentTotal)}</span>
                      </div>
                    </div>}
                    {m.email && <div>
                      <span className="block text-xs font-semibold uppercase tracking-wide text-emerald-700">Email</span>
                      <span className="break-all text-sm font-medium text-slate-700">{m.email}</span>
                    </div>}
                  </div>

                  {paymentHistory.length > 0 && <div className="mt-5 border-t border-emerald-200 pt-3">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-emerald-700">
                      <span>Date</span>
                      <span>PAID</span>
                    </div>
                    <div className="mt-2 border-t border-emerald-200">
                      {paymentHistory.map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between gap-3 border-b border-emerald-200 py-2.5 text-sm">
                          <span className="min-w-0 truncate text-slate-600">{formatDate(payment.date)}</span>
                          <span className="shrink-0 font-bold text-emerald-700">{formatINR(payment.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>}
                </div>
              )}
            </article>
            )
          })
        )}
      </div>
    </div>
  )
}
