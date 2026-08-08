export const metadata = {
  title: "Cultural Program | ADIM LAKCHAR CHIRGAL GAONTA",
}

export default function CulturalPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Cultural Program</h1>

      <section className="space-y-4 text-gray-800">
        <p className="text-gray-700">
          Preserving and promoting tribal culture, language, and traditional art forms.
        </p>

        <div>
          <h2 className="text-xl font-semibold text-gray-900">Key Activities</h2>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>Organization of traditional dance and music events.</li>
            <li>Workshops on language, folklore, and craft.</li>
            <li>Festival celebrations with community participation.</li>
            <li>Documentation of local history and heritage.</li>
          </ul>
        </div>
      </section>
    </main>
  )
}
