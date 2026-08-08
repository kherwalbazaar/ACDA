"use client"

import { CheckCircle2 } from "lucide-react"
import type { Payment } from "@/data/members"
import { formatINR, formatDate } from "@/data/members"

export function PaymentHistory({ payments }: { payments: Payment[] }) {
  const sorted = [...payments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <section className="px-4 mt-6 space-y-3">
      <h3 className="text-sm font-bold text-slate-900 tracking-wide">Payment History</h3>

      {sorted.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center text-sm text-slate-400">
          No payments recorded yet
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-3">
        {sorted.map((p, i) => (
          <div key={p.id} className="relative pl-9">
            {/* Timeline node + line */}
            <span className="absolute left-2 top-2 h-3 w-3 rounded-full bg-whatsapp ring-4 ring-emerald-50" />
            {i < sorted.length - 1 && <span className="absolute left-[17px] top-6 bottom-[-14px] w-0.5 bg-slate-200" />}

            <div className="bg-white p-4 rounded-2xl border border-slate-100 border-l-4 border-whatsapp shadow-sm space-y-2">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-xs font-mono font-semibold text-slate-500">#{p.receiptNo || "N/A"}</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="h-3 w-3" />
                  Success
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-1">
                <div>
                  <span className="text-xs text-slate-400 block">Amount Paid</span>
                  <span className="text-base font-extrabold text-slate-900">{formatINR(p.amount)}</span>
                </div>
                <span className="text-xs text-slate-500">{formatDate(p.date)}</span>
              </div>
              <div className="text-xs text-slate-500 space-y-0.5 pt-1">
                <p><span className="font-medium text-slate-700">Method:</span> {p.method || "—"}</p>
                <p><span className="font-medium text-slate-700">Collected By:</span> {p.collectedBy || "—"}</p>
                {p.remarks && <p className="text-slate-400 italic">"{p.remarks}"</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}