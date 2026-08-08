"use client"

import { useSettings } from "@/lib/firebase-data"
import { QrDonateCard } from "@/components/donations/qr-card"

export default function DonationsPage() {
  const settings = useSettings()
  const upiId = settings?.donations?.upiId || ""

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">Donations / Support</h1>
      <p className="text-gray-600 mb-6">Support our Education, Cultural, Social and Sports initiatives.</p>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* QR Card */}
        {upiId ? (
          <QrDonateCard upiId={upiId} imageSrc="https://ik.imagekit.io/kherwalbazaar/WhatsApp%20Image%202025-09-19%20at%2011.51.43_e949c180.jpg?updatedAt=1758280124396" />
        ) : (
          <section className="rounded-2xl border bg-white shadow p-6 text-center text-gray-500 text-sm">
            Donation details will appear here once configured.
          </section>
        )}

        {/* Info Card */}
        <section className="rounded-2xl border bg-white shadow p-6">
          <h2 className="font-semibold mb-2">Other Ways to Donate</h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>Bank: {settings?.donations?.accountName || "Account Name"}, {settings?.donations?.accountNo || "Account No"}, {settings?.donations?.ifsc || "IFSC"}</li>
            <li>In person: Contact the team</li>
            <li>Request a receipt via email/WhatsApp after payment</li>
          </ul>
          <h3 className="font-semibold mt-6 mb-2">Impact Areas</h3>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            <li>Education</li>
            <li>Cultural Programs</li>
            <li>Social Welfare</li>
            <li>Sports & Youth Development</li>
          </ul>
        </section>
      </div>
    </main>
  )
}
