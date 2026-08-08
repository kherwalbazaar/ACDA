import TicketsPageClient from "@/components/event-ticket/TicketsPageClient"

export const metadata = {
  title: "Event Ticket | ADIM LAKCHAR CHIRGAL GAONTA",
}

type EventItem = {
  id: string
  name: string
  datetime: string // ISO
  price: number
  available: number
  venue: string
}

const seedEvents: EventItem[] = [
  {
    id: "evt-1",
    name: "Cultural Performance Night",
    datetime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // +7 days
    price: 199,
    available: 120,
    venue: "Community Hall, Khunta",
  },
  {
    id: "evt-2",
    name: "Educational Workshop",
    datetime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20).toISOString(), // +20 days
    price: 149,
    available: 60,
    venue: "ADIM LAHAH Campus",
  },
]

function formatDate(dt: string) {
  return new Date(dt).toLocaleString()
}

function daysUntil(dt: string) {
  const diff = new Date(dt).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export default function EventTicketPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <TicketsPageClient />
    </main>
  )
}
