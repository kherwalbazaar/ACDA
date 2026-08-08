"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Wallet, Pencil, X, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useCashBook } from "@/lib/firebase-data"
import { setNavbarForcedHidden } from "@/hooks/navbar-store"
import { formatINR } from "@/data/members"

const inputCls =
  "w-full bg-white text-slate-900 placeholder-slate-400 px-4 py-3 rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function formatDate(d: string) {
  if (!d) return d
  const [y, m, day] = d.slice(0, 10).split("-")
  if (!y || !m || !day) return d
  return `${day}-${MONTHS[+m - 1]}-${y}`
}

export function AddExpenseForm() {
  const router = useRouter()
  const { txns, addTxn, updateTxn, deleteTxn } = useCashBook()
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const expenses = txns
    .filter((t) => t.type === "Expense")
    .sort((a, b) => (a.date || "").localeCompare(b.date || ""))
    .reverse()

  useEffect(() => {
    setNavbarForcedHidden(true)
    return () => setNavbarForcedHidden(false)
  }, [])

  const resetForm = () => {
    setDescription("")
    setAmount("")
    setDate(new Date().toISOString().slice(0, 10))
    setEditingId(null)
  }

  const startEdit = (id: string) => {
    const t = txns.find((x) => x.id === id)
    if (!t) return
    setEditingId(id)
    setDescription(t.description)
    setAmount(String(t.amount))
    setDate(t.date.slice(0, 10))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim()) {
      toast.error("Description is required")
      return
    }
    const amt = Number(amount)
    if (!amt || amt <= 0) {
      toast.error("Enter a valid amount")
      return
    }

    const payload = {
      date: new Date(date).toISOString(),
      description: description.trim(),
      type: "Expense" as const,
      amount: amt,
    }

    if (editingId) {
      await updateTxn(editingId, payload)
      toast.success("Expense updated")
      resetForm()
    } else {
      await addTxn(payload)
      toast.success("Expense added")
      router.push("/profile")
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteTxn(deleteTarget)
    toast.success("Expense deleted")
    setDeleteTarget(null)
    resetForm()
  }

  return (
    <div className="min-h-screen bg-chat-bg pb-12">
      <header className="bg-whatsapp text-white px-3 py-3 flex items-center justify-between shadow-md sticky top-0 z-40">
        <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-whatsapp-dark transition" aria-label="Back">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-base font-semibold">Add Expense</h2>
        <span className="w-9" />
      </header>

      <div className="p-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <form onSubmit={submit} className="space-y-2.5">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Description</label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Sports Equipment"
                className={inputCls}
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Amount (₹)</label>
              <input
                type="number"
                inputMode="numeric"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 1200"
                className={inputCls}
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 mb-1 block">Date</label>
              <input
                type="date"
                value={date}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setDate(e.target.value)}
                className={inputCls}
                required
              />
            </div>

            {editingId ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-3 rounded-full bg-slate-100 text-slate-700 text-sm font-bold hover:bg-slate-200 active:scale-95 transition inline-flex items-center justify-center gap-1.5"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-full bg-whatsapp text-white text-sm font-bold hover:bg-whatsapp-dark active:scale-95 transition shadow-md inline-flex items-center justify-center gap-1.5"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(editingId)}
                  className="flex-1 py-3 rounded-full bg-rose-100 text-rose-700 text-sm font-bold hover:bg-rose-200 active:scale-95 transition inline-flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            ) : (
              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-whatsapp text-white text-sm font-bold hover:bg-whatsapp-dark active:scale-95 transition shadow-md"
              >
                Save Expense
              </button>
            )}
          </form>
        </div>
      </div>

      <section className="px-4 pb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-slate-900 tracking-wide">Expense History</h3>
          <span className="text-[11px] font-semibold text-slate-400">{expenses.length} entries</span>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-100">
          {expenses.length === 0 && (
            <div className="py-10 text-center text-slate-400 text-sm">No expenses recorded yet.</div>
          )}
          {expenses.map((t) => (
            <div key={t.id} className="flex items-center gap-3 px-3 py-2.5">
              <div className="h-9 w-9 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <Wallet className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{t.description}</p>
                <p className="text-[11px] text-slate-400">{formatDate(t.date)}</p>
              </div>
              <span className="text-sm font-bold text-rose-600 whitespace-nowrap">-{formatINR(t.amount)}</span>
              <button
                onClick={() => startEdit(t.id)}
                className="text-emerald-600 hover:text-emerald-700 p-1"
                aria-label="Edit expense"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-6">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Delete expense?</h2>
              <p className="text-xs text-slate-500 mt-1">This expense will be removed. This action cannot be undone.</p>
            </div>
            <div className="flex gap-2 p-4 border-t border-slate-100">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3.5 text-sm font-semibold text-white bg-slate-400 hover:bg-slate-500 active:bg-slate-600 rounded-xl transition shadow-sm"
              >
                No
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3.5 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl transition shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}