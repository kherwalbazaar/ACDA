"use client"

import React, { useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import { App } from "@capacitor/app"
import { Capacitor } from "@capacitor/core"
import { executeBackHandler } from "@/lib/back-button-handler"

/**
 * AndroidBackButtonProvider handles the Android hardware back button
 * according to the hierarchical navigation requirements.
 */
export function AndroidBackButtonProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  // Use a ref to ensure the event listener always uses the current path without needing to re-register
  const pathnameRef = useRef<string>(pathname)
  useEffect(() => {
    pathnameRef.current = pathname
  }, [pathname])

  useEffect(() => {
    // Only register the listener on native platforms
    if (!Capacitor.isNativePlatform()) return

    let backListenerHandle: any = null

    const setupListener = async () => {
      backListenerHandle = await App.addListener("backButton", (data) => {
        // 1. Check if any open modal, dialog, or overlay captures the event
        const handledByOverlay = executeBackHandler()
        if (handledByOverlay) return

        const currentPath = pathnameRef.current
        const segments = currentPath.split("/").filter(Boolean)

        // 2. ROOT/HOME SECTION behavior
        // Home (/) -> Android Back -> Exit APK
        if (segments.length === 0) {
          App.exitApp()
          return
        }

        // 3. MAIN SECTIONS (Top-level tabs) behavior
        // Cashbook or Profile root -> Android Back -> Home
        if (segments.length === 1) {
          const mainSection = segments[0]
          if (mainSection === "cash-book" || mainSection === "profile") {
            router.push("/")
            return
          }
        }

        // 4. SUB-PAGES / DEEPER SECTIONS behavior
        // "Back should always return to the immediately previous screen."
        // "Preserve navigation history correctly."

        // If the platform indicates no history (e.g., initial load on sub-page),
        // we provide a hierarchical fallback to ensure the APK doesn't close on a sub-page.
        if (!data.canGoBack) {
          if (currentPath.startsWith("/profile/")) {
            router.push("/profile")
          } else if (currentPath.startsWith("/login/")) {
            router.push("/")
          } else {
            router.push("/")
          }
          return
        }

        // Default behavior for sub-pages: use the standard history back action
        router.back()
      })
    }

    setupListener()

    return () => {
      if (backListenerHandle) {
        backListenerHandle.remove()
      }
    }
  }, [router])

  return <>{children}</>
}
