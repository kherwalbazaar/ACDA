"use client"

import { useMemo, useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEvents } from "@/lib/firebase-data"

export type EventItem = {
  id: string
  name: string
  datetime: string // ISO
  price: number
  available: number
  venue: string
}

function parseFlexibleDate(input: string | number | Date): Date | null {
  if (input instanceof Date) return isNaN(input.getTime()) ? null : input
  if (typeof input === "number") return new Date(input)
  if (typeof input !== "string") return null

  // Try native parsing first (works for ISO strings)
  const native = new Date(input)
  if (!isNaN(native.getTime())) return native

  // Try to parse formats like "29/9/2025, 11:33:05 pm" or "9/29/2025, 11:33:08 PM"
  const match = input.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4}),?\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(am|pm|AM|PM)?$/)
  if (match) {
    let d = parseInt(match[1], 10)
    let m = parseInt(match[2], 10)
    const y = parseInt(match[3], 10)
    let hh = parseInt(match[4], 10)
    const mm = parseInt(match[5], 10)
    const ss = match[6] ? parseInt(match[6], 10) : 0
    const mer = match[7]

    // Disambiguate: if first > 12 -> DD/MM; if second > 12 -> MM/DD; else default to DD/MM for India
    const ddmm = d > 12 || (d <= 12 && m <= 12) // prefer DD/MM
    const day = ddmm ? d : m
    const month = ddmm ? m : d

    if (mer) {
      const lower = mer.toLowerCase()
      if (lower === "pm" && hh < 12) hh += 12
      if (lower === "am" && hh === 12) hh = 0
    }
    return new Date(y, month - 1, day, hh, mm, ss)
  }

  return null
}

function formatDateFlexible(input: string | number | Date, locale = "en-IN") {
  const d = parseFlexibleDate(input)
  if (!d) return ""
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(d)
}

function daysUntil(dt: string) {
  const diff = new Date(dt).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

const DEFAULT_EVENTS: EventItem[] = [
  {
    id: "evt-1",
    name: "Cultural Performance Night",
    datetime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    price: 199,
    available: 120,
    venue: "Community Hall, Khunta",
  },
  {
    id: "evt-2",
    name: "Educational Workshop",
    datetime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20).toISOString(),
    price: 149,
    available: 60,
    venue: "ADIM LAHAH Campus",
  },
]

export default function TicketsPageClient() {
  const { events: fbEvents } = useEvents()
  const [events, setEvents] = useState<EventItem[]>(DEFAULT_EVENTS)
  const [openForId, setOpenForId] = useState<string | null>(null)
  const [qty, setQty] = useState<number>(1)
  const [payment, setPayment] = useState<string>("upi")
  const [confirmCode, setConfirmCode] = useState<string>("")

  useEffect(() => {
    if (fbEvents && fbEvents.length > 0) setEvents(fbEvents)
  }, [fbEvents])

  const current = useMemo(() => events.find(e => e.id === openForId) || null, [events, openForId])

  const effectivePrice = useMemo(() => {
    if (!current) return 0
    const d = daysUntil(current.datetime)
    const earlyBird = d >= 10 ? 0.85 : 1 // 15% off if purchased >= 10 days before
    return Math.round(current.price * earlyBird)
  }, [current])

  const total = useMemo(() => qty * (effectivePrice || 0), [qty, effectivePrice])

  const openBuy = (id: string) => {
    setOpenForId(id)
    setQty(1)
    setPayment("upi")
    setConfirmCode("")
  }

  const buy = () => {
    if (!current) return
    if (qty < 1) return
    if (qty > current.available) return
    setEvents(prev => prev.map(e => (e.id === current.id ? { ...e, available: e.available - qty } : e)))
    const code = `${current.id}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`.toUpperCase()
    setConfirmCode(code)
  }

  const resetDialog = () => {
    setOpenForId(null)
    setConfirmCode("")
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Event Tickets</h1>
      <p className="text-gray-700 mb-6">Show Ticket Details, pricing, availability, and purchase securely.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((e) => {
          const d = daysUntil(e.datetime)
          const early = d >= 10
          const priceNow = Math.round(e.price * (early ? 0.85 : 1))
          return (
            <Card key={e.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">{e.name}</h3>
                  <p className="text-sm text-muted-foreground">{formatDateFlexible(e.datetime)} • {e.venue}</p>
                  <div className="mt-2 flex items-center gap-3 text-sm">
                    <span className="font-medium">Price:</span>
                    {early ? (
                      <>
                        <span className="line-through text-gray-400">₹{e.price}</span>
                        <span className="font-semibold text-green-700">₹{priceNow} (Early Bird)</span>
                      </>
                    ) : (
                      <span className="font-semibold">₹{e.price}</span>
                    )}
                  </div>
                  <div className="mt-1 text-sm">
                    <span className="font-medium">Available:</span> {e.available} tickets
                  </div>
                </div>

                <div className="text-right">
                  <Button onClick={() => openBuy(e.id)} className="">Buy Ticket</Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <Dialog open={!!openForId} onOpenChange={(o) => !o && resetDialog()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{current ? current.name : "Ticket"}</DialogTitle>
          </DialogHeader>

          {current && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Date & Time</div>
                  <div className="font-medium">{formatDateFlexible(current.datetime)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Venue</div>
                  <div className="font-medium">{current.venue}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Price</div>
                  <div className="font-medium">₹{effectivePrice} {effectivePrice !== current.price ? <span className="text-green-700">(Discounted)</span> : null}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Available</div>
                  <div className="font-medium">{current.available}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 items-end">
                <div>
                  <Label htmlFor="qty">Quantity</Label>
                  <Input
                    id="qty"
                    type="number"
                    value={qty}
                    min={1}
                    max={current.available}
                    onChange={(e) => setQty(Math.max(1, Math.min(current.available, Number(e.target.value) || 1)))}
                  />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Total</div>
                  <div className="text-xl font-bold">₹{total}</div>
                </div>
              </div>

              <div>
                <Label>Payment Option</Label>
                <Select value={payment} onValueChange={setPayment}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select payment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>

                {payment === "upi" && (
                  <p className="mt-2 text-sm text-muted-foreground">Pay to UPI ID: <span className="font-medium">adimlahah@upi</span> and keep the reference ID.</p>
                )}
                {payment === "paypal" && (
                  <p className="mt-2 text-sm text-muted-foreground">You will be redirected to PayPal or use example link here.</p>
                )}
                {payment === "manual" && (
                  <p className="mt-2 text-sm text-muted-foreground">Contact office for manual payment and verification.</p>
                )}
              </div>

              {confirmCode ? (
                <div className="rounded-md border p-3 bg-green-50">
                  <div className="font-semibold text-green-800">Ticket Confirmed</div>
                  <div className="text-sm mt-1">Confirmation Code:</div>
                  <div className="font-mono text-sm break-all">{confirmCode}</div>
                  <div className="text-xs text-muted-foreground mt-1">Show this code at the gate. You will also receive a receipt from payment provider.</div>
                </div>
              ) : null}
            </div>
          )}

          <DialogFooter>
            {!confirmCode ? (
              <Button disabled={!current || qty < 1 || (current && qty > current.available)} onClick={buy}>
                Confirm & Generate Ticket
              </Button>
            ) : (
              <Button onClick={resetDialog}>Close</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
