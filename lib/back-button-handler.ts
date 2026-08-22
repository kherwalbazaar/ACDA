/**
 * Registry for Android hardware back button modal/overlay handlers.
 * Allows open modals to capture the back button event before route navigation.
 */
export type BackHandler = () => boolean

const handlers: BackHandler[] = []

export function registerBackHandler(handler: BackHandler): () => void {
  handlers.push(handler)
  return () => {
    const idx = handlers.indexOf(handler)
    if (idx !== -1) {
      handlers.splice(idx, 1)
    }
  }
}

export function executeBackHandler(): boolean {
  for (let i = handlers.length - 1; i >= 0; i--) {
    const handled = handlers[i]()
    if (handled) {
      return true
    }
  }
  return false
}
