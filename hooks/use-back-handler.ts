"use client"

import { useEffect } from "react"
import { registerBackHandler } from "@/lib/back-button-handler"

/**
 * Custom hook to register a handler when a modal or overlay is open.
 * When Android hardware Back is pressed, the handler runs and returns true,
 * closing the modal without triggering route navigation or exiting the app.
 */
export function useBackHandler(active: boolean, onBack: () => void) {
  useEffect(() => {
    if (!active) return
    const unregister = registerBackHandler(() => {
      onBack()
      return true
    })
    return unregister
  }, [active, onBack])
}
