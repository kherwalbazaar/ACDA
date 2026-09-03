"use client"

import { useEffect, useState } from "react"
import { database } from "./firebase"
import { ref, set, update, remove, push, onValue } from "firebase/database"
import type { Member, EnrichedMember } from "@/data/members"

export type CommunityMessage = {
  id: string
  sender: string
  senderId?: string
  avatar: string
  text: string
  time: string
  fromMe?: boolean
}

export type CashTxn = {
  id: string
  date: string
  description: string
  type: "Income" | "Expense"
  amount: number
  via?: string
}

export type EventItem = {
  id: string
  name: string
  datetime: string
  price: number
  available: number
  venue: string
}

export type OrgSettings = {
  org: { name: string; regdNo: string; address: string; email: string; phone: string; whatsapp: string }
  admin: { name: string; role: string; image: string; phone: string; email: string }
  donations: { upiId: string; accountName: string; accountNo: string; ifsc: string }
}

const LOCAL_CACHE_PREFIX = "alm:data:"

function readLocalCache<T>(key: string): T | null {
  if (typeof window === "undefined") return null
  try {
    const value = window.localStorage.getItem(`${LOCAL_CACHE_PREFIX}${key}`)
    return value ? (JSON.parse(value) as T) : null
  } catch {
    return null
  }
}

function writeLocalCache<T>(key: string, value: T) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(`${LOCAL_CACHE_PREFIX}${key}`, JSON.stringify(value))
  } catch {
    // Storage can be unavailable or full; Firebase remains the source of truth.
  }
}

function toArray<T>(val: Record<string, T> | T[] | null | undefined): T[] {
  if (!val) return []
  if (Array.isArray(val)) return val
  return Object.entries(val).map(([id, v]) => ({ ...(v as object), id })) as T[]
}

function enrichMembers(records: Record<string, Member> | Member[] | null): EnrichedMember[] {
  if (!records) return []
  const list = toArray(records)
  return list
    .map((m) => {
      const totalPaid = (m.paymentHistory || []).reduce((s, p) => s + (p.amount || 0), 0)
      const sorted = [...(m.paymentHistory || [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      return {
        ...m,
        totalPaid,
        due: Math.max(0, (m.membershipFee || 0) - totalPaid),
        paymentCount: (m.paymentHistory || []).length,
        lastPayment: sorted[0],
        status: totalPaid > 0 ? ("paid" as const) : ("pending" as const),
        vip: (m.categories || []).includes("vip"),
      }
    })
    .sort((a, b) => a.id.localeCompare(b.id))
}

/* ---------------- Members ---------------- */

function toStoredMember(m: Member): Member {
  const {
    totalPaid: _totalPaid,
    due: _due,
    paymentCount: _paymentCount,
    lastPayment: _lastPayment,
    status: _status,
    vip: _vip,
    ...stored
  } = m as Member & Partial<EnrichedMember>
  return stored
}

export function useMembers() {
  const [members, setMembers] = useState<EnrichedMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cached = readLocalCache<Record<string, Member> | Member[]>("members")
    if (cached) {
      setMembers(enrichMembers(cached))
      setLoading(false)
    }

    const un = onValue(
      ref(database, "members"),
      (snap) => {
        const value = snap.val()
        setMembers(enrichMembers(value))
        writeLocalCache("members", value)
        setLoading(false)
      },
      () => setLoading(false)
    )
    return () => {
      un()
    }
  }, [])

  const addMember = async (m: Member) => {
    await set(ref(database, `members/${m.id}`), toStoredMember(m))
  }
  const updateMember = async (m: Member) => {
    await set(ref(database, `members/${m.id}`), toStoredMember(m))
  }
  const deleteMember = async (id: string) => {
    await remove(ref(database, `members/${id}`))
  }

  return { members, loading, addMember, updateMember, deleteMember }
}

export function useMemberById(id?: string) {
  const { members } = useMembers()
  if (!id) return undefined
  return members.find((m) => m.id === id)
}

/* ---------------- Community chat ---------------- */

export function useCommunityChat() {
  const [messages, setMessages] = useState<CommunityMessage[]>([])

  useEffect(() => {
    const cached = readLocalCache<CommunityMessage[]>("chat")
    if (cached) setMessages(cached)

    const r = ref(database, "chat/community")
    const un = onValue(r, (snap) => {
      const value = toArray<CommunityMessage>(snap.val())
      setMessages(value)
      writeLocalCache("chat", value)
    })
    return () => {
      un()
    }
  }, [])

  const send = async (msg: Omit<CommunityMessage, "id">) => {
    await push(ref(database, "chat/community"), msg)
  }

  return { messages, send }
}

/* ---------------- Cash book ---------------- */

export function useCashBook() {
  const [txns, setTxns] = useState<CashTxn[]>([])

  useEffect(() => {
    const cached = readLocalCache<CashTxn[]>("cashBook")
    if (cached) setTxns(cached)

    const r = ref(database, "cashBook")
    const un = onValue(r, (snap) => {
      const value = toArray<CashTxn>(snap.val())
      setTxns(value)
      writeLocalCache("cashBook", value)
    })
    return () => {
      un()
    }
  }, [])

  const addTxn = async (t: Omit<CashTxn, "id">) => {
    await push(ref(database, "cashBook"), t)
  }

  const updateTxn = async (id: string, t: Partial<CashTxn>) => {
    await update(ref(database, `cashBook/${id}`), t)
  }

  const deleteTxn = async (id: string) => {
    await remove(ref(database, `cashBook/${id}`))
  }

  return { txns, addTxn, updateTxn, deleteTxn }
}

/* ---------------- Events / tickets ---------------- */

export function useEvents() {
  const [events, setEvents] = useState<EventItem[]>([])

  useEffect(() => {
    const cached = readLocalCache<EventItem[]>("events")
    if (cached) setEvents(cached)

    const r = ref(database, "events")
    const un = onValue(r, (snap) => {
      const value = toArray<EventItem>(snap.val())
      setEvents(value)
      writeLocalCache("events", value)
    })
    return () => {
      un()
    }
  }, [])

  const updateEvent = async (id: string, patch: Partial<EventItem>) => {
    await update(ref(database, `events/${id}`), patch)
  }

  return { events, updateEvent }
}

/* ---------------- Settings ---------------- */

export function useSettings() {
  const [settings, setSettings] = useState<OrgSettings | null>(null)

  useEffect(() => {
    const cached = readLocalCache<OrgSettings>("settings")
    if (cached) setSettings(cached)

    const r = ref(database, "settings")
    const un = onValue(r, (snap) => {
      const value = snap.val()
      setSettings(value)
      writeLocalCache("settings", value)
    })
    return () => {
      un()
    }
  }, [])

  return settings
}
