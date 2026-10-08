/**
 * @file whatsapp-contact-list.tsx
 * @description Provides a WhatsApp-styled contact list for ACDA members,
 * including search, filtering by payment status, and collection summary.
 */

"use client"

import React, { useState, useMemo } from "react"
import { formatDate, formatINR } from "@/data/members"
import { Search, CheckCircle2, AlertCircle, UserCheck, ChevronDown, X, TrendingDown, TrendingUp, Wallet, Phone } from "lucide-react"
import { MemberAvatar } from "@/components/members/member-avatar"
import { formatPhone } from "@/components/members/status-badge"
import { useMembers, useCashBook } from "@/lib/firebase-data"

const MEMBERSHIP_FEE = 2000

function amountTint(totalPaid: number) {
  if (!totalPaid) return "bg-red-100 text-red-700"
  if (totalPaid < MEMBERSHIP_FEE) return "bg-yellow-100 text-yellow-800"
  if (totalPaid === MEMBERSHIP_FEE) return "bg-emerald-100 text-emerald-700"
  return "bg-blue-100 text-blue-700"
}

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
  const [showSearch, setShowSearch] = useState(false)
  const { members: enrichedMembers } = useMembers()
  const { txns } = useCashBook()

  const directIncome = txns.filter((t) => t.type === "Income").reduce((s, t) => s + t.amount, 0)
  const totalCollection = enrichedMembers.reduce((s, m) => s + m.totalPaid, 0) + directIncome
  const expense = txns.filter((t) => t.type === "Expense").reduce((s, t) => s + t.amount, 0)

  const stats = [
    { label: "Collection", value: formatINR(totalCollection), icon: TrendingDown, tint: "bg-emerald-500 text-white" },
    { label: "Expense", value: formatINR(expense), icon: TrendingUp, tint: "bg-rose-500 text-white" },
    { label: "Balance", value: formatINR(totalCollection - expense), icon: Wallet, tint: "bg-pink-500 text-white" },
  ]
  const filteredMembers = useMemo(() => {
    return enrichedMembers
      .filter((m) => {
        const matchesSearch =
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (m.phone || "").includes(searchQuery.trim())

        if (!matchesSearch) return false
        if (activeFilter === "paid") return m.status === "paid"
        if (activeFilter === "pending") return m.status === "pending"

        return true
      })
      .sort((a, b) => b.totalPaid - a.totalPaid || a.name.localeCompare(b.name))
  }, [enrichedMembers, searchQuery, activeFilter])

  return (
    <div className="w-full min-h-screen bg-slate-100 text-slate-900">
      {/* WhatsApp Header Banner */}
      <div className="bg-whatsapp text-white px-4 pt-4 pb-3 shadow-md">
        <div className="flex items-center justify-center">
          <h2 className="text-lg font-extrabold leading-tight tracking-wide uppercase text-center">
            ADIM LAHAH MANDAWA
          </h2>
        </div>
      </div>

      {/* Stats Cards */}
      <section className="px-2 py-2 flex items-stretch gap-1.5 overflow-x-auto bg-slate-100">
        {stats.map((s) => (
          <div key={s.label} className={`flex-1 min-w-[0] ${s.tint} rounded-xl shadow-sm px-2 py-2.5 flex flex-col items-center gap-1 text-center`}>
            <div className="inline-flex items-center justify-center h-6 w-6 rounded-md bg-white/20">
              <s.icon className="h-3.5 w-3.5" />
            </div>
            <span className="text-[13px] font-bold text-white leading-none">{s.value}</span>
            <span className="text-[8.5px] font-semibold text-white/80 uppercase tracking-wide leading-tight">{s.label}</span>
          </div>
        ))}
      </section>

      {/* Filter Tabs */}
      <div className="px-1.5 py-1.5 flex items-center gap-1.5 bg-slate-100">
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
              className={`flex-1 min-w-0 px-2 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap truncate text-center transition-all active:scale-95 ${
                active
                  ? "bg-white text-emerald-800 shadow-xs"
                  : "bg-slate-200 text-slate-600 hover:bg-slate-300"
              }`}
            >
              {tab.label}
            </button>
          )
        })}
        <button
          onClick={() => setShowSearch(!showSearch)}
          className={`shrink-0 h-8 w-8 flex items-center justify-center rounded-full transition-all active:scale-95 ${
            showSearch ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-600 hover:bg-slate-300"
          }`}
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="px-1.5 py-1.5 bg-slate-100">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search contact by name, role or mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full pl-9 pr-8 py-2 bg-white text-slate-900 placeholder-slate-400 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-xs"
            />
            <button
              onClick={() => { setSearchQuery(""); setShowSearch(false) }}
              className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

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
                  <div className="flex items-center gap-1.5 mt-0.5 min-w-0">
                    <p
                      className={`text-xs truncate font-medium ${
                        m.phone
                          ? expanded
                            ? "text-emerald-800"
                            : "text-slate-500"
                          : "text-slate-400"
                      }`}
                    >
                      {m.phone ? formatPhone(m.phone) : "+91xxxxxxxxxx"}
                    </p>
                    {m.phone && (
                      <a
                        href={`tel:${m.phone.replace(/\s+/g, "")}`}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Call ${m.name}`}
                        title={`Call ${m.name}`}
                        className="shrink-0 inline-flex items-center justify-center h-5 w-5 rounded-full border border-emerald-500 text-emerald-600 hover:bg-emerald-50 active:scale-90 transition"
                      >
                        <Phone className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Payment Status & Chevron Arrow */}
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${amountTint(m.totalPaid)}`}
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
