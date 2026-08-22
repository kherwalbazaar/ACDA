"use client"

import { useCashBook, useMembers } from "@/lib/firebase-data"
import { useRouter } from "next/navigation"
import { ArrowLeft, FileText, Wallet, Scale, TrendingDown } from "lucide-react"
import { formatINR } from "@/data/members"

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]

function formatDate(d: string) {
  if (!d) return d
  const [y, m, day] = d.slice(0, 10).split("-")
  if (!y || !m || !day) return d
  return `${day} ${MONTHS[+m - 1]} ${y}`
}

export default function CashBookPage() {
  const { txns } = useCashBook()
  const { members } = useMembers()
  const router = useRouter()

  const directIncome = txns.filter((t) => t.type === "Income").reduce((s, t) => s + t.amount, 0)
  const collection = members.reduce((s, m) => s + (m.totalPaid || 0), 0) + directIncome
  const expense = txns.filter((t) => t.type === "Expense").reduce((s, t) => s + t.amount, 0)

  type Entry = { id: string; date: string; description: string; type: "Income" | "Expense"; amount: number; via?: string; running?: number }

  const memberPayments: Entry[] = members.flatMap((m) =>
    (m.paymentHistory || []).map((p) => ({
      id: `${m.id}-${p.id}`,
      date: p.date,
      description: `${m.name}${p.description ? ` · ${p.description}` : ""}`,
      type: "Income",
      amount: p.amount,
    }))
  )

  const raw = [...txns.map((t) => ({ id: t.id, date: t.date, description: t.description, type: t.type, amount: t.amount, via: t.via })), ...memberPayments].sort((a, b) =>
    (a.date || "").localeCompare(b.date || "")
  )

  let running = 0
  const withBalance = raw.map((t) => {
    const t2 = { ...t }
    running += t.type === "Income" ? t.amount : -t.amount
    return { ...t2, running }
  })

  const entries = withBalance.reverse()

  const stats = [
    { label: "Collection", value: formatINR(collection), icon: Wallet, tint: "bg-sky-50 text-sky-600" },
    { label: "Expense", value: formatINR(expense), icon: TrendingDown, tint: "bg-rose-50 text-rose-600" },
    { label: "Balance", value: formatINR(collection - expense), icon: Scale, tint: "bg-indigo-50 text-indigo-600" },
  ]

  const groups = new Map<string, Entry[]>()
  for (const t of entries) {
    const key = t.date || "Unknown date"
    const arr = groups.get(key) || []
    arr.push(t)
    groups.set(key, arr)
  }

  return (
    <div className="min-h-screen bg-chat-bg pb-10">
      <header className="bg-whatsapp text-white px-3 py-3 flex items-center justify-between shadow-md sticky top-0 z-40">
        <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-whatsapp-dark transition" aria-label="Back">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          <h2 className="text-base font-semibold">Cash Book</h2>
        </div>
        <span className="w-9" />
      </header>

      <section className="px-2 py-2 flex items-stretch gap-1.5 overflow-x-auto bg-chat-bg">
        {stats.map((s) => (
          <div key={s.label} className="flex-1 min-w-[0] bg-white rounded-xl shadow-sm border border-slate-100 px-2 py-2.5 flex flex-col items-center gap-1 text-center">
            <div className={`inline-flex items-center justify-center h-6 w-6 rounded-md ${s.tint}`}>
              <s.icon className="h-3.5 w-3.5" />
            </div>
            <span className="text-[13px] font-bold text-slate-900 leading-none">{s.value}</span>
            <span className="text-[8.5px] font-semibold text-slate-500 uppercase tracking-wide leading-tight">{s.label}</span>
          </div>
        ))}
      </section>

      <main className="px-3 py-2 space-y-2">
        {entries.length === 0 && (
          <div className="py-16 text-center text-slate-400 text-sm">No transactions yet.</div>
        )}
        {(() =>
          [...groups.entries()].map(([date, items]) => (
            <div key={date}>
              <div className="relative bg-emerald-600 text-white rounded-t-2xl shadow-sm px-3 py-2 flex items-center justify-between gap-3">
                <div className="py-1 px-3 bg-emerald-700 rounded-lg flex items-center">
                  <span className="text-xs font-semibold tracking-wide uppercase leading-none">{formatDate(date)}</span>
                </div>
                {items[0]?.running != null && (
                  <div className="py-1 px-3 bg-emerald-700 rounded-lg flex items-center">
                    <span className="text-base font-extrabold leading-none">{formatINR(items[0].running)}</span>
                  </div>
                )}
              </div>
              <div className="bg-white rounded-b-2xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-100">
                {items.map((t) => (
                  <div key={t.id} className="flex items-center gap-3 px-3 py-2.5">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{t.description}</p>
                      {t.via && <span className="inline-block mt-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 rounded-full px-1.5 py-0.5">Via: {t.via}</span>}
                      <span
                        className={`inline-block mt-0.5 ml-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                          t.type === "Income" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {t.type}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-0.5 shrink-0">
                      <span
                        className={`text-sm font-bold whitespace-nowrap ${
                          t.type === "Income" ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        {t.type === "Income" ? "+" : "-"}
                        {formatINR(t.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )))()}
      </main>
    </div>
  )
}
