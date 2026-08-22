"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Phone, Wallet, Calendar, UserX, Plus, X, Loader2, Pencil, Trash2 } from "lucide-react"
import { formatINR, formatDate, type Payment } from "@/data/members"
import { formatPhone, StatusBadge } from "@/components/members/status-badge"
import { MemberAvatar } from "@/components/members/member-avatar"
import { useMemberById, useMembers } from "@/lib/firebase-data"
import { toast } from "sonner"
import { useBackHandler } from "@/hooks/use-back-handler"

const inputCls =
  "w-full bg-white text-slate-900 placeholder-slate-400 px-4 py-3 rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"

export function MemberDetails({ memberId }: { memberId: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromHome = searchParams.get("src") === "home"
  const editMode = searchParams.get("mode") === "edit"
  const active = useMemberById(memberId)
  const { updateMember } = useMembers()
  const [isAdmin, setIsAdmin] = useState(false)
  const [editing, setEditing] = useState(editMode)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [designation, setDesignation] = useState("")
  const [payments, setPayments] = useState<Payment[]>([])

  useEffect(() => {
    setIsAdmin(typeof window !== "undefined" && localStorage.getItem("admin_authenticated") === "1")
  }, [])

  const canAddPayment = isAdmin && !fromHome

  useEffect(() => {
    setEditing(editMode && isAdmin)
  }, [editMode, isAdmin])

  useEffect(() => {
    if (!active) return
    setName(active.name)
    setPhone(active.phone || "")
    setDesignation(active.designation)
    setPayments((active.paymentHistory || []).map((payment) => ({ ...payment })))
  }, [active?.id])

  const [payOpen, setPayOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [desc, setDesc] = useState("")
  const [method, setMethod] = useState<Payment["method"]>("Cash")
  const [saving, setSaving] = useState(false)

  if (!active) {
    return (
      <div className="min-h-screen bg-chat-bg flex flex-col items-center justify-center px-6 text-center">
        <UserX className="w-12 h-12 text-slate-300 mb-3" />
        <p className="text-sm font-semibold text-slate-600">Member not found</p>
        <p className="text-xs text-slate-400 mt-1">Loading from database…</p>
        <button
          onClick={() => router.back()}
          className="mt-5 px-4 py-2 rounded-full bg-whatsapp text-white text-sm font-semibold"
        >
          Go Back
        </button>
      </div>
    )
  }

  const startEditing = () => {
    setName(active.name)
    setPhone(active.phone || "")
    setDesignation(active.designation)
    setEditing(true)
  }

  const saveMember = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateMember({
      ...active,
      name: name.trim(),
      phone: phone.trim(),
      designation: designation.trim(),
      paymentHistory: payments,
    })
    setEditing(false)
    toast.success("Member details updated")
  }

  const updatePayment = (id: string, patch: Partial<Payment>) => {
    setPayments((current) => current.map((payment) => (payment.id === id ? { ...payment, ...patch } : payment)))
  }

  const addPayment = () => {
    setPayments((current) => [
      ...current,
      {
        id: `pay-${Date.now()}`,
        amount: 0,
        date: new Date().toISOString().slice(0, 10),
        description: "",
        method: "Cash",
      },
    ])
  }

  const total = active.totalPaid
  const history = [...(active.paymentHistory || [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const submitPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    const amt = Number(amount)
    if (!amt || amt <= 0) {
      toast.error("Enter a valid amount")
      return
    }
    if (!date) {
      toast.error("Select a date")
      return
    }

    const p: Payment = {
      id: `pay-${Date.now()}`,
      amount: amt,
      date: new Date(date).toISOString(),
      description: desc.trim() || "Member Fee",
      method,
    }

    const updated = {
      ...active,
      paymentHistory: [...(active.paymentHistory || []), p],
      paidDate: p.date,
    }

    setSaving(true)
    try {
      await updateMember(updated)
      toast.success(`${formatINR(amt)} payment added`)
      setPayOpen(false)
      setAmount("")
      setDesc("")
      setDate(new Date().toISOString().slice(0, 10))
      setMethod("Cash")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-chat-bg pb-10">
      <header className="bg-whatsapp text-white px-3 py-3 flex items-center justify-between shadow-md sticky top-0 z-40">
        <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-whatsapp-dark transition" aria-label="Back">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-base font-semibold">Member Details</h2>
        {isAdmin && !editing ? (
          <button onClick={startEditing} className="p-2 rounded-full hover:bg-whatsapp-dark transition" aria-label="Edit member">
            <Pencil className="h-5 w-5" />
          </button>
        ) : (
          <span className="w-9" />
        )}
      </header>

      <main className="p-4">
        {editing ? (
          <form onSubmit={saveMember} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Update Member</h3>
            <label className="block text-xs font-semibold text-slate-600">
              Name
              <input value={name} onChange={(e) => setName(e.target.value)} className={`${inputCls} mt-1`} required />
            </label>
            <label className="block text-xs font-semibold text-slate-600">
              Phone
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className={`${inputCls} mt-1`} />
            </label>
            <label className="block text-xs font-semibold text-slate-600">
              Designation
              <input value={designation} onChange={(e) => setDesignation(e.target.value)} className={`${inputCls} mt-1`} required />
            </label>

            <div className="pt-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-slate-900">Payment History</h4>
                <button type="button" onClick={addPayment} className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <Plus className="h-3.5 w-3.5" /> Add Payment
                </button>
              </div>
              {payments.length === 0 && <p className="py-3 text-center text-xs text-slate-400">No payments yet.</p>}
              <div className="space-y-3">
                {payments.map((payment, index) => (
                  <div key={payment.id} className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500">Payment {index + 1}</span>
                      <button type="button" onClick={() => setPayments((current) => current.filter((item) => item.id !== payment.id))} className="text-rose-500" aria-label={`Remove payment ${index + 1}`}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="text-[11px] font-semibold text-slate-600">
                        Amount
                        <input type="number" min="0" value={payment.amount} onChange={(e) => updatePayment(payment.id, { amount: Number(e.target.value) })} className={`${inputCls} mt-1`} />
                      </label>
                      <label className="text-[11px] font-semibold text-slate-600">
                        Date
                        <input type="date" value={payment.date.slice(0, 10)} onChange={(e) => updatePayment(payment.id, { date: e.target.value })} className={`${inputCls} mt-1`} />
                      </label>
                      <label className="text-[11px] font-semibold text-slate-600">
                        Description
                        <input value={payment.description} onChange={(e) => updatePayment(payment.id, { description: e.target.value })} className={`${inputCls} mt-1`} />
                      </label>
                      <label className="text-[11px] font-semibold text-slate-600">
                        Method
                        <select value={payment.method || "Cash"} onChange={(e) => updatePayment(payment.id, { method: e.target.value as Payment["method"] })} className={`${inputCls} mt-1`}>
                          <option value="Cash">Cash</option>
                          <option value="UPI">UPI</option>
                          <option value="Bank Transfer">Bank Transfer</option>
                          <option value="Cheque">Cheque</option>
                        </select>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setEditing(false)} className="flex-1 rounded-xl bg-slate-400 py-3 text-sm font-semibold text-white">Cancel</button>
              <button type="submit" className="flex-1 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white">Update</button>
            </div>
          </form>
        ) : null}

        {!editing && <>
        {/* Profile section */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6 text-center">
          <MemberAvatar
            name={active.name}
            image={active.image}
            className="h-20 w-20 rounded-full border-4 border-whatsapp shadow-md mx-auto mb-4"
            textClassName="text-4xl"
          />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{active.name}</h1>
          <p className="text-sm font-medium text-slate-500">{active.designation}</p>

          <div className="flex items-center justify-center gap-3 mt-3">
            <StatusBadge member={active} />
            <span className="text-sm font-medium text-slate-700">{active.phone ? formatPhone(active.phone) : "—"}</span>
          </div>
        </section>

        {/* Payment History */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <div className="flex items-center justify-between gap-3 mb-2">
            <h3 className="text-sm font-bold text-slate-900 tracking-wide flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-emerald-600" />
              Payment History ({history.length})
            </h3>
            <div className="text-right shrink-0">
              <span className="block text-[10px] font-medium text-slate-500">Total Paid</span>
              <span className="block text-lg font-bold text-emerald-600">{formatINR(total)}</span>
            </div>
          </div>

          {history.length === 0 ? (
            <div className="py-6 text-center text-slate-500 text-sm">
              No payment records found.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {history.map((p) => (
                <div key={p.id} className="p-3.5 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{p.description}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {formatDate(p.date)}
                      {p.method ? ` • ${p.method}` : ""}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-emerald-700 shrink-0">{formatINR(p.amount)}</span>
                </div>
              ))}
            </div>
          )}
        </section>
        </>}
      </main>
    </div>
  )
}