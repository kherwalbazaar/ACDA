export type Payment = {
  id: string
  amount: number
  date: string // ISO date string
  description: string
  receiptNo?: string
  method?: "Cash" | "UPI" | "Bank Transfer" | "Cheque"
  collectedBy?: string
  remarks?: string
}

export type MemberCategory = "paid" | "pending" | "vip" | "executive" | "new" | "birthday"

export type Member = {
  id: string
  name: string
  image: string
  designation: string
  paidDate?: string // ISO date string (last paid date)
  paymentHistory: Payment[]
  email?: string
  phone?: string
  membershipFee: number
  birthday?: string // ISO date
  categories: MemberCategory[]
}

export type EnrichedMember = Member & {
  totalPaid: number
  due: number
  paymentCount: number
  lastPayment?: Payment
  status: "paid" | "pending"
  vip: boolean
}

export function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)
}

export function formatDate(iso?: string) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}

export const members: Member[] = [
  {
    id: 'mandwa-1786966829357',
    name: 'Ramchandra Murmu',
    image: '/images/default-avatar.png',
    designation: 'General Member',
    paidDate: '2024-01-15',
    paymentHistory: [
      {
        id: 'pay-1',
        amount: 2000,
        date: '2024-01-15',
        description: 'Membership Fee',
        method: 'Cash',
      },
      {
        id: 'pay-2',
        amount: 500,
        date: '2024-06-20',
        description: 'Donation',
        method: 'UPI',
      },
    ],
    email: 'ramchu@example.com',
    phone: '9876543210',
    membershipFee: 2000,
    birthday: '1990-03-10',
    categories: ['paid'],
  },
  {
    id: 'mandwa-1786967001234',
    name: 'Sankari Hansdah',
    image: '/images/default-avatar.png',
    designation: 'Executive Member',
    paidDate: '2023-11-30',
    paymentHistory: [
      {
        id: 'pay-3',
        amount: 2000,
        date: '2023-11-30',
        description: 'Annual Membership',
        method: 'Cash',
      },
      {
        id: 'pay-4',
        amount: 1000,
        date: '2024-02-10',
        description: 'Festival Contribution',
        method: 'Bank Transfer',
      },
    ],
    email: 'sankari@example.com',
    phone: '9123456789',
    membershipFee: 2000,
    birthday: '1985-12-25',
    categories: ['vip', 'executive'],
  },
  {
    id: 'mandwa-1786967112345',
    name: 'Budhu Gop',
    image: '/images/default-avatar.png',
    designation: 'General Member',
    paidDate: undefined,
    paymentHistory: [],
    email: 'budhu@example.com',
    phone: '8765432109',
    membershipFee: 2000,
    birthday: '1992-07-20',
    categories: ['new'],
  },
]

export const enrichedMembers: EnrichedMember[] = members.map((m) => ({
  ...m,
  totalPaid: (m.paymentHistory || []).reduce((s, p) => s + (p.amount || 0), 0),
  due: Math.max(0, (m.membershipFee || 0) - ((m.paymentHistory || []).reduce((s, p) => s + (p.amount || 0), 0))),
  paymentCount: (m.paymentHistory || []).length,
  lastPayment: (m.paymentHistory || []).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0],
  status: (m.paymentHistory || []).length > 0 ? ('paid' as const) : ('pending' as const),
  vip: (m.categories || []).includes('vip'),
}))

export function getMemberById(id: string): EnrichedMember | undefined {
  return enrichedMembers.find((m) => m.id === id)
}