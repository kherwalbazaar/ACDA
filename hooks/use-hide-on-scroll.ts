"use client"

import { useEffect, useRef, useState } from "react"

export function useHideOnScroll(threshold = 10) {
  const [isVisible, setIsVisible] = useState(true)
  const thresholdRef = useRef(threshold)
  thresholdRef.current = threshold

  useEffect(() => {
    let lastScrollY = window.scrollY || document.documentElement.scrollTop
    let ticking = false
    let hideTimeout: ReturnType<typeof setTimeout> | null = null

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY || document.documentElement.scrollTop
          const scrollDelta = currentScrollY - lastScrollY
          const t = thresholdRef.current

          if (currentScrollY <= 30) {
            if (hideTimeout) {
              clearTimeout(hideTimeout)
              hideTimeout = null
            }
            setIsVisible(true)
          } else if (scrollDelta > t) {
            if (hideTimeout) {
              clearTimeout(hideTimeout)
            }
            hideTimeout = setTimeout(() => {
              setIsVisible(false)
            }, 80)
          } else if (scrollDelta < -t) {
            if (hideTimeout) {
              clearTimeout(hideTimeout)
              hideTimeout = null
            }
            setIsVisible(true)
          }

          lastScrollY = currentScrollY
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (hideTimeout) clearTimeout(hideTimeout)
    }
  }, [])

  return isVisible
}
