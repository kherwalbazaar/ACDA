"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Users, Lock, IdCard, ArrowLeft } from "lucide-react"

export default function MemberLoginPage() {
  const router = useRouter()
  const [memberId, setMemberId] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!memberId.trim()) {
      toast.error("Please enter your Member ID")
      return
    }

    setLoading(true)
    setTimeout(() => {
      localStorage.setItem("chat_name", `Member ${memberId.trim()}`)
      toast.success("Welcome back, Member!")
      router.push("/members")
    }, 400)
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <button
          onClick={() => router.back()}
          className="mb-4 inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-3 shadow-sm">
          <Users className="w-9 h-9" />
        </div>
        <h1 className="text-center text-2xl font-black text-slate-900 tracking-tight">Member Login</h1>
        <p className="mt-1 text-center text-xs text-slate-500">
          Access your member directory and payment contributions
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-slate-100">
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1" htmlFor="member-id">
                Member ID / Mobile Number
              </label>
              <div className="relative">
                <IdCard className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="member-id"
                  type="text"
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 text-slate-900 placeholder-slate-400 rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. mandwa-01 or Mobile"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1" htmlFor="password">
                Password / PIN
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 text-slate-900 placeholder-slate-400 rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-sm transition disabled:opacity-50 mt-2"
            >
              {loading ? "Logging in..." : "Login to Member Portal"}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
