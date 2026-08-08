"use client"

type Listener = (hidden: boolean) => void

let forcedHidden = false
const listeners = new Set<Listener>()

export function setNavbarForcedHidden(hidden: boolean) {
  if (forcedHidden === hidden) return
  forcedHidden = hidden
  listeners.forEach((l) => l(hidden))
}

export function isNavbarForcedHidden() {
  return forcedHidden
}

export function subscribeNavbarForcedHidden(fn: Listener) {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}
