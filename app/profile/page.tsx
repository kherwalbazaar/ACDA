"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProfileTab } from "@/components/members/profile"
import { ShieldCheck, Lock } from "lucide-react"
import { setNavbarForcedHidden } from "@/hooks/navbar-store"

const ADMIN_PASSWORD = "54557735"
const ADMIN_AUTH_KEY = "admin_authenticated"

export default function ProfilePage() {
  const router = useRouter()
  const [step, setStep] = useState<"gate" | "password" | "admin">("gate")
  const [pw, setPw] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(ADMIN_AUTH_KEY) === "1") setStep("admin")
  }, [])

  const locked = step === "gate" || step === "password"

  useEffect(() => {
    setNavbarForcedHidden(true)
    return () => setNavbarForcedHidden(false)
  }, [])

  const submitPassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (pw === ADMIN_PASSWORD) {
      localStorage.setItem(ADMIN_AUTH_KEY, "1")
      setStep("admin")
    } else {
      setError("Incorrect password. Please try again.")
      setPw("")
    }
  }

  if (step === "admin") {
    return <ProfileTab onBack={() => router.push("/")} />
  }

  return (
    <div className={locked ? "min-h-screen bg-slate-100 text-slate-900" : "min-h-screen bg-slate-100 text-slate-900"}>
      {/* Gate overlay */}
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
          {step === "gate" ? (
            <>
              <div className="p-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Are you an Admin?</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Admin access is restricted. Confirm your role to continue.
                </p>
              </div>
              <div className="flex gap-2 p-4">
                <button
                  onClick={() => setStep("password")}
                  className="flex-1 py-3.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl transition shadow-sm"
                >
                  Yes
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="flex-1 py-3.5 text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 active:bg-rose-700 rounded-xl transition shadow-sm"
                >
                  No
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={submitPassword}>
              <div className="p-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-3">Admin Verification</h2>
                <p className="text-xs text-slate-500 mt-1">Enter the admin password to continue.</p>

                <input
                  autoFocus
                  type="password"
                  value={pw}
                  onChange={(e) => {
                    setPw(e.target.value)
                    setError("")
                  }}
                  placeholder="Admin password"
                  className="mt-4 w-full bg-slate-100 text-slate-900 placeholder-slate-400 px-4 py-3 rounded-xl text-sm text-center focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-slate-200"
                />
                {error && <p className="text-xs text-rose-600 mt-2 font-medium">{error}</p>}
              </div>
              <div className="flex gap-2 p-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="flex-1 py-3.5 text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 active:bg-rose-700 rounded-xl transition shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl transition shadow-sm"
                >
                  Unlock
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}