"use client"

import { useEffect } from "react"

export function ScreenshotProtection() {
  useEffect(() => {
    const block = (e: Event) => e.preventDefault()

    const blockContext = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    const blockKeys = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "p" || e.key === "s" || e.key === "u" || e.key === "c" || e.key === "a" || e.key === "P")
      ) {
        e.preventDefault()
      }
    }

    document.addEventListener("contextmenu", blockContext)
    document.addEventListener("dragstart", block)
    document.addEventListener("copy", block)
    document.addEventListener("cut", block)
    document.addEventListener("selectstart", block)
    document.addEventListener("keydown", blockKeys)

    return () => {
      document.removeEventListener("contextmenu", blockContext)
      document.removeEventListener("dragstart", block)
      document.removeEventListener("copy", block)
      document.removeEventListener("cut", block)
      document.removeEventListener("selectstart", block)
      document.removeEventListener("keydown", blockKeys)
    }
  }, [])

  return null
}
