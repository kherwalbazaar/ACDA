export const metadata = {
  title: "Reports | ADIM LAKCHAR CHIRGAL GAONTA",
}

export default function ReportsPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <section className="p-4 border rounded-lg">
          <h2 className="font-semibold mb-2">Balance Sheet</h2>
          <p className="text-gray-600">Summary of assets, liabilities, and equity.</p>
        </section>
        <section className="p-4 border rounded-lg">
          <h2 className="font-semibold mb-2">Fee Summary</h2>
          <p className="text-gray-600">Overview of membership fees collected and outstanding.</p>
        </section>
        <section className="p-4 border rounded-lg">
          <h2 className="font-semibold mb-2">Paid / Unpaid</h2>
          <p className="text-gray-600">List of members by payment status.</p>
        </section>
      </div>
    </main>
  )
}
