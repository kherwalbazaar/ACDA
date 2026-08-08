"use client"

import { useEffect, useState } from "react"

export function useHideOnScroll() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    let lastScrollY = window.scrollY || document.documentElement.scrollTop
    const handleScroll = () => {
      const currentScrollY = window.scrollY || document.documentElement.scrollTop
      if (currentScrollY <= 20) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY + 5) {
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY - 5) {
        setIsVisible(true)
      }
      lastScrollY = currentScrollY
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return isVisible
}
