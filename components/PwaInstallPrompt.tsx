"use client"

import { useEffect, useState } from "react"
import { Download, X } from "lucide-react"

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PwaInstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const isAppInstalled = () =>
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true

    const handleBeforeInstallPrompt = (event: Event) => {
      if (isAppInstalled()) return
      event.preventDefault()
      setInstallEvent(event as BeforeInstallPromptEvent)
      setVisible(true)
    }

    const handleAppInstalled = () => {
      setInstallEvent(null)
      setVisible(false)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  if (!visible || !installEvent) return null

  const install = async () => {
    await installEvent.prompt()
    const { outcome } = await installEvent.userChoice
    setInstallEvent(null)
    setVisible(false)
    if (outcome === "dismissed") return
  }

  return (
    <div className="fixed inset-x-3 bottom-4 z-[60] mx-auto max-w-md rounded-2xl border border-emerald-200 bg-white p-3 shadow-[0_12px_32px_rgba(15,23,42,0.24)]">
      <div className="flex items-center gap-3">
        <img src="/icon-512.png" alt="ALM" className="h-12 w-12 shrink-0 rounded-xl border border-emerald-100 object-cover" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-900">Install ALM</p>
          <p className="text-xs text-slate-500">Install Adim Lahah Mandawa Application on your device for quick access.</p>
        </div>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="shrink-0 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          aria-label="Dismiss install prompt"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <button
        type="button"
        onClick={install}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 active:scale-[0.99]"
      >
        <Download className="h-4 w-4" />
        Install
      </button>
    </div>
  )
}
