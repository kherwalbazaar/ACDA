"use client"

import { useMembers, useCashBook } from "@/lib/firebase-data"
import { formatINR } from "@/data/members"
import { FileText, Wallet, TrendingDown, Scale, Users, CheckCircle2, AlertCircle, Printer } from "lucide-react"

export default function ReportsPage() {
  const { members, loading: loadingMembers } = useMembers()
  const { txns } = useCashBook()

  const directIncome = txns.filter((t) => t.type === "Income").reduce((s, t) => s + t.amount, 0)
  const totalMemberPaid = members.reduce((s, m) => s + (m.totalPaid || 0), 0)
  const totalCollection = totalMemberPaid + directIncome
  const totalExpenses = txns.filter((t) => t.type === "Expense").reduce((s, t) => s + t.amount, 0)
  const netBalance = totalCollection - totalExpenses

  const paidMembersCount = members.filter((m) => m.status === "paid" || (m.totalPaid || 0) > 0).length
  const pendingMembersCount = members.length - paidMembersCount
  const totalDueAmount = members.reduce((s, m) => s + (m.due || 0), 0)

  const handlePrint = () => {
    window.print()
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <FileText className="w-8 h-8 text-emerald-600" />
            Financial & Membership Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time financial statement and fee collection overview of ADIM LAHAH MANDAWA
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition"
        >
          <Printer className="w-4 h-4" /> Print / Export Report
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Income</span>
            <h3 className="text-xl font-black text-slate-900 leading-tight">{formatINR(totalCollection)}</h3>
            <span className="text-[11px] text-emerald-600 font-semibold">
              Member Fees: {formatINR(totalMemberPaid)}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Expenses</span>
            <h3 className="text-xl font-black text-rose-600 leading-tight">{formatINR(totalExpenses)}</h3>
            <span className="text-[11px] text-slate-500 font-medium">
              {txns.filter((t) => t.type === "Expense").length} recorded expenses
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Net Balance</span>
            <h3 className="text-xl font-black text-indigo-700 leading-tight">{formatINR(netBalance)}</h3>
            <span className="text-[11px] text-emerald-600 font-semibold">Available Funds</span>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Fee Collection Summary */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-blue-600" />
            <h2 className="font-extrabold text-base text-slate-900">Membership Fee Summary</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
              <span className="text-xs font-semibold text-slate-600">Total Registered Members</span>
              <span className="text-sm font-bold text-slate-900">{members.length}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-emerald-50 text-emerald-800 rounded-xl">
              <span className="text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Paid Members
              </span>
              <span className="text-sm font-bold">{paidMembersCount}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-amber-50 text-amber-800 rounded-xl">
              <span className="text-xs font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" /> Pending Members
              </span>
              <span className="text-sm font-bold">{pendingMembersCount}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-rose-50 text-rose-800 rounded-xl">
              <span className="text-xs font-semibold">Total Outstanding Due</span>
              <span className="text-sm font-bold">{formatINR(totalDueAmount)}</span>
            </div>
          </div>
        </section>

        {/* Balance Sheet Breakdown */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-emerald-600" />
            <h2 className="font-extrabold text-base text-slate-900">Balance Sheet Summary</h2>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Member Fee Contributions</span>
              <span className="font-bold text-slate-900">{formatINR(totalMemberPaid)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Direct Income & Donations</span>
              <span className="font-bold text-slate-900">{formatINR(directIncome)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium font-bold text-slate-800">Gross Revenues</span>
              <span className="font-bold text-emerald-700">{formatINR(totalCollection)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Operational & Event Expenses</span>
              <span className="font-bold text-rose-600">-{formatINR(totalExpenses)}</span>
            </div>
            <div className="flex justify-between py-2.5 pt-3 font-extrabold text-sm text-slate-900 bg-slate-50 px-3 rounded-xl">
              <span>Net Organization Surplus</span>
              <span className="text-indigo-700">{formatINR(netBalance)}</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
