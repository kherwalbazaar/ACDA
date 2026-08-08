import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Phone, Wallet, Calendar, UserX, Plus, X, Loader2 } from "lucide-react"
import { formatINR, formatDate, type Payment } from "@/data/members"
import { formatPhone } from "@/components/members/status-badge"
import { MemberAvatar } from "@/components/members/member-avatar"
import { useMemberById, useMembers } from "@/lib/firebase-data"
import { toast } from "sonner"

const inputCls =
  "w-full bg-white text-slate-900 placeholder-slate-400 px-4 py-3 rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"

export function MemberDetails({ memberId }: { memberId: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromHome = searchParams.get("src") === "home"
  const active = useMemberById(memberId)
  const { updateMember } = useMembers()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    setIsAdmin(typeof window !== "undefined" && localStorage.getItem("admin_authenticated") === "1")
  }, [])

  const canAddPayment = isAdmin && !fromHome

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
    <div className="min-h-screen bg-chat-bg pb-28">
      {/* Profile section */}
      <section className="bg-white pt-4 px-4 pb-5 rounded-b-[2.5rem] border-b border-slate-100 shadow-sm text-center relative">
        <button
          onClick={() => router.back()}
          className="absolute left-4 top-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <MemberAvatar
          name={active.name}
          image={active.image}
          className="h-24 w-24 rounded-full border-4 border-whatsapp shadow-md mx-auto mt-2"
          textClassName="text-3xl"
        />
        <h1 className="text-xl font-bold text-slate-900 mt-3">{active.name}</h1>
        <p className="text-xs font-medium text-slate-500 mt-0.5">{active.designation}</p>

        <div className="flex items-center justify-center gap-8 mt-4 pt-3 border-t border-slate-100">
          <div className="flex flex-col items-center gap-1.5">
            <span className="h-11 w-11 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
              <Phone className="h-5 w-5" />
            </span>
            <span className="text-[10px] font-semibold text-slate-500">{formatPhone(active.phone)}</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <span className="h-11 w-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
              <Wallet className="h-5 w-5" />
            </span>
            <span className="text-[10px] font-semibold text-slate-500">{formatINR(total)}</span>
          </div>
        </div>
      </section>

      {/* Payment history */}
      <section className="px-4 mt-5">
        <h3 className="text-sm font-bold text-slate-900 tracking-wide mb-2 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-emerald-600" />
          Payment History ({history.length})
        </h3>

        {history.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-12 text-center text-slate-400 text-sm">
            No payment records found.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100">
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

      {/* Add Payment FAB */}
      {canAddPayment && (
        <button
          onClick={() => setPayOpen(true)}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 bg-whatsapp text-white pl-4 pr-5 py-3 rounded-full shadow-lg flex items-center gap-2 text-sm font-bold active:scale-95 transition"
        >
          <Plus className="w-5 h-5" />
          Add Payment
        </button>
      )}

      {/* Add Payment Modal */}
      {payOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden">
            <form onSubmit={submitPayment}>
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Add Payment</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      {active.name} • {formatINR(total)} paid so far
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPayOpen(false)}
                    className="text-slate-400 hover:text-slate-600"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-5 space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 mb-1 block">Amount (₹)</label>
                    <input
                      type="number"
                      inputMode="numeric"
                      min="1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="e.g. 2000"
                      className={inputCls}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 mb-1 block">Date</label>
                    <input
                      type="date"
                      value={date}
                      max={new Date().toISOString().slice(0, 10)}
                      onChange={(e) => setDate(e.target.value)}
                      className={inputCls}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 mb-1 block">Description</label>
                    <input
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      placeholder="e.g. Member Fee"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 mb-1 block">Method</label>
                    <select value={method} onChange={(e) => setMethod(e.target.value as Payment["method"])} className={inputCls}>
                      <option value="Cash">Cash</option>
                      <option value="UPI">UPI</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 p-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPayOpen(false)}
                  className="flex-1 py-3 rounded-full border border-slate-200 text-slate-600 text-sm font-semibold active:scale-95 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 rounded-full bg-whatsapp text-white text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition disabled:opacity-60"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Save Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}