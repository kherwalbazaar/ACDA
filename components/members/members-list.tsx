"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { type Member } from "@/data/members"
import { useMembers } from "@/lib/firebase-data"

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)
}

export function MembersList() {
  const [q, setQ] = useState("")
  const [status, setStatus] = useState<"all" | "paid" | "unpaid">("all")
  const { members: source, loading } = useMembers()

  const rows = useMemo(() => {
    return source
      .map((m) => {
        const total = (m.paymentHistory || []).reduce((s, p) => s + (p.amount || 0), 0)
        const paid = m.status === "paid" || total > 0
        return { ...m, total, paid }
      })
      .filter((m) => (q ? m.name.toLowerCase().includes(q.toLowerCase()) : true))
      .filter((m) => (status === "all" ? true : status === "paid" ? m.paid : !m.paid))
  }, [source, q, status])

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search members by name"
          className="w-full sm:max-w-sm px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "all" | "paid" | "unpaid")}
          className="w-full sm:w-40 px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="all">All</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rows.map((m) => (
          <Link
            key={m.id}
            href={`/profile/member?id=${m.id}`}
            className="p-3 rounded-xl border shadow-sm bg-white cursor-pointer hover:shadow-md transition block group"
          >
            <div className="flex items-center gap-3">
              <img
                src={m.image}
                alt={m.name}
                className="w-12 h-12 rounded-full object-cover border"
                onError={(e) => {
                  ;(e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=0D9488&color=fff`
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="font-semibold leading-tight group-hover:text-emerald-700 transition-colors truncate">
                  {m.name}
                </div>
                <div className="text-xs text-gray-500 leading-tight">
                  {m.paidDate ? `Last paid: ${m.paidDate}` : "No payment record"}
                </div>
              </div>
              <span
                className={
                  "text-xs px-2 py-1 rounded-full font-semibold shrink-0 " +
                  (m.paidDate || m.total > 0
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-red-100 text-red-700 border border-red-200")
                }
              >
                {m.paidDate || m.total > 0 ? "Paid" : "Unpaid"}
              </span>
            </div>

            {m.paymentHistory.length > 0 && (
              <div className="mt-3 text-sm border-t pt-2">
                <div className="font-medium text-xs text-slate-500">Payments Summary</div>
                <div className="mt-1 flex justify-between text-gray-800 text-xs">
                  <span>Total Contribution</span>
                  <span className="font-bold text-emerald-700">{formatINR(m.total)}</span>
                </div>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
