export const metadata = {
  title: "Sport & Youth Development | ADIM LAKCHAR CHIRGAL GAONTA",
}

export default function SportPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Sport &amp; Youth Development</h1>

      <section className="space-y-4 text-gray-800">
        <p className="text-gray-700">
          Encouraging youth engagement through sports, leadership, and skill-building.
        </p>

        <div>
          <h2 className="text-xl font-semibold text-gray-900">Key Activities</h2>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>Village/Block-level football and athletics tournaments.</li>
            <li>Providing basic sports kits and coaching support.</li>
            <li>Youth leadership and soft-skill workshops.</li>
            <li>Exposure visits and inter-village competitions.</li>
          </ul>
        </div>
      </section>
    </main>
  )
}
