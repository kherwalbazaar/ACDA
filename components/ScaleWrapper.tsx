"use client"

import React, { useLayoutEffect, useRef, useState } from "react"

/**
 * ScaleWrapper ensures the entire desktop layout (fixed width) scales down
 * uniformly on smaller screens without changing layout positions.
 */
export default function ScaleWrapper({
  children,
  desktopWidth = 1280, // matches Tailwind max-w-7xl (~1280px)
}: {
  children: React.ReactNode
  desktopWidth?: number
}) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const updateScaleAndHeight = () => {
      const vw = document.documentElement.clientWidth || window.innerWidth || 0
      const s = Math.min(1, vw / desktopWidth)
      setScale(s)

      if (wrapperRef.current && canvasRef.current) {
        const intrinsicHeight = canvasRef.current.scrollHeight
        wrapperRef.current.style.minHeight = `${intrinsicHeight * s}px`
      }
    }

    updateScaleAndHeight()

    const hasWindow = typeof window !== "undefined"
    let resizeObs: ResizeObserver | null = null

    if (typeof ResizeObserver !== "undefined" && canvasRef.current) {
      resizeObs = new ResizeObserver(() => {
        updateScaleAndHeight()
      })
      resizeObs.observe(canvasRef.current)
    }

    if (hasWindow) {
      const events = ["resize", "orientationchange", "load"]
      const docEvents = ["transitionend", "animationend", "toggle"]

      events.forEach((ev) => window.addEventListener(ev, updateScaleAndHeight))
      docEvents.forEach((ev) => document.addEventListener(ev, updateScaleAndHeight, true))

      let raf = requestAnimationFrame(function settle(t) {
        updateScaleAndHeight()
        if (t < 1000) raf = requestAnimationFrame(settle) // settle for 1s
      })

      return () => {
        events.forEach((ev) => window.removeEventListener(ev, updateScaleAndHeight))
        docEvents.forEach((ev) => document.removeEventListener(ev, updateScaleAndHeight, true))
        cancelAnimationFrame(raf)
        if (resizeObs) resizeObs.disconnect()
      }
    }

    return () => {
      if (resizeObs) resizeObs.disconnect()
    }
  }, [desktopWidth])

  return (
    <div
      ref={wrapperRef}
      style={{ width: "100%", overflowX: "hidden", overflowY: "auto", position: "relative" }}
    >
      <div
        ref={canvasRef}
        style={{
          width: desktopWidth,
          margin: "0 auto",
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          willChange: "transform",
          display: "inline-block",
        }}
      >
        {children}
      </div>
    </div>
  )
}
