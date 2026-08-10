"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, UserPlus } from "lucide-react"
import { toast } from "sonner"
import { type Member } from "@/data/members"
import { useMembers } from "@/lib/firebase-data"
import { setNavbarForcedHidden } from "@/hooks/navbar-store"

const inputCls =
  "w-full bg-white text-slate-900 placeholder-slate-400 px-4 py-3 rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"

export function AddMemberForm() {
  const router = useRouter()
  const { addMember } = useMembers()
  const [name, setName] = useState("")

  useEffect(() => {
    setNavbarForcedHidden(true)
    return () => setNavbarForcedHidden(false)
  }, [])
  const [designation, setDesignation] = useState("General Member")
  const [phone, setPhone] = useState("")
  const [membershipFee, setMembershipFee] = useState("2000")

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error("Name is required")
      return
    }

    const member: Member = {
      id: `mandwa-${Date.now()}`,
      name: name.trim(),
      designation: designation.trim() || "General Member",
      phone: phone.trim(),
      image: "",
      membershipFee: Math.max(0, Number(membershipFee) || 2000),
      paymentHistory: [],
      categories: ["pending"],
    }

    await addMember(member)
    toast.success(`${member.name} added`)
    router.push("/profile")
  }

  return (
    <div className="min-h-screen bg-chat-bg pb-12">
      <header className="bg-whatsapp text-white px-3 py-3 flex items-center justify-between shadow-md sticky top-0 z-40">
        <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-whatsapp-dark transition" aria-label="Back">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-base font-semibold">Add Member</h2>
        <span className="w-9" />
      </header>

      <form onSubmit={submit} className="px-4 mt-5 space-y-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center mx-auto shadow-sm">
            <UserPlus className="h-7 w-7" />
          </div>
          <Field label="Full Name *">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Johar Murmu" className={inputCls} required />
          </Field>
          <Field label="Designation">
            <input value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="e.g. General Member" className={inputCls} />
          </Field>
          <Field label="Mobile Number">
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 9000012345" className={inputCls} inputMode="numeric" />
          </Field>
          <Field label="Membership Fee (₹)">
            <input value={membershipFee} onChange={(e) => setMembershipFee(e.target.value)} placeholder="2000" className={inputCls} inputMode="numeric" />
          </Field>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition shadow-sm"
        >
          Save Member
        </button>
      </form>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-semibold text-slate-400 mb-1">{label}</span>
      {children}
    </label>
  )
}
