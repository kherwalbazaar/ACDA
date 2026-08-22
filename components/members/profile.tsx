"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  LogOut,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  X,
  Search,
  UserPlus,
  Plus,
  Wallet,
  Users,
  TrendingDown,
  Scale,
} from "lucide-react"
import { toast } from "sonner"
import type { Member, Payment } from "@/data/members"
import { formatPhone } from "@/components/members/status-badge"
import { MemberAvatar } from "@/components/members/member-avatar"
import { useMembers, useCashBook } from "@/lib/firebase-data"
import { formatINR } from "@/data/members"
import { useBackHandler } from "@/hooks/use-back-handler"

export function ProfileTab({ onBack }: { onBack: () => void }) {
  const router = useRouter()
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [menuId, setMenuId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null)
  const [editing, setEditing] = useState<Member | null>(null)
  const [addMenuOpen, setAddMenuOpen] = useState(false)
  const { members: list, updateMember, deleteMember } = useMembers()
  const { txns } = useCashBook()

  useBackHandler(logoutOpen, () => setLogoutOpen(false))
  useBackHandler(!!deleteTarget, () => setDeleteTarget(null))
  useBackHandler(!!editing, () => setEditing(null))
  useBackHandler(addMenuOpen, () => setAddMenuOpen(false))
  useBackHandler(!!menuId, () => setMenuId(null))

  const totalCollection = list.reduce((s, m) => s + (m.totalPaid || 0), 0)
  const totalExpense = txns
    .filter((t) => t.type === "Expense")
    .reduce((s, t) => s + t.amount, 0)
  const remaining = totalCollection - totalExpense

  const stats = [
    { label: "Collection", value: formatINR(totalCollection), icon: Wallet, tint: "bg-sky-50 text-sky-600" },
    { label: "Expense", value: formatINR(totalExpense), icon: TrendingDown, tint: "bg-rose-50 text-rose-600" },
    { label: "Balance", value: formatINR(remaining), icon: Scale, tint: "bg-indigo-50 text-indigo-600" },
  ]

  const filtered = list.filter((m) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return (
      m.name.toLowerCase().includes(q) ||
      m.designation.toLowerCase().includes(q) ||
      (m.phone || "").toLowerCase().includes(q)
    )
  })

  const confirmLogout = () => {
    setLogoutOpen(false)
    toast.info("Logged out (demo)")
    router.push("/")
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    deleteMember(deleteTarget.id)
    toast.success(`${deleteTarget.name} deleted`)
    setDeleteTarget(null)
  }

  return (
    <div className="min-h-screen bg-chat-bg pb-12">
      <header className="bg-whatsapp text-white px-3 py-3 flex items-center justify-between shadow-md sticky top-0 z-40">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-whatsapp-dark transition" aria-label="Back">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-base font-semibold">MEMBERS MANAGEMENT SYSTEM</h2>
        <button
          onClick={() => setLogoutOpen(true)}
          className="p-2 rounded-full hover:bg-whatsapp-dark transition"
          aria-label="Log out"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </header>

      <section className="px-2 py-2 flex items-stretch gap-1.5 overflow-x-auto">
        {stats.map((s) => (
          <div key={s.label} className="flex-1 min-w-[0] bg-white rounded-xl shadow-sm border border-slate-100 px-2 py-2 flex flex-col items-center gap-1 text-center">
            <div className={`inline-flex items-center justify-center h-6 w-6 rounded-md ${s.tint}`}>
              <s.icon className="h-3.5 w-3.5" />
            </div>
            <span className="text-[13px] font-bold text-slate-900 leading-none">{s.value}</span>
            <span className="text-[8.5px] font-semibold text-slate-500 uppercase tracking-wide leading-tight">{s.label}</span>
          </div>
        ))}
      </section>

      {/* All members list */}
      <section className="px-0 -mt-1">
        <div className="flex items-center gap-2 px-3 py-2 mb-2 bg-white shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 tracking-wide whitespace-nowrap">
            All Members<span className="text-slate-400 font-semibold">({filtered.length})</span>
          </h3>
          <div className="relative flex items-center flex-1 ml-auto min-w-0">
            <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search member..."
              className="w-full pl-8 pr-7 py-1.5 bg-white text-slate-900 placeholder-slate-400 rounded-lg text-sm border border-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2 text-slate-400 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-0.5 bg-white">
          {filtered.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-sm">No members match your search.</div>
          )}
          {filtered.map((m) => (
            <div key={m.id} className="bg-white relative border-b border-emerald-200 border-b-2">
              <button
                className="w-full flex items-center gap-3 p-3 pr-2 text-left hover:bg-slate-50 active:bg-slate-100/80 transition-colors"
                onClick={() => router.push(`/profile/member/${m.id}?mode=edit`)}
              >
                <MemberAvatar name={m.name} image={m.image} />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 truncate">{m.name}</h4>
                  <p className="text-xs text-slate-500 truncate">{m.designation}</p>
                  <p className="text-[11px] text-slate-400">{formatPhone(m.phone)}</p>
                </div>
              </button>
              <div className="absolute right-1 top-1/2 -translate-y-1/2 shrink-0">
                <button
                  onClick={() => setMenuId(menuId === m.id ? null : m.id)}
                  className="p-2 rounded-full hover:bg-slate-100 active:bg-slate-200 transition text-slate-500"
                  aria-label="Member actions"
                >
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>

              {menuId === m.id && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setMenuId(null)} />
                  <div className="absolute right-2 top-full mt-1 z-40 w-40 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                    <MenuItem
                      icon={Eye}
                      label="View"
                      onClick={() => {
                        setMenuId(null)
                        router.push(`/profile/member?id=${m.id}`)
                      }}
                    />
                    <MenuItem
                      icon={Pencil}
                      label="Edit"
                      onClick={() => {
                        setMenuId(null)
                        setEditing(m)
                      }}
                    />
                    <MenuItem
                      icon={Trash2}
                      label="Delete"
                      danger
                      onClick={() => {
                        setMenuId(null)
                        setDeleteTarget(m)
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Logout confirmation popup */}
      {logoutOpen && (
        <ConfirmPopup
          title="Log out?"
          message="Are you sure you want to log out?"
          onCancel={() => setLogoutOpen(false)}
          onConfirm={confirmLogout}
        />
      )}

      {/* Delete confirmation popup */}
      {deleteTarget && (
        <ConfirmPopup
          title={`Delete ${deleteTarget.name}?`}
          message="This member will be removed from the list. This action cannot be undone."
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}

      {/* Edit member popup */}
      {editing && <EditMemberModal member={editing} onClose={() => setEditing(null)} onSave={(updated) => {
        updateMember(updated)
        setEditing(null)
        toast.success(`${updated.name} updated`)
      }} />}

      {/* Floating add button */}
      {addMenuOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setAddMenuOpen(false)} />
          <div className="fixed bottom-24 right-4 z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden min-w-[210px]">
            <button
              onClick={() => {
                setAddMenuOpen(false)
                router.push("/profile/add-member")
              }}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 active:bg-slate-100 transition text-left"
            >
              <span className="h-9 w-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <UserPlus className="h-5 w-5" />
              </span>
              Add Member
            </button>
            <div className="h-px bg-slate-100" />
            <button
              onClick={() => {
                setAddMenuOpen(false)
                router.push("/profile/add-expense")
              }}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 active:bg-slate-100 transition text-left"
            >
              <span className="h-9 w-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                <Wallet className="h-5 w-5" />
              </span>
              Add Expense
            </button>
          </div>
        </>
      )}
      <button
        onClick={() => setAddMenuOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 bg-whatsapp text-white h-14 w-14 rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.35)] hover:bg-whatsapp-dark active:scale-95 transition"
        aria-label="Add"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  )
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
  danger,
}: {
  icon: typeof Eye
  label: string
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-left transition ${
        danger ? "text-rose-600 hover:bg-rose-50" : "text-slate-700 hover:bg-slate-50"
      }`}
    >
      <Icon className={`h-4 w-4 ${danger ? "text-rose-500" : "text-slate-400"}`} />
      {label}
    </button>
  )
}

function ConfirmPopup({
  title,
  message,
  onCancel,
  onConfirm,
}: {
  title: string
  message: string
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
            <LogOut className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <p className="text-xs text-slate-500 mt-1">{message}</p>
        </div>
        <div className="flex gap-2 p-4 border-t border-slate-100">
          <button
            onClick={onCancel}
            className="flex-1 py-3.5 text-sm font-semibold text-white bg-slate-400 hover:bg-slate-500 active:bg-slate-600 rounded-xl transition shadow-sm"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3.5 text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 active:bg-rose-700 rounded-xl transition shadow-sm"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  )
}

function EditMemberModal({
  member,
  onClose,
  onSave,
}: {
  member: Member
  onClose: () => void
  onSave: (m: Member) => void
}) {
  const [name, setName] = useState(member.name)
  const [phone, setPhone] = useState(member.phone || "")
  const [designation, setDesignation] = useState(member.designation)
  const [payments, setPayments] = useState<Payment[]>(() =>
    (member.paymentHistory || []).map((p) => ({ ...p }))
  )

  const updatePayment = (id: string, patch: Partial<Payment>) => {
    setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }

  const addPayment = () => {
    setPayments((prev) => [
      ...prev,
      { id: crypto.randomUUID?.() || `${Date.now()}`, amount: 0, date: new Date().toISOString().slice(0, 10), description: "", method: "Cash" },
    ])
  }

  const removePayment = (id: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== id))
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ ...member, name, phone, designation, paymentHistory: payments })
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-6 py-6 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden my-auto">
        <form onSubmit={submit}>
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Edit Member</h2>
                <p className="text-xs text-slate-500 mt-1">Update member details and payments.</p>
              </div>
              <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <Field label="Name">
                <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} required />
              </Field>
              <Field label="Phone">
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
              </Field>
              <Field label="Designation">
                <input value={designation} onChange={(e) => setDesignation(e.target.value)} className={inputCls} />
              </Field>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-900">Payments</h3>
                <button
                  type="button"
                  onClick={addPayment}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
              {payments.length === 0 && (
                <p className="text-xs text-slate-400 py-3 text-center">No payments yet.</p>
              )}
              <div className="space-y-2.5">
                {payments.map((p, i) => (
                  <div key={p.id} className="border border-slate-100 rounded-xl p-3 bg-slate-50/70">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-slate-500">Payment {i + 1}</span>
                      <button
                        type="button"
                        onClick={() => removePayment(p.id)}
                        className="text-rose-500 hover:text-rose-700"
                        aria-label={`Remove payment ${i + 1}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Field label="Amount (₹)">
                        <input
                          type="number"
                          value={p.amount}
                          onChange={(e) => updatePayment(p.id, { amount: Number(e.target.value) })}
                          className={inputCls}
                        />
                      </Field>
                      <Field label="Date">
                        <input
                          type="date"
                          value={p.date}
                          max={new Date().toISOString().split("T")[0]}
                          onChange={(e) => updatePayment(p.id, { date: e.target.value })}
                          className={inputCls}
                        />
                      </Field>
                      <Field label="Description">
                        <input
                          value={p.description}
                          onChange={(e) => updatePayment(p.id, { description: e.target.value })}
                          className={inputCls}
                        />
                      </Field>
                      <Field label="Method">
                        <select
                          value={p.method || "Cash"}
                          onChange={(e) => updatePayment(p.id, { method: e.target.value as Payment["method"] })}
                          className={inputCls}
                        >
                          <option value="Cash">Cash</option>
                          <option value="UPI">UPI</option>
                          <option value="Bank Transfer">Bank Transfer</option>
                          <option value="Cheque">Cheque</option>
                        </select>
                      </Field>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2 p-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 text-sm font-semibold text-white bg-slate-400 hover:bg-slate-500 active:bg-slate-600 rounded-xl transition shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl transition shadow-sm"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const inputCls =
  "w-full bg-slate-100 text-slate-900 placeholder-slate-400 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-slate-200"

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-semibold text-slate-400 mb-1">{label}</span>
      {children}
    </label>
  )
}
