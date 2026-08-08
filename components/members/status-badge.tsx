"use client"

import { CheckCircle2, Star } from "lucide-react"
import type { EnrichedMember } from "@/data/members"

export function StatusBadge({ member, className = "" }: { member: EnrichedMember; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap ${className}`}>
      {member.status === "paid" ? (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-emerald-100 text-emerald-800">
          <CheckCircle2 className="h-3 w-3" />
          Paid
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-amber-100 text-amber-800">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Pending
        </span>
      )}
      {member.vip && (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-yellow-100 text-yellow-700">
          <Star className="h-3 w-3 fill-current" />
          VIP
        </span>
      )}
    </span>
  )
}

export function formatPhone(phone?: string) {
  if (!phone) return "—"
  const p = phone.replace(/\D+/g, "")
  if (p.length === 10) return `+91 ${p.slice(0, 5)} ${p.slice(5)}`
  return phone
}