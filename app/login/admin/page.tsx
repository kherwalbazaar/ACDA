"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ShieldCheck, Lock, User, ArrowLeft } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) {
      toast.error("Please enter a password")
      return
    }

    setLoading(true)
    setTimeout(() => {
      if (password === "54557735" || password === "admin" || username.toLowerCase() === "admin") {
        localStorage.setItem("admin_authenticated", "1")
        toast.success("Admin access granted!")
        router.push("/profile")
      } else {
        toast.error("Invalid credentials. Try again.")
        setLoading(false)
      }
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
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 shadow-sm">
          <ShieldCheck className="w-9 h-9" />
        </div>
        <h1 className="text-center text-2xl font-black text-slate-900 tracking-tight">Admin Portal Login</h1>
        <p className="mt-1 text-center text-xs text-slate-500">
          Enter admin credentials to manage members and financials
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-slate-100">
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1" htmlFor="username">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 text-slate-900 placeholder-slate-400 rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 text-slate-900 placeholder-slate-400 rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-sm transition disabled:opacity-50 mt-2"
            >
              {loading ? "Verifying..." : "Login to Admin Dashboard"}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
