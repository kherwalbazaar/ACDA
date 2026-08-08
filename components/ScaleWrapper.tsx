"use client"

import React, { useEffect, useLayoutEffect, useRef, useState } from "react"

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

  const updateScale = () => {
    // Use clientWidth to avoid including scrollbar width, which can cause a right-side gap
    const vw = document.documentElement.clientWidth || window.innerWidth || 0
    const s = Math.min(1, vw / desktopWidth)
    setScale(s)
  }

  useLayoutEffect(() => {
    updateScale()

    // Attach observers and listeners only in the browser
    const hasWindow = typeof window !== "undefined"
    const hasRO = typeof ResizeObserver !== "undefined"
    let resizeObs: ResizeObserver | null = null

    const setWrapperSize = (s: number) => {
      if (!wrapperRef.current || !canvasRef.current) return
      const intrinsicHeight = canvasRef.current.scrollHeight
      // Use minHeight to avoid clipping while still reserving space
      wrapperRef.current.style.minHeight = `${intrinsicHeight * s}px`
    }

    if (hasRO) {
      // resize observer to adjust wrapper height based on scaled canvas height
      resizeObs = new ResizeObserver(() => {
        if (!wrapperRef.current || !canvasRef.current) return
        setWrapperSize(scale)
      })
      if (canvasRef.current) resizeObs.observe(canvasRef.current)
    } else {
      // Fallback: set an initial height without observing
      setWrapperSize(scale)
    }

    const onResize = () => {
      updateScale()
      if (!wrapperRef.current || !canvasRef.current) return
      const vw = document.documentElement.clientWidth || window.innerWidth || 0
      const s = Math.min(1, vw / desktopWidth)
      setWrapperSize(s)
    }

    if (hasWindow) {
      window.addEventListener("resize", onResize)
      window.addEventListener("orientationchange", onResize)
      window.addEventListener("load", onResize)
      document.addEventListener("transitionend", onResize, true)
      document.addEventListener("animationend", onResize, true)
      document.addEventListener("toggle", onResize, true) // captures <details> changes

      // A short settle loop to account for late-loading assets like images
      let raf = 0
      let ticks = 0
      const settle = () => {
        ticks += 1
        onResize()
        if (ticks < 10) raf = requestAnimationFrame(settle)
      }
      raf = requestAnimationFrame(settle)

      return () => {
        if (hasWindow) {
          window.removeEventListener("resize", onResize)
          window.removeEventListener("orientationchange", onResize)
          window.removeEventListener("load", onResize)
          document.removeEventListener("transitionend", onResize, true)
          document.removeEventListener("animationend", onResize, true)
          document.removeEventListener("toggle", onResize, true)
          if (raf) cancelAnimationFrame(raf)
        }
        if (resizeObs) resizeObs.disconnect()
      }
    }

    return () => {
      if (hasWindow) {
        window.removeEventListener("resize", onResize)
        window.removeEventListener("orientationchange", onResize)
        window.removeEventListener("load", onResize)
        document.removeEventListener("transitionend", onResize, true)
        document.removeEventListener("animationend", onResize, true)
        document.removeEventListener("toggle", onResize, true)
      }
      if (resizeObs) resizeObs.disconnect()
    }
  }, [desktopWidth, scale])

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
