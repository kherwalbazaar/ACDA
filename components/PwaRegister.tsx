"use client"

import { useEffect } from "react"

export function PwaRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).Capacitor?.isNative) return
    if (!("serviceWorker" in navigator)) return
    if (process.env.NODE_ENV !== "production") return
    navigator.serviceWorker.register("/sw.js").catch(() => {})
  }, [])

  return null
}